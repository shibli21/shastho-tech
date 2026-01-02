import React, { useState } from "react";
import { X, User, MapPin, CreditCard, ChevronRight, ChevronLeft, CheckCircle2, Clock } from "lucide-react";
import { LabTest, Booking } from "@/types/types";

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

  if (!isOpen) return null;

  const total = cart.reduce((acc, curr) => acc + curr.price, 0);

  const handleNext = () => setStep((s) => s + 1);
  const handleBack = () => setStep((s) => s - 1);

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
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-foreground/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-background w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-8 py-6 border-b border-border flex items-center justify-between bg-muted">
          <div>
            <h2 className="text-2xl font-black text-foreground">Complete Your Booking</h2>
            <p className="text-muted-foreground text-sm font-medium">Step {step} of 3</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-background rounded-xl transition-colors">
            <X className="w-6 h-6 text-muted-foreground/40" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 max-h-[70vh] overflow-y-auto">
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <div className="flex items-center space-x-3 text-primary mb-2">
                <User className="w-5 h-5" />
                <h3 className="font-bold text-lg">Patient Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Full Name</label>
                  <input
                    type="text"
                    value={formData.patientName}
                    onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                    placeholder="Enter patient name"
                    className="w-full p-4 rounded-2xl bg-muted border-none focus:ring-2 focus:ring-primary transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Age</label>
                  <input
                    type="number"
                    value={formData.patientAge}
                    onChange={(e) => setFormData({ ...formData, patientAge: e.target.value })}
                    placeholder="Age"
                    className="w-full p-4 rounded-2xl bg-muted border-none focus:ring-2 focus:ring-primary transition-all"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Gender</label>
                  <div className="flex space-x-4">
                    {["Male", "Female", "Other"].map((g) => (
                      <button
                        key={g}
                        onClick={() => setFormData({ ...formData, patientGender: g })}
                        className={`flex-1 py-3 rounded-xl font-bold transition-all ${
                          formData.patientGender === g
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <div className="flex items-center space-x-3 text-primary mb-2">
                <MapPin className="w-5 h-5" />
                <h3 className="font-bold text-lg">Logistics & Schedule</h3>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Collection Address</label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="House no, Road, Area, Landmark"
                    className="w-full p-4 rounded-2xl bg-muted border-none focus:ring-2 focus:ring-primary transition-all h-24"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase">Preferred Date</label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full p-4 rounded-2xl bg-muted border-none focus:ring-2 focus:ring-primary transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase">Time Slot</label>
                    <div className="relative">
                      <select
                        value={formData.slot}
                        onChange={(e) => setFormData({ ...formData, slot: e.target.value })}
                        className="w-full p-4 rounded-2xl bg-muted border-none focus:ring-2 focus:ring-primary transition-all appearance-none"
                      >
                        <option value="">Select a slot</option>
                        {slots.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                      <Clock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <div className="flex items-center space-x-3 text-primary mb-2">
                <CreditCard className="w-5 h-5" />
                <h3 className="font-bold text-lg">Review & Pay</h3>
              </div>
              <div className="bg-muted p-6 rounded-3xl space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-bold text-muted-foreground/60 uppercase tracking-widest">
                      Patient Details
                    </p>
                    <p className="font-bold text-foreground">
                      {formData.patientName} ({formData.patientAge}Y, {formData.patientGender})
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-muted-foreground/60 uppercase tracking-widest">Schedule</p>
                    <p className="font-bold text-foreground">
                      {formData.date} | {formData.slot}
                    </p>
                  </div>
                </div>
                <div className="border-t border-border pt-4">
                  <p className="text-xs font-bold text-muted-foreground/60 uppercase tracking-widest mb-2">
                    Selected Tests ({cart.length})
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {cart.map((t) => (
                      <span
                        key={t.id}
                        className="bg-background px-3 py-1 rounded-full text-xs font-bold text-muted-foreground border border-border"
                      >
                        {t.name}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="border-t border-border pt-4 flex justify-between items-center">
                  <span className="text-lg font-black text-foreground">Total Payable</span>
                  <span className="text-2xl font-black text-primary">৳{total}</span>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-primary/10 rounded-2xl text-primary">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <p className="text-xs font-bold">
                  Payment will be collected securely at your doorstep or via Digital Wallet after collection.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-8 bg-muted border-t border-border flex justify-between items-center">
          {step > 1 ? (
            <button
              onClick={handleBack}
              className="flex items-center space-x-2 text-muted-foreground/60 font-bold hover:text-foreground transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          <button
            onClick={step === 3 ? handleSubmit : handleNext}
            className="bg-primary text-primary-foreground px-8 py-4 rounded-2xl font-bold flex items-center space-x-2 hover:bg-primary/90 transition-all shadow-xl shadow-primary/20"
          >
            <span>{step === 3 ? "Confirm Booking" : "Continue"}</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
