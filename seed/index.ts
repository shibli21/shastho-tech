
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { labs, tests, testCategories, packages, packageTests, labTests } from '../db/schema';
import { eq } from 'drizzle-orm';

const client = postgres(process.env.DATABASE_URL!, { prepare: false });
const db = drizzle(client);

async function main() {
    console.log('🌱 Seeding database...');

    try {
        // 1. Create Test Categories
        const [hematology, biochemistry, hormonal] = await db.insert(testCategories).values([
            { name: 'Hematology', slug: 'hematology', description: 'Blood related tests' },
            { name: 'Biochemistry', slug: 'biochemistry', description: 'Chemical processes' },
            { name: 'Hormonal', slug: 'hormonal', description: 'Hormone levels' },
        ]).returning();
        console.log('✅ Categories created');

        // 2. Create Tests
        const [cbc, lipid, tsh] = await db.insert(tests).values([
            { name: 'Complete Blood Count (CBC)', code: 'CBC001', categoryId: hematology.id, turnaroundTime: '24 Hours', sampleType: 'Blood' },
            { name: 'Lipid Profile', code: 'LIP001', categoryId: biochemistry.id, turnaroundTime: '24 Hours', sampleType: 'Blood', fastingRequired: true },
            { name: 'Thyroid Stimulating Hormone (TSH)', code: 'TSH001', categoryId: hormonal.id, turnaroundTime: '24 Hours', sampleType: 'Blood' },
        ]).returning();
        console.log('✅ Tests created');

        // 3. Create Labs
        const [labA, labB] = await db.insert(labs).values([
            { name: 'Popular Diagnostic', slug: 'popular-diagnostic', address: 'Dhanmondi, Dhaka', rating: '4.5', isVerified: true },
            { name: 'Ibn Sina', slug: 'ibn-sina', address: 'Zigatola, Dhaka', rating: '4.8', isVerified: true },
        ]).returning();
        console.log('✅ Labs created');

        // 4. Link Tests to Labs (Pricing)
        await db.insert(labTests).values([
            { labId: labA.id, testId: cbc.id, price: 500, isAvailable: true },
            { labId: labA.id, testId: lipid.id, price: 1200, isAvailable: true },
            { labId: labB.id, testId: cbc.id, price: 450, isAvailable: true },
            { labId: labB.id, testId: tsh.id, price: 800, isAvailable: true },
        ]);
        console.log('✅ Lab Pricing linked');

        // 5. Create Packages
        const [wellnessPkg] = await db.insert(packages).values([
            { name: 'Basic Wellness Check', slug: 'basic-wellness', price: 2500, discountPrice: 2000, isPopular: true, recommendedFor: 'Adults' },
        ]).returning();
        console.log('✅ Packages created');

        // 6. Link Tests to Package
        await db.insert(packageTests).values([
            { packageId: wellnessPkg.id, testId: cbc.id },
            { packageId: wellnessPkg.id, testId: lipid.id },
        ]);
        console.log('✅ Package Bundle created');

        console.log('🎉 Seeding completed successfully!');
    } catch (error) {
        console.error('❌ Seeding failed:', error);
    } finally {
        await client.end();
    }
}

main();
