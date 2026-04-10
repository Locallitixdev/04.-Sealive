"use client";

import React, { useState } from "react";
import { 
  FileText, Calendar as CalendarIcon, Download, Share2, 
  TrendingUp, AlertTriangle, Ship, CheckCircle2,
  Clock, MapPin, Search
} from "lucide-react";

const TIMELINE_EVENTS = [
  { time: "08:30 AM", type: "ANOMALY", title: "Dark Target Detected", desc: "Vessel 'SEA QUEEN' turned off AIS transponder in sector 7B.", status: "Investigating" },
  { time: "11:45 AM", type: "INCIDENT", title: "EEZ Intrusion", desc: "Unidentified foreign fishing vessel entered EEZ 5nm from border.", status: "Dispatched" },
  { time: "01:20 PM", type: "SYSTEM", title: "Routine Patrol Log", desc: "Patrol boat KRI-332 completed sector 4 perimeter check. Clear.", status: "Resolved" },
  { time: "03:10 PM", type: "ANOMALY", title: "Speed Irregularity", desc: "Cargo vessel 'OCEANIC' drifting at < 2 knots for 4 hours.", status: "Flagged" },
  { time: "05:00 PM", type: "INCIDENT", title: "Unauthorized Anchorage", desc: "Vessel anchoring outside designated port limits.", status: "Warning Sent" }
];

