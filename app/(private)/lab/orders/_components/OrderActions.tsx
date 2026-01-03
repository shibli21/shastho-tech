"use client";

import { useState, useTransition } from "react";
import { MoreHorizontal, FileUp, CheckCircle2, Loader2, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { updateLabOrderStatus, uploadReport } from "@/app/actions/lab";

interface OrderItem {
  id: string;
  type: "test" | "package";
  test?: { name: string } | null;
  package?: { name: string } | null;
  patient?: { name: string } | null;
  status: string | null;
}

interface OrderActionsProps {
  orderId: string;
  currentStatus: string;
  items: OrderItem[];
}

export function OrderActions({ orderId, currentStatus, items }: OrderActionsProps) {
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [selectedItemId, setSelectedItemId] = useState<string>("");
  const [fileUrl, setFileUrl] = useState("");
  const [notes, setNotes] = useState("");

  const pendingItems = items.filter((item) => item.status !== "reported");

  const handleStatusUpdate = (status: "collected" | "processing" | "completed") => {
    startTransition(async () => {
      const result = await updateLabOrderStatus(orderId, status);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`Order marked as ${status}`);
      }
    });
  };

  const handleUploadReport = () => {
    if (!selectedItemId || !fileUrl) {
      toast.error("Please select a test and provide the report URL");
      return;
    }

    startTransition(async () => {
      const formData = new FormData();
      formData.set("orderItemId", selectedItemId);
      formData.set("fileUrl", fileUrl);
      formData.set("notes", notes);

      const result = await uploadReport(formData);
      if (result.error) {
        toast.error(typeof result.error === "string" ? result.error : "Failed to upload report");
      } else {
        toast.success("Report uploaded successfully");
        setShowUploadDialog(false);
        setSelectedItemId("");
        setFileUrl("");
        setNotes("");
      }
    });
  };

  const canMarkCollected = currentStatus === "assigned" || currentStatus === "confirmed";
  const canMarkProcessing = currentStatus === "collected";
  const canMarkCompleted = currentStatus === "processing";
  const canUploadReport = currentStatus === "collected" || currentStatus === "processing";

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0" disabled={isPending}>
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoreHorizontal className="h-4 w-4" />}
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {canMarkCollected && (
            <DropdownMenuItem onClick={() => handleStatusUpdate("collected")}>
              <Package className="h-4 w-4 mr-2" />
              Mark as Collected
            </DropdownMenuItem>
          )}
          {canMarkProcessing && (
            <DropdownMenuItem onClick={() => handleStatusUpdate("processing")}>
              <Loader2 className="h-4 w-4 mr-2" />
              Mark as Processing
            </DropdownMenuItem>
          )}
          {canMarkCompleted && (
            <DropdownMenuItem onClick={() => handleStatusUpdate("completed")}>
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Mark as Completed
            </DropdownMenuItem>
          )}
          {canUploadReport && pendingItems.length > 0 && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setShowUploadDialog(true)}>
                <FileUp className="h-4 w-4 mr-2" />
                Upload Report
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Report</DialogTitle>
            <DialogDescription>Upload a diagnostic report for an order item.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="orderItem">Select Test *</Label>
              <Select value={selectedItemId} onValueChange={setSelectedItemId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a test..." />
                </SelectTrigger>
                <SelectContent>
                  {pendingItems.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.test?.name || item.package?.name || "Unknown Test"}
                      {item.patient?.name && ` - ${item.patient.name}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="fileUrl">Report URL *</Label>
              <Input
                id="fileUrl"
                placeholder="https://example.com/reports/report.pdf"
                value={fileUrl}
                onChange={(e) => setFileUrl(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">Enter the URL where the report PDF is hosted.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Any additional notes for the patient..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUploadDialog(false)} disabled={isPending}>
              Cancel
            </Button>
            <Button onClick={handleUploadReport} disabled={isPending || !selectedItemId || !fileUrl}>
              {isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Upload Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
