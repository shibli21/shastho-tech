import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { SectionCards, type SectionCardItem } from "@/components/section-cards";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package } from "lucide-react";

export default async function PatientDashboardPage() {
  const requestHeaders = await headers();
  const session = await auth.api.getSession({ headers: requestHeaders });

  const patientStats: SectionCardItem[] = [
    {
      title: "Total Orders",
      value: "0",
      footerLabel: "Lifetime bookings",
    },
    {
      title: "Reports Ready",
      value: "0",
      footerLabel: "Available to view",
    },
    {
      title: "Pending",
      value: "0",
      footerLabel: "Awaiting collection",
    },
    {
      title: "Family Members",
      value: "1",
      footerLabel: "Profiles saved",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="px-4 lg:px-6">
        <h1 className="text-3xl font-bold">Welcome back, {session?.user.name.split(" ")[0]}! 👋</h1>
        <p className="text-muted-foreground mt-1">Here&apos;s an overview of your health journey</p>
      </div>

      {/* Stats Cards */}
      <SectionCards items={patientStats} />

      {/* Recent Orders Section */}
      <div className="px-4 lg:px-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Package className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium">No orders yet</h3>
              <p className="text-sm text-muted-foreground mt-1">Book your first diagnostic test to get started</p>
              <a
                href="/tests"
                className="mt-4 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Browse Tests
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
