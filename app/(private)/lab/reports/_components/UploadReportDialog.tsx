"use client";

import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { uploadReport } from "@/app/actions/lab";

interface UploadReportDialogProps {
  orderItemId: string;
  testName: string;
  patientName: string;
  children: React.ReactNode;
}

export function UploadReportDialog({ orderItemId, testName, patientName, children }: UploadReportDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [fileUrl, setFileUrl] = useState("");
  const [notes, setNotes] = useState("");

  const handleUpload = () => {
    if (!fileUrl) {
      toast.error("Please provide the report URL");
      return;
    }

    startTransition(async () => {
      const formData = new FormData();
      formData.set("orderItemId", orderItemId);
      formData.set("fileUrl", fileUrl);
      formData.set("notes", notes);

      const result = await uploadReport(formData);
      if (result.error) {
        toast.error(typeof result.error === "string" ? result.error : "Failed to upload report");
      } else {
        toast.success("Report uploaded successfully");
        setOpen(false);
        setFileUrl("");
        setNotes("");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Report</DialogTitle>
          <DialogDescription>
            Upload report for <strong>{testName}</strong> - Patient: {patientName}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
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
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isPending}>
            Cancel
          </Button>
          <Button onClick={handleUpload} disabled={isPending || !fileUrl}>
            {isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Upload Report
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
