"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { updateLab } from "@/app/actions/admin";

interface Lab {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  address: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  serviceAreas: string | null;
  isVerified: boolean | null;
}

interface EditLabFormProps {
  lab: Lab;
}

export function EditLabForm({ lab }: EditLabFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);

    try {
      const result = await updateLab(lab.id, formData);
      if (result && result.error) {
        if (typeof result.error === "string") {
          toast.error(result.error);
        } else {
          toast.error("Validation failed. Please check inputs.");
          console.error(result.error);
        }
      } else {
        toast.success("Lab partner updated successfully!");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/labs">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Edit Lab Partner</h1>
          <p className="text-muted-foreground mt-1">Update details for {lab.name}</p>
        </div>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Lab Information</CardTitle>
          <CardDescription>Update the lab partner details below.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Lab Name *</Label>
                <Input id="name" name="name" defaultValue={lab.name} placeholder="Ibn Sina Diagnostic" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug *</Label>
                <Input id="slug" name="slug" defaultValue={lab.slug} placeholder="ibn-sina" required />
              </div>
            </div>

            {/* Contact Info */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="contactPhone">Contact Phone</Label>
                <Input
                  id="contactPhone"
                  name="contactPhone"
                  type="tel"
                  defaultValue={lab.contactPhone || ""}
                  placeholder="+880 17XX-XXXXXX"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact Email</Label>
                <Input
                  id="contactEmail"
                  name="contactEmail"
                  type="email"
                  defaultValue={lab.contactEmail || ""}
                  placeholder="info@labname.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                name="address"
                defaultValue={lab.address || ""}
                placeholder="House #48, Road #9/A, Dhanmondi, Dhaka 1209"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="serviceAreas">Service Areas</Label>
              <Input
                id="serviceAreas"
                name="serviceAreas"
                defaultValue={lab.serviceAreas || ""}
                placeholder="Dhaka, Chittagong, Sylhet"
              />
              <p className="text-sm text-muted-foreground">
                Comma-separated list of areas where this lab provides service.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="isVerified" name="isVerified" defaultChecked={lab.isVerified || false} />
              <Label htmlFor="isVerified">Verify Lab (Show Verified Badge)</Label>
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update Lab Partner
              </Button>
              <Link href="/admin/labs">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
