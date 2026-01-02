import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileText } from "lucide-react";

export default function LabReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reports</h1>
          <p className="text-muted-foreground mt-1">Upload diagnostic reports for completed orders</p>
        </div>
        <Button>
          <Upload className="h-4 w-4 mr-2" />
          Upload Report
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Uploaded Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium">No reports uploaded</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Upload diagnostic reports for completed sample collections
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
