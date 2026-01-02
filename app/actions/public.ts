
"use server";

import { db } from "@/db";
import { labs, tests, testCategories, packages, packageTests, labTests } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";

// Fetch all available test categories
export async function getPublicTestCategories() {
    return await db.select().from(testCategories);
}

// Fetch all tests with their category and lowest available price from linked labs
export async function getPublicTests() {
    const allTests = await db.query.tests.findMany({
        with: {
            category: true,
            labTests: {
                where: eq(labTests.isAvailable, true),
                with: {
                    lab: true
                }
            }
        },
        orderBy: desc(tests.createdAt),
    });

    // Transform tests to include only necessary public info and the best price
    return allTests.map(test => {
        // Find lowest price among all labs offering this test
        const prices = test.labTests.map(lt => Number(lt.price));
        const bestPrice = prices.length > 0 ? Math.min(...prices) : null;

        // If no lab offers this test, we might exclude it or show as "Check availability"
        // For now, let's include it but price might be null/0

        return {
            id: test.id,
            name: test.name,
            category: test.category?.name || "General",
            description: test.description,
            turnaroundTime: test.turnaroundTime,
            price: bestPrice || 0, // Fallback if no lab offers it yet
            labCount: test.labTests.length,
            fastingRequired: test.fastingRequired
        };
    });
}

// Fetch all health packages with test count and details
export async function getPublicPackages() {
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
