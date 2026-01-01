
import React from 'react';
// Added MapPin to the imports to resolve the "Cannot find name 'MapPin'" error.
import { Package, Clock, CheckCircle2, FileText, Download, User, ArrowRight, Activity, TrendingUp, MapPin } from 'lucide-react';
import { Booking, BookingStatus } from '@/types/types';

interface DashboardProps {
  bookings: Booking[];
  isAdmin?: boolean;
  onUpdateStatus?: (bookingId: string, status: BookingStatus) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ bookings, isAdmin, onUpdateStatus }) => {
  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case 'completed': return 'bg-emerald-100 text-emerald-700';
      case 'processing': return 'bg-sky-100 text-sky-700';
      case 'collected': return 'bg-purple-100 text-purple-700';
      case 'confirmed': return 'bg-blue-100 text-blue-700';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  const statusOrder: BookingStatus[] = ['pending', 'confirmed', 'collected', 'processing', 'completed'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 mb-2">
            {isAdmin ? 'Lab Partner Portal' : 'My Health Hub'}
          </h1>
          <p className="text-slate-500 font-medium">
            {isAdmin ? 'Manage incoming samples and reports.' : 'Track your tests and health progress.'}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex items-center space-x-4">
            <div className="bg-teal-50 p-3 rounded-2xl text-teal-600">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase">Active Tests</p>
              <p className="text-xl font-black text-slate-900">{bookings.filter(b => b.status !== 'completed').length}</p>
            </div>
          </div>
          {!isAdmin && (
             <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex items-center space-x-4">
             <div className="bg-sky-50 p-3 rounded-2xl text-sky-600">
               <TrendingUp className="w-6 h-6" />
             </div>
             <div>
               <p className="text-xs font-bold text-slate-400 uppercase">Health Score</p>
               <p className="text-xl font-black text-slate-900">82/100</p>
             </div>
           </div>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-xl font-bold text-slate-900 flex items-center">
            <Package className="w-5 h-5 mr-2 text-teal-600" />
            {isAdmin ? 'Recent Orders' : 'My Test History'}
          </h3>

          {bookings.length === 0 ? (
            <div className="bg-white p-12 rounded-[2.5rem] border border-dashed border-slate-200 text-center">
              <Package className="w-12 h-12 text-slate-200 mx-auto mb-4" />
              <p className="text-slate-500 font-bold">No bookings found.</p>
            </div>
          ) : (
            bookings.map(booking => (
              <div key={booking.id} className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
                <div className="flex flex-col md:flex-row justify-between gap-6 mb-8">
                  <div className="flex items-start space-x-4">
                    <div className="bg-slate-50 p-4 rounded-2xl">
                      <Clock className="w-6 h-6 text-slate-400" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-3 mb-1">
                        <span className="font-black text-lg">ID: {booking.id}</span>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                      </div>
                      <p className="text-slate-500 text-sm font-medium">
                        Patient: <span className="text-slate-900 font-bold">{booking.patientName}</span> • {booking.date}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-slate-900">৳{booking.total}</p>
                    <p className="text-xs font-bold text-slate-400">Total Bill</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="relative mb-8">
                  <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 rounded-full" />
                  <div 
                    className="absolute top-1/2 left-0 h-1 bg-teal-500 -translate-y-1/2 rounded-full transition-all duration-1000" 
                    style={{ width: `${(statusOrder.indexOf(booking.status) / (statusOrder.length - 1)) * 100}%` }}
                  />
                  <div className="relative flex justify-between">
                    {statusOrder.map((s, idx) => (
                      <div key={s} className="flex flex-col items-center">
                        <div className={`w-4 h-4 rounded-full border-4 border-white shadow-sm z-10 ${statusOrder.indexOf(booking.status) >= idx ? 'bg-teal-500' : 'bg-slate-200'}`} />
                        <span className="text-[10px] font-bold text-slate-400 mt-2 uppercase">{s}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-8">
                  {booking.tests.map(t => (
                    <span key={t.id} className="bg-slate-50 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600">
                      {t.name}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-slate-500 font-medium truncate max-w-[200px]">{booking.address}</span>
                  </div>
                  {isAdmin ? (
                    <div className="flex space-x-2">
                      <select 
                        value={booking.status}
                        onChange={(e) => onUpdateStatus?.(booking.id, e.target.value as BookingStatus)}
                        className="bg-slate-900 text-white text-xs font-bold py-2 px-4 rounded-xl outline-none"
                      >
                        {statusOrder.map(s => <option key={s} value={s}>{s.toUpperCase()}</option>)}
                      </select>
                    </div>
                  ) : (
                    booking.status === 'completed' ? (
                      <button className="flex items-center space-x-2 bg-teal-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-teal-700 transition-all shadow-lg shadow-teal-600/20">
                        <FileText className="w-4 h-4" />
                        <span>View Report</span>
                      </button>
                    ) : (
                      <span className="text-sm font-bold text-slate-400 flex items-center italic">
                        Processing Sample...
                      </span>
                    )
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="space-y-8">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
              <Download className="w-5 h-5 mr-2 text-teal-600" />
              Recent Reports
            </h3>
            <div className="space-y-4">
              {[1, 2].map(i => (
                <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-teal-50 transition-colors group">
                  <div className="flex items-center space-x-3">
                    <div className="bg-white p-2 rounded-xl text-teal-600">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">Blood Profile - Oct {10+i}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Digital Lab Signature</p>
                    </div>
                  </div>
                  <button className="text-slate-400 hover:text-teal-600 transition-colors">
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 py-4 rounded-2xl bg-slate-900 text-white font-bold text-sm flex items-center justify-center space-x-2">
              <span>Visit Report Center</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="bg-teal-600 p-8 rounded-[2.5rem] text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Activity className="w-32 h-32" />
            </div>
            <h3 className="text-xl font-black mb-2 relative z-10">Health Insights</h3>
            <p className="text-teal-100 text-sm mb-6 relative z-10">Your Vitamin D levels have improved by 15% since last month. Keep up the balanced diet!</p>
            <button className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-3 rounded-2xl font-bold text-sm transition-all relative z-10">
              View Analytics
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
