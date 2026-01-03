import { getLabOrders, getLabReports } from "@/app/actions/lab";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Upload, ExternalLink, CheckCircle2 } from "lucide-react";
import { UploadReportDialog } from "./_components/UploadReportDialog";

export default async function LabReportsPage() {
  const [orders, uploadedReports] = await Promise.all([getLabOrders(), getLabReports()]);

  // Get pending items (need report upload)
  const pendingItems = orders.flatMap((order) =>
    order.items
      .filter((item) => item.status === "pending" || item.status === "completed")
      .map((item) => ({
        ...item,
        order: {
          id: order.id,
          scheduledDate: order.scheduledDate,
          status: order.status,
          user: order.user,
        },
      }))
  );

  // Filter to only show pending items from collected/processing orders
  const itemsReadyForReport = pendingItems.filter(
    (item) => item.order.status === "collected" || item.order.status === "processing"
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Reports</h1>
        <p className="text-muted-foreground mt-1">Upload diagnostic reports for completed orders</p>
      </div>

      {/* Pending Uploads */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Pending Uploads ({itemsReadyForReport.length})
          </CardTitle>
          <CardDescription>Order items waiting for report upload</CardDescription>
        </CardHeader>
        <CardContent>
          {itemsReadyForReport.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <CheckCircle2 className="h-12 w-12 text-green-500/50 mb-4" />
              <h3 className="text-lg font-medium">All caught up!</h3>
              <p className="text-sm text-muted-foreground mt-1">No pending report uploads at the moment</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Test</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {itemsReadyForReport.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-mono text-xs">{item.order.id.slice(0, 8)}...</TableCell>
                    <TableCell className="font-medium">{item.test?.name || item.package?.name || "Unknown"}</TableCell>
                    <TableCell>{item.patient?.name || "Self"}</TableCell>
                    <TableCell>{item.order.scheduledDate}</TableCell>
                    <TableCell className="text-right">
                      <UploadReportDialog
                        orderItemId={item.id}
                        testName={item.test?.name || item.package?.name || "Test"}
                        patientName={item.patient?.name || "Self"}
                      >
                        <Button size="sm">
                          <Upload className="h-4 w-4 mr-2" />
                          Upload
                        </Button>
                      </UploadReportDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Uploaded Reports */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Uploaded Reports ({uploadedReports.length})
          </CardTitle>
          <CardDescription>Reports that have been uploaded for patients</CardDescription>
        </CardHeader>
        <CardContent>
          {uploadedReports.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium">No reports uploaded yet</h3>
              <p className="text-sm text-muted-foreground mt-1">Uploaded reports will appear here</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Test</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Uploaded Date</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead className="text-right">Report</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {uploadedReports.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.test?.name || item.package?.name || "Unknown"}</TableCell>
                    <TableCell>{item.patient?.name || "Self"}</TableCell>
                    <TableCell>
                      {item.reports[0]?.uploadedAt ? new Date(item.reports[0].uploadedAt).toLocaleDateString() : "N/A"}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">{item.reports[0]?.notes || "-"}</TableCell>
                    <TableCell className="text-right">
                      {item.reports[0]?.fileUrl ? (
                        <a href={item.reports[0].fileUrl} target="_blank" rel="noopener noreferrer">
                          <Button size="sm" variant="outline">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            View
                          </Button>
                        </a>
                      ) : (
                        <Badge variant="secondary">No file</Badge>
                      )}
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
