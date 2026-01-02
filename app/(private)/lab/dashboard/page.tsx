import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { parseOrgMetadata } from "@/lib/shared";
import { SectionCards, type SectionCardItem } from "@/components/section-cards";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package } from "lucide-react";

export default async function LabDashboardPage() {
  const requestHeaders = await headers();
  const session = await auth.api.getSession({ headers: requestHeaders });
  // @ts-expect-error - activeOrganization is added by organization plugin
  const activeOrg = session?.activeOrganization;
  const metadata = activeOrg ? parseOrgMetadata(activeOrg.metadata) : null;

  const labStats: SectionCardItem[] = [
    {
      title: "Assigned Orders",
      value: "0",
      footerLabel: "This month",
    },
    {
      title: "Pending Collection",
      value: "0",
      footerLabel: "Awaiting sample",
    },
    {
      title: "Reports Uploaded",
      value: "0",
      footerLabel: "This month",
    },
    {
      title: "Team Members",
      value: "1",
      footerLabel: "Active staff",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="px-4 lg:px-6">
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
      <div className="px-4 lg:px-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Package className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium">No orders assigned yet</h3>
              <p className="text-sm text-muted-foreground mt-1">Orders will appear here when patients book your lab</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
