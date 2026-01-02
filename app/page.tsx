"use client";

import React, { useState, useCallback } from "react";
import Hero from "./_components/Hero";
import TestGrid from "./_components/TestGrid";
import PackageGrid from "./_components/PackageGrid";
import Process from "./_components/Process";
import Testimonials from "./_components/Testimonials";
import BookingModal from "./_components/BookingModal";
import Dashboard from "./_components/Dashboard";
import { LabTest, Booking, User, BookingStatus } from "@/types/types";
import { ShoppingBag, ChevronRight, X, Phone, Activity } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function Page() {
  const [activeView, setActiveView] = useState<"home" | "dashboard" | "admin">("home");
  const [cart, setCart] = useState<LabTest[]>([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [currentUser] = useState<User | null>({
    id: "u1",
    name: "John Doe",
    email: "john@example.com",
    phone: "01712345678",
  });

  const addToCart = useCallback((test: LabTest) => {
    setCart((prev) => {
      if (prev.find((t) => t.id === test.id)) return prev;
      return [...prev, test];
    });
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setCart((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const handleCreateBooking = (bookingData: Omit<Booking, "id" | "userId" | "status" | "createdAt">) => {
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
            <Card className="rounded-3xl p-8 shadow-xl">
              <CardContent className="p-0 grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="text-center">
                  <p className="text-3xl font-black text-foreground">50k+</p>
                  <p className="text-sm font-medium text-muted-foreground">Happy Patients</p>
                </div>
                <div className="text-center md:border-l border-border">
                  <p className="text-3xl font-black text-foreground">200+</p>
                  <p className="text-sm font-medium text-muted-foreground">Certified Labs</p>
                </div>
                <div className="text-center border-l border-border md:border-l">
                  <p className="text-3xl font-black text-foreground">100%</p>
                  <p className="text-sm font-medium text-muted-foreground">Accuracy Rate</p>
                </div>
                <div className="text-center md:border-l border-border">
                  <p className="text-3xl font-black text-foreground">24h</p>
                  <p className="text-sm font-medium text-muted-foreground">Fast Reporting</p>
                </div>
              </CardContent>
            </Card>
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
    <div className="min-h-screen bg-background selection:bg-primary/20 selection:text-primary">
      <nav
        className={`fixed top-0 left-0 right-0 z-[80] transition-all duration-300 glass-effect border-b border-border py-4`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setActiveView("home")}>
              <div className="bg-primary p-2 rounded-xl">
                <Activity className="text-primary-foreground w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-foreground">
                Shastho<span className="text-primary">Tech</span>
              </span>
            </div>

            <div className="hidden md:flex items-center space-x-6">
              <button
                onClick={() => setActiveView("home")}
                className={`text-sm font-bold ${
                  activeView === "home" ? "text-primary" : "text-muted-foreground hover:text-primary"
                } transition-colors`}
              >
                Search Tests
              </button>
              <button
                onClick={() => setActiveView("dashboard")}
                className={`text-sm font-bold ${
                  activeView === "dashboard" ? "text-primary" : "text-muted-foreground hover:text-primary"
                } transition-colors`}
              >
                My Bookings
              </button>
              <button
                onClick={() => setActiveView("admin")}
                className={`text-sm font-bold ${
                  activeView === "admin" ? "text-primary" : "text-muted-foreground hover:text-primary"
                } transition-colors underline decoration-primary decoration-2 underline-offset-4`}
              >
                Lab Partner Portal
              </button>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsCheckoutOpen(true)}
                className="p-2 text-muted-foreground hover:text-primary relative"
              >
                <ShoppingBag className="w-6 h-6" />
                {cart.length > 0 && (
                  <span className="absolute top-0 right-0 bg-destructive text-destructive-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full ring-2 ring-background">
                    {cart.length}
                  </span>
                )}
              </button>
              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center font-bold text-muted-foreground text-xs">
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
            className="fixed bottom-8 right-8 z-40 bg-primary text-primary-foreground p-5 rounded-full shadow-2xl animate-bounce flex items-center space-x-3 md:hidden"
          >
            <ShoppingBag className="w-6 h-6" />
            <span className="font-bold">{cart.length} Tests</span>
          </button>
        )}

        {/* Checkout Sidebar */}
        <Sheet open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
          <SheetContent className="flex flex-col sm:max-w-md">
            <SheetHeader>
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5" />
                <SheetTitle>Your Selection</SheetTitle>
              </div>
              <SheetDescription className="hidden">
                Review the items in your cart before proceeding to checkout.
              </SheetDescription>
            </SheetHeader>

            <div className="grow overflow-y-auto space-y-4 py-4">
              {cart.length === 0 ? (
                <div className="text-center py-20">
                  <div className="bg-muted w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                    <ShoppingBag className="w-12 h-12 text-muted-foreground/40" />
                  </div>
                  <p className="text-muted-foreground font-medium">Your cart is empty.</p>
                </div>
              ) : (
                cart.map((item) => (
                  <Card key={item.id}>
                    <CardContent className="p-4 flex items-center justify-between">
                      <div>
                        <h4 className="font-bold">{item.name}</h4>
                        <p className="text-xs text-muted-foreground">{item.category}</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="font-bold text-primary">৳{item.price}</span>
                        <Button variant="ghost" size="icon-sm" onClick={() => removeFromCart(item.id)}>
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <SheetFooter className="flex flex-col gap-4 pt-4 border-t">
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm font-medium text-muted-foreground">
                    <span>Subtotal</span>
                    <span>৳{total}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold">Total</span>
                    <span className="text-2xl font-bold text-primary">৳{total}</span>
                  </div>
                </div>
                <Button onClick={() => setIsBookingModalOpen(true)} className="w-full gap-2">
                  <span>Proceed to Schedule</span>
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </SheetFooter>
            )}
          </SheetContent>
        </Sheet>

        <BookingModal
          isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
          cart={cart}
          onConfirm={handleCreateBooking}
        />
      </main>

      {/* Footer (Condensed for App views) */}
      <footer className="bg-muted pt-20 pb-10 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div className="space-y-6">
              <div className="flex items-center space-x-2">
                <div className="bg-primary p-2 rounded-xl">
                  <Activity className="text-primary-foreground w-6 h-6" />
                </div>
                <span className="text-2xl font-extrabold tracking-tight text-foreground">
                  Shastho<span className="text-primary">Tech</span>
                </span>
              </div>
              <p className="text-muted-foreground leading-relaxed text-sm">
                Revolutionizing diagnostics in Bangladesh with home sample collection, AI-powered health monitoring, and
                trusted lab partnerships.
              </p>
            </div>
            <div>
              <h4 className="text-foreground font-bold mb-6">Popular Tests</h4>
              <ul className="space-y-4 text-sm text-muted-foreground font-medium">
                <li>Complete Blood Count</li>
                <li>Thyroid Profile</li>
                <li>Diabetes Screening</li>
              </ul>
            </div>
            <div>
              <h4 className="text-foreground font-bold mb-6">Support</h4>
              <ul className="space-y-4 text-sm text-muted-foreground font-medium">
                <li>Help Center</li>
                <li>Sample Guidelines</li>
                <li>Lab Locations</li>
              </ul>
            </div>
            <div className="bg-background p-8 rounded-[2.5rem] border border-border shadow-sm">
              <h4 className="text-foreground font-extrabold mb-8 text-sm uppercase tracking-widest">Contact Us</h4>
              <div className="space-y-6">
                <a href="tel:+8809643247247" className="flex items-center space-x-4 text-muted-foreground group">
                  <div className="bg-primary/10 p-3 rounded-2xl group-hover:bg-primary/20 transition-colors">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-sm font-black">+880 9643 247247</span>
                </a>
              </div>
            </div>
          </div>
          <div className="pt-10 border-t border-border text-center text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest">
            © 2024 Shastho Tech. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
