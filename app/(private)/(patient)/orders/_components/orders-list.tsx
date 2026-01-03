"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, Calendar, Clock, MapPin, ChevronRight } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { OrderStatusBadge, type OrderStatus } from "@/components/order-status-timeline";
import type { Booking } from "@/types/types";

interface OrdersListProps {
  orders: Booking[];
}

export function OrdersList({ orders }: OrdersListProps) {
  if (orders.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Order History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Package className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium">No orders found</h3>
            <p className="text-sm text-muted-foreground mt-1">Your orders will appear here after you book a test</p>
            <Link href="/">
              <Button className="mt-4">Book a Test</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order History</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {orders.map((order) => (
          <Link key={order.id} href={`/dashboard/orders/${order.id}`} className="block">
            <div className="flex items-center gap-4 p-4 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors group">
              {/* Left: Order Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-mono text-xs text-muted-foreground">#{order.id.slice(0, 8)}</span>
                  <OrderStatusBadge status={order.status as OrderStatus} />
                </div>

                <div className="flex flex-wrap gap-2 mb-2">
                  {order.tests.slice(0, 3).map((test, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {test.name}
                    </Badge>
                  ))}
                  {order.tests.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{order.tests.length - 3} more
                    </Badge>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{order.date ? format(new Date(order.date), "MMM d, yyyy") : "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{order.slot}</span>
                  </div>
                  <div className="flex items-center gap-1 truncate max-w-[200px]">
                    <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                    <span className="truncate">{order.address}</span>
                  </div>
                </div>
              </div>

              {/* Right: Price & Arrow */}
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-bold text-lg">৳{order.total}</p>
                  <p className="text-xs text-muted-foreground">{format(new Date(order.createdAt), "MMM d, yyyy")}</p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
