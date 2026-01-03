"use client";

import { useActionState, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Search, Check } from "lucide-react";
import Link from "next/link";
import { createPackage, getTests } from "@/app/actions/admin";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

// Since getTests is a server action, we need to fetch it differently in a client component or pass it as prop.
// For simplicity in this structure, let's fetch it on mount or use a separate client component wrapper.
// But to keep it simple, I'll pass the tests from a server component wrapper or just useEffect fetch if I had an API.
// Since I have server actions, I can call them directly in useEffect.

export default function NewPackagePage() {
  const [tests, setTests] = useState<{ id: string; name: string; code: string | null }[]>([]);
  const [selectedTests, setSelectedTests] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Initial State for useActionState - matches createPackage return type
  const initialState: { error?: unknown } | undefined = undefined;

  const [state, formAction] = useActionState(createPackage, initialState);

  useEffect(() => {
    getTests().then((data) => {
      setTests(data);
    });
  }, []);

  const filteredTests = tests.filter(
    (t) =>
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.code && t.code.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const toggleTest = (id: string) => {
    setSelectedTests((prev) => (prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/packages">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Create Health Package</h1>
          <p className="text-muted-foreground mt-1">Bundle multiple tests into a discounted package</p>
        </div>
      </div>

      <form action={formAction}>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Package Details</CardTitle>
                <CardDescription>Basic information about the package</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Package Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Executive Health Checkup"
                    required
                    onChange={(e) => {
                      const slug = document.getElementById("slug") as HTMLInputElement;
                      if (slug && !slug.value) {
                        slug.value = e.target.value
                          .toLowerCase()
                          .replace(/[^a-z0-9]+/g, "-")
                          .replace(/(^-|-$)/g, "");
                      }
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug *</Label>
                  <Input id="slug" name="slug" placeholder="executive-health-checkup" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" name="description" placeholder="Comprehensive checkup for..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="recommendedFor">Recommended For</Label>
                  <Input id="recommendedFor" name="recommendedFor" placeholder="Males above 40" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Base Price *</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5">৳</span>
                      <Input id="price" name="price" type="number" className="pl-8" placeholder="5000" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="discountPrice">Discount Price</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5">৳</span>
                      <Input
                        id="discountPrice"
                        name="discountPrice"
                        type="number"
                        className="pl-8"
                        placeholder="3500"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 pt-2">
                  <Switch id="isPopular" name="isPopular" />
                  <Label htmlFor="isPopular">Mark as Popular</Label>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="h-full flex flex-col">
              <CardHeader>
                <CardTitle>Include Tests</CardTitle>
                <CardDescription>Select the tests to include in this package</CardDescription>
                <div className="relative mt-2">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search tests..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </CardHeader>
              <CardContent className="flex-1 min-h-[400px]">
                <ScrollArea className="h-[400px] border rounded-md p-4">
                  <div className="space-y-2">
                    {filteredTests.map((test) => (
                      <div
                        key={test.id}
                        className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                          selectedTests.includes(test.id) ? "bg-primary/5 border-primary" : "hover:bg-muted/50"
                        }`}
                        onClick={() => toggleTest(test.id)}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-4 h-4 rounded-sm border flex items-center justify-center ${
                              selectedTests.includes(test.id)
                                ? "bg-primary border-primary text-primary-foreground"
                                : "border-muted-foreground"
                            }`}
                          >
                            {selectedTests.includes(test.id) && <Check className="h-3 w-3" />}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{test.name}</p>
                            <p className="text-xs text-muted-foreground">{test.code}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                    {filteredTests.length === 0 && (
                      <p className="text-center text-sm text-muted-foreground py-8">No tests found</p>
                    )}
                  </div>
                </ScrollArea>
                <div className="mt-4 text-sm text-muted-foreground">{selectedTests.length} tests selected</div>
                {/* Hidden inputs to submit selected tests */}
                {selectedTests.map((id) => (
                  <input key={id} type="hidden" name="testIds" value={id} />
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex gap-4 mt-6">
          <Button type="submit" size="lg">
            Create Package
          </Button>
          <Link href="/admin/packages">
            <Button type="button" variant="outline" size="lg">
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
