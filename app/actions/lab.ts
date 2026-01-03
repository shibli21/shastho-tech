"use server";

import { db } from "@/db";
import { labs, orders, orderItems, labTests, reports } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { parseOrgMetadata } from "@/lib/shared";
import { z } from "zod";

// --- Helper: Get current lab for authenticated user ---

async function getCurrentLab() {
    const requestHeaders = await headers();
    const session = await auth.api.getSession({ headers: requestHeaders });

    if (!session) {
        return { error: "Unauthorized" };
    }

    // Get the active organization
    const activeOrg = await auth.api.getFullOrganization({ headers: requestHeaders });

    if (!activeOrg) {
        return { error: "No active organization" };
    }

    const metadata = parseOrgMetadata(activeOrg.metadata);

    if (!metadata || metadata.type !== "lab") {
        return { error: "Not a lab partner" };
    }

    // Find the lab linked to this organization
    const [lab] = await db
        .select()
        .from(labs)
        .where(eq(labs.organizationId, activeOrg.id))
        .limit(1);

    if (!lab) {
        return { error: "Lab not found" };
    }

    return { lab, session, organization: activeOrg };
}

// --- Lab Orders ---

export async function getLabOrders() {
    const result = await getCurrentLab();
    if ("error" in result) {
        return [];
    }

    const { lab } = result;

    return await db.query.orders.findMany({
        where: eq(orders.assignedLabId, lab.id),
        with: {
            user: true,
            address: true,
            items: {
                with: {
                    test: true,
                    package: true,
                    patient: true,
                    reports: true,
                },
            },
        },
        orderBy: desc(orders.createdAt),
    });
}

export async function getLabPendingOrders() {
    const result = await getCurrentLab();
    if ("error" in result) {
        return [];
    }

    const { lab } = result;

    return await db.query.orders.findMany({
        where: and(
            eq(orders.assignedLabId, lab.id),
            eq(orders.status, "assigned")
        ),
        with: {
            user: true,
            address: true,
            items: {
                with: {
                    test: true,
                    patient: true,
                },
            },
        },
        orderBy: desc(orders.createdAt),
    });
}

// --- Lab Test Pricing ---

export async function getLabTests() {
    const result = await getCurrentLab();
    if ("error" in result) {
        return [];
    }

    const { lab } = result;

    return await db.query.labTests.findMany({
        where: eq(labTests.labId, lab.id),
        with: {
            test: {
                with: {
                    category: true,
                },
            },
        },
        orderBy: desc(labTests.createdAt),
    });
}

const UpdateLabTestSchema = z.object({
    labTestId: z.string().uuid(),
    price: z.coerce.number().min(0),
    isAvailable: z.boolean(),
});

export async function updateLabTestPricing(formData: FormData) {
    const result = await getCurrentLab();
    if ("error" in result) {
        return { error: result.error };
    }

    const { lab } = result;

    const data = {
        labTestId: formData.get("labTestId") as string,
        price: formData.get("price"),
        isAvailable: formData.get("isAvailable") === "on",
    };

    const parsed = UpdateLabTestSchema.safeParse(data);
    if (!parsed.success) {
        return { error: parsed.error.flatten() };
    }

    try {
        // Verify this labTest belongs to this lab
        const [existingLabTest] = await db
            .select()
            .from(labTests)
            .where(and(
                eq(labTests.id, parsed.data.labTestId),
                eq(labTests.labId, lab.id)
            ))
            .limit(1);

        if (!existingLabTest) {
            return { error: "Lab test not found" };
        }

        await db
            .update(labTests)
            .set({
                price: parsed.data.price,
                isAvailable: parsed.data.isAvailable,
                updatedAt: new Date(),
            })
            .where(eq(labTests.id, parsed.data.labTestId));

        revalidatePath("/lab/tests");
        return { success: true };
    } catch (e) {
        console.error("Failed to update lab test:", e);
        return { error: "Failed to update test pricing" };
    }
}

// --- Report Upload ---

const UploadReportSchema = z.object({
    orderItemId: z.string().uuid(),
    fileUrl: z.string().url(),
    notes: z.string().optional(),
});

export async function uploadReport(formData: FormData) {
    const result = await getCurrentLab();
    if ("error" in result) {
        return { error: result.error };
    }

    const { lab } = result;

    const data = {
        orderItemId: formData.get("orderItemId") as string,
        fileUrl: formData.get("fileUrl") as string,
        notes: formData.get("notes") as string,
    };

    const parsed = UploadReportSchema.safeParse(data);
    if (!parsed.success) {
        return { error: parsed.error.flatten() };
    }

    try {
        // Verify this orderItem belongs to an order assigned to this lab
        const [orderItem] = await db
            .select({
                id: orderItems.id,
                orderId: orderItems.orderId,
                assignedLabId: orders.assignedLabId,
            })
            .from(orderItems)
            .innerJoin(orders, eq(orders.id, orderItems.orderId))
            .where(and(
                eq(orderItems.id, parsed.data.orderItemId),
                eq(orders.assignedLabId, lab.id)
            ))
            .limit(1);

        if (!orderItem) {
            return { error: "Order item not found or not assigned to your lab" };
        }

        // Insert report
        await db.insert(reports).values({
            orderItemId: parsed.data.orderItemId,
            fileUrl: parsed.data.fileUrl,
            notes: parsed.data.notes,
        });

        // Update order item status to reported
        await db
            .update(orderItems)
            .set({ status: "reported" })
            .where(eq(orderItems.id, parsed.data.orderItemId));

        revalidatePath("/lab/orders");
        revalidatePath("/lab/reports");
        return { success: true };
    } catch (e) {
        console.error("Failed to upload report:", e);
        return { error: "Failed to upload report" };
    }
}

// --- Lab Stats ---

export async function getLabStats() {
    const result = await getCurrentLab();
    if ("error" in result) {
        return null;
    }

    const { lab } = result;

    // Get counts for various stats
    const allOrders = await db
        .select()
        .from(orders)
        .where(eq(orders.assignedLabId, lab.id));

    const pendingCount = allOrders.filter(o => o.status === "assigned" || o.status === "confirmed").length;
    const completedCount = allOrders.filter(o => o.status === "completed").length;

    // Get reports count this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    return {
        totalOrders: allOrders.length,
        pendingOrders: pendingCount,
        completedOrders: completedCount,
        reportsThisMonth: completedCount, // Simplified - could query reports table
    };
}
