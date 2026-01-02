import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { parseOrgMetadata } from "@/lib/shared";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

export default async function LabSettingsPage() {
  const requestHeaders = await headers();
  const session = await auth.api.getSession({ headers: requestHeaders });
  const activeOrg = session?.activeOrganization;
  const metadata = activeOrg ? parseOrgMetadata(activeOrg.metadata) : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your lab profile and settings</p>
      </div>

      <div className="grid gap-6 max-w-2xl">
        {/* Lab Profile */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Lab Profile</CardTitle>
              <Badge
                variant={
                  metadata?.status === "active"
                    ? "default"
                    : metadata?.status === "pending"
                      ? "secondary"
                      : "destructive"
                }
              >
                {metadata?.status || "Unknown"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Lab Name</Label>
              <Input value={activeOrg?.name || ""} disabled />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Contact Email</Label>
                <Input value={metadata?.contactEmail || ""} disabled />
              </div>
              <div className="space-y-2">
                <Label>Contact Phone</Label>
                <Input value={metadata?.contactPhone || ""} disabled />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Accreditations</Label>
              <div className="flex flex-wrap gap-2">
                {metadata?.accreditations?.length ? (
                  metadata.accreditations.map((acc) => (
                    <Badge key={acc} variant="outline">
                      {acc}
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground">No accreditations added</span>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Service Areas</Label>
              <div className="flex flex-wrap gap-2">
                {metadata?.serviceAreas?.length ? (
                  metadata.serviceAreas.map((area) => (
                    <Badge key={area} variant="outline">
                      {area}
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground">No service areas defined</span>
                )}
              </div>
            </div>
            <p className="text-sm text-muted-foreground">Contact platform admin to update your lab profile.</p>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              These actions are irreversible. Please proceed with caution.
            </p>
            <Button variant="destructive" disabled>
              Leave Organization
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
