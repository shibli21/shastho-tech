import React from "react";
import { Package, Clock, FileText, Download, ArrowRight, Activity, TrendingUp, MapPin } from "lucide-react";
import { Booking, BookingStatus } from "@/types/types";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface DashboardProps {
  bookings: Booking[];
  isAdmin?: boolean;
  onUpdateStatus?: (bookingId: string, status: BookingStatus) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ bookings, isAdmin, onUpdateStatus }) => {
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
          <Card>
            <CardContent className="flex flex-row items-center space-x-4">
              <div className="bg-primary/10 p-3 rounded-xl text-primary shrink-0">
                <Activity className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-tight">Active Tests</p>
                <p className="text-lg font-black text-foreground leading-none">
                  {bookings.filter((b) => b.status !== "completed").length}
                </p>
              </div>
            </CardContent>
          </Card>
          {!isAdmin && (
            <Card>
              <CardContent className="flex flex-row items-center space-x-4">
                <div className="bg-accent/10 p-3 rounded-xl text-accent shrink-0">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-tight">
                    Health Score
                  </p>
                  <p className="text-lg font-black text-foreground leading-none">82/100</p>
                </div>
              </CardContent>
            </Card>
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
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                <Package className="w-12 h-12 text-muted-foreground/20 mb-4" />
                <p className="text-muted-foreground font-medium">No bookings found.</p>
              </CardContent>
            </Card>
          ) : (
            bookings.map((booking) => (
              <Card key={booking.id}>
                <CardHeader className="border-b pb-6">
                  <div className="flex flex-col md:flex-row justify-between gap-6">
                    <div className="flex items-start space-x-4">
                      <div className="bg-muted p-3 rounded-xl">
                        <Clock className="w-5 h-5 text-muted-foreground/40" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-lg font-black">ID: {booking.id}</CardTitle>
                          <Badge
                            variant="secondary"
                            className={cn(
                              "text-[10px] font-black uppercase tracking-widest px-2 py-0.5",
                              booking.status === "completed" && "bg-emerald-50 text-emerald-700 border-emerald-100",
                              booking.status === "processing" && "bg-sky-50 text-sky-700 border-sky-100",
                              booking.status === "collected" && "bg-purple-50 text-purple-700 border-purple-100",
                              booking.status === "confirmed" && "bg-blue-50 text-blue-700 border-blue-100"
                            )}
                          >
                            {booking.status}
                          </Badge>
                        </div>
                        <CardDescription className="font-medium">
                          Patient: <span className="text-foreground font-bold">{booking.patientName}</span> •{" "}
                          {booking.date}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="md:text-right">
                      <p className="text-2xl font-black text-foreground leading-none">৳{booking.total}</p>
                      <p className="text-[10px] font-bold text-muted-foreground/60 uppercase mt-1">Total Bill</p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-6 space-y-8">
                  {/* Progress Bar */}
                  <div className="relative">
                    <Progress
                      value={(statusOrder.indexOf(booking.status) / (statusOrder.length - 1)) * 100}
                      className="h-1"
                    />
                    <div className="relative flex justify-between">
                      {statusOrder.map((s, idx) => (
                        <div key={s} className="flex flex-col items-center">
                          <div
                            className={`w-3 h-3 rounded-full border-2 border-background shadow-sm z-10 ${
                              statusOrder.indexOf(booking.status) >= idx ? "bg-primary" : "bg-muted"
                            }`}
                          />
                          <span className="text-[9px] font-bold text-muted-foreground/50 mt-2 uppercase">{s}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {booking.tests.map((t) => (
                      <Badge
                        key={t.id}
                        variant="outline"
                        className="rounded-lg text-[10px] font-bold text-muted-foreground px-2 py-0"
                      >
                        {t.name}
                      </Badge>
                    ))}
                  </div>
                </CardContent>

                <CardFooter className="border-t pt-6 flex flex-row items-center justify-between">
                  <div className="flex items-center space-x-3 text-muted-foreground">
                    <MapPin className="w-4 h-4 opacity-40" />
                    <span className="text-xs font-medium truncate max-w-[200px]">{booking.address}</span>
                  </div>
                  {isAdmin ? (
                    <Select
                      value={booking.status}
                      onValueChange={(value) => onUpdateStatus?.(booking.id, value as BookingStatus)}
                    >
                      <SelectTrigger className="w-[140px] h-9 text-xs font-bold rounded-xl">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOrder.map((s) => (
                          <SelectItem key={s} value={s} className="text-xs font-bold">
                            {s.toUpperCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : booking.status === "completed" ? (
                    <Button size="sm" className="rounded-xl h-9">
                      <FileText className="w-4 h-4 mr-2" />
                      <span>View Report</span>
                    </Button>
                  ) : (
                    <span className="text-xs font-bold text-muted-foreground/60 flex items-center italic">
                      Processing Sample...
                    </span>
                  )}
                </CardFooter>
              </Card>
            ))
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-bold flex items-center">
                <Download className="w-5 h-5 mr-2 text-primary" />
                Recent Reports
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-xl bg-muted/50 hover:bg-primary/5 transition-colors group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="bg-background p-2 rounded-lg text-primary">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-foreground leading-tight">Blood Profile - Oct {10 + i}</p>
                      <p className="text-[9px] font-bold text-muted-foreground/60 uppercase">Digital Lab Signature</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground/40 hover:text-primary">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Button className="w-full font-bold text-xs h-10 rounded-xl">
                <span>Visit Report Center</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardFooter>
          </Card>

          <Card className="bg-primary text-primary-foreground overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
              <Activity className="w-24 h-24" />
            </div>
            <CardHeader className="relative z-10">
              <CardTitle className="text-lg font-black leading-tight">Health Insights</CardTitle>
              <CardDescription className="text-primary-foreground/80 font-medium text-xs leading-relaxed">
                Your Vitamin D levels have improved by 15% since last month. Keep up the balanced diet!
              </CardDescription>
            </CardHeader>
            <CardFooter className="relative z-10">
              <Button
                variant="outline"
                className="bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground border-primary-foreground/20 rounded-xl w-full text-xs h-9"
              >
                View Analytics
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
