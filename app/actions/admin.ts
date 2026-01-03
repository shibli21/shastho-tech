
"use server";

import { db } from "@/db";
import { labs, tests, testCategories, packages, packageTests, orders } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import type { LabMetadata } from "@/lib/shared";

// --- Types & Schemas ---

const LabSchema = z.object({
    name: z.string().min(1, "Lab name is required"),
    slug: z.string().min(1, "Slug is required"),
    address: z.string().optional(),
    logo: z.string().optional(),
    adminEmail: z.string().email("Valid admin email is required"),
    contactPhone: z.string().optional(),
    contactEmail: z.string().email().optional(),
    serviceAreas: z.string().optional(), // Comma-separated areas
    isVerified: z.boolean().optional(),
});

const TestSchema = z.object({
    name: z.string().min(1),
    code: z.string().min(1),
    categoryId: z.string().uuid(),
    description: z.string().optional(),
    turnaroundTime: z.string().optional(),
    fastingRequired: z.boolean().optional(),
    sampleType: z.string().optional(),
});

const PackageSchema = z.object({
    name: z.string().min(1),
    slug: z.string().min(1),
    description: z.string().optional(),
    price: z.coerce.number().min(0),
    discountPrice: z.coerce.number().optional(),
    isPopular: z.boolean().optional(),
    recommendedFor: z.string().optional(),
    testIds: z.array(z.string().uuid()),
});

// --- Labs Actions ---

export async function getLabs() {
    return await db.select().from(labs).orderBy(desc(labs.createdAt));
}

export async function createLab(formData: FormData) {
    const requestHeaders = await headers();

    // Check admin session
    const session = await auth.api.getSession({ headers: requestHeaders });
    if (!session || session.user.role !== "admin") {
        return { error: "Unauthorized. Admin access required." };
    }

    const data = {
        name: formData.get("name") as string,
        slug: formData.get("slug") as string,
        address: formData.get("address") as string,
        adminEmail: formData.get("adminEmail") as string,
        contactPhone: formData.get("contactPhone") as string,
        contactEmail: formData.get("contactEmail") as string,
        serviceAreas: formData.get("serviceAreas") as string,
        isVerified: formData.get("isVerified") === "on",
    };

    const parsed = LabSchema.safeParse(data);
    if (!parsed.success) {
        return { error: parsed.error.flatten() };
    }

    try {
        // 1. Create Better Auth organization with lab metadata
        const labMetadata: LabMetadata = {
            type: "lab",
            status: parsed.data.isVerified ? "active" : "pending",
            accreditations: [],
            serviceAreas: parsed.data.serviceAreas?.split(",").map(s => s.trim()).filter(Boolean) || [],
            contactPhone: parsed.data.contactPhone || "",
            contactEmail: parsed.data.contactEmail || parsed.data.adminEmail,
            rating: null,
            logoUrl: parsed.data.logo || null,
        };

        const orgResult = await auth.api.createOrganization({
            headers: requestHeaders,
            body: {
                name: parsed.data.name,
                slug: parsed.data.slug,
                logo: parsed.data.logo,
                metadata: labMetadata as unknown as Record<string, unknown>,
            },
        });

        if (!orgResult) {
            return { error: "Failed to create organization." };
        }

        // 2. Insert lab record linked to organization
        await db.insert(labs).values({
            organizationId: orgResult.id,
            name: parsed.data.name,
            slug: parsed.data.slug,
            address: parsed.data.address,
            logo: parsed.data.logo,
            contactEmail: parsed.data.contactEmail || parsed.data.adminEmail,
            contactPhone: parsed.data.contactPhone,
            serviceAreas: parsed.data.serviceAreas,
            isVerified: parsed.data.isVerified || false,
        });

        // 3. Invite lab admin via email
        await auth.api.createInvitation({
            headers: requestHeaders,
            body: {
                email: parsed.data.adminEmail,
                role: "owner",
                organizationId: orgResult.id,
            },
        });

    } catch (e) {
        console.error("Failed to create lab:", e);
        return { error: "Failed to create lab. Slug might be duplicate." };
    }

    revalidatePath("/admin/labs");
    redirect("/admin/labs");
}

// --- Tests Actions ---

export async function getTests() {
    return await db.query.tests.findMany({
        with: {
            category: true,
        },
        orderBy: desc(tests.createdAt),
    });
}

export async function getTestCategories() {
    return await db.select().from(testCategories);
}

export async function createTest(formData: FormData) {
    const data = {
        name: formData.get("name") as string,
        code: formData.get("code") as string,
        categoryId: formData.get("categoryId") as string,
        description: formData.get("description") as string,
        turnaroundTime: formData.get("turnaroundTime") as string,
        fastingRequired: formData.get("fastingRequired") === "on",
        sampleType: formData.get("sampleType") as string,
    };

    const parsed = TestSchema.safeParse(data);
    if (!parsed.success) {
        return { error: parsed.error.flatten() };
    }

    try {
        await db.insert(tests).values({
            ...parsed.data,
            fastingRequired: parsed.data.fastingRequired || false,
        });
    } catch {
        return { error: "Failed to create test. Code might be duplicate." };
    }

    revalidatePath("/admin/tests");
    redirect("/admin/tests");
}

// --- Packages Actions ---

export async function getPackages() {
    return await db.query.packages.findMany({
        with: {
            packageTests: {
                with: {
                    test: true,
                }
            }
        },
        orderBy: desc(packages.createdAt),
    });
}

export async function createPackage(prevState: unknown, formData: FormData) {
    const testIds = formData.getAll("testIds") as string[];

    const data = {
        name: formData.get("name") as string,
        slug: formData.get("slug") as string,
        description: formData.get("description") as string,
        price: formData.get("price"),
        discountPrice: formData.get("discountPrice"),
        isPopular: formData.get("isPopular") === "on",
        recommendedFor: formData.get("recommendedFor") as string,
        testIds: testIds,
    };

    const parsed = PackageSchema.safeParse(data);
    if (!parsed.success) {
        return { error: parsed.error.flatten() };
    }

    try {
        // Transaction to create package and link tests
        await db.transaction(async (tx) => {
            const [newPkg] = await tx.insert(packages).values({
                name: parsed.data.name,
                slug: parsed.data.slug,
                description: parsed.data.description,
                price: parsed.data.price,
                discountPrice: parsed.data.discountPrice,
                isPopular: parsed.data.isPopular || false,
                recommendedFor: parsed.data.recommendedFor,
            }).returning();

            if (parsed.data.testIds.length > 0) {
                await tx.insert(packageTests).values(
                    parsed.data.testIds.map(testId => ({
                        packageId: newPkg.id,
                        testId: testId,
                    }))
                );
            }
        });

    } catch (e) {
        console.error(e);
        return { error: "Failed to create package." };
    }

    revalidatePath("/admin/packages");
    redirect("/admin/packages");
}

// --- Orders Actions ---

export async function getAdminOrders() {
    return await db.query.orders.findMany({
        with: {
            user: true,
            address: true,
            items: {
                with: {
                    test: true,
                    package: true,
                }
            }
        },
        orderBy: desc(orders.createdAt),
    });
}

export async function updateOrderStatus(orderId: string, status: "pending" | "confirmed" | "assigned" | "collected" | "processing" | "completed" | "cancelled") {
    try {
        await db.update(orders)
            .set({ status })
            .where(eq(orders.id, orderId));

        revalidatePath("/admin/orders");
        return { success: true };
    } catch {
        console.error("Failed to update status");
        return { error: "Failed to update order status." };
    }
}
