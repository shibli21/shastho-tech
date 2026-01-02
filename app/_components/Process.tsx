import React from "react";
import { ClipboardList, Droplets, FileSearch, ArrowRight } from "lucide-react";

const steps = [
  {
    icon: <ClipboardList className="w-8 h-8 text-primary" />,
    title: "Book Your Test",
    description:
      "Choose from 500+ tests or use our AI assistant to find what you need. Schedule a time that suits you.",
  },
  {
    icon: <Droplets className="w-8 h-8 text-accent" />,
    title: "Sample Collection",
    description: "Our certified phlebotomist arrives at your doorstep with a sterile kit to collect your samples.",
  },
  {
    icon: <FileSearch className="w-8 h-8 text-primary" />,
    title: "Digital Reports",
    description:
      "Samples are processed in accredited labs. Get your accurate reports via Email or WhatsApp within 24 hours.",
  },
];

const Process: React.FC = () => {
  return (
    <section id="how-it-works" className="py-24 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-extrabold text-foreground mb-4">How It Works</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Experience premium healthcare from the comfort of your home in just three simple steps.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12 relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-1/2 -translate-y-1/2 left-1/4 right-1/4 h-0.5 border-t-2 border-dashed border-border z-0"></div>

          {steps.map((step, idx) => (
            <div key={idx} className="relative z-10 flex flex-col items-center text-center group">
              <div className="bg-background p-8 rounded-[2.5rem] shadow-xl border border-border mb-8 transform transition-transform duration-500 group-hover:-translate-y-2 group-hover:shadow-2xl">
                <div className="bg-muted p-6 rounded-3xl mb-2">{step.icon}</div>
                <div className="absolute -top-4 -right-4 bg-primary text-primary-foreground w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-lg border-4 border-background">
                  {idx + 1}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">{step.title}</h3>
              <p className="text-muted-foreground leading-relaxed max-w-xs">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <div className="inline-flex items-center space-x-4 bg-primary/10 px-6 py-3 rounded-full text-primary font-bold text-sm">
            <span>Trusted by 100+ Partner Laboratories</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Process;
