
import React from 'react';
import { Check, ArrowRight, Zap } from 'lucide-react';
import { HEALTH_PACKAGES } from '@/constants/constants';

const PackageGrid: React.FC = () => {
  return (
    <section id="packages" className="py-24 gradient-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-slate-900 mb-4">Curated Health Packages</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">Comprehensive checkups designed for different health needs and age groups. Save up to 40% with bundled packages.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {HEALTH_PACKAGES.map(pkg => (
            <div 
              key={pkg.id} 
              className={`relative bg-white rounded-[2rem] p-8 shadow-sm transition-all duration-500 hover:shadow-2xl flex flex-col ${
                pkg.isPopular ? 'ring-4 ring-teal-500 ring-offset-0 scale-105 z-10' : 'border border-slate-100'
              }`}
            >
              {pkg.isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-teal-500 text-white text-xs font-black uppercase tracking-widest px-6 py-2 rounded-full shadow-lg flex items-center">
                  <Zap className="w-3 h-3 mr-2 fill-current" />
                  Most Popular
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-2xl font-extrabold text-slate-900 mb-2">{pkg.name}</h3>
                <p className="text-slate-500 text-sm font-medium">{pkg.recommendedFor}</p>
              </div>

              <div className="mb-8 flex items-baseline space-x-2">
                <span className="text-4xl font-black text-slate-900">৳{pkg.discountPrice || pkg.price}</span>
                {pkg.discountPrice && (
                  <span className="text-lg text-slate-400 line-through font-bold">৳{pkg.price}</span>
                )}
              </div>

              <div className="space-y-4 mb-10 flex-grow">
                <p className="text-sm font-bold text-slate-900 flex items-center">
                  <Check className="w-5 h-5 text-teal-600 mr-2" />
                  {pkg.testsCount} Essential Tests Included:
                </p>
                <div className="space-y-3">
                  {pkg.testList.map((test, idx) => (
                    <div key={idx} className="flex items-center text-sm text-slate-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-teal-200 mr-3"></div>
                      {test}
                    </div>
                  ))}
                  <button className="text-teal-600 text-xs font-bold hover:underline">View All {pkg.testsCount} Tests</button>
                </div>
              </div>

              <button className={`w-full py-5 rounded-2xl font-bold transition-all flex items-center justify-center group ${
                pkg.isPopular 
                ? 'bg-teal-600 text-white shadow-xl shadow-teal-600/30 hover:bg-teal-700' 
                : 'bg-slate-50 text-slate-900 hover:bg-teal-600 hover:text-white'
              }`}>
                <span>Select Package</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PackageGrid;
