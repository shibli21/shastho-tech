
"use server";

import { db } from "@/db";
import { labs, tests, testCategories, packages, packageTests, labTests } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

// --- Types & Schemas ---

const LabSchema = z.object({
    name: z.string().min(1),
    slug: z.string().min(1),
    address: z.string().optional(),
    logo: z.string().optional(),
    rating: z.string().optional(), // Decimal as string from form
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
    const data = {
        name: formData.get("name") as string,
        slug: formData.get("slug") as string,
        address: formData.get("address") as string,
        isVerified: formData.get("isVerified") === "on",
    };

    const parsed = LabSchema.safeParse(data);
    if (!parsed.success) {
        return { error: parsed.error.flatten() };
    }

    try {
        await db.insert(labs).values({
            ...parsed.data,
            isVerified: parsed.data.isVerified || false,
        });
    } catch (e) {
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
    } catch (e) {
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

export async function createPackage(prevState: any, formData: FormData) {
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
