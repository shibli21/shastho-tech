import React, { useState } from "react";
import { User, MapPin, CreditCard, ChevronRight, ChevronLeft, CheckCircle2 } from "lucide-react";
import { LabTest, Booking } from "@/types/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: LabTest[];
  onConfirm: (bookingData: Omit<Booking, "id" | "userId" | "status" | "createdAt">) => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, cart, onConfirm }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    patientName: "",
    patientAge: "",
    patientGender: "Male",
    address: "",
    date: "",
    slot: "",
  });

  const total = cart.reduce((acc, curr) => acc + curr.price, 0);

  const handleNext = () => setStep((s: number) => s + 1);
  const handleBack = () => setStep((s: number) => s - 1);

  const handleSubmit = () => {
    onConfirm({
      ...formData,
      tests: cart,
      total,
    });
  };

  const slots = [
    "07:00 AM - 08:00 AM",
    "08:00 AM - 09:00 AM",
    "09:00 AM - 10:00 AM",
    "10:00 AM - 11:00 AM",
    "04:00 PM - 05:00 PM",
  ];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Complete Your Booking</DialogTitle>
          <DialogDescription>Step {step} of 3</DialogDescription>
        </DialogHeader>

        {/* Content */}
        <div className="space-y-6">
          {step === 1 && (
            <div className="space-y-6">
              <div className="flex items-center space-x-3 text-primary">
                <User className="w-5 h-5" />
                <h3 className="font-bold">Patient Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="patientName">Full Name</Label>
                  <Input
                    id="patientName"
                    value={formData.patientName}
                    onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                    placeholder="Enter patient name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="patientAge">Age</Label>
                  <Input
                    id="patientAge"
                    type="number"
                    value={formData.patientAge}
                    onChange={(e) => setFormData({ ...formData, patientAge: e.target.value })}
                    placeholder="Age"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Gender</Label>
                  <div className="flex gap-2">
                    {["Male", "Female", "Other"].map((g) => (
                      <Button
                        key={g}
                        type="button"
                        variant={formData.patientGender === g ? "default" : "secondary"}
                        className="flex-1"
                        onClick={() => setFormData({ ...formData, patientGender: g })}
                      >
                        {g}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="flex items-center space-x-3 text-primary">
                <MapPin className="w-5 h-5" />
                <h3 className="font-bold">Logistics & Schedule</h3>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Collection Address</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="House no, Road, Area, Landmark"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Preferred Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slot">Time Slot</Label>
                    <Select value={formData.slot} onValueChange={(value) => setFormData({ ...formData, slot: value })}>
                      <SelectTrigger id="slot">
                        <SelectValue placeholder="Select a slot" />
                      </SelectTrigger>
                      <SelectContent>
                        {slots.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="flex items-center space-x-3 text-primary">
                <CreditCard className="w-5 h-5" />
                <h3 className="font-bold">Review & Pay</h3>
              </div>

              <Card>
                <CardContent className="p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
                        Patient Details
                      </p>
                      <p className="font-bold">
                        {formData.patientName} ({formData.patientAge}Y, {formData.patientGender})
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Schedule</p>
                      <p className="font-bold">
                        {formData.date} | {formData.slot}
                      </p>
                    </div>
                  </div>
                  <div className="border-t pt-4">
                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-2">
                      Selected Tests ({cart.length})
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {cart.map((t) => (
                        <Badge key={t.id} variant="secondary">
                          {t.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="border-t pt-4 flex justify-between items-center">
                    <span className="text-lg font-bold">Total Payable</span>
                    <span className="text-2xl font-bold text-primary">৳{total}</span>
                  </div>
                </CardContent>
              </Card>

              <div className="flex items-center space-x-3 p-4 border text-primary">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <p className="text-sm">
                  Payment will be collected securely at your doorstep or via Digital Wallet after collection.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <DialogFooter className="sm:justify-between">
          {step > 1 ? (
            <Button variant="ghost" onClick={handleBack} className="flex items-center gap-2">
              <ChevronLeft className="w-4 h-4" />
              Back
            </Button>
          ) : (
            <div />
          )}

          <Button onClick={step === 3 ? handleSubmit : handleNext} className="gap-2">
            {step === 3 ? "Confirm Booking" : "Continue"}
            <ChevronRight className="w-4 h-4" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;
