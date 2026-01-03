
"use server";

import { db } from "@/db";
import { orders, orderItems, addresses, familyMembers, orderStatusHistory } from "@/db/schema-mvp";
import { auth } from "@/lib/auth"; // Server-side auth
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { eq, desc } from "drizzle-orm";
import { Booking, LabTest } from "@/types/types";

interface CreateOrderInput {
    patientName: string;
    patientAge: string;
    patientGender: string;
    address: string;
    date: string;
    slot: string;
    cart: {
        id: string; // Test ID or Package ID (mixed in cart for now?)
        price: number;
        category?: string; // used to distinguish packages vs tests if needed, or we rely on ID prefix/lookup
    }[];
    total: number;
}

export async function createOrder(data: CreateOrderInput) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        return { error: "Unauthorized" };
    }

    const userId = session.user.id;

    try {
        // 1. Create Address
        // In a real app, we'd check if this address already exists or let user select from saved.
        // For MVP, we always create a new one for simplicity or look for exact match.
        // Let's just create a new one for now to avoid complexity.
        const [newAddress] = await db
            .insert(addresses)
            .values({
                userId,
                address: data.address,
                label: "Home", // Default
                isDefault: true,
            })
            .returning({ id: addresses.id });

        // 2. Create/Find Family Member (Patient)
        // For MVP, checking if exists might be tricky with just name.
        // We'll create a new entry for every order if we want to be safe, or just "Self" if name matches user.
        // Let's just create a new entry to ensure specific age/gender info is captured for this order context.
        const [patient] = await db
            .insert(familyMembers)
            .values({
                userId,
                name: data.patientName,
                relation: "other", // Defaulting to other/self loosely
                gender: data.patientGender.toLowerCase() as "male" | "female" | "other",
                // Approximate DOB from age if needed, or leave null for now as schema allows dateOfBirth to be nullable?
                // Schema: dateOfBirth: date("date_of_birth") -> optional
            })
            .returning({ id: familyMembers.id });

        // 3. Create Order
        const [newOrder] = await db
            .insert(orders)
            .values({
                userId,
                status: "pending",
                totalAmount: data.total,
                paymentStatus: "pending",
                paymentMethod: "cash", // Default for MVP
                scheduledDate: data.date,
                scheduledTimeSlot: data.slot,
                addressId: newAddress.id,
            })
            .returning({ id: orders.id });

        // 4. Create Order Items
        // We need to determine if an item is a 'test' or 'package'.
        // The cart in `landing-page-client.tsx` mixes them.
        // We'll assume if it has a 'category' it's a test? Packages usually don't have category in the simplified view?
        // Or we simply check in DB?
        // Efficient way: try to match IDs to tables.
        // Prerogative: The UI 'Cart' items currently are `LabTest` type.
        // Let's look at `types.ts` to see if we can distinguish.

        // Quick fix: We can check if `category` exists -> Test.
        // If we look at `PacketGrid`, we didn't add to cart there yet?
        // Wait, `PackageGrid` had a `Select Package` button but no `addToCart` logic connected in my previous edits?
        // Let's check `PackageGrid.tsx`... Ah, `Select Package` button just does nothing? 
        // I need to fix that too! 

        // For now, assuming cart contains `LabTest` objects.
        const orderItemsData = data.cart.map((item) => ({
            orderId: newOrder.id,
            type: (item.category ? "test" : "package") as "test" | "package", // Heuristic
            testId: item.category ? item.id : null,
            // packageId: !item.category ? item.id : null, // If we support packages in cart later
            price: item.price,
            patientId: patient.id,
            status: "pending" as const,
        }));

        if (orderItemsData.length > 0) {
            await db.insert(orderItems).values(orderItemsData);
        }

        // Record initial status in history
        await db.insert(orderStatusHistory).values({
            orderId: newOrder.id,
            status: "pending",
            changedBy: userId,
            notes: "Order placed",
        });

        revalidatePath("/dashboard");
        revalidatePath("/dashboard/orders");
        revalidatePath("/admin/orders");

        return { success: true, orderId: newOrder.id };
    } catch (error) {
        console.error("Order creation failed:", error);
        return { error: "Failed to create order" };
    }
}

export async function getUserOrders(): Promise<Booking[]> {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        return [];
    }

    const userOrders = await db.query.orders.findMany({
        where: eq(orders.userId, session.user.id),
        orderBy: desc(orders.createdAt),
        with: {
            address: true,
            items: {
                with: {
                    test: {
                        with: {
                            category: true
                        }
                    },
                    package: true,
                    patient: true, // Assuming one patient per item, but we need overall patient for booking?
                }
            },
            // We need a way to get the "main" patient for the booking, usually the first item's patient or from a join
            // But our schema links patient to items.
            // For standard "Booking" type, we assume one patient per booking for now.
        }
    });

    // Transform to Booking type
    return userOrders.map(order => {
        // Logic to extract patient info from items (assuming all items for same patient in MVP flow)
        const firstItem = order.items[0];
        const patient = firstItem?.patient;

        // Map items to LabTest
        const manualTests: LabTest[] = order.items.map(item => {
            if (item.type === 'test' && item.test) {
                return {
                    id: item.test.id,
                    name: item.test.name,
                    category: item.test.category?.name || "General",
                    price: item.price,
                    description: item.test.description || "",
                    turnaroundTime: item.test.turnaroundTime || "24-48h",
                };
            } else if (item.type === 'package' && item.package) {
                return {
                    id: item.package.id,
                    name: item.package.name,
                    category: "Package",
                    price: item.price,
                    description: item.package.description || "",
                    turnaroundTime: "24-48h",
                };
            }
            return null;
        }).filter(Boolean) as LabTest[];

        return {
            id: order.id,
            userId: order.userId,
            patientName: patient?.name || "Unknown Patient",
            patientAge: "N/A", // Not stored in familyMembers currently? Schema has dateOfBirth.
            patientGender: patient?.gender || "Other",
            tests: manualTests,
            date: order.scheduledDate || "",
            slot: order.scheduledTimeSlot || "",
            address: order.address?.address || "No address",
            total: order.totalAmount,
            status: order.status as "pending" | "confirmed" | "collected" | "processing" | "completed", // Cast to BookingStatus
            createdAt: order.createdAt.toISOString(),
        };
    });
}

export async function getUserOrderDetails(orderId: string) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        return null;
    }

    const order = await db.query.orders.findFirst({
        where: eq(orders.id, orderId),
        with: {
            user: true,
            address: true,
            assignedLab: true,
            items: {
                with: {
                    test: {
                        with: {
                            category: true,
                        }
                    },
                    package: true,
                    patient: true,
                    reports: true,
                }
            },
            statusHistory: {
                orderBy: (sh, { asc }) => asc(sh.createdAt),
            },
        },
    });

    // Verify the order belongs to the user
    if (!order || order.userId !== session.user.id) {
        return null;
    }

    return order;
}

// Record initial status when order is created
export async function recordInitialOrderStatus(orderId: string, userId: string) {
    await db.insert(orderStatusHistory).values({
        orderId,
        status: "pending",
        changedBy: userId,
        notes: "Order placed",
    });
}
