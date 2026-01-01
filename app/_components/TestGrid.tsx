
import React, { useState } from 'react';
import { Search, Plus, Clock, Info } from 'lucide-react';
import { LAB_TESTS } from '@/constants/constants';
import { LabTest } from '@/types/types';

interface TestGridProps {
  onAddToCart: (test: LabTest) => void;
}

const TestGrid: React.FC<TestGridProps> = ({ onAddToCart }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', ...Array.from(new Set(LAB_TESTS.map(t => t.category)))];

  const filteredTests = LAB_TESTS.filter(test => {
    const matchesSearch = test.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'All' || test.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <section id="tests" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
        <div>
          <h2 className="text-4xl font-extrabold text-slate-900 mb-4">Diagnostic Lab Tests</h2>
          <p className="text-slate-600 max-w-xl">Search and choose from over 500+ specialized diagnostic tests. Certified phlebotomists will collect samples at your doorstep.</p>
        </div>

        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search for blood tests, hormones..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all shadow-sm"
          />
        </div>
      </div>

      <div className="flex overflow-x-auto pb-4 gap-2 mb-8 no-scrollbar">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`whitespace-nowrap px-6 py-2.5 rounded-full font-semibold transition-all ${
              activeCategory === cat 
              ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/20' 
              : 'bg-white text-slate-600 border border-slate-200 hover:border-teal-500 hover:text-teal-600'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTests.map(test => (
          <div key={test.id} className="group bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
              <span className="bg-slate-100 text-slate-600 text-[10px] uppercase tracking-widest font-bold px-2 py-1 rounded">
                {test.category}
              </span>
              <div className="flex items-center text-slate-400 text-xs font-medium">
                <Clock className="w-3.5 h-3.5 mr-1" />
                {test.turnaroundTime}
              </div>
            </div>
            
            <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-teal-600 transition-colors">
              {test.name}
            </h3>
            <p className="text-slate-500 text-sm mb-6 line-clamp-2 h-10">
              {test.description}
            </p>

            <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
              <div className="flex flex-col">
                <span className="text-2xl font-black text-slate-900">৳{test.price}</span>
                <span className="text-[10px] font-bold text-slate-400">Taxes Included</span>
              </div>
              <button 
                onClick={() => onAddToCart(test)}
                className="bg-slate-900 text-white p-3 rounded-xl hover:bg-teal-600 transition-colors shadow-lg active:scale-95"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredTests.length === 0 && (
        <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
          <Info className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 font-medium">No tests found matching your criteria.</p>
        </div>
      )}
    </section>
  );
};

export default TestGrid;
