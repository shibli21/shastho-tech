"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { createTest } from "@/app/actions/admin";
import { toast } from "sonner";

interface TestCategory {
  id: string;
  name: string;
}

interface NewTestFormProps {
  categories: TestCategory[];
}

export function NewTestForm({ categories }: NewTestFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    try {
      const result = await createTest(formData);
      if (result && result.error) {
        if (typeof result.error === "string") {
          toast.error(result.error);
        } else {
          toast.error("Validation failed. Please check inputs.");
          console.error(result.error);
        }
      } else {
        toast.success("Test created successfully!");
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
        <Link href="/admin/tests">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Add Diagnostic Test</h1>
          <p className="text-muted-foreground mt-1">Create a new test that labs can add to their catalog</p>
        </div>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Test Details</CardTitle>
          <CardDescription>
            Define the test specifications. Labs will set their own prices for this test.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Test Name *</Label>
                <Input id="name" name="name" placeholder="Complete Blood Count (CBC)" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="code">Test Code (SKU) *</Label>
                <Input id="code" name="code" placeholder="CBC001" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="categoryId">Category *</Label>
              <Select name="categoryId" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="gap-4 grid md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="sampleType">Sample Type</Label>
                <Input id="sampleType" name="sampleType" placeholder="Blood, Urine, etc." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="turnaroundTime">Turnaround Time (Avg)</Label>
                <Input id="turnaroundTime" name="turnaroundTime" placeholder="24 Hours" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Brief description of what this test measures..."
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="fastingRequired" name="fastingRequired" />
              <Label htmlFor="fastingRequired">Fasting Required?</Label>
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Test
              </Button>
              <Link href="/admin/tests">
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
