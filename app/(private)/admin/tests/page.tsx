import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TestTube, Plus } from "lucide-react";

export default function AdminTestsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tests &amp; Packages</h1>
          <p className="text-muted-foreground mt-1">Manage diagnostic tests and health packages</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Test
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Tests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <TestTube className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium">No tests added yet</h3>
            <p className="text-sm text-muted-foreground mt-1">Add diagnostic tests that labs can offer</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
