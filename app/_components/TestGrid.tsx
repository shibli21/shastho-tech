import React, { useState } from "react";
import { Search, Plus, Clock, Info } from "lucide-react";
import { LAB_TESTS } from "@/constants/constants";
import { LabTest } from "@/types/types";

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
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/60 w-5 h-5" />
          <input
            type="text"
            placeholder="Search for blood tests, hormones..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-background border border-border rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all shadow-sm"
          />
        </div>
      </div>

      <div className="flex overflow-x-auto pb-4 gap-2 mb-8 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`whitespace-nowrap px-6 py-2.5 rounded-full font-semibold transition-all ${
              activeCategory === cat
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                : "bg-background text-muted-foreground border border-border hover:border-primary hover:text-primary"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTests.map((test) => (
          <div
            key={test.id}
            className="group bg-background rounded-3xl p-6 border border-border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className="flex justify-between items-start mb-4">
              <span className="bg-muted text-muted-foreground text-[10px] uppercase tracking-widest font-bold px-2 py-1 rounded">
                {test.category}
              </span>
              <div className="flex items-center text-muted-foreground/60 text-xs font-medium">
                <Clock className="w-3.5 h-3.5 mr-1" />
                {test.turnaroundTime}
              </div>
            </div>

            <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
              {test.name}
            </h3>
            <p className="text-muted-foreground text-sm mb-6 line-clamp-2 h-10">{test.description}</p>

            <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
              <div className="flex flex-col">
                <span className="text-2xl font-black text-foreground">৳{test.price}</span>
                <span className="text-[10px] font-bold text-muted-foreground/60">Taxes Included</span>
              </div>
              <button
                onClick={() => onAddToCart(test)}
                className="bg-foreground text-background p-3 rounded-xl hover:bg-primary hover:text-primary-foreground transition-colors shadow-lg active:scale-95"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>
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
