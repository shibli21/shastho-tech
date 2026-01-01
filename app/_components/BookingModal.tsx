
import React, { useState } from 'react';
import { X, User, MapPin, Calendar, CreditCard, ChevronRight, ChevronLeft, CheckCircle2, Clock } from 'lucide-react';
import { LabTest, Booking } from '@/types/types';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: LabTest[];
  onConfirm: (bookingData: Omit<Booking, 'id' | 'userId' | 'status' | 'createdAt'>) => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, cart, onConfirm }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    patientName: '',
    patientAge: '',
    patientGender: 'Male',
    address: '',
    date: '',
    slot: ''
  });

  if (!isOpen) return null;

  const total = cart.reduce((acc, curr) => acc + curr.price, 0);

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);

  const handleSubmit = () => {
    onConfirm({
      ...formData,
      tests: cart,
      total
    });
  };

  const slots = ['07:00 AM - 08:00 AM', '08:00 AM - 09:00 AM', '09:00 AM - 10:00 AM', '10:00 AM - 11:00 AM', '04:00 PM - 05:00 PM'];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-8 py-6 border-b flex items-center justify-between bg-slate-50">
          <div>
            <h2 className="text-2xl font-black text-slate-900">Complete Your Booking</h2>
            <p className="text-slate-500 text-sm font-medium">Step {step} of 3</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-xl transition-colors">
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 max-h-[70vh] overflow-y-auto">
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <div className="flex items-center space-x-3 text-teal-600 mb-2">
                <User className="w-5 h-5" />
                <h3 className="font-bold text-lg">Patient Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Full Name</label>
                  <input 
                    type="text" 
                    value={formData.patientName}
                    onChange={e => setFormData({...formData, patientName: e.target.value})}
                    placeholder="Enter patient name"
                    className="w-full p-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-teal-500 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Age</label>
                  <input 
                    type="number" 
                    value={formData.patientAge}
                    onChange={e => setFormData({...formData, patientAge: e.target.value})}
                    placeholder="Age"
                    className="w-full p-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-teal-500 transition-all"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Gender</label>
                  <div className="flex space-x-4">
                    {['Male', 'Female', 'Other'].map(g => (
                      <button 
                        key={g}
                        onClick={() => setFormData({...formData, patientGender: g})}
                        className={`flex-1 py-3 rounded-xl font-bold transition-all ${formData.patientGender === g ? 'bg-teal-600 text-white' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
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
              <div className="flex items-center space-x-3 text-teal-600 mb-2">
                <MapPin className="w-5 h-5" />
                <h3 className="font-bold text-lg">Logistics & Schedule</h3>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Collection Address</label>
                  <textarea 
                    value={formData.address}
                    onChange={e => setFormData({...formData, address: e.target.value})}
                    placeholder="House no, Road, Area, Landmark"
                    className="w-full p-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-teal-500 transition-all h-24"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Preferred Date</label>
                    <input 
                      type="date" 
                      value={formData.date}
                      onChange={e => setFormData({...formData, date: e.target.value})}
                      className="w-full p-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-teal-500 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Time Slot</label>
                    <select 
                      value={formData.slot}
                      onChange={e => setFormData({...formData, slot: e.target.value})}
                      className="w-full p-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-teal-500 transition-all appearance-none"
                    >
                      <option value="">Select a slot</option>
                      {slots.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <div className="flex items-center space-x-3 text-teal-600 mb-2">
                <CreditCard className="w-5 h-5" />
                <h3 className="font-bold text-lg">Review & Pay</h3>
              </div>
              <div className="bg-slate-50 p-6 rounded-3xl space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Patient Details</p>
                    <p className="font-bold text-slate-800">{formData.patientName} ({formData.patientAge}Y, {formData.patientGender})</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Schedule</p>
                    <p className="font-bold text-slate-800">{formData.date} | {formData.slot}</p>
                  </div>
                </div>
                <div className="border-t border-slate-200 pt-4">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Selected Tests ({cart.length})</p>
                  <div className="flex flex-wrap gap-2">
                    {cart.map(t => (
                      <span key={t.id} className="bg-white px-3 py-1 rounded-full text-xs font-bold text-slate-600 border border-slate-200">
                        {t.name}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="border-t border-slate-200 pt-4 flex justify-between items-center">
                  <span className="text-lg font-black text-slate-900">Total Payable</span>
                  <span className="text-2xl font-black text-teal-600">৳{total}</span>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-teal-50 rounded-2xl text-teal-700">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                <p className="text-xs font-bold">Payment will be collected securely at your doorstep or via Digital Wallet after collection.</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-8 bg-slate-50 border-t flex justify-between items-center">
          {step > 1 ? (
            <button onClick={handleBack} className="flex items-center space-x-2 text-slate-500 font-bold hover:text-slate-900 transition-colors">
              <ChevronLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
          ) : <div />}
          
          <button 
            onClick={step === 3 ? handleSubmit : handleNext}
            className="bg-teal-600 text-white px-8 py-4 rounded-2xl font-bold flex items-center space-x-2 hover:bg-teal-700 transition-all shadow-xl shadow-teal-600/20"
          >
            <span>{step === 3 ? 'Confirm Booking' : 'Continue'}</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
