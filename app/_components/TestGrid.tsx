import React, { useState } from "react";
import { Plus, Clock, Info } from "lucide-react";
import { LAB_TESTS } from "@/constants/constants";
import { LabTest } from "@/types/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/field";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

interface TestGridProps {
  onAddToCart: (test: LabTest) => void;
}

const TestGrid: React.FC<TestGridProps> = ({ onAddToCart }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", ...Array.from(new Set(LAB_TESTS.map((t) => t.category)))];

  const filteredTests = LAB_TESTS.filter((test) => {
    const matchesSearch = test.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "All" || test.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <section id="tests" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
        <div>
          <h2 className="text-4xl font-extrabold text-foreground mb-4">Diagnostic Lab Tests</h2>
          <p className="text-muted-foreground max-w-xl">
            Search and choose from over 500+ specialized diagnostic tests. Certified phlebotomists will collect samples
            at your doorstep.
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
                  {test.turnaroundTime}
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
                  <span className="text-2xl font-black text-foreground">৳{test.price}</span>
                  <span className="text-[10px] font-bold text-muted-foreground/60">Taxes Included</span>
                </div>
                <Button onClick={() => onAddToCart(test)} size="icon-lg">
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
