
import React from 'react';
import { ClipboardList, Droplets, FileSearch, ArrowRight } from 'lucide-react';

const steps = [
  {
    icon: <ClipboardList className="w-8 h-8 text-teal-600" />,
    title: "Book Your Test",
    description: "Choose from 500+ tests or use our AI assistant to find what you need. Schedule a time that suits you."
  },
  {
    icon: <Droplets className="w-8 h-8 text-sky-600" />,
    title: "Sample Collection",
    description: "Our certified phlebotomist arrives at your doorstep with a sterile kit to collect your samples."
  },
  {
    icon: <FileSearch className="w-8 h-8 text-emerald-600" />,
    title: "Digital Reports",
    description: "Samples are processed in accredited labs. Get your accurate reports via Email or WhatsApp within 24 hours."
  }
];

const Process: React.FC = () => {
  return (
    <section id="how-it-works" className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-extrabold text-slate-900 mb-4">How It Works</h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg">Experience premium healthcare from the comfort of your home in just three simple steps.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-12 relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-1/4 left-1/4 right-1/4 h-0.5 border-t-2 border-dashed border-slate-200 -z-0"></div>

          {steps.map((step, idx) => (
            <div key={idx} className="relative z-10 flex flex-col items-center text-center group">
              <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-50 mb-8 transform transition-transform duration-500 group-hover:-translate-y-2 group-hover:shadow-2xl">
                <div className="bg-slate-50 p-6 rounded-3xl mb-2">
                  {step.icon}
                </div>
                <div className="absolute -top-4 -right-4 bg-teal-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-lg border-4 border-white">
                  {idx + 1}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">{step.title}</h3>
              <p className="text-slate-500 leading-relaxed max-w-xs">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <div className="inline-flex items-center space-x-4 bg-teal-50 px-6 py-3 rounded-full text-teal-700 font-bold text-sm">
            <span>Trusted by 100+ Partner Laboratories</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Process;
