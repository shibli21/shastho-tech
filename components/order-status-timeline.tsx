"use client";

import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Clock, CheckCircle2, UserCheck, FlaskConical, FileText, Package, XCircle } from "lucide-react";

export type OrderStatus = "pending" | "confirmed" | "assigned" | "collected" | "processing" | "completed" | "cancelled";

interface StatusHistoryEntry {
  id: string;
  status: OrderStatus;
  createdAt: Date;
  notes?: string | null;
  changedByUser?: { name: string } | null;
}

interface OrderStatusTimelineProps {
  currentStatus: OrderStatus;
  statusHistory: StatusHistoryEntry[];
  variant?: "horizontal" | "vertical";
  className?: string;
}

const STATUS_CONFIG: Record<
  OrderStatus,
  {
    label: string;
    icon: React.ElementType;
    color: string;
    bgColor: string;
    order: number;
  }
> = {
  pending: {
    label: "Booked",
    icon: Package,
    color: "text-gray-500",
    bgColor: "bg-gray-100",
    order: 1,
  },
  confirmed: {
    label: "Confirmed",
    icon: CheckCircle2,
    color: "text-blue-500",
    bgColor: "bg-blue-100",
    order: 2,
  },
  assigned: {
    label: "Collector Assigned",
    icon: UserCheck,
    color: "text-purple-500",
    bgColor: "bg-purple-100",
    order: 3,
  },
  collected: {
    label: "Sample Collected",
    icon: FlaskConical,
    color: "text-orange-500",
    bgColor: "bg-orange-100",
    order: 4,
  },
  processing: {
    label: "Processing",
    icon: Clock,
    color: "text-amber-500",
    bgColor: "bg-amber-100",
    order: 5,
  },
  completed: {
    label: "Report Ready",
    icon: FileText,
    color: "text-green-500",
    bgColor: "bg-green-100",
    order: 6,
  },
  cancelled: {
    label: "Cancelled",
    icon: XCircle,
    color: "text-red-500",
    bgColor: "bg-red-100",
    order: -1,
  },
};

// Get steps in order (excluding cancelled)
const ORDERED_STEPS: OrderStatus[] = ["pending", "confirmed", "assigned", "collected", "processing", "completed"];

export function OrderStatusTimeline({
  currentStatus,
  statusHistory,
  variant = "horizontal",
  className,
}: OrderStatusTimelineProps) {
  const currentOrder = STATUS_CONFIG[currentStatus].order;
  const isCancelled = currentStatus === "cancelled";

  // Map history to status for quick lookup
  const historyMap = new Map<OrderStatus, StatusHistoryEntry>();
  statusHistory.forEach((entry) => {
    if (!historyMap.has(entry.status)) {
      historyMap.set(entry.status, entry);
    }
  });

  if (variant === "vertical") {
    return (
      <div className={cn("space-y-0", className)}>
        {ORDERED_STEPS.map((status, index) => {
          const config = STATUS_CONFIG[status];
          const historyEntry = historyMap.get(status);
          const isCompleted = config.order <= currentOrder && !isCancelled;
          const isCurrent = status === currentStatus;
          const Icon = config.icon;
          const isLast = index === ORDERED_STEPS.length - 1;

          return (
            <div key={status} className="flex gap-4">
              {/* Timeline Line & Icon */}
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all",
                    isCompleted
                      ? `${config.bgColor} ${config.color} border-current`
                      : "bg-muted border-muted-foreground/20",
                    isCurrent && "ring-2 ring-offset-2 ring-current"
                  )}
                >
                  <Icon className={cn("w-5 h-5", isCompleted ? config.color : "text-muted-foreground/50")} />
                </div>
                {!isLast && (
                  <div
                    className={cn(
                      "w-0.5 h-12 transition-colors",
                      isCompleted ? "bg-primary/50" : "bg-muted-foreground/20"
                    )}
                  />
                )}
              </div>

              {/* Content */}
              <div className="pb-8">
                <p className={cn("font-medium", isCompleted ? "text-foreground" : "text-muted-foreground")}>
                  {config.label}
                </p>
                {historyEntry ? (
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(historyEntry.createdAt), "MMM d, yyyy 'at' h:mm a")}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground/50">Pending</p>
                )}
                {historyEntry?.notes && <p className="text-xs text-muted-foreground mt-1">{historyEntry.notes}</p>}
              </div>
            </div>
          );
        })}

        {/* Cancelled State */}
        {isCancelled && (
          <div className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-red-100 text-red-500 border-2 border-red-500">
                <XCircle className="w-5 h-5" />
              </div>
            </div>
            <div>
              <p className="font-medium text-red-500">Cancelled</p>
              {historyMap.get("cancelled") && (
                <p className="text-sm text-muted-foreground">
                  {format(new Date(historyMap.get("cancelled")!.createdAt), "MMM d, yyyy 'at' h:mm a")}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Horizontal variant
  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between">
        {ORDERED_STEPS.map((status, index) => {
          const config = STATUS_CONFIG[status];
          const historyEntry = historyMap.get(status);
          const isCompleted = config.order <= currentOrder && !isCancelled;
          const isCurrent = status === currentStatus;
          const Icon = config.icon;
          const isLast = index === ORDERED_STEPS.length - 1;

          return (
            <div key={status} className="flex items-center flex-1 last:flex-none">
              {/* Step */}
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all",
                    isCompleted
                      ? `${config.bgColor} ${config.color} border-current`
                      : "bg-muted border-muted-foreground/20",
                    isCurrent && "ring-2 ring-offset-2 ring-primary scale-110"
                  )}
                >
                  <Icon className={cn("w-5 h-5", isCompleted ? config.color : "text-muted-foreground/50")} />
                </div>
                <div className="mt-2 text-center">
                  <p
                    className={cn(
                      "text-xs font-medium whitespace-nowrap",
                      isCompleted ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {config.label}
                  </p>
                  {historyEntry && (
                    <p className="text-[10px] text-muted-foreground">
                      {format(new Date(historyEntry.createdAt), "MMM d, h:mm a")}
                    </p>
                  )}
                </div>
              </div>

              {/* Connector Line */}
              {!isLast && (
                <div
                  className={cn(
                    "h-0.5 flex-1 mx-2 transition-colors",
                    isCompleted && config.order < currentOrder ? "bg-primary/50" : "bg-muted-foreground/20"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Cancelled Badge */}
      {isCancelled && (
        <div className="mt-4 flex justify-center">
          <div className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-full">
            <XCircle className="w-4 h-4" />
            <span className="text-sm font-medium">Order Cancelled</span>
          </div>
        </div>
      )}
    </div>
  );
}

// Compact inline status badge
export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const config = STATUS_CONFIG[status];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
        config.bgColor,
        config.color
      )}
    >
      <Icon className="w-3.5 h-3.5" />
      {config.label}
    </div>
  );
}
