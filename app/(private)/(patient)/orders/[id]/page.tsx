import { notFound } from "next/navigation";
import { getUserOrderDetails } from "@/app/actions/orders";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { OrderStatusTimeline } from "@/components/order-status-timeline";
import { ArrowLeft, Calendar, Clock, MapPin, Building2, FileDown, FlaskConical } from "lucide-react";
import Link from "next/link";

interface PatientOrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function PatientOrderDetailPage({ params }: PatientOrderDetailPageProps) {
  const { id } = await params;
  const order = await getUserOrderDetails(id);

  if (!order) {
    notFound();
  }

  // Get first patient from items (for display)
  const patient = order.items[0]?.patient;

  // Check if any reports are available
  const hasReports = order.items.some((item) => item.reports && item.reports.length > 0);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/orders">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">Order Details</h1>
            <Badge variant="outline" className="font-mono text-xs">
              #{order.id.slice(0, 8)}
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm mt-1">
            Placed on {format(new Date(order.createdAt), "MMMM d, yyyy 'at' h:mm a")}
          </p>
        </div>
      </div>

      {/* Status Timeline - Main Focus */}
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10">
          <CardTitle>Order Status</CardTitle>
          <CardDescription>Track your order progress</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <OrderStatusTimeline currentStatus={order.status} statusHistory={order.statusHistory} variant="horizontal" />
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Order Items */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FlaskConical className="h-5 w-5" />
              Tests & Packages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 rounded-lg border bg-muted/30">
                  <div className="flex-1">
                    <p className="font-medium">{item.test?.name || item.package?.name || "Unknown Test"}</p>
                    <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                      <Badge variant="secondary" className="text-xs capitalize">
                        {item.type}
                      </Badge>
                      {item.test?.category && <span>{item.test.category.name}</span>}
                      {item.patient && <span>• Patient: {item.patient.name}</span>}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">৳{item.price}</p>
                    {item.reports && item.reports.length > 0 && (
                      <a href={item.reports[0].fileUrl} target="_blank" rel="noopener noreferrer">
                        <Button size="sm" variant="outline" className="mt-2">
                          <FileDown className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </a>
                    )}
                  </div>
                </div>
              ))}
              <div className="flex justify-between pt-4 border-t mt-4">
                <span className="font-semibold">Total Amount</span>
                <span className="font-bold text-xl">৳{order.totalAmount}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Schedule & Address */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Collection Schedule
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">{format(new Date(order.scheduledDate), "EEEE, MMMM d, yyyy")}</p>
                <p className="text-sm text-muted-foreground">Scheduled Date</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">{order.scheduledTimeSlot}</p>
                <p className="text-sm text-muted-foreground">Time Slot</p>
              </div>
            </div>
            <div className="flex items-start gap-3 pt-2 border-t">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Collection Address</p>
                {order.address ? (
                  <p className="text-sm text-muted-foreground">
                    {order.address.address}
                    {order.address.area && `, ${order.address.area}`}
                    {order.address.city && `, ${order.address.city}`}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground">No address provided</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lab Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Lab Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            {order.assignedLab ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">{order.assignedLab.name}</p>
                    {order.assignedLab.isVerified && (
                      <Badge variant="secondary" className="text-xs mt-1">
                        Verified Partner
                      </Badge>
                    )}
                  </div>
                </div>
                {order.assignedLab.address && (
                  <p className="text-sm text-muted-foreground">{order.assignedLab.address}</p>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <Building2 className="h-10 w-10 text-muted-foreground/50 mb-2" />
                <p className="text-muted-foreground">Lab not assigned yet</p>
                <p className="text-sm text-muted-foreground">A lab will be assigned soon</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Reports Section (shown when completed) */}
      {hasReports && (
        <Card className="border-green-200 bg-green-50/50">
          <CardHeader>
            <CardTitle className="text-green-700 flex items-center gap-2">
              <FileDown className="h-5 w-5" />
              Reports Available
            </CardTitle>
            <CardDescription>Download your test reports below</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              {order.items
                .filter((item) => item.reports && item.reports.length > 0)
                .map((item) => (
                  <a
                    key={item.id}
                    href={item.reports![0].fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg border bg-white hover:shadow-md transition-shadow"
                  >
                    <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                      <FileDown className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{item.test?.name || item.package?.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(item.reports![0].uploadedAt), "MMM d, yyyy")}
                      </p>
                    </div>
                  </a>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Status History (Detailed) */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Timeline</CardTitle>
          <CardDescription>Detailed history of your order</CardDescription>
        </CardHeader>
        <CardContent>
          <OrderStatusTimeline currentStatus={order.status} statusHistory={order.statusHistory} variant="vertical" />
        </CardContent>
      </Card>
    </div>
  );
}