export default function DailyReportPage() {
  const [date] = useState("April 09, 2026");

  return (
    <div className="h-full flex flex-col bg-[#0C0E14] page-enter text-white overflow-hidden">
      
      {/* HEADER SECTION */}
      <div className="px-6 py-5 border-b border-[#2A3441] bg-[#131820] flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold font-[family-name:var(--font-display)] uppercase tracking-widest text-[#E5E7EB] flex items-center gap-3">
             <FileText className="w-6 h-6 text-[#0EA5E9]" />
             Daily Operations Report
          </h1>
          <div className="flex items-center gap-2 mt-1 text-[#6B7280] text-xs font-[family-name:var(--font-mono)]">
             <CalendarIcon className="w-3.5 h-3.5" />
             <span className="text-[#0EA5E9] font-bold">{date}</span>
             <span className="mx-2">•</span>
             <span>Maritime Command Center</span>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-[#1A1E28] border border-[#2A3441] rounded hover:border-[#4B5563] hover:text-white transition-colors text-xs font-[family-name:var(--font-display)] uppercase tracking-wider text-[#D1D5DB]">
            <Share2 className="w-4 h-4" /> Share
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#0EA5E9]/10 border border-[#0EA5E9]/30 text-[#0EA5E9] rounded hover:bg-[#0EA5E9]/20 transition-colors text-xs font-bold font-[family-name:var(--font-display)] uppercase tracking-wider shadow-[0_0_15px_rgba(14,165,233,0.15)]">
            <Download className="w-4 h-4" /> Export PDF
          </button>
        </div>
      </div>

      {/* SCROLLABLE CONTENT */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 flex flex-col">
          
          {/* STATS ROW */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
             <StatCard title="Active Incidents" value="12" trend="+3" trendUp={true} icon={AlertTriangle} color="text-[#EF4444]" bg="bg-[#EF4444]/10" border="border-[#EF4444]/30" />
             <StatCard title="Suspected Anomalies" value="8" trend="-2" trendUp={false} icon={TrendingUp} color="text-[#E67E22]" bg="bg-[#E67E22]/10" border="border-[#E67E22]/30" />
             <StatCard title="Vessels Tracked" value="1,432" trend="+154" trendUp={true} icon={Ship} color="text-[#0EA5E9]" bg="bg-[#0EA5E9]/10" border="border-[#0EA5E9]/30" />
             <StatCard title="Cases Resolved Today" value="24" trend="+5" trendUp={true} icon={CheckCircle2} color="text-[#10B981]" bg="bg-[#10B981]/10" border="border-[#10B981]/30" />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 flex-1 min-h-0">
             
             {/* LEFT: TIMELINE */}
             <div className="xl:col-span-2 bg-[#131820] border border-[#2A3441] rounded-lg p-5 flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-sm font-bold font-[family-name:var(--font-display)] uppercase tracking-wider text-[#D1D5DB] flex items-center gap-2">
                     <Clock className="w-4 h-4 text-[#E67E22]" /> 
                     Chronological Log
                  </h3>
                  <div className="relative">
                     <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#6B7280]" />
                     <input type="text" placeholder="Filter Logs..." className="w-[200px] bg-[#0C0E14] border border-[#2A3441] rounded pl-8 pr-3 py-1.5 text-[11px] text-[#D1D5DB] placeholder-[#6B7280] outline-none focus:border-[#E67E22]/50 transition-colors" />
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto pr-2 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-[#2A3441] before:to-transparent">
                  {TIMELINE_EVENTS.map((event, idx) => (
                    <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active mb-8 stagger-slide-up" style={{ "--i": idx } as React.CSSProperties}>
                        {/* Status Icon Marker */}
                        <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-[#131820] shadow-[0_0_15px_rgba(0,0,0,0.5)] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 
                          bg-[#0C0E14] 
                          group-even:border-[#E67E22]/50 group-odd:border-[#EF4444]/50">
                           <div className={`w-2.5 h-2.5 rounded-full ${event.type === 'INCIDENT' ? 'bg-[#EF4444]' : event.type === 'ANOMALY' ? 'bg-[#E67E22]' : 'bg-[#10B981]'}`} />
                        </div>
                        {/* Event Card */}
                        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-[#0C0E14] border border-[#2A3441] p-4 rounded-lg hover:border-[#4B5563] transition-all duration-300">
                          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                            <span className="text-[10px] text-[#E67E22] font-semibold tracking-wider font-[family-name:var(--font-mono)]">{event.time}</span>
                            <span className={`text-[8px] px-1.5 py-0.5 rounded uppercase font-bold tracking-wider font-[family-name:var(--font-display)] border ${
                               event.type === 'INCIDENT' ? 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/30' : 
                               event.type === 'ANOMALY' ? 'bg-[#E67E22]/10 text-[#E67E22] border-[#E67E22]/30' :
                               'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/30'
                            }`}>
                              {event.type}
                            </span>
                          </div>
                          <h4 className="text-[13px] font-bold text-white font-[family-name:var(--font-display)] mb-1">{event.title}</h4>
                          <p className="text-[11px] text-[#9CA3AF] leading-relaxed font-[family-name:var(--font-mono)] mb-3">{event.desc}</p>
                          <div className="text-[10px] text-[#6B7280] flex items-center gap-1.5 pt-2 border-t border-[#2A3441]/50">
                            Status: <strong className="text-[#D1D5DB]">{event.status}</strong>
                          </div>
                        </div>
                    </div>
                  ))}
                </div>
             </div>

             {/* RIGHT: MAP SUMMARY & REPORTS */}
             <div className="flex flex-col gap-6">
                
                {/* Simulated Geographic Activity Heatmap/Chart */}
                <div className="bg-[#131820] border border-[#2A3441] rounded-lg p-5">
                   <h3 className="text-sm font-bold font-[family-name:var(--font-display)] uppercase tracking-wider text-[#D1D5DB] flex items-center gap-2 border-b border-[#2A3441] pb-3 mb-4">
                     <MapPin className="w-4 h-4 text-[#0EA5E9]" /> 
                     Regional Activity
                   </h3>
                   <div className="space-y-4">
                      <div className="flex flex-col gap-1.5">
                         <div className="flex justify-between text-[11px] font-[family-name:var(--font-mono)]">
                           <span className="text-[#9CA3AF]">Malacca Strait</span>
                           <span className="text-white font-bold">45%</span>
                         </div>
                         <div className="h-1.5 w-full bg-[#0C0E14] rounded-full overflow-hidden">
                           <div className="h-full bg-gradient-to-r from-[#0EA5E9] to-[#EF4444]" style={{ width: '45%' }} />
                         </div>
                      </div>
                      <div className="flex flex-col gap-1.5">
                         <div className="flex justify-between text-[11px] font-[family-name:var(--font-mono)]">
                           <span className="text-[#9CA3AF]">Java Sea</span>
                           <span className="text-white font-bold">28%</span>
                         </div>
                         <div className="h-1.5 w-full bg-[#0C0E14] rounded-full overflow-hidden">
                           <div className="h-full bg-gradient-to-r from-[#0EA5E9] to-[#E67E22]" style={{ width: '28%' }} />
                         </div>
                      </div>
                      <div className="flex flex-col gap-1.5">
                         <div className="flex justify-between text-[11px] font-[family-name:var(--font-mono)]">
                           <span className="text-[#9CA3AF]">Natuna Edge</span>
                           <span className="text-white font-bold">15%</span>
                         </div>
                         <div className="h-1.5 w-full bg-[#0C0E14] rounded-full overflow-hidden">
                           <div className="h-full bg-[#10B981]" style={{ width: '15%' }} />
                         </div>
                      </div>
                   </div>
                </div>

                {/* Operations Summary Notes */}
                <div className="bg-[#131820] border border-[#2A3441] rounded-lg p-5 flex-1 line-clamp-none">
                  <h3 className="text-sm font-bold font-[family-name:var(--font-display)] uppercase tracking-wider text-[#D1D5DB] flex items-center gap-2 border-b border-[#2A3441] pb-3 mb-4">
                     <FileText className="w-4 h-4 text-[#10B981]" /> 
                     Commander's Summary
                  </h3>
                  <div className="text-[11px] text-[#9CA3AF] font-[family-name:var(--font-mono)] leading-loose space-y-3">
                     <p>
                        Routine monitoring executed strictly according to protocol. Main observations highlight a spike in <span className="text-[#E67E22] bg-[#E67E22]/10 px-1 rounded">AIS gaps</span> within the eastern quadrant.
                     </p>
                     <p>
                        Special task force dispatched at 11:45 AM neutralized the EEZ intrusion threat. No significant casualty or escalation reported.
                     </p>
                     <p>
                        <strong>Watchlist directives:</strong> Enhance radar tracking on dark targets near Zone C for the upcoming night watch shift.
                     </p>
                  </div>
                </div>

             </div>
          </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, trend, trendUp, icon: Icon, color, bg, border }: any) {
  return (
    <div className={`p-4 rounded-lg bg-[#131820] border ${border} flex flex-col hover:-translate-y-1 transition-transform duration-300 relative overflow-hidden group`}>
       {/* Ambient glow behind icon */}
       <div className={`absolute top-0 right-0 w-24 h-24 ${bg} blur-3xl rounded-full -mr-8 -mt-8 pointer-events-none group-hover:opacity-70 opacity-40 transition-opacity`} />
       
       <div className="flex items-start justify-between relative z-10 mb-4">
          <div className="p-2 bg-[#0C0E14] rounded-lg border border-[#2A3441]">
             <Icon className={`w-5 h-5 ${color}`} />
          </div>
          <div className={`flex items-center gap-1 text-[11px] font-bold font-[family-name:var(--font-mono)] ${trendUp ? "text-[#10B981]" : "text-[#EF4444]"}`}>
             {trendUp ? <TrendingUp className="w-3 h-3" /> : <TrendingUp className="w-3 h-3 rotate-180" />}
             {trend}
          </div>
       </div>
       <div className="relative z-10">
          <div className="text-[10px] text-[#6B7280] uppercase tracking-widest font-[family-name:var(--font-display)] mb-1">{title}</div>
          <div className="text-2xl font-bold text-white font-[family-name:var(--font-mono)]">{value}</div>
       </div>
    </div>
  )
}
