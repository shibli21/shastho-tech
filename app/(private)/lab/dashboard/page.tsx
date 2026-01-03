import { getLabStats, getLabOrders } from "@/app/actions/lab";
import { SectionCards, type SectionCardItem } from "@/components/section-cards";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, ArrowRight } from "lucide-react";
import Link from "next/link";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { parseOrgMetadata } from "@/lib/shared";

function getStatusBadge(status: string) {
  const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> =
    {
      pending: { label: "Pending", variant: "secondary" },
      confirmed: { label: "Confirmed", variant: "secondary" },
      assigned: { label: "Assigned", variant: "default" },
      collected: { label: "Collected", variant: "outline" },
      processing: { label: "Processing", variant: "outline" },
      completed: { label: "Completed", variant: "default" },
      cancelled: { label: "Cancelled", variant: "destructive" },
    };

  const config = statusConfig[status] || { label: status, variant: "secondary" as const };
  return <Badge variant={config.variant}>{config.label}</Badge>;
}

export default async function LabDashboardPage() {
  const requestHeaders = await headers();
  const session = await auth.api.getSession({ headers: requestHeaders });
  const activeOrg = await auth.api.getFullOrganization({ headers: requestHeaders });
  const metadata = activeOrg ? parseOrgMetadata(activeOrg.metadata) : null;

  const [stats, orders] = await Promise.all([getLabStats(), getLabOrders()]);

  const recentOrders = orders.slice(0, 5);

  const labStats: SectionCardItem[] = [
    {
      title: "Assigned Orders",
      value: String(stats?.totalOrders || 0),
      footerLabel: "Total orders",
    },
    {
      title: "Pending",
      value: String(stats?.pendingOrders || 0),
      footerLabel: "Awaiting action",
    },
    {
      title: "Completed",
      value: String(stats?.completedOrders || 0),
      footerLabel: "Reports delivered",
    },
    {
      title: "This Month",
      value: String(stats?.reportsThisMonth || 0),
      footerLabel: "Reports uploaded",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold">Welcome, {activeOrg?.name || "Lab Partner"}! 🔬</h1>
        <p className="text-muted-foreground mt-1">Manage your orders and upload diagnostic reports</p>
        {metadata?.status === "pending" && (
          <div className="mt-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20 p-4">
            <p className="text-sm text-yellow-600 dark:text-yellow-400">
              ⚠️ Your lab partner account is pending approval. You&apos;ll be able to receive orders once approved.
            </p>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <SectionCards items={labStats} />

      {/* Recent Orders */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Orders</CardTitle>
          <Link href="/lab/orders">
            <Button variant="ghost" size="sm">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {recentOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Package className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium">No orders assigned yet</h3>
              <p className="text-sm text-muted-foreground mt-1">Orders will appear here when patients book your lab</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Tests</TableHead>
                  <TableHead>Scheduled</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono text-xs">{order.id.slice(0, 8)}...</TableCell>
                    <TableCell>{order.user?.name || "N/A"}</TableCell>
                    <TableCell>
                      {order.items.length} test{order.items.length !== 1 ? "s" : ""}
                    </TableCell>
                    <TableCell>{order.scheduledDate}</TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
