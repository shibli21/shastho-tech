"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Hero from "@/app/_components/Hero";
import TestGrid, { PublicTest } from "@/app/_components/TestGrid";
import PackageGrid, { PublicPackage } from "@/app/_components/PackageGrid";
import Process from "@/app/_components/Process";
import Testimonials from "@/app/_components/Testimonials";
import BookingModal from "@/app/_components/BookingModal";
import Dashboard from "@/app/_components/Dashboard";
import { LabTest, Booking, BookingStatus } from "@/types/types";
import { ShoppingBag, ChevronRight, X } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { authClient } from "@/lib/auth-client";
import { useCart } from "@/hooks/use-cart-provider";

interface LandingPageProps {
  initialTests: PublicTest[];
  initialPackages: PublicPackage[];
}

export default function LandingPageClient({ initialTests, initialPackages }: LandingPageProps) {
  const router = useRouter();
  const [activeView, setActiveView] = useState<"home" | "dashboard" | "admin">("home");
  const { cart, addToCart, removeFromCart, clearCart, isCartOpen, setIsCartOpen, total } = useCart();
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);

  const { data: session } = authClient.useSession();
  const currentUser = session?.user;

  const handleProceedToSchedule = () => {
    if (!currentUser) {
      router.push("/sign-in?callbackUrl=/");
      return;
    }
    setIsBookingModalOpen(true);
  };

  const handleCreateBooking = (bookingData: Omit<Booking, "id" | "userId" | "status" | "createdAt">) => {
    const newBooking: Booking = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      userId: currentUser?.id || "guest",
      ...bookingData,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    setBookings((prev) => [newBooking, ...prev]);
    clearCart();
    setIsBookingModalOpen(false);
    setIsCartOpen(false);
    setActiveView("dashboard");
  };

  const updateBookingStatus = (id: string, status: BookingStatus) => {
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
  };

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
          <TestGrid tests={initialTests} onAddToCart={addToCart} />
          <PackageGrid packages={initialPackages} />
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
      <main>
        {renderContent()}

        {cart.length > 0 && !isCartOpen && (
          <button
            onClick={() => setIsCartOpen(true)}
            className="fixed bottom-8 right-8 z-40 bg-primary text-primary-foreground p-5 rounded-full shadow-2xl animate-bounce flex items-center space-x-3 md:hidden"
          >
            <ShoppingBag className="w-6 h-6" />
            <span className="font-bold">{cart.length} Tests</span>
          </button>
        )}

        <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
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
                cart.map((item: LabTest) => (
                  <Card key={item.id}>
                    <CardContent className="p-4 flex items-center justify-between">
                      <div>
                        <h4 className="font-bold">{item.name}</h4>
                        <p className="text-xs text-muted-foreground">{item.category}</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="font-bold text-primary">৳{item.price}</span>
                        <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)}>
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
                <Button onClick={handleProceedToSchedule} className="w-full gap-2">
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
    </div>
  );
}
