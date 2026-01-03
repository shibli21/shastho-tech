import { notFound } from "next/navigation";
import { getAdminOrderDetails, getLabs } from "@/app/actions/admin";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { OrderStatusTimeline } from "@/components/order-status-timeline";
import { ArrowLeft, Calendar, Clock, MapPin, User, Phone, Mail, Building2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { OrderStatusActions } from "./_components/order-status-actions";

interface AdminOrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminOrderDetailPage({ params }: AdminOrderDetailPageProps) {
  const { id } = await params;
  const [order, labs] = await Promise.all([getAdminOrderDetails(id), getLabs()]);

  if (!order) {
    notFound();
  }

  // Get first patient from items
  const patient = order.items[0]?.patient;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/orders">
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
            Created on {format(new Date(order.createdAt), "MMMM d, yyyy 'at' h:mm a")}
          </p>
        </div>
      </div>

      {/* Status Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Order Status</CardTitle>
          <CardDescription>Track the progress of this order</CardDescription>
        </CardHeader>
        <CardContent>
          <OrderStatusTimeline currentStatus={order.status} statusHistory={order.statusHistory} variant="horizontal" />
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>Tests & Packages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 rounded-lg border bg-muted/30">
                    <div className="flex-1">
                      <p className="font-medium">{item.test?.name || item.package?.name || "Unknown"}</p>
                      <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                        <Badge variant="secondary" className="text-xs">
                          {item.type}
                        </Badge>
                        {item.test?.category && <span>{item.test.category.name}</span>}
                        {item.patient && <span>• For: {item.patient.name}</span>}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">৳{item.price}</p>
                      {item.reports && item.reports.length > 0 && (
                        <Badge className="bg-green-100 text-green-700 mt-1">Report Uploaded</Badge>
                      )}
                    </div>
                  </div>
                ))}
                <div className="flex justify-between pt-4 border-t font-bold text-lg">
                  <span>Total</span>
                  <span>৳{order.totalAmount}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status History */}
          <Card>
            <CardHeader>
              <CardTitle>Status History</CardTitle>
              <CardDescription>Complete timeline of status changes</CardDescription>
            </CardHeader>
            <CardContent>
              <OrderStatusTimeline
                currentStatus={order.status}
                statusHistory={order.statusHistory}
                variant="vertical"
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <OrderStatusActions
                orderId={order.id}
                currentStatus={order.status}
                assignedLabId={order.assignedLabId}
                labs={labs}
              />
            </CardContent>
          </Card>

          {/* Customer Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Customer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="font-medium">{order.user.name}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                  <Mail className="h-3 w-3" />
                  {order.user.email}
                </div>
              </div>
              {patient && (
                <div className="pt-3 border-t">
                  <p className="text-xs text-muted-foreground mb-1">Patient</p>
                  <p className="font-medium">{patient.name}</p>
                  <p className="text-sm text-muted-foreground capitalize">
                    {patient.gender} • {patient.relation}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Schedule */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{format(new Date(order.scheduledDate), "EEEE, MMMM d, yyyy")}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{order.scheduledTimeSlot}</span>
              </div>
            </CardContent>
          </Card>

          {/* Address */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Collection Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              {order.address ? (
                <div className="space-y-1">
                  <p>{order.address.address}</p>
                  {order.address.area && <p className="text-sm text-muted-foreground">{order.address.area}</p>}
                  {order.address.city && <p className="text-sm text-muted-foreground">{order.address.city}</p>}
                </div>
              ) : (
                <p className="text-muted-foreground">No address provided</p>
              )}
            </CardContent>
          </Card>

          {/* Assigned Lab */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Assigned Lab
              </CardTitle>
            </CardHeader>
            <CardContent>
              {order.assignedLab ? (
                <div className="space-y-1">
                  <p className="font-medium">{order.assignedLab.name}</p>
                  {order.assignedLab.contactEmail && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-3 w-3" />
                      {order.assignedLab.contactEmail}
                    </div>
                  )}
                  {order.assignedLab.contactPhone && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="h-3 w-3" />
                      {order.assignedLab.contactPhone}
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground">Not assigned yet</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
