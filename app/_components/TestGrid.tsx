import React, { useState } from "react";
import { Plus, Clock, Info } from "lucide-react";
import { LabTest } from "@/types/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/field";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

// Define a type that matches what our server action returns, effectively extending/replacing parts of LabTest
export interface PublicTest {
  id: string;
  name: string;
  category: string;
  description: string | null;
  turnaroundTime: string | null;
  price: number;
  labCount: number;
  fastingRequired: boolean | null;
}

interface TestGridProps {
  tests: PublicTest[];
  onAddToCart: (test: LabTest) => void; // Keeping LabTest compatibility for now
}

const TestGrid: React.FC<TestGridProps> = ({ tests, onAddToCart }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", ...Array.from(new Set(tests.map((t) => t.category).filter(Boolean)))];

  const filteredTests = tests.filter((test) => {
    const matchesSearch = test.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "All" || test.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAdd = (test: PublicTest) => {
    // Adapt PublicTest to LabTest for cart compatibility
    const cartItem: LabTest = {
      id: test.id,
      name: test.name,
      category: test.category || "General",
      price: test.price,
      description: test.description || "",
      turnaroundTime: test.turnaroundTime || "",
      preparation: test.fastingRequired ? "Fasting Required" : "",
    };
    onAddToCart(cartItem);
  };

  return (
    <section id="tests" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
        <div>
          <h2 className="text-4xl font-extrabold text-foreground mb-4">Diagnostic Lab Tests</h2>
          <p className="text-muted-foreground max-w-xl">
            Search and choose from specialized diagnostic tests. Certified phlebotomists will collect samples at your
            doorstep.
          </p>
        </div>

        <div className="relative w-full md:w-96">
          <Field>
            <Input
              type="text"
              placeholder="Search for blood tests, hormones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Field>
        </div>
      </div>

      <div className="flex overflow-x-auto pb-4 gap-2 mb-8 no-scrollbar">
        {categories.map((cat) => (
          <Button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            variant={activeCategory === cat ? "default" : "outline"}
          >
            {cat}
          </Button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTests.map((test) => (
          <Card key={test.id}>
            <CardHeader>
              <div className="flex justify-between items-start mb-1">
                <span className="bg-muted text-muted-foreground text-[10px] uppercase tracking-widest font-bold px-2 py-1 rounded">
                  {test.category}
                </span>
                <div className="flex items-center text-muted-foreground/60 text-xs font-medium">
                  <Clock className="w-3.5 h-3.5 mr-1" />
                  {test.turnaroundTime || "24-48h"}
                </div>
              </div>
              <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">
                {test.name}
              </CardTitle>
              <CardDescription className="line-clamp-2 h-10">{test.description}</CardDescription>
            </CardHeader>

            <CardContent className="mt-auto pt-4 border-t border-border/50">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  {test.price > 0 ? (
                    <>
                      <span className="text-2xl font-black text-foreground">৳{test.price}</span>
                      <span className="text-[10px] font-bold text-muted-foreground/60">Starting Price</span>
                    </>
                  ) : (
                    <span className="text-sm font-bold text-muted-foreground">Price varies by lab</span>
                  )}
                </div>
                <Button onClick={() => handleAdd(test)} size="icon-lg">
                  <Plus />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTests.length === 0 && (
        <div className="text-center py-20 bg-background rounded-3xl border-2 border-dashed border-border">
          <Info className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground font-medium">No tests found matching your criteria.</p>
        </div>
      )}
    </section>
  );
};

export default TestGrid;
