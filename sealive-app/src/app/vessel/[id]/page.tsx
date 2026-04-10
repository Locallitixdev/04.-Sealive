"use client";

import React, { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import { ChevronLeft, ChevronRight, Star, FileText, Info, Play, Navigation, AlertTriangle, ShieldAlert, ShieldCheck, Eye, Shield, Activity, Anchor, MapPin, Clock, AlertCircle } from "lucide-react";
import { MOCK_VESSEL_GEOJSON } from "@/components/map/MapView";

const MapView = dynamic(() => import("@/components/map/MapView"), { ssr: false, loading: () => <div className="w-full h-full bg-[#0C1015] flex items-center justify-center text-[#6B7280] text-[10px] font-mono tracking-widest uppercase">Initializing Map Engine...</div> });

const VESSELS = MOCK_VESSEL_GEOJSON.features.map((f: any, i: number) => ({
  ...f.properties,
  riskStatus: (i === 1 || i === 4) ? "BLACKLISTED" : (i === 3) ? "WATCHLIST" : "NORMAL",
  coordinates: f.geometry.coordinates,
}));

function TechCard({ title, action, children, glow = false }: { title: string; action?: React.ReactNode; children: React.ReactNode; glow?: boolean }) {
  return (
    <div className={`bg-[#0F131A] border ${glow ? 'border-[#E67E22]/30 shadow-[0_0_15px_rgba(230,126,34,0.05)]' : 'border-[#1E2530]'} rounded-xl overflow-hidden flex flex-col relative group`}>
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#2A3441] group-hover:via-[#E67E22]/50 to-transparent transition-all duration-500" />
      <div className="h-12 border-b border-[#1E2530] flex items-center justify-between px-5 bg-[#141923]">
        <div className="flex items-center gap-3">
          {glow && <div className="w-1.5 h-1.5 rounded-full bg-[#E67E22] animate-pulse" />}
          <h3 className="text-[12px] font-bold text-white tracking-[0.1em] font-[family-name:var(--font-display)] uppercase">{title}</h3>
        </div>
        {action ? action : null}
      </div>
      <div className="p-5 flex-1 relative z-10">{children}</div>
    </div>
  );
}

export default function VesselDetailPage() {
  const params = useParams();
  const idStr = params?.id as string;
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const vessel = useMemo(() => {
    const found = VESSELS.find((v) => v.id === idStr);
    if (found) return found;
    return {
      id: "fallback",
      name: "SANTARLI",
      flag: "🇵🇦",
      flagName: "Panama",
      imo: "9207443",
      mmsi: "371111000",
      type: "Cargo",
      status: "Under Way Using Engine",
      speed: 9.4,
      heading: 112,
      lastUpdate: "2026-04-09 13:10:41 UTC+7",
    };
  }, [idStr]);

  const flagEmoji = vessel.flag?.length === 2 ? vessel.flag : "🇵🇦";
  const flagText = vessel.flagName || (vessel.flag === "ID" ? "Indonesia" : "Panama");
  const [riskStatus, setRiskStatus] = useState(vessel.riskStatus || "NORMAL");
  const [activeTab, setActiveTab] = useState("Overview");

  const StatusConfig = {
    NORMAL: { color: "text-[#10B981]", border: "border-[#10B981]/40", bg: "bg-[#10B981]/10", shadow: "shadow-[0_0_10px_rgba(16,185,129,0.2)]", icon: ShieldCheck, label: "Clear" },
    WATCHLIST: { color: "text-[#E67E22]", border: "border-[#E67E22]/40", bg: "bg-[#E67E22]/10", shadow: "shadow-[0_0_10px_rgba(230,126,34,0.2)]", icon: Eye, label: "Watchlist" },
    BLACKLISTED: { color: "text-[#EF4444]", border: "border-[#EF4444]/40", bg: "bg-[#EF4444]/10", shadow: "shadow-[0_0_10px_rgba(239,68,68,0.2)]", icon: ShieldAlert, label: "Sanctioned" },
  } as Record<string, any>;

  const currentStatusNode = StatusConfig[riskStatus] || StatusConfig["NORMAL"];
  const CurrentIcon = currentStatusNode.icon;

  if (!mounted) return null;

  return (
    <div className="h-full flex flex-col overflow-hidden bg-[#0A0D12] selection:bg-[#E67E22]/30 text-white">
      
      {/* MASSIVE HERO SECTION */}
      <div className="relative min-h-[260px] flex flex-col shrink-0 border-b border-[#1E2530] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1572097561858-a5b591b65e9f?q=80&w=1200&auto=format&fit=crop" className="w-full h-full object-cover opacity-30 transform scale-105" alt="Vessel Background" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0D12] via-[#0A0D12]/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A0D12] via-[#0A0D12]/40 to-transparent" />
        </div>

        {/* Top Navbar overlapping Hero */}
        <div className="relative z-20 flex justify-between items-center px-8 py-4">
           <Link href="/map" className="flex items-center gap-2 px-3 py-1.5 bg-[#141923]/60 backdrop-blur border border-[#2A3441]/50 rounded-lg text-white text-[11px] uppercase font-bold tracking-wider hover:bg-[#1A1E28] hover:border-[#E67E22]/50 transition-all font-[family-name:var(--font-display)] group">
             <ChevronLeft className="w-4 h-4 text-[#E67E22] group-hover:-translate-x-0.5 transition-transform" /> Command Map
           </Link>
           <button className="flex items-center gap-2 px-4 py-1.5 bg-[#E67E22] hover:bg-[#D6731E] rounded-lg text-white text-[11px] uppercase font-bold tracking-wider shadow-[0_0_15px_rgba(230,126,34,0.3)] hover:shadow-[0_0_20px_rgba(230,126,34,0.5)] transition-all font-[family-name:var(--font-display)] animate-pulse-slow">
             <Star className="w-3.5 h-3.5 fill-current" /> Add to Fleet
           </button>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 px-8 flex-1 flex flex-col justify-end pb-8 pt-4">
           <div className="flex items-end justify-between">
              <div className="flex flex-col gap-2">
                 <div className="flex items-center gap-3">
                   <div className="px-2 py-0.5 bg-black/40 backdrop-blur border border-white/10 rounded text-xl shadow-lg">{flagEmoji}</div>
                   <div className={`px-2.5 py-1 ${currentStatusNode.bg} ${currentStatusNode.border} border rounded backdrop-blur-md flex items-center gap-1.5 ${currentStatusNode.shadow}`}>
                      <CurrentIcon className={`w-3.5 h-3.5 ${currentStatusNode.color}`} />
                      <span className={`text-[10px] uppercase font-bold tracking-widest ${currentStatusNode.color}`}>{currentStatusNode.label}</span>
                   </div>
                 </div>
                 <h1 className="text-5xl font-black font-[family-name:var(--font-display)] tracking-tight uppercase flex items-end gap-4 drop-shadow-2xl">
                   {vessel.name}
                   <span className="text-xl text-[#6B7280] font-normal tracking-wide mb-1.5">IMO {vessel.imo || "9207443"}</span>
                 </h1>
              </div>
              
              {/* Glassmorphism Quick Stats */}
              <div className="flex gap-4">
                 <div className="bg-[#141923]/70 backdrop-blur-md border border-[#2A3441]/50 rounded-xl p-3 w-[130px] flex flex-col gap-1 shadow-2xl">
                    <span className="text-[10px] text-[#9CA3AF] uppercase font-bold tracking-widest flex items-center gap-1.5"><Navigation className="w-3 h-3 text-[#E67E22]" /> Speed / COG</span>
                    <div className="text-xl font-bold font-[family-name:var(--font-mono)] text-white">{vessel.speed}<span className="text-xs text-[#6B7280] ml-1">kn</span></div>
                    <div className="text-[10px] text-[#6B7280] font-[family-name:var(--font-mono)]">{Math.round(vessel.heading)}° True</div>
                 </div>
                 <div className="bg-[#141923]/70 backdrop-blur-md border border-[#2A3441]/50 rounded-xl p-3 w-[150px] flex flex-col gap-1 shadow-2xl">
                    <span className="text-[10px] text-[#9CA3AF] uppercase font-bold tracking-widest flex items-center gap-1.5"><MapPin className="w-3 h-3 text-[#E67E22]" /> Coordinates</span>
                    <div className="text-[13px] font-bold font-[family-name:var(--font-mono)] text-white pt-1">{vessel.coordinates?.[1] || 3.1816}</div>
                    <div className="text-[13px] font-bold font-[family-name:var(--font-mono)] text-[#6B7280]">{vessel.coordinates?.[0] || 119.4883}</div>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* Futuristic Tabs Menu */}
      <div className="flex items-center px-8 py-0 bg-[#0A0D12] border-b border-[#1E2530] shrink-0 gap-8 h-14 relative">
        {["Overview", "Portcall Log", "Sanction List", "Database", "Activity Report"].map((tab) => (
          <button 
             key={tab} 
             onClick={() => setActiveTab(tab)}
             className={`relative h-full flex items-center justify-center px-2 text-[11px] font-bold uppercase tracking-widest transition-colors duration-300
               ${activeTab === tab ? "text-[#E67E22]" : "text-[#6B7280] hover:text-[#D1D5DB]"}`}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#E67E22] shadow-[0_0_8px_rgba(230,126,34,0.8)]" />
            )}
          </button>
        ))}
      </div>

      {/* Scrollable Main Content */}
      <div className="flex-1 overflow-y-auto custom-scroll">
        <div className="p-8">
          
          {/* TAB: OVERVIEW */}
          {activeTab === "Overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
              
              {/* === LEFT COLUMN === */}
              <div className="lg:col-span-4 flex flex-col gap-8">
              
               <TechCard title="General Profile">
                  <div className="mb-6 rounded-lg border border-[#1E2530] overflow-hidden h-[180px] relative group cursor-pointer bg-black shadow-inner">
                    <img src="https://images.unsplash.com/photo-1572097561858-a5b591b65e9f?q=80&w=600&auto=format&fit=crop" 
                         className="w-full h-full object-cover grayscale-[20%] brightness-90 group-hover:scale-105 transition-all duration-700" alt="Vessel Photo" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0D12]/80 via-transparent to-transparent" />
                  </div>
                  
                  <div className="grid grid-cols-[110px_1fr] gap-y-4 text-[11px] items-center">
                    <div className="text-[#6B7280] uppercase tracking-wider font-bold">Name</div>
                    <div className="text-white font-[family-name:var(--font-mono)] text-[12px]">{vessel.name}</div>
                    
                    <div className="text-[#6B7280] uppercase tracking-wider font-bold">Flag</div>
                    <div className="text-white font-[family-name:var(--font-mono)] text-[12px] flex items-center gap-2">{flagEmoji} {flagText}</div>
                    
                    <div className="text-[#6B7280] uppercase tracking-wider font-bold">MMSI</div>
                    <div className="text-white font-[family-name:var(--font-mono)] text-[12px] text-[#0EA5E9] cursor-pointer hover:underline">{vessel.mmsi || "371111000"}</div>
                    
                    <div className="border-t border-[#1E2530] col-span-2 my-2" />
                    
                    <div className="text-[#6B7280] uppercase tracking-wider font-bold">Vessel Type</div>
                    <div className="text-white font-[family-name:var(--font-mono)] text-[12px]">{vessel.type}</div>
                    
                    <div className="text-[#6B7280] uppercase tracking-wider font-bold">Size</div>
                    <div className="text-white font-[family-name:var(--font-mono)] text-[12px]">225 x 32 m</div>
                    
                    <div className="text-[#6B7280] uppercase tracking-wider font-bold">Tonnage</div>
                    <div className="text-white font-[family-name:var(--font-mono)] text-[12px]">38,889 t (Gross)</div>
                  </div>
               </TechCard>
               
               <TechCard title="AIS Telemetry" glow>
                  <div className="flex flex-col gap-6">
                     <div className="flex items-center gap-4 bg-[#141923] border border-[#1E2530] p-4 rounded-lg">
                        <div className="w-10 h-10 rounded-full bg-[#059669]/20 flex items-center justify-center shrink-0 border border-[#059669]/40">
                           <Activity className="w-5 h-5 text-[#10B981]" />
                        </div>
                        <div className="flex flex-col gap-1">
                           <span className="text-[10px] text-[#6B7280] uppercase tracking-widest font-bold">Navigational Status</span>
                           <span className="text-[13px] text-white font-[family-name:var(--font-display)] font-bold">{vessel.status}</span>
                        </div>
                     </div>
                     
                     <div className="grid grid-cols-[120px_1fr] gap-y-4 text-[11px] items-center">
                        <div className="text-[#6B7280] uppercase tracking-wider font-bold">Position Recv</div>
                        <div className="text-white font-[family-name:var(--font-mono)]">
                           12 minutes ago <br/><span className="text-[9px] text-[#E67E22]">{vessel.lastUpdate}</span>
                        </div>
                        
                        <div className="text-[#6B7280] uppercase tracking-wider font-bold">Draught</div>
                        <div className="text-white font-[family-name:var(--font-mono)]">14.0 m</div>
                        
                        <div className="border-t border-[#1E2530] col-span-2 my-2" />
                        
                        <div className="text-[#6B7280] uppercase tracking-wider font-bold">Destination</div>
                        <div className="text-white font-[family-name:var(--font-mono)] uppercase font-bold text-[#E67E22]">HUILAI/CN</div>
                        
                        <div className="text-[#6B7280] uppercase tracking-wider font-bold">Reported ETA</div>
                        <div className="text-white font-[family-name:var(--font-mono)]">-</div>
                     </div>
                  </div>
               </TechCard>
            </div>

            {/* === CENTER COLUMN === */}
            <div className="lg:col-span-8 flex flex-col gap-8">
              
              {/* Map & Route Tracking Widget */}
              <div className="bg-[#0F131A] border border-[#1E2530] rounded-xl overflow-hidden flex flex-col h-[520px] shadow-2xl relative group">
                <div className="flex-1 relative bg-[#0A0D12]">
                  <MapView selectedVesselId={idStr} layerVisibility={{ vessels: true, "vessel-labels": true, "shipping-routes": true }} />
                  
                  {/* Floating Action Menu inside Map */}
                  <div className="absolute top-5 right-5 z-10 flex flex-col gap-3">
                     <button className="flex items-center justify-center p-2.5 bg-[#0F131A]/90 backdrop-blur border border-[#E67E22]/50 rounded-lg shadow-xl hover:bg-[#E67E22] hover:text-white text-[#E67E22] transition-colors group/btn">
                       <Play className="w-4 h-4 fill-current group-hover/btn:scale-110 transition-transform" />
                     </button>
                     <button className="flex items-center justify-center p-2.5 bg-[#0F131A]/90 backdrop-blur border border-[#2A3441] rounded-lg shadow-xl hover:bg-[#1A1E28] text-white transition-colors">
                       <Clock className="w-4 h-4" />
                     </button>
                  </div>
                </div>
                
                {/* Advanced Progress Journey Bar */}
                <div className="p-6 bg-[#0F131A] border-t border-[#1E2530] relative overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#E67E22]/5 to-transparent opacity-50" />
                  <div className="relative z-10">
                     <div className="flex justify-between items-end mb-4">
                        <div className="flex flex-col gap-1">
                           <span className="text-[10px] text-[#6B7280] uppercase font-bold tracking-widest">Departure</span>
                           <span className="text-[14px] text-white font-bold font-[family-name:var(--font-display)] tracking-wider">UNKNOWN</span>
                        </div>
                        <div className="flex flex-col gap-1 items-end">
                           <span className="text-[10px] text-[#E67E22] uppercase font-bold tracking-widest">Destination</span>
                           <span className="text-[14px] text-white font-bold font-[family-name:var(--font-display)] tracking-wider">HUILAI, CN</span>
                        </div>
                     </div>
                     
                     <div className="relative h-[4px] bg-[#1A1E28] rounded-full my-6">
                        <div className="absolute left-0 top-0 h-full bg-gradient-to-r from-[#8B5CF6] via-[#E67E22] to-[#E67E22] rounded-full shadow-[0_0_10px_rgba(230,126,34,0.5)]" style={{ width: '45%' }} />
                        
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full border-2 border-[#8B5CF6] bg-[#0F131A]" />
                        
                        <div className="absolute top-1/2 -translate-y-1/2 left-[45%]">
                           <div className="relative w-8 h-8 rounded-full bg-[#E67E22]/20 flex items-center justify-center -translate-x-1/2">
                              <div className="absolute w-full h-full bg-[#E67E22]/20 rounded-full animate-ping" />
                              <Navigation className="w-4 h-4 text-[#E67E22] rotate-[90deg] drop-shadow-[0_0_8px_rgba(230,126,34,1)] relative z-10" />
                           </div>
                        </div>
                        
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-4 h-4 rounded-full border-2 border-[#4A5568] bg-[#0F131A] flex items-center justify-center">
                           <div className="w-1.5 h-1.5 bg-[#4A5568] rounded-full" />
                        </div>
                     </div>
                  </div>
                </div>
              </div>

              {/* Risk Analytics Chart */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <TechCard title="Risk Diagnostic Pattern">
                    <div className="flex h-[150px] items-center gap-8">
                       <div className="relative w-[120px] h-[120px] flex items-center justify-center shrink-0 bg-[#0A0D12] rounded-full border border-[#1E2530] shadow-inner">
                          <svg className="w-[100px] h-[100px] -rotate-90">
                            <circle cx="50" cy="50" r="42" stroke="#1A1E28" strokeWidth="8" fill="none" />
                            <circle cx="50" cy="50" r="42" stroke="#EF4444" strokeWidth="8" fill="none" strokeDasharray="264" strokeDashoffset="180" strokeLinecap="round" className="animate-[stroke-in_1.5s_ease-out_forwards] drop-shadow-[0_0_5px_rgba(239,68,68,0.6)]" />
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-2xl font-black text-white font-[family-name:var(--font-mono)] leading-none">31</span>
                            <span className="text-[9px] text-[#6B7280] uppercase tracking-widest mt-1">Score</span>
                          </div>
                       </div>
                       
                       <div className="flex-1 flex flex-col border-l border-[#1E2530] pl-6 h-full justify-between pb-2">
                          <div className="flex justify-between items-center text-[10px] text-[#6B7280] font-[family-name:var(--font-mono)] mb-2">
                             <span>Risk Trend</span>
                             <span className="text-[#10B981]">+2% Improving</span>
                          </div>
                          <div className="relative flex-1 w-full flex items-end">
                             <div className="absolute inset-0 grid grid-rows-3 gap-0">
                               <div className="border-b border-[#2A3441]/30 w-full" />
                               <div className="border-b border-[#2A3441]/30 w-full" />
                               <div className="w-full" />
                             </div>
                             <svg className="relative z-10 w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 40">
                               <path d="M0,35 L10,33 L20,36 L30,20 L40,25 L50,15 L60,18 L70,10 L80,12 L90,20 L100,5" fill="none" stroke="#E67E22" strokeWidth="2" className="drop-shadow-[0_0_4px_rgba(230,126,34,0.4)]" />
                               <path d="M0,35 L10,33 L20,36 L30,20 L40,25 L50,15 L60,18 L70,10 L80,12 L90,20 L100,5 L100,40 L0,40 Z" fill="url(#trend-gradient)" opacity="0.1" />
                               <defs>
                                 <linearGradient id="trend-gradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#E67E22" />
                                    <stop offset="100%" stopColor="transparent" />
                                 </linearGradient>
                               </defs>
                             </svg>
                          </div>
                          <div className="flex justify-between text-[9px] text-[#6B7280] font-[family-name:var(--font-mono)] mt-2">
                            <span>Mar 1</span>
                            <span>Today</span>
                          </div>
                       </div>
                    </div>
                 </TechCard>

                 <TechCard title="Active Anomalies">
                    <div className="h-full flex flex-col justify-center items-center p-4">
                       <div className="w-16 h-16 rounded-full bg-[#EF4444]/10 flex items-center justify-center mb-4 border border-[#EF4444]/30 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                          <AlertTriangle className="w-8 h-8 text-[#EF4444]" />
                       </div>
                       <h4 className="text-white text-sm font-bold font-[family-name:var(--font-display)] tracking-wide mb-2 text-center">EEZ Intrusion Detected</h4>
                       <p className="text-[11px] text-[#9CA3AF] text-center leading-relaxed">
                         Vessel has entered an unauthorized operating zone. Immediate surveillance recommended.
                       </p>
                    </div>
                 </TechCard>
              </div>

            </div>
          </div>
          )}

          {/* TAB: DATABASE Visual Implementation */}
          {activeTab === "Database" && (
            <div className="max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* 1. Identification & Ownership */}
                <TechCard title="Identification & Ownership">
                  <div className="space-y-4">
                     {[
                       { label: "Registered Owner", value: "PACIFIC MARITIME CORP", sub: "Singapore" },
                       { label: "Commercial Manager", value: "OCEAN ROUTE SHIPPING", sub: "Hong Kong" },
                       { label: "Technical Manager", value: "GLOBAL SHIPMGMT LLC", sub: "Isle of Man" },
                       { label: "Port of Registry", value: "PANAMA", sub: "PAN" },
                       { label: "Classification Society", value: "Nippon Kaiji Kyokai (NKK)", sub: "" },
                     ].map((item, idx) => (
                       <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#2A3441] pb-3 last:border-0 last:pb-0">
                         <span className="text-[12px] text-[#9CA3AF] uppercase font-bold tracking-wider">{item.label}</span>
                         <div className="flex flex-col sm:items-end">
                           <span className="text-[13px] text-white font-[family-name:var(--font-mono)]">{item.value}</span>
                           {item.sub && <span className="text-[10px] text-[#6B7280]">{item.sub}</span>}
                         </div>
                       </div>
                     ))}
                  </div>
                </TechCard>

                {/* 2. Ship Dimensions & Capacity */}
                <TechCard title="Ship Dimensions & Capacity">
                  <div className="space-y-4">
                     {[
                       { label: "Gross Tonnage (GRT)", value: "38,889 t" },
                       { label: "Deadweight (DWT)", value: "62,400 t" },
                       { label: "Length Overall (LOA)", value: "225.0 m" },
                       { label: "Beam (Width)", value: "32.2 m" },
                       { label: "Maximum Draught", value: "14.2 m" },
                       { label: "Year Built", value: "2015" },
                       { label: "Builder", value: "HYUNDAI HEAVY IND." },
                     ].map((item, idx) => (
                       <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#2A3441] pb-3 last:border-0 last:pb-0">
                         <span className="text-[12px] text-[#9CA3AF] uppercase font-bold tracking-wider">{item.label}</span>
                         <span className="text-[13px] text-[#E67E22] font-[family-name:var(--font-mono)] font-bold">{item.value}</span>
                       </div>
                     ))}
                  </div>
                </TechCard>

                {/* 3. Electronic/Radio IDs */}
                <TechCard title="Radio & Electronic Identifiers">
                  <div className="grid grid-cols-2 gap-4">
                     <div className="bg-[#141923] p-4 rounded-lg border border-[#1E2530]">
                        <span className="block text-[10px] text-[#6B7280] uppercase tracking-widest font-bold mb-1">MMSI NUMBER</span>
                        <span className="text-lg text-[#0EA5E9] font-[family-name:var(--font-mono)] tracking-wider block">{vessel.mmsi || "371111000"}</span>
                     </div>
                     <div className="bg-[#141923] p-4 rounded-lg border border-[#1E2530]">
                        <span className="block text-[10px] text-[#6B7280] uppercase tracking-widest font-bold mb-1">IMO NUMBER</span>
                        <span className="text-lg text-white font-[family-name:var(--font-mono)] tracking-wider block">{vessel.imo || "9207443"}</span>
                     </div>
                     <div className="bg-[#141923] p-4 rounded-lg border border-[#1E2530]">
                        <span className="block text-[10px] text-[#6B7280] uppercase tracking-widest font-bold mb-1">CALL SIGN</span>
                        <span className="text-lg text-white font-[family-name:var(--font-mono)] tracking-wider block">5L F77</span>
                     </div>
                     <div className="bg-[#141923] p-4 rounded-lg border border-[#1E2530]">
                        <span className="block text-[10px] text-[#6B7280] uppercase tracking-widest font-bold mb-1">INMARSAT ID</span>
                        <span className="text-lg text-[#6B7280] font-[family-name:var(--font-mono)] tracking-wider block">Not Disclosed</span>
                     </div>
                  </div>
                </TechCard>
              </div>
            </div>
          )}

          {/* TAB: PORTCALL LOG */}
          {activeTab === "Portcall Log" && (
            <div className="max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
              <TechCard title="Recent Port Operations">
                <div className="flex flex-col">
                  <div className="grid grid-cols-[auto_1fr_1fr_1fr_auto] gap-4 mb-4 pb-2 border-b border-[#2A3441] text-[10px] text-[#6B7280] uppercase tracking-wider font-bold">
                    <div className="w-8 shrink-0">Status</div>
                    <div>Port / Anchorage</div>
                    <div>Arrival (ATA)</div>
                    <div>Departure (ATD)</div>
                    <div className="text-right">Time in Port</div>
                  </div>
                  
                  {[
                    { status: "Departure", port: "Singapore (SG)", ata: "2026-04-06 08:15 UTC", atd: "2026-04-08 14:30 UTC", dur: "2d 6h" },
                    { status: "Transit", port: "Malacca Strait", ata: "2026-04-05 11:20 UTC", atd: "2026-04-05 22:15 UTC", dur: "11h" },
                    { status: "Arrival", port: "Port Klang (MY)", ata: "2026-04-02 09:00 UTC", atd: "2026-04-04 18:45 UTC", dur: "2d 9h" },
                    { status: "Departure", port: "Jakarta (ID)", ata: "2026-03-28 14:10 UTC", atd: "2026-03-31 06:20 UTC", dur: "2d 16h" },
                    { status: "Transit", port: "Sunda Strait", ata: "2026-03-27 05:45 UTC", atd: "2026-03-27 16:30 UTC", dur: "10h" }
                  ].map((log, i) => (
                    <div key={i} className="grid grid-cols-[auto_1fr_1fr_1fr_auto] gap-4 py-3 border-b border-[#1E2530] last:border-0 items-center hover:bg-[#1A1F2B] transition-colors -mx-4 px-4">
                      <div className="w-8 shrink-0 flex justify-center">
                        <div className={`w-2 h-2 rounded-full ${log.status === "Arrival" ? "bg-[#10B981] shadow-[0_0_8px_rgba(16,185,129,0.5)]" : log.status === "Departure" ? "bg-[#3B82F6] shadow-[0_0_8px_rgba(59,130,246,0.5)]" : "bg-[#F59E0B] shadow-[0_0_8px_rgba(245,158,11,0.5)]"}`} />
                      </div>
                      <div className="text-[13px] text-white font-[family-name:var(--font-display)] font-bold">{log.port}</div>
                      <div className="text-[11px] text-[#D1D5DB] font-[family-name:var(--font-mono)]">{log.ata}</div>
                      <div className="text-[11px] text-[#D1D5DB] font-[family-name:var(--font-mono)]">{log.atd}</div>
                      <div className="text-[11px] text-[#9CA3AF] font-[family-name:var(--font-mono)] text-right">{log.dur}</div>
                    </div>
                  ))}
                </div>
              </TechCard>
            </div>
          )}

          {/* TAB: SANCTION LIST */}
          {activeTab === "Sanction List" && (
            <div className="max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Status KPI */}
                <div className="lg:col-span-1 flex flex-col gap-8">
                  <div className="bg-[#EF4444]/10 border border-[#EF4444]/30 rounded-xl p-8 flex flex-col items-center justify-center text-center shadow-[0_0_30px_rgba(239,68,68,0.1)] relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#EF4444]/20 blur-[50px] rounded-full translate-x-1/2 -translate-y-1/2" />
                    <ShieldAlert className="w-16 h-16 text-[#EF4444] mb-4" />
                    <h3 className="text-xl font-bold font-[family-name:var(--font-display)] text-white uppercase tracking-wider">Sanction Match</h3>
                    <p className="text-[#EF4444] font-[family-name:var(--font-mono)] text-sm mt-2">1 Entity Flagged</p>
                  </div>
                  
                  <TechCard title="Screening Databases">
                    <div className="flex flex-col gap-3">
                      {[
                        { name: "OFAC SDN List", status: "Clean", color: "bg-[#10B981]" },
                        { name: "UN Security Council", status: "Clean", color: "bg-[#10B981]" },
                        { name: "EU Consolidated", status: "Flagged", color: "bg-[#EF4444]", border: "border-[#EF4444]/50" },
                        { name: "UK HMT", status: "Clean", color: "bg-[#10B981]" }
                      ].map((db, i) => (
                        <div key={i} className={`flex items-center justify-between p-3 rounded bg-[#131820] border ${db.border || "border-[#1E2530]"}`}>
                          <span className="text-[12px] text-white font-[family-name:var(--font-display)]">{db.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-[#9CA3AF] uppercase font-bold">{db.status}</span>
                            <div className={`w-2 h-2 rounded-full ${db.color}`} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </TechCard>
                </div>

                {/* Match Details */}
                <div className="lg:col-span-2">
                  <TechCard title="Flagged Entities & Ownership Nexus">
                    <div className="bg-[#1A1E28] border border-[#2A3441] rounded-lg p-5 mb-6 relative overflow-hidden">
                      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#EF4444]" />
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="text-white font-bold font-[family-name:var(--font-display)] text-lg mb-1">GLOBAL SHIPMGMT LLC</h4>
                          <span className="text-[10px] bg-[#EF4444]/20 text-[#EF4444] px-2 py-0.5 rounded font-bold uppercase tracking-wider border border-[#EF4444]/30">Exact Match</span>
                        </div>
                        <span className="text-[11px] text-[#9CA3AF] font-[family-name:var(--font-mono)]">Matched: 2026-03-15</span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-[12px] bg-[#131820] p-4 rounded border border-[#1E2530]">
                        <div>
                          <span className="block text-[#6B7280] uppercase font-bold mb-1 text-[9px]">Relation</span>
                          <span className="text-[#D1D5DB]">Technical Manager</span>
                        </div>
                        <div>
                          <span className="block text-[#6B7280] uppercase font-bold mb-1 text-[9px]">Sanctioning Body</span>
                          <span className="text-white">European Union</span>
                        </div>
                        <div>
                          <span className="block text-[#6B7280] uppercase font-bold mb-1 text-[9px]">Program</span>
                          <span className="text-[#E67E22]">EU Russian Sanctions Framework</span>
                        </div>
                        <div>
                          <span className="block text-[#6B7280] uppercase font-bold mb-1 text-[9px]">Action</span>
                          <span className="text-[#D1D5DB]">Asset Freeze / Prohibition of Services</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-[#0F131A] border border-[#1E2530] border-dashed rounded text-[11px] text-[#9CA3AF]">
                      <span className="text-[#E67E22] font-bold block mb-1">RECOMMENDATION:</span>
                      Review commercial operating records and verify beneficial ownership chain. Any direct bunkering, transshipment, or port agent services involving GLOBAL SHIPMGMT LLC risk secondary sanctions exposure.
                    </div>
                  </TechCard>
                </div>
              </div>
            </div>
          )}

          {/* TAB: ACTIVITY REPORT */}
          {activeTab === "Activity Report" && (
            <div className="max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 grid grid-cols-1 gap-8">
              <TechCard title="Automated Behavioral Analysis (Last 30 Days)">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-[#1A1E28] p-5 rounded-lg border border-[#2A3441] flex flex-col">
                    <span className="text-[10px] text-[#6B7280] uppercase font-bold tracking-widest mb-2">AIS Consistency</span>
                    <span className="text-2xl text-[#10B981] font-[family-name:var(--font-display)] font-black">98.5%</span>
                    <span className="text-[11px] text-[#9CA3AF] mt-2">No unexplained transmission gaps &gt; 2 hours detected.</span>
                  </div>
                  <div className="bg-[#1A1E28] p-5 rounded-lg border border-[#2A3441] flex flex-col">
                    <span className="text-[10px] text-[#6B7280] uppercase font-bold tracking-widest mb-2">Dark Activities</span>
                    <span className="text-2xl text-white font-[family-name:var(--font-display)] font-black">0</span>
                    <span className="text-[11px] text-[#9CA3AF] mt-2">Zero suspected instances of active tracking manipulation.</span>
                  </div>
                  <div className="bg-[#EF4444]/10 p-5 rounded-lg border border-[#EF4444]/30 flex flex-col relative overflow-hidden">
                    <div className="absolute right-[-10px] bottom-[-10px]"><AlertCircle className="w-16 h-16 text-[#EF4444]/20" /></div>
                    <span className="text-[10px] text-[#EF4444] uppercase font-bold tracking-widest mb-2 z-10">Risk Profile Status</span>
                    <span className="text-2xl text-[#EF4444] font-[family-name:var(--font-display)] font-black z-10">ELEVATED</span>
                    <span className="text-[11px] text-[#EF4444]/80 mt-2 z-10">Due to secondary sanction nexus.</span>
                  </div>
                </div>

                <div className="prose prose-invert max-w-none text-[13px] text-[#D1D5DB]">
                  <h4 className="text-white font-[family-name:var(--font-display)] mb-2 uppercase tracking-wide border-b border-[#2A3441] pb-2">Voyage Narrative</h4>
                  <p className="mb-4">
                    The vessel has primarily operated within the South East Asian maritime corridor over the past 30 days. Operations appear normal for a bulk carrier of its class, alternating between anchorages in Singapore and discharge ports in Malaysia and Indonesia.
                  </p>
                  <p className="mb-4">
                    The vessel recorded a consistent speed profile outside of designated slowdown areas (e.g. Traffic Separation Schemes). Average underway speed documented at 11.4 knots. Fuel efficiency routing was observed during transit across the Java Sea.
                  </p>
                  
                  <h4 className="text-white font-[family-name:var(--font-display)] mb-2 mt-6 uppercase tracking-wide border-b border-[#2A3441] pb-2">Anomalies Detected</h4>
                  <ul className="list-disc pl-5 mt-2 space-y-2 text-[#9CA3AF]">
                    <li>Minor trajectory deviation detected near Singapore Strait (Likely due to heavy traffic density avoidance), resolved within 45 minutes.</li>
                    <li>Port calls matched filed declarations across all identified port sectors.</li>
                    <li>No Ship-to-Ship (STS) transfer signatures or slow-speed loitering in open waters suspected.</li>
                  </ul>
                </div>
              </TechCard>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
