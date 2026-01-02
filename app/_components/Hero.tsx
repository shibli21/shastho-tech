import React from "react";
import NextImage from "next/image";
import { ShieldCheck, Clock, MapPin, ArrowRight, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";

const Hero: React.FC = () => {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Decorative Circles */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[100px] opacity-50 z-0"></div>
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[100px] opacity-50 z-0"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full font-medium text-sm animate-bounce">
              <ShieldCheck className="w-4 h-4" />
              <span>Accredited Labs & Expert Phlebotomists</span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-extrabold text-foreground leading-[1.1]">
              Quality Diagnostic <br />
              <span className="text-primary">Tests at Home</span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
              Skip the queues. Get professional blood sample collection from your home or office. Accurate reports
              delivered digitally within 24 hours.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg">
                <span>Book a Test Now</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline">
                View Health Packages
              </Button>
            </div>

            <div className="flex items-center space-x-8 pt-4">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-primary" />
                <span className="text-sm font-semibold text-foreground">60 Min Collection</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-primary" />
                <span className="text-sm font-semibold text-foreground">All Over Dhaka</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500">
              <NextImage
                src="/doctor.png"
                alt="Medical Professional"
                width={1470}
                height={1837}
                className="w-full aspect-4/5 object-cover"
              />
            </div>
            {/* Float Cards */}
            <div className="absolute -bottom-6 -left-6 z-20 bg-background p-4 rounded-2xl shadow-xl border border-primary/10 animate-pulse">
              <div className="flex items-center space-x-3">
                <div className="bg-emerald-500/10 p-2 rounded-lg">
                  <Activity className="text-emerald-500" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Daily Tests</p>
                  <p className="text-xl font-bold text-foreground">1,200+</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
