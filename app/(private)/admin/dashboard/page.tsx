import { SectionCards, type SectionCardItem } from "@/components/section-cards";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, FileText, Clock } from "lucide-react";
import { db } from "@/db";
import { user } from "@/db/schema";
import { orders, labs, reports } from "@/db/schema-mvp";
import { count } from "drizzle-orm";

export default async function AdminDashboardPage() {
  const [usersCount] = await db.select({ value: count() }).from(user);
  const [ordersCount] = await db.select({ value: count() }).from(orders);
  const [labsCount] = await db.select({ value: count() }).from(labs);
  // Simple sum for revenue (assuming totalAmount is in integer cents/currency)
  // const [revenue] = await db.select({ value: sum(orders.totalAmount) }).from(orders);

  // For MVP demo, formatted numbers
  const adminStats: SectionCardItem[] = [
    {
      title: "Total Users",
      value: usersCount?.value.toString() || "0",
      trend: {
        label: "+0% from last month",
        value: "+0%",
        direction: "up",
      },
    },
    {
      title: "Total Orders",
      value: ordersCount?.value.toString() || "0",
      trend: {
        label: "+0% from last month",
        value: "+0%",
        direction: "up",
      },
    },
    {
      title: "Partner Labs",
      value: labsCount?.value.toString() || "0",
      footerLabel: "Active partners",
    },
    {
      title: "Revenue",
      value: "৳0", // Placeholder until we have sum aggregation working with Drizzle types
      footerLabel: "This month",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="px-4 lg:px-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">Platform overview and key metrics</p>
      </div>

      {/* Stats Cards */}
      <SectionCards items={adminStats} />

      {/* Two column grid */}
      <div className="grid gap-6 px-4 md:grid-cols-2 lg:px-6">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Package className="h-10 w-10 text-muted-foreground/50 mb-3" />
              <p className="text-sm text-muted-foreground">No recent orders</p>
            </div>
          </CardContent>
        </Card>

        {/* Pending Reports */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Pending Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <FileText className="h-10 w-10 text-muted-foreground/50 mb-3" />
              <p className="text-sm text-muted-foreground">No pending reports</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
