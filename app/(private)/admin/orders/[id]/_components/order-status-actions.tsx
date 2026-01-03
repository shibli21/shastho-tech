"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { updateOrderStatus, assignLabToOrder } from "@/app/actions/admin";
import type { OrderStatus } from "@/components/order-status-timeline";

interface Lab {
  id: string;
  name: string;
}

interface OrderStatusActionsProps {
  orderId: string;
  currentStatus: OrderStatus;
  assignedLabId: string | null;
  labs: Lab[];
}

const STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "assigned", label: "Assigned" },
  { value: "collected", label: "Collected" },
  { value: "processing", label: "Processing" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

export function OrderStatusActions({ orderId, currentStatus, assignedLabId, labs }: OrderStatusActionsProps) {
  const [status, setStatus] = useState(currentStatus);
  const [labId, setLabId] = useState(assignedLabId || "");
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isAssigningLab, setIsAssigningLab] = useState(false);

  const handleStatusUpdate = async () => {
    if (status === currentStatus) return;

    setIsUpdatingStatus(true);
    try {
      const result = await updateOrderStatus(orderId, status);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`Status updated to ${status}`);
      }
    } catch {
      toast.error("Failed to update status");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleLabAssign = async () => {
    if (!labId || labId === assignedLabId) return;

    setIsAssigningLab(true);
    try {
      const result = await assignLabToOrder(orderId, labId);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Lab assigned successfully");
      }
    } catch {
      toast.error("Failed to assign lab");
    } finally {
      setIsAssigningLab(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Status Update */}
      <div className="space-y-3">
        <Label>Update Status</Label>
        <Select value={status} onValueChange={(val) => setStatus(val as OrderStatus)}>
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={handleStatusUpdate} disabled={isUpdatingStatus || status === currentStatus} className="w-full">
          {isUpdatingStatus ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Updating...
            </>
          ) : (
            "Update Status"
          )}
        </Button>
      </div>

      {/* Lab Assignment */}
      <div className="space-y-3 pt-4 border-t">
        <Label>Assign Lab</Label>
        <Select value={labId} onValueChange={setLabId}>
          <SelectTrigger>
            <SelectValue placeholder="Select a lab" />
          </SelectTrigger>
          <SelectContent>
            {labs.map((lab) => (
              <SelectItem key={lab.id} value={lab.id}>
                {lab.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          onClick={handleLabAssign}
          disabled={isAssigningLab || !labId || labId === assignedLabId}
          variant="secondary"
          className="w-full"
        >
          {isAssigningLab ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Assigning...
            </>
          ) : assignedLabId ? (
            "Reassign Lab"
          ) : (
            "Assign Lab"
          )}
        </Button>
      </div>
    </div>
  );
}
