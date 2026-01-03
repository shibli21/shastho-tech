import { getLabOrders } from "@/app/actions/lab";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Package } from "lucide-react";
import { OrderActions } from "./_components/OrderActions";

function getStatusBadge(status: string) {
  const statusConfig: Record<string, { label: string; className: string }> = {
    pending: { label: "Pending", className: "bg-gray-500" },
    confirmed: { label: "Confirmed", className: "bg-blue-500" },
    assigned: { label: "Assigned", className: "bg-purple-500" },
    collected: { label: "Collected", className: "bg-yellow-500" },
    processing: { label: "Processing", className: "bg-orange-500" },
    completed: { label: "Completed", className: "bg-green-500" },
    cancelled: { label: "Cancelled", className: "bg-red-500" },
  };

  const config = statusConfig[status] || { label: status, className: "" };
  return <Badge className={`${config.className} hover:${config.className}`}>{config.label}</Badge>;
}

export default async function LabOrdersPage() {
  const orders = await getLabOrders();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Orders</h1>
        <p className="text-muted-foreground mt-1">View and manage orders assigned to your lab</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Assigned Orders ({orders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Package className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium">No orders assigned</h3>
              <p className="text-sm text-muted-foreground mt-1">Orders assigned to your lab will appear here</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Tests</TableHead>
                  <TableHead>Scheduled Date</TableHead>
                  <TableHead>Time Slot</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono text-xs">{order.id.slice(0, 8)}...</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{order.user?.name || "N/A"}</div>
                        <div className="text-xs text-muted-foreground">{order.user?.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {order.items.slice(0, 2).map((item) => (
                          <div key={item.id} className="text-sm">
                            {item.test?.name || item.package?.name || "Unknown"}
                            {item.patient && <span className="text-muted-foreground"> ({item.patient.name})</span>}
                          </div>
                        ))}
                        {order.items.length > 2 && (
                          <div className="text-xs text-muted-foreground">+{order.items.length - 2} more</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{order.scheduledDate}</TableCell>
                    <TableCell>{order.scheduledTimeSlot}</TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell className="text-right">
                      <OrderActions
                        orderId={order.id}
                        currentStatus={order.status}
                        items={order.items.map((item) => ({
                          id: item.id,
                          type: item.type,
                          test: item.test,
                          package: item.package,
                          patient: item.patient,
                          status: item.status,
                        }))}
                      />
                    </TableCell>
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
