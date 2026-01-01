
import React from 'react';
// Added Activity to the imports
import { ShieldCheck, Clock, MapPin, ArrowRight, Activity } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Decorative Circles */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-teal-100 rounded-full blur-[100px] opacity-50 z-0"></div>
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-sky-100 rounded-full blur-[100px] opacity-50 z-0"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center space-x-2 bg-teal-50 text-teal-700 px-4 py-2 rounded-full font-medium text-sm animate-bounce">
              <ShieldCheck className="w-4 h-4" />
              <span>Accredited Labs & Expert Phlebotomists</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 leading-[1.1]">
              Quality Diagnostic <br />
              <span className="text-gradient">Tests at Home</span>
            </h1>
            
            <p className="text-lg text-slate-600 max-w-lg leading-relaxed">
              Skip the queues. Get professional blood sample collection from your home or office. Accurate reports delivered digitally within 24 hours.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-teal-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-teal-700 transition-all shadow-xl shadow-teal-600/30 flex items-center justify-center space-x-2 group">
                <span>Book a Test Now</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="bg-white text-slate-900 border-2 border-slate-200 px-8 py-4 rounded-2xl font-bold text-lg hover:border-teal-600 hover:text-teal-600 transition-all flex items-center justify-center">
                View Health Packages
              </button>
            </div>

            <div className="flex items-center space-x-8 pt-4">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-teal-600" />
                <span className="text-sm font-semibold text-slate-700">60 Min Collection</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-teal-600" />
                <span className="text-sm font-semibold text-slate-700">All Over Dhaka</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500">
              <img 
                src="https://images.unsplash.com/photo-1579152276532-535c21af3bb5?q=80&w=1470&auto=format&fit=crop" 
                alt="Medical Professional" 
                className="w-full aspect-[4/5] object-cover"
              />
            </div>
            {/* Float Cards */}
            <div className="absolute -bottom-6 -left-6 z-20 bg-white p-4 rounded-2xl shadow-xl border border-teal-50 animate-pulse">
              <div className="flex items-center space-x-3">
                <div className="bg-emerald-100 p-2 rounded-lg">
                  <Activity className="text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Daily Tests</p>
                  <p className="text-xl font-bold text-slate-900">1,200+</p>
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