"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { Switch } from "@/components/ui/switch";
import { createLab } from "@/app/actions/admin";

export default function NewLabPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);

    // Client-side slug generation if not provided is handled by server action logic (in a real app),
    // but here we trust the user input or generate it for them.
    // Let's generate slug if empty before sending?
    // Actually, let's keep it simple and just submit.

    try {
      const result = await createLab(formData);
      if (result && result.error) {
        if (typeof result.error === "string") {
          toast.error(result.error);
        } else {
          toast.error("Validation failed. Please check inputs.");
          console.error(result.error);
        }
      } else {
        toast.success("Lab partner created successfully!");
      }
    } catch (e) {
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
          <h1 className="text-3xl font-bold">Add Lab Partner</h1>
          <p className="text-muted-foreground mt-1">Create a new diagnostic lab partner organization</p>
        </div>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Lab Information</CardTitle>
          <CardDescription>
            Enter the lab partner details. This will create a public profile in the catalog.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Lab Name *</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Ibn Sina Diagnostic"
                  required
                  onChange={(e) => {
                    // Basic client-side helper to auto-fill slug
                    const slugInput = document.getElementById("slug") as HTMLInputElement;
                    if (slugInput && !slugInput.value) {
                      slugInput.value = e.target.value
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, "-")
                        .replace(/(^-|-$)/g, "");
                    }
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug *</Label>
                <Input id="slug" name="slug" placeholder="ibn-sina" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea id="address" name="address" placeholder="House #48, Road #9/A, Dhanmondi, Dhaka 1209" />
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="isVerified" name="isVerified" />
              <Label htmlFor="isVerified">Verify Lab (Show Verified Badge)</Label>
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Lab Partner
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
