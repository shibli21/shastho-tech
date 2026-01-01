"use client";

import React, { useState, useCallback, useEffect } from "react";
import Navbar from "./_components/Navbar";
import Hero from "./_components/Hero";
import TestGrid from "./_components/TestGrid";
import PackageGrid from "./_components/PackageGrid";
import Process from "./_components/Process";
import Testimonials from "./_components/Testimonials";
import BookingModal from "./_components/BookingModal";
import Dashboard from "./_components/Dashboard";
import { LabTest, Booking, User, BookingStatus } from "@/types/types";
import { LAB_TESTS } from "@/constants/constants";
import {
  ShoppingBag,
  ChevronRight,
  X,
  Phone,
  Mail,
  Instagram,
  Facebook,
  Twitter,
  Globe,
  ArrowUp,
  Activity,
} from "lucide-react";

export default function Page() {
  const [activeView, setActiveView] = useState<"home" | "dashboard" | "admin">("home");
  const [cart, setCart] = useState<LabTest[]>([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Mock initial bookings for the Dashboard demo
  useEffect(() => {
    setCurrentUser({ id: "u1", name: "John Doe", email: "john@example.com", phone: "01712345678" });
  }, []);

  const addToCart = useCallback((test: LabTest) => {
    setCart((prev) => {
      if (prev.find((t) => t.id === test.id)) return prev;
      return [...prev, test];
    });
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setCart((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addTestByName = useCallback(
    (name: string) => {
      const lowerName = name.toLowerCase();
      const found = LAB_TESTS.find(
        (t) => t.name.toLowerCase().includes(lowerName) || lowerName.includes(t.name.toLowerCase())
      );
      if (found) {
        addToCart(found);
      }
    },
    [addToCart]
  );

  const handleCreateBooking = (bookingData: any) => {
    const newBooking: Booking = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      userId: currentUser?.id || "guest",
      ...bookingData,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    setBookings((prev) => [newBooking, ...prev]);
    setCart([]);
    setIsBookingModalOpen(false);
    setIsCheckoutOpen(false);
    setActiveView("dashboard");
  };

  const updateBookingStatus = (id: string, status: BookingStatus) => {
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
  };

  const total = cart.reduce((acc, curr) => acc + curr.price, 0);

  const renderContent = () => {
    if (activeView === "home") {
      return (
        <>
          <Hero />
          <div className="max-w-7xl mx-auto px-4 -mt-10 relative z-20">
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-50 grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <p className="text-3xl font-black text-slate-900">50k+</p>
                <p className="text-sm font-medium text-slate-500">Happy Patients</p>
              </div>
              <div className="text-center border-l border-slate-100">
                <p className="text-3xl font-black text-slate-900">200+</p>
                <p className="text-sm font-medium text-slate-500">Certified Labs</p>
              </div>
              <div className="text-center border-l border-slate-100">
                <p className="text-3xl font-black text-slate-900">100%</p>
                <p className="text-sm font-medium text-slate-500">Accuracy Rate</p>
              </div>
              <div className="text-center border-l border-slate-100">
                <p className="text-3xl font-black text-slate-900">24h</p>
                <p className="text-sm font-medium text-slate-500">Fast Reporting</p>
              </div>
            </div>
          </div>
          <Process />
          <TestGrid onAddToCart={addToCart} />
          <PackageGrid />
          <Testimonials />
        </>
      );
    }

    if (activeView === "dashboard") {
      return <Dashboard bookings={bookings} />;
    }

    if (activeView === "admin") {
      return <Dashboard bookings={bookings} isAdmin onUpdateStatus={updateBookingStatus} />;
    }
  };

  return (
    <div className="min-h-screen bg-white selection:bg-teal-100 selection:text-teal-900">
      <nav
        className={`fixed top-0 left-0 right-0 z-[80] transition-all duration-300 glass-effect border-b border-slate-100 py-4`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setActiveView("home")}>
              <div className="bg-teal-600 p-2 rounded-xl">
                <Activity className="text-white w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900">
                AmarLab<span className="text-teal-600">Next</span>
              </span>
            </div>

            <div className="hidden md:flex items-center space-x-6">
              <button
                onClick={() => setActiveView("home")}
                className={`text-sm font-bold ${
                  activeView === "home" ? "text-teal-600" : "text-slate-500 hover:text-teal-600"
                } transition-colors`}
              >
                Search Tests
              </button>
              <button
                onClick={() => setActiveView("dashboard")}
                className={`text-sm font-bold ${
                  activeView === "dashboard" ? "text-teal-600" : "text-slate-500 hover:text-teal-600"
                } transition-colors`}
              >
                My Bookings
              </button>
              <button
                onClick={() => setActiveView("admin")}
                className={`text-sm font-bold ${
                  activeView === "admin" ? "text-teal-600" : "text-slate-500 hover:text-teal-600"
                } transition-colors underline decoration-teal-600 decoration-2 underline-offset-4`}
              >
                Lab Partner Portal
              </button>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsCheckoutOpen(true)}
                className="p-2 text-slate-600 hover:text-teal-600 relative"
              >
                <ShoppingBag className="w-6 h-6" />
                {cart.length > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ring-2 ring-white">
                    {cart.length}
                  </span>
                )}
              </button>
              <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-500 text-xs">
                JD
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main>
        {renderContent()}

        {/* Floating Cart Button (Mobile) */}
        {cart.length > 0 && !isCheckoutOpen && (
          <button
            onClick={() => setIsCheckoutOpen(true)}
            className="fixed bottom-8 right-8 z-40 bg-teal-600 text-white p-5 rounded-full shadow-2xl animate-bounce flex items-center space-x-3 md:hidden"
          >
            <ShoppingBag className="w-6 h-6" />
            <span className="font-bold">{cart.length} Tests</span>
          </button>
        )}

        {/* Checkout Sidebar Overlay */}
        {isCheckoutOpen && (
          <div className="fixed inset-0 z-[90] overflow-hidden">
            <div
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
              onClick={() => setIsCheckoutOpen(false)}
            />
            <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
              <div className="p-6 border-b flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-teal-50 p-2 rounded-xl">
                    <ShoppingBag className="text-teal-600 w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-bold">Your Selection</h3>
                </div>
                <button
                  onClick={() => setIsCheckoutOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-grow overflow-y-auto p-6 space-y-6">
                {cart.length === 0 ? (
                  <div className="text-center py-20">
                    <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                      <ShoppingBag className="w-12 h-12 text-slate-300" />
                    </div>
                    <p className="text-slate-500 font-medium">Your cart is empty.</p>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start justify-between group bg-slate-50 p-4 rounded-2xl border border-transparent hover:border-teal-100 transition-all"
                    >
                      <div>
                        <h4 className="font-bold text-slate-900 group-hover:text-teal-600 transition-colors">
                          {item.name}
                        </h4>
                        <p className="text-xs text-slate-500 font-medium mt-1">{item.category}</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="font-bold text-teal-600">৳{item.price}</span>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-slate-300 hover:text-red-500 transition-colors p-1"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-8 border-t bg-white space-y-4 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
                  <div className="flex justify-between items-center text-sm font-medium text-slate-600">
                    <span>Subtotal</span>
                    <span>৳{total}</span>
                  </div>
                  <div className="flex justify-between items-center text-2xl font-black text-slate-900 pt-4 border-t border-slate-100">
                    <span>Total</span>
                    <span className="text-teal-600">৳{total}</span>
                  </div>
                  <button
                    onClick={() => setIsBookingModalOpen(true)}
                    className="w-full bg-teal-600 text-white py-5 rounded-2xl font-bold text-lg hover:bg-teal-700 transition-all shadow-xl shadow-teal-600/30 flex items-center justify-center space-x-2 group mt-6"
                  >
                    <span>Proceed to Schedule</span>
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        <BookingModal
          isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
          cart={cart}
          onConfirm={handleCreateBooking}
        />
      </main>

      {/* Footer (Condensed for App views) */}
      <footer className="bg-slate-50 pt-20 pb-10 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div className="space-y-6">
              <div className="flex items-center space-x-2">
                <div className="bg-teal-600 p-2 rounded-xl">
                  <Activity className="text-white w-6 h-6" />
                </div>
                <span className="text-2xl font-extrabold tracking-tight text-slate-900">
                  AmarLab<span className="text-teal-600">Next</span>
                </span>
              </div>
              <p className="text-slate-500 leading-relaxed text-sm">
                Revolutionizing diagnostics in Bangladesh with home sample collection, AI-powered health monitoring, and
                trusted lab partnerships.
              </p>
            </div>
            <div>
              <h4 className="text-slate-900 font-bold mb-6">Popular Tests</h4>
              <ul className="space-y-4 text-sm text-slate-500 font-medium">
                <li>Complete Blood Count</li>
                <li>Thyroid Profile</li>
                <li>Diabetes Screening</li>
              </ul>
            </div>
            <div>
              <h4 className="text-slate-900 font-bold mb-6">Support</h4>
              <ul className="space-y-4 text-sm text-slate-500 font-medium">
                <li>Help Center</li>
                <li>Sample Guidelines</li>
                <li>Lab Locations</li>
              </ul>
            </div>
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <h4 className="text-slate-900 font-extrabold mb-8 text-sm uppercase tracking-widest">Contact Us</h4>
              <div className="space-y-6">
                <a href="tel:+8809643247247" className="flex items-center space-x-4 text-slate-600 group">
                  <div className="bg-teal-50 p-3 rounded-2xl group-hover:bg-teal-100 transition-colors">
                    <Phone className="w-5 h-5 text-teal-600" />
                  </div>
                  <span className="text-sm font-black">+880 9643 247247</span>
                </a>
              </div>
            </div>
          </div>
          <div className="pt-10 border-t border-slate-200 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
            © 2024 AmarLab Next. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
