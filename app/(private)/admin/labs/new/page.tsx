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
import { authClient } from "@/lib/auth-client";

export default function NewLabPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    contactEmail: "",
    contactPhone: "",
    accreditations: "",
    serviceAreas: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      // Auto-generate slug from name
      ...(name === "name" && {
        slug: value
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, ""),
      }),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Create organization with lab metadata
      const metadata = {
        type: "lab",
        status: "pending",
        accreditations: formData.accreditations
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        serviceAreas: formData.serviceAreas
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        contactPhone: formData.contactPhone,
        contactEmail: formData.contactEmail,
        rating: null,
        logoUrl: null,
      };

      await authClient.organization.create({
        name: formData.name,
        slug: formData.slug,
        metadata,
      });

      toast.success("Lab partner created successfully!");
      toast.info("You can now invite the lab owner via email.");
      router.push("/admin/labs");
    } catch (error: unknown) {
      const err = error as { message?: string };
      toast.error(err.message || "Failed to create lab partner");
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
            Enter the lab partner details. You can invite the lab owner after creating the organization.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Lab Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Ibn Sina Diagnostic"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug *</Label>
                <Input
                  id="slug"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  placeholder="ibn-sina"
                  required
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact Email *</Label>
                <Input
                  id="contactEmail"
                  name="contactEmail"
                  type="email"
                  value={formData.contactEmail}
                  onChange={handleChange}
                  placeholder="labs@ibnsina.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactPhone">Contact Phone</Label>
                <Input
                  id="contactPhone"
                  name="contactPhone"
                  type="tel"
                  value={formData.contactPhone}
                  onChange={handleChange}
                  placeholder="+880-xxx-xxx"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="accreditations">Accreditations</Label>
              <Input
                id="accreditations"
                name="accreditations"
                value={formData.accreditations}
                onChange={handleChange}
                placeholder="NABL, ISO 15189 (comma separated)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="serviceAreas">Service Areas</Label>
              <Textarea
                id="serviceAreas"
                name="serviceAreas"
                value={formData.serviceAreas}
                onChange={handleChange}
                placeholder="Dhaka, Chattogram, Sylhet (comma separated)"
                rows={2}
              />
            </div>

            <div className="flex gap-4">
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
