
import { boolean, date, decimal, integer, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { user, session, account, member, invitation, twoFactor, passkey, oauthClient, oauthRefreshToken, oauthAccessToken, oauthConsent } from "./auth-schema";

// Enums
export const bookingStatusEnum = pgEnum("booking_status", [
    "pending",
    "confirmed",
    "assigned",
    "collected",
    "processing",
    "completed",
    "cancelled",
]);

export const paymentStatusEnum = pgEnum("payment_status", ["pending", "paid", "failed", "refunded"]);
export const orderItemTypeEnum = pgEnum("order_item_type", ["test", "package"]);
export const orderItemStatusEnum = pgEnum("order_item_status", ["pending", "completed", "reported", "cancelled"]);
export const relationEnum = pgEnum("relation", ["self", "spouse", "child", "parent", "other"]);
export const genderEnum = pgEnum("gender", ["male", "female", "other"]);

// Labs
export const labs = pgTable("labs", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").unique().notNull(),
    logo: text("logo"),
    address: text("address"),
    rating: decimal("rating", { precision: 2, scale: 1 }).default("0"),
    isVerified: boolean("is_verified").default(false),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Tests
export const testCategories = pgTable("test_categories", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").unique().notNull(),
    description: text("description"),
});

export const tests = pgTable("tests", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    code: text("code").unique(),
    categoryId: uuid("category_id").references(() => testCategories.id),
    description: text("description"),
    turnaroundTime: text("turnaround_time"), // e.g., "24 Hours"
    fastingRequired: boolean("fasting_required").default(false),
    sampleType: text("sample_type"), // e.g., "Blood", "Urine"
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Packages
export const packages = pgTable("packages", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").unique().notNull(),
    description: text("description"),
    price: integer("price").notNull(), // Base price in cents/subunits if needed, or just integer currency
    discountPrice: integer("discount_price"),
    isPopular: boolean("is_popular").default(false),
    recommendedFor: text("recommended_for"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Package Tests (Many-to-Many)
export const packageTests = pgTable("package_tests", {
    id: uuid("id").defaultRandom().primaryKey(),
    packageId: uuid("package_id").references(() => packages.id, { onDelete: "cascade" }).notNull(),
    testId: uuid("test_id").references(() => tests.id, { onDelete: "cascade" }).notNull(),
});

// Lab Tests (Pricing & Availability)
export const labTests = pgTable("lab_tests", {
    id: uuid("id").defaultRandom().primaryKey(),
    labId: uuid("lab_id").references(() => labs.id, { onDelete: "cascade" }).notNull(),
    testId: uuid("test_id").references(() => tests.id, { onDelete: "cascade" }).notNull(),
    price: integer("price").notNull(),
    isAvailable: boolean("is_available").default(true),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// User Addresses
export const addresses = pgTable("addresses", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id").references(() => user.id, { onDelete: "cascade" }).notNull(),
    label: text("label"), // Home, Office
    address: text("address").notNull(),
    city: text("city"),
    area: text("area"),
    zipCode: text("zip_code"),
    latitude: decimal("latitude", { precision: 10, scale: 7 }),
    longitude: decimal("longitude", { precision: 10, scale: 7 }),
    isDefault: boolean("is_default").default(false),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Family Members / Patients
export const familyMembers = pgTable("family_members", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id").references(() => user.id, { onDelete: "cascade" }).notNull(),
    name: text("name").notNull(),
    relation: relationEnum("relation").default("self"),
    dateOfBirth: date("date_of_birth"),
    gender: genderEnum("gender"),
    bloodGroup: text("blood_group"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Orders
export const orders = pgTable("orders", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id").references(() => user.id).notNull(),
    status: bookingStatusEnum("status").default("pending").notNull(),
    totalAmount: integer("total_amount").notNull(),
    paymentStatus: paymentStatusEnum("payment_status").default("pending").notNull(),
    paymentMethod: text("payment_method"), // "online", "cash"
    transactionId: text("transaction_id"),
    scheduledDate: date("scheduled_date").notNull(),
    scheduledTimeSlot: text("scheduled_time_slot").notNull(),
    addressId: uuid("address_id").references(() => addresses.id),
    notes: text("notes"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Order Items
export const orderItems = pgTable("order_items", {
    id: uuid("id").defaultRandom().primaryKey(),
    orderId: uuid("order_id").references(() => orders.id, { onDelete: "cascade" }).notNull(),
    type: orderItemTypeEnum("type").notNull(), // "test" or "package"
    testId: uuid("test_id").references(() => tests.id), // If type is test
    packageId: uuid("package_id").references(() => packages.id), // If type is package
    labId: uuid("lab_id").references(() => labs.id), // If applicable/selected
    price: integer("price").notNull(),
    patientId: uuid("patient_id").references(() => familyMembers.id), // Who is this for?
    status: orderItemStatusEnum("status").default("pending"),
});

// Reports
export const reports = pgTable("reports", {
    id: uuid("id").defaultRandom().primaryKey(),
    orderItemId: uuid("order_item_id").references(() => orderItems.id, { onDelete: "cascade" }).notNull(),
    fileUrl: text("file_url").notNull(),
    uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
    notes: text("notes"),
});

// Relations
export const labsRelations = relations(labs, ({ many }) => ({
    labTests: many(labTests),
}));

export const testsRelations = relations(tests, ({ one, many }) => ({
    category: one(testCategories, {
        fields: [tests.categoryId],
        references: [testCategories.id],
    }),
    packageTests: many(packageTests),
    labTests: many(labTests),
}));

export const packagesRelations = relations(packages, ({ many }) => ({
    packageTests: many(packageTests),
}));

export const packageTestsRelations = relations(packageTests, ({ one }) => ({
    package: one(packages, {
        fields: [packageTests.packageId],
        references: [packages.id],
    }),
    test: one(tests, {
        fields: [packageTests.testId],
        references: [tests.id],
    }),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
    user: one(user, {
        fields: [orders.userId],
        references: [user.id],
    }),
    address: one(addresses, {
        fields: [orders.addressId],
        references: [addresses.id],
    }),
    items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one, many }) => ({
    order: one(orders, {
        fields: [orderItems.orderId],
        references: [orders.id],
    }),
    test: one(tests, {
        fields: [orderItems.testId],
        references: [tests.id],
    }),
    package: one(packages, {
        fields: [orderItems.packageId],
        references: [packages.id],
    }),
    lab: one(labs, {
        fields: [orderItems.labId],
        references: [labs.id],
    }),
    patient: one(familyMembers, {
        fields: [orderItems.patientId],
        references: [familyMembers.id],
    }),
    reports: many(reports),
}));

export const reportsRelations = relations(reports, ({ one }) => ({
    orderItem: one(orderItems, {
        fields: [reports.orderItemId],
        references: [orderItems.id],
    }),
}));

export const userRelations = relations(user, ({ many }) => ({
    // Auth relations
    sessions: many(session),
    accounts: many(account),
    members: many(member),
    invitations: many(invitation),
    twoFactors: many(twoFactor),
    passkeys: many(passkey),
    oauthClients: many(oauthClient),
    oauthRefreshTokens: many(oauthRefreshToken),
    oauthAccessTokens: many(oauthAccessToken),
    oauthConsents: many(oauthConsent),
    // App relations
    familyMembers: many(familyMembers),
    addresses: many(addresses),
    orders: many(orders),
}));

