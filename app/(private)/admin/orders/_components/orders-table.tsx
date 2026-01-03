"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BookingStatus } from "@/types/types";
import { Loader2 } from "lucide-react";
import { updateOrderStatus } from "@/app/actions/admin";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Order {
  id: string;
  totalAmount: number;
  status: BookingStatus;
  scheduledDate: string;
  scheduledTimeSlot: string;
  createdAt: Date; // Date object from Drizzle query
  address?: { address: string; area: string | null; city: string | null } | null;
  user: { name: string; email: string };
  items: {
    type: "test" | "package";
    test?: { name: string } | null;
    package?: { name: string } | null;
    price: number;
  }[];
}

interface OrdersTableProps {
  orders: Order[]; // Using any for flexibility with Drizzle result, but typed internally
}

export function OrdersTable({ orders }: OrdersTableProps) {
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleStatusChange = async (orderId: string, newStatus: BookingStatus) => {
    setUpdatingId(orderId);
    try {
      const result = await updateOrderStatus(orderId, newStatus);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`Order ${orderId.slice(0, 8)} status updated to ${newStatus}`);
      }
    } catch {
      toast.error("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "collected":
        return "bg-purple-100 text-purple-800";
      case "processing":
        return "bg-orange-100 text-orange-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Orders ({orders.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Patient/User</TableHead>
              <TableHead>Schedule</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                  No orders found.
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono text-xs text-muted-foreground">{order.id.slice(0, 8)}...</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{order.user?.name || "Guest"}</span>
                      <span className="text-xs text-muted-foreground">{order.user?.email}</span>
                      <span className="text-xs text-muted-foreground truncate max-w-[150px]">
                        {order.address?.address}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col text-sm">
                      <span>{order.scheduledDate ? format(new Date(order.scheduledDate), "MMM dd, yyyy") : "N/A"}</span>
                      <span className="text-xs text-muted-foreground">{order.scheduledTimeSlot}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      {order.items.map((item: any, idx: number) => (
                        <Badge key={idx} variant="outline" className="w-fit text-[10px]">
                          {item.test?.name || item.package?.name}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="font-bold">৳{order.totalAmount}</TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={`capitalize ${getStatusColor(order.status)} hover:${getStatusColor(order.status)}`}
                    >
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {updatingId === order.id ? (
                      <Button disabled size="sm" variant="ghost">
                        <Loader2 className="w-4 h-4 animate-spin" />
                      </Button>
                    ) : (
                      <Select
                        defaultValue={order.status}
                        onValueChange={(val) => handleStatusChange(order.id, val as BookingStatus)}
                      >
                        <SelectTrigger className="w-[130px] h-8 text-xs ml-auto">
                          <SelectValue placeholder="Update Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="assigned">Assigned</SelectItem>
                          <SelectItem value="collected">Collected</SelectItem>
                          <SelectItem value="processing">Processing</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
