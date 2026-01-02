import React from "react";
// Added MapPin to the imports to resolve the "Cannot find name 'MapPin'" error.
import { Package, Clock, FileText, Download, ArrowRight, Activity, TrendingUp, MapPin } from "lucide-react";
import { Booking, BookingStatus } from "@/types/types";

interface DashboardProps {
  bookings: Booking[];
  isAdmin?: boolean;
  onUpdateStatus?: (bookingId: string, status: BookingStatus) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ bookings, isAdmin, onUpdateStatus }) => {
  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case "completed":
        return "bg-emerald-100 text-emerald-700";
      case "processing":
        return "bg-sky-100 text-sky-700";
      case "collected":
        return "bg-purple-100 text-purple-700";
      case "confirmed":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  const statusOrder: BookingStatus[] = ["pending", "confirmed", "collected", "processing", "completed"];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-black text-foreground mb-2">
            {isAdmin ? "Lab Partner Portal" : "My Health Hub"}
          </h1>
          <p className="text-muted-foreground font-medium">
            {isAdmin ? "Manage incoming samples and reports." : "Track your tests and health progress."}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="bg-background p-4 rounded-3xl shadow-sm border border-border flex items-center space-x-4">
            <div className="bg-primary/10 p-3 rounded-2xl text-primary">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-muted-foreground/60 uppercase">Active Tests</p>
              <p className="text-xl font-black text-foreground">
                {bookings.filter((b) => b.status !== "completed").length}
              </p>
            </div>
          </div>
          {!isAdmin && (
            <div className="bg-background p-4 rounded-3xl shadow-sm border border-border flex items-center space-x-4">
              <div className="bg-accent/10 p-3 rounded-2xl text-accent">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-muted-foreground/60 uppercase">Health Score</p>
                <p className="text-xl font-black text-foreground">82/100</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-xl font-bold text-foreground flex items-center">
            <Package className="w-5 h-5 mr-2 text-primary" />
            {isAdmin ? "Recent Orders" : "My Test History"}
          </h3>

          {bookings.length === 0 ? (
            <div className="bg-background p-12 rounded-[2.5rem] border border-dashed border-border text-center">
              <Package className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
              <p className="text-muted-foreground font-bold">No bookings found.</p>
            </div>
          ) : (
            bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-background rounded-[2rem] p-8 border border-border shadow-sm hover:shadow-xl transition-all group"
              >
                <div className="flex flex-col md:flex-row justify-between gap-6 mb-8">
                  <div className="flex items-start space-x-4">
                    <div className="bg-muted p-4 rounded-2xl">
                      <Clock className="w-6 h-6 text-muted-foreground/40" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-3 mb-1">
                        <span className="font-black text-lg">ID: {booking.id}</span>
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusColor(
                            booking.status
                          )}`}
                        >
                          {booking.status}
                        </span>
                      </div>
                      <p className="text-muted-foreground text-sm font-medium">
                        Patient: <span className="text-foreground font-bold">{booking.patientName}</span> •{" "}
                        {booking.date}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-foreground">৳{booking.total}</p>
                    <p className="text-xs font-bold text-muted-foreground/60">Total Bill</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="relative mb-8">
                  <div className="absolute top-1/2 left-0 w-full h-1 bg-muted -translate-y-1/2 rounded-full" />
                  <div
                    className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 rounded-full transition-all duration-1000"
                    style={{ width: `${(statusOrder.indexOf(booking.status) / (statusOrder.length - 1)) * 100}%` }}
                  />
                  <div className="relative flex justify-between">
                    {statusOrder.map((s, idx) => (
                      <div key={s} className="flex flex-col items-center">
                        <div
                          className={`w-4 h-4 rounded-full border-4 border-background shadow-sm z-10 ${
                            statusOrder.indexOf(booking.status) >= idx ? "bg-primary" : "bg-muted"
                          }`}
                        />
                        <span className="text-[10px] font-bold text-muted-foreground/60 mt-2 uppercase">{s}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-8">
                  {booking.tests.map((t) => (
                    <span
                      key={t.id}
                      className="bg-muted px-3 py-1.5 rounded-xl text-xs font-bold text-muted-foreground"
                    >
                      {t.name}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-border/50">
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-4 h-4 text-muted-foreground/40" />
                    <span className="text-sm text-muted-foreground font-medium truncate max-w-[200px]">
                      {booking.address}
                    </span>
                  </div>
                  {isAdmin ? (
                    <div className="flex space-x-2">
                      <select
                        value={booking.status}
                        onChange={(e) => onUpdateStatus?.(booking.id, e.target.value as BookingStatus)}
                        className="bg-foreground text-background text-xs font-bold py-2 px-4 rounded-xl outline-none"
                      >
                        {statusOrder.map((s) => (
                          <option key={s} value={s}>
                            {s.toUpperCase()}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : booking.status === "completed" ? (
                    <button className="flex items-center space-x-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
                      <FileText className="w-4 h-4" />
                      <span>View Report</span>
                    </button>
                  ) : (
                    <span className="text-sm font-bold text-muted-foreground/60 flex items-center italic">
                      Processing Sample...
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="space-y-8">
          <div className="bg-background p-8 rounded-[2.5rem] shadow-sm border border-border">
            <h3 className="text-xl font-bold text-foreground mb-6 flex items-center">
              <Download className="w-5 h-5 mr-2 text-primary" />
              Recent Reports
            </h3>
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 rounded-2xl bg-muted hover:bg-primary/5 transition-colors group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="bg-background p-2 rounded-xl text-primary">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">Blood Profile - Oct {10 + i}</p>
                      <p className="text-[10px] font-bold text-muted-foreground/60 uppercase">Digital Lab Signature</p>
                    </div>
                  </div>
                  <button className="text-muted-foreground/40 hover:text-primary transition-colors">
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 py-4 rounded-2xl bg-foreground text-background font-bold text-sm flex items-center justify-center space-x-2">
              <span>Visit Report Center</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="bg-primary p-8 rounded-[2.5rem] text-primary-foreground relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Activity className="w-32 h-32" />
            </div>
            <h3 className="text-xl font-black mb-2 relative z-10">Health Insights</h3>
            <p className="text-primary-foreground/80 text-sm mb-6 relative z-10">
              Your Vitamin D levels have improved by 15% since last month. Keep up the balanced diet!
            </p>
            <button className="bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground border border-primary-foreground/20 px-6 py-3 rounded-2xl font-bold text-sm transition-all relative z-10">
              View Analytics
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
