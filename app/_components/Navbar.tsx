
import React, { useState, useEffect } from 'react';
import { Menu, X, Activity, User, ShoppingCart, Search } from 'lucide-react';

const Navbar: React.FC<{ cartCount: number }> = ({ cartCount }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'glass-effect shadow-md py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="bg-teal-600 p-2 rounded-xl">
              <Activity className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-slate-900">
              AmarLab<span className="text-teal-600">Next</span>
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#tests" className="text-slate-600 hover:text-teal-600 font-medium transition-colors">Lab Tests</a>
            <a href="#packages" className="text-slate-600 hover:text-teal-600 font-medium transition-colors">Packages</a>
            <a href="#how-it-works" className="text-slate-600 hover:text-teal-600 font-medium transition-colors">How it Works</a>
            <a href="#ai-assistant" className="text-slate-600 hover:text-teal-600 font-medium transition-colors">AI Health Assistant</a>
          </div>

          <div className="flex items-center space-x-4">
            <button className="p-2 text-slate-600 hover:text-teal-600 relative">
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ring-2 ring-white">
                  {cartCount}
                </span>
              )}
            </button>
            <button className="hidden md:flex items-center space-x-2 bg-teal-600 text-white px-5 py-2.5 rounded-full font-semibold hover:bg-teal-700 transition-all shadow-lg shadow-teal-600/20 active:scale-95">
              <User className="w-4 h-4" />
              <span>Login</span>
            </button>
            <button 
              className="md:hidden p-2 text-slate-600"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b animate-in fade-in slide-in-from-top-4">
          <div className="px-4 pt-2 pb-6 space-y-1">
            <a href="#tests" className="block px-3 py-4 text-base font-medium text-slate-700 border-b border-gray-50">Lab Tests</a>
            <a href="#packages" className="block px-3 py-4 text-base font-medium text-slate-700 border-b border-gray-50">Health Packages</a>
            <a href="#ai-assistant" className="block px-3 py-4 text-base font-medium text-slate-700 border-b border-gray-50">AI Health Assistant</a>
            <button className="w-full mt-4 bg-teal-600 text-white py-4 rounded-xl font-bold">Login / Sign Up</button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
