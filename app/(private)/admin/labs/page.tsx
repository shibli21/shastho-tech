import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Plus } from "lucide-react";

export default function AdminLabsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Partner Labs</h1>
          <p className="text-muted-foreground mt-1">Manage diagnostic lab partners on the platform</p>
        </div>
        <Link href="/admin/labs/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Lab Partner
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Partner Labs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Building2 className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium">No lab partners yet</h3>
            <p className="text-sm text-muted-foreground mt-1">Add your first lab partner to start accepting orders</p>
            <Link href="/admin/labs/new">
              <Button className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Add Lab Partner
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
