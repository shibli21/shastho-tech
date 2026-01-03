ALTER TABLE "labs" ADD COLUMN "organization_id" text;--> statement-breakpoint
ALTER TABLE "labs" ADD COLUMN "contact_email" text;--> statement-breakpoint
ALTER TABLE "labs" ADD COLUMN "contact_phone" text;--> statement-breakpoint
ALTER TABLE "labs" ADD COLUMN "service_areas" text;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "assigned_lab_id" uuid;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "assigned_at" timestamp;--> statement-breakpoint
ALTER TABLE "labs" ADD CONSTRAINT "labs_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_assigned_lab_id_labs_id_fk" FOREIGN KEY ("assigned_lab_id") REFERENCES "public"."labs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "labs" ADD CONSTRAINT "labs_organization_id_unique" UNIQUE("organization_id");