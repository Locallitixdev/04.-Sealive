"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import { ChevronLeft, ChevronRight, Star, FileText, Info, Play, Navigation, AlertTriangle, ShieldAlert, ShieldCheck, Eye, Shield } from "lucide-react";
import { MOCK_VESSEL_GEOJSON } from "@/components/map/MapView";

const MapView = dynamic(() => import("@/components/map/MapView"), { ssr: false, loading: () => <div className="w-full h-full bg-[#0C1015] flex items-center justify-center text-[#6B7280] text-[10px] font-mono tracking-widest uppercase">Loading Map Engine...</div> });

// Map GEOJSON features dynamically so we can lookup the vessel
const VESSELS = MOCK_VESSEL_GEOJSON.features.map((f: any, i: number) => ({
  ...f.properties,
  riskStatus: (i === 1 || i === 4) ? "BLACKLISTED" : (i === 3) ? "WATCHLIST" : "NORMAL",
  coordinates: f.geometry.coordinates,
}));

function InfoCard({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-[#131820] border border-[#2A3441] rounded-lg overflow-hidden flex flex-col">
      <div className="h-12 border-b border-[#2A3441] flex items-center justify-between px-5 bg-[#171C26]">
        <div className="flex items-center gap-2">
          <h3 className="text-[13px] font-bold text-white tracking-wide font-[family-name:var(--font-display)]">{title}</h3>
        </div>
        {action ? action : <Info className="w-4 h-4 text-[#6B7280] cursor-pointer hover:text-[#D1D5DB]" />}
      </div>
      <div className="p-5 flex-1 bg-[#131820]">{children}</div>
    </div>
  );
}

export default function VesselDetailPage() {
  const params = useParams();
  const idStr = params?.id as string;
  
  // Lookup vessel by ID, fallback to mock data
  const vessel = useMemo(() => {
    const found = VESSELS.find((v) => v.id === idStr);
    if (found) return found;
    // Fallback Mock (like SANTARLI)
    return {
      id: "fallback",
      name: "SANTARLI",
      flag: "🇵🇦",
      flagName: "Panama",
      imo: "9207443",
      mmsi: "371111000",
      type: "Cargo",
      status: "Under Way Using Engine",
      speed: 9,
      heading: 11,
      lastUpdate: "2026-04-09 13:10:41 UTC+7",
    };
  }, [idStr]);

  const flagEmoji = vessel.flag?.length === 2 ? vessel.flag : "🇵🇦"; // Real parser would be used in prod
  const flagText = vessel.flagName || (vessel.flag === "ID" ? "Indonesia" : "Panama");
  const [riskStatus, setRiskStatus] = useState(vessel.riskStatus || "NORMAL");
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [activeTab, setActiveTab] = useState("Overview");

  // Sync state if vessel changes externally
  React.useEffect(() => {
    setRiskStatus(vessel.riskStatus || "NORMAL");
  }, [vessel.riskStatus]);

  const StatusConfig = {
    NORMAL: { color: "text-[#10B981]", border: "border-[#059669]/40", bg: "bg-[#059669]/20", icon: Shield, label: "Normal" },
    WATCHLIST: { color: "text-[#E67E22]", border: "border-[#E67E22]/40", bg: "bg-[#E67E22]/20", icon: Eye, label: "Watchlist" },
    BLACKLISTED: { color: "text-[#EF4444]", border: "border-[#EF4444]/40", bg: "bg-[#EF4444]/20", icon: ShieldAlert, label: "Blacklisted" },
    WHITELISTED: { color: "text-[#3B82F6]", border: "border-[#3B82F6]/40", bg: "bg-[#3B82F6]/20", icon: ShieldCheck, label: "Whitelisted" },
  } as Record<string, any>;

  const currentStatusNode = StatusConfig[riskStatus];
  const CurrentIcon = currentStatusNode.icon;

  return (
    <div className="h-[calc(100vh-56px)] flex flex-col overflow-hidden bg-[#0C1015] selection:bg-[#E67E22]/30">
      
      {/* Top Header */}
      <div className="h-[52px] border-b border-[#2A3441] bg-[#10141C] flex items-center justify-between px-6 shrink-0 z-10 sticky top-0">
        <div className="flex items-center gap-3">
          <span className="text-xl leading-none" title={flagText}>{flagEmoji}</span>
          <h1 className="text-[15px] font-bold uppercase tracking-widest text-[#F8FAFC] font-[family-name:var(--font-display)] drop-shadow-sm flex items-center gap-3">
            {vessel.name || "SANTARLI"}
            
            {/* Risk Status Badge */}
            <span className={`px-2 py-0.5 rounded-sm text-[9px] flex items-center gap-1.5 border font-[family-name:var(--font-mono)] transition-colors ${currentStatusNode.bg} ${currentStatusNode.border} ${currentStatusNode.color}`}>
              <CurrentIcon className="w-2.5 h-2.5" />
              {currentStatusNode.label}
            </span>
          </h1>
        </div>
        <div className="flex items-center gap-6">
          <span className="text-[10px] text-[#6B7280] font-[family-name:var(--font-mono)] italic tracking-wider">
            Last Update: <span className="text-[#9CA3AF] not-italic ml-1">{vessel.lastUpdate || "2026-04-09 13:10:41 UTC+7"}</span>
          </span>
          <div className="flex gap-2 relative">
            
            {/* Custom Change Status Dropdown/Button */}
            <div className="relative">
              <button 
                onClick={() => setShowStatusMenu(!showStatusMenu)}
                className={`flex items-center gap-1.5 px-3 py-1.5 hover:bg-[#2A3441] border rounded shadow-sm text-[10px] uppercase font-bold transition-colors btn-press ${showStatusMenu ? 'bg-[#2A3441] border-[#E67E22]/50 text-white' : 'bg-[#1A1E28] border-[#2A3441] text-[#D1D5DB]'}`}
              >
                Set Risk Status
              </button>
              
              {showStatusMenu && (
                <div className="absolute top-full mt-1.5 right-0 w-36 bg-[#131820] border border-[#2A3441] rounded shadow-xl overflow-hidden z-50 animate-in slide-in-from-top-2 fade-in duration-200">
                  {Object.keys(StatusConfig).map((key) => {
                    const cfg = StatusConfig[key];
                    const Icon = cfg.icon;
                    return (
                      <button 
                        key={key} 
                        onClick={() => { setRiskStatus(key); setShowStatusMenu(false); }}
                        className={`w-full text-left px-3 py-2 text-[10px] uppercase font-bold tracking-wider flex items-center gap-2 hover:bg-[#1A1E28] transition-colors ${riskStatus === key ? cfg.color : 'text-[#9CA3AF]'}`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        {cfg.label}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1A1E28] hover:bg-[#2A3441] border border-[#2A3441] rounded shadow-sm text-[#D1D5DB] hover:text-white text-[10px] uppercase font-bold transition-colors btn-press">
              <Star className="w-3.5 h-3.5" /> Fleet
            </button>
            <Link href="/map" className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1A1E28] hover:bg-[#2A3441] border border-[#2A3441] rounded shadow-sm text-white text-[10px] uppercase font-bold transition-colors ml-4 btn-press">
              <ChevronLeft className="w-3.5 h-3.5" /> Back
            </Link>
          </div>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex items-center px-6 py-2 border-b border-[#2A3441] bg-[#10141C] shrink-0 overflow-x-auto no-scrollbar gap-2">
        {["Overview", "Portcall Log", "Sanction List", "Database", "Activity Report"].map((tab) => (
          <button 
             key={tab} 
             onClick={() => setActiveTab(tab)}
             className={`px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider rounded-lg transition-all duration-200 whitespace-nowrap btn-press
               ${activeTab === tab ? "bg-[#E67E22]/15 text-[#E67E22] border border-[#E67E22]/30 shadow-[0_0_12px_rgba(230,126,34,0.1)]" : "text-[#6B7280] hover:text-[#D1D5DB] hover:bg-[#1A1E28] border border-transparent"}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Scrollable Main Content */}
      <div className="flex-1 overflow-y-auto bg-[#0C1015]">
        <div className="p-6 md:p-8">
          
          {/* TAB: OVERVIEW */}
          {activeTab === "Overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-[1500px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              {/* === LEFT COLUMN === */}
              <div className="lg:col-span-5 flex flex-col gap-6">
              
              {/* Summary */}
              <InfoCard 
                title="Summary" 
                action={
                  <span className="flex items-center gap-2 text-[9px] uppercase font-bold tracking-wider bg-[#1A1E28]/80 hover:bg-[#2A3441] cursor-pointer transition-colors px-2.5 py-1 rounded-sm text-[#D1D5DB] border border-[#2A3441]">
                    <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-[#8B5CF6] via-[#E67E22] to-[#10B981] animate-spin-slow shadow-[0_0_8px_rgba(139,92,246,0.5)]" />
                    More With GlassAI
                  </span>
                }
              >
                <div className="text-[11px] text-[#D1D5DB] space-y-5 leading-relaxed font-[family-name:var(--font-mono)]">
                  <p>
                    <span className="text-[#6B7280] block mb-1 font-[family-name:var(--font-display)] tracking-wide font-normal">Where is the ship currently located?</span>
                    The <strong>{vessel.type || "Cargo"}</strong> <strong className="text-white text-[12px]">{vessel.name}</strong> is currently reported to be in <span className="text-[#E67E22] border-b border-[#E67E22]/50 cursor-pointer">Sulawesi Sea west</span>, with the latest update recorded <strong className="text-white text-[12px]">12 minutes ago</strong>.
                  </p>
                  <div className="w-12 h-px bg-[#2A3441]" />
                  <p>
                    <span className="text-[#6B7280] block mb-1 font-[family-name:var(--font-display)] tracking-wide font-normal">What are the details about this ship?</span>
                    The <strong className="text-white text-[12px]">{vessel.name}</strong>, <strong>{vessel.status}</strong> under the flag of <strong className="text-white text-[12px]">{flagText}</strong>. The vessel has an overall length (LOA) of 225 meters and a width of 32 meters. With its current reported draught is 14 meters.
                  </p>
                </div>
              </InfoCard>

              {/* General Specs */}
              <InfoCard title="General">
                <div className="mb-5 rounded border border-[#2A3441] overflow-hidden h-[180px] relative group cursor-pointer bg-black">
                  <img src="https://images.unsplash.com/photo-1572097561858-a5b591b65e9f?q=80&w=600&auto=format&fit=crop" 
                       className="w-full h-full object-cover grayscale brightness-50 group-hover:grayscale-0 group-hover:brightness-90 transition-all duration-700 hover:scale-105" alt="Vessel Photo" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-2 right-2 text-[9px] text-white/50 font-[family-name:var(--font-mono)]">
                    Ref image
                  </div>
                </div>
                
                <div className="grid grid-cols-[130px_1fr] gap-y-3.5 text-[11px] items-center">
                  <div className="text-[#6B7280] font-[family-name:var(--font-display)] font-medium">Name</div>
                  <div className="text-white font-[family-name:var(--font-mono)]">{vessel.name}</div>
                  
                  <div className="text-[#6B7280] font-[family-name:var(--font-display)] font-medium">Flag</div>
                  <div className="text-white font-[family-name:var(--font-mono)]">{flagText}</div>
                  
                  <div className="text-[#6B7280] font-[family-name:var(--font-display)] font-medium">IMO</div>
                  <div className="text-white font-[family-name:var(--font-mono)]">{vessel.imo || "9207443"}</div>
                  
                  <div className="text-[#6B7280] font-[family-name:var(--font-display)] font-medium">MMSI</div>
                  <div className="text-white font-[family-name:var(--font-mono)]">{vessel.mmsi || "371111000"}</div>

                  <div className="text-[#6B7280] font-[family-name:var(--font-display)] font-medium">Risk Status</div>
                  <div className={`font-[family-name:var(--font-mono)] uppercase font-bold tracking-wider ${currentStatusNode.color}`}>
                    {currentStatusNode.label}
                  </div>
                  
                  <div className="border-t border-[#2A3441] col-span-2 my-0.5" />
                  
                  <div className="text-[#6B7280] font-[family-name:var(--font-display)] font-medium">Call Sign</div>
                  <div className="text-white font-[family-name:var(--font-mono)]">3EFE2</div>
                  
                  <div className="text-[#6B7280] font-[family-name:var(--font-display)] font-medium">Build Year</div>
                  <div className="text-white font-[family-name:var(--font-mono)]">2000</div>
                  
                  <div className="text-[#6B7280] font-[family-name:var(--font-display)] font-medium">Size</div>
                  <div className="text-white font-[family-name:var(--font-mono)]">225 x 32 m</div>
                  
                  <div className="text-[#6B7280] font-[family-name:var(--font-display)] font-medium">Tonnage</div>
                  <div className="text-white font-[family-name:var(--font-mono)]">38889 t (Gross)</div>
                </div>
              </InfoCard>
              
              {/* AIS Information */}
              <InfoCard title="AIS Information">
                <div className="grid grid-cols-[140px_1fr] gap-y-4 text-[11px] items-center">
                  <div className="text-[#6B7280] font-[family-name:var(--font-display)] font-medium">Navigational Status</div>
                  <div className="text-white font-[family-name:var(--font-mono)]">{vessel.status}</div>
                  
                  <div className="text-[#6B7280] font-[family-name:var(--font-display)] font-medium">Position Received</div>
                  <div className="text-white font-[family-name:var(--font-mono)] font-bold">12 minutes ago</div>
                  
                  <div className="text-[#6B7280] font-[family-name:var(--font-display)] font-medium">Latitude/Longitude</div>
                  <div className="text-[#E67E22] font-[family-name:var(--font-mono)] leading-5 cursor-pointer hover:underline underline-offset-2">
                    {vessel.coordinates?.[1] || 3.181666634} /<br/>{vessel.coordinates?.[0] || 119.48833333}
                  </div>
                  
                  <div className="border-t border-[#2A3441] col-span-2 my-0.5" />
                  
                  <div className="text-[#6B7280] font-[family-name:var(--font-display)] font-medium">Speed</div>
                  <div className="text-white font-[family-name:var(--font-mono)]">{vessel.speed || 9} kn</div>
                  
                  <div className="text-[#6B7280] font-[family-name:var(--font-display)] font-medium">Course</div>
                  <div className="text-white font-[family-name:var(--font-mono)]">{vessel.heading || 11}°</div>
                  
                  <div className="text-[#6B7280] font-[family-name:var(--font-display)] font-medium">Draught</div>
                  <div className="text-white font-[family-name:var(--font-mono)]">14 m</div>
                  
                  <div className="border-t border-[#2A3441] col-span-2 my-0.5" />
                  
                  <div className="text-[#6B7280] font-[family-name:var(--font-display)] font-medium">Destination</div>
                  <div className="text-white font-[family-name:var(--font-mono)]">HUILAI/CN</div>
                  
                  <div className="text-[#6B7280] font-[family-name:var(--font-display)] font-medium leading-tight">Estimation time of<br/>arrival</div>
                  <div className="text-white font-[family-name:var(--font-mono)]">-</div>
                  
                  <div className="text-[#6B7280] font-[family-name:var(--font-display)] font-medium">AIS Source</div>
                  <div className="text-white font-[family-name:var(--font-mono)]">S-AIS</div>
                </div>
              </InfoCard>
            </div>

            {/* === RIGHT COLUMN === */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              
              {/* Map View Widget */}
              <div className="bg-[#131820] border border-[#2A3441] rounded-lg overflow-hidden flex flex-col h-[420px] shadow-lg">
                <div className="flex-1 relative bg-black">
                  <MapView selectedVesselId={idStr} layerVisibility={{ vessels: true, "vessel-labels": true, "shipping-routes": true }} />
                  
                  <div className="absolute top-4 left-4 z-10">
                     <Link href="/map" className="flex items-center gap-1.5 bg-[#10141C]/90 backdrop-blur border border-[#E67E22] px-3 py-2 rounded text-[#E67E22] text-[10px] uppercase font-bold tracking-wider shadow-lg hover:bg-[#E67E22] border-opacity-60 hover:text-white transition-all duration-300 btn-press group">
                       <Play className="w-3.5 h-3.5 fill-current group-hover:scale-110 transition-transform" /> Enter Live Tracking Mode
                     </Link>
                  </div>
                </div>
                
                {/* Progress UI */}
                <div className="p-6 bg-[#131820] border-t border-[#2A3441]">
                  <div className="flex justify-between text-[10px] text-[#6B7280] mb-0.5 font-[family-name:var(--font-display)] uppercase">
                    <span>Departure</span>
                    <span>Destination</span>
                  </div>
                  <div className="flex justify-between text-sm text-[#F8FAFC] font-bold font-[family-name:var(--font-mono)]">
                    <span>-</span>
                    <span className="tracking-widest">HUILAI/CN</span>
                  </div>
                  
                  <div className="relative h-[3px] bg-[#1E252F] rounded-full mt-6 mb-3">
                     <div className="absolute left-0 top-0 h-full bg-[#E67E22] rounded-full" style={{ width: '30%' }} />
                     
                     {/* Depart bubble */}
                     <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2">
                       <div className="w-2.5 h-2.5 rounded-full border-2 border-[#E67E22] bg-[#131820]" />
                     </div>
                     
                     {/* Ship current pos */}
                     <div className="absolute top-1/2 -translate-y-1/2 left-[30%]">
                       <Navigation className="w-4 h-4 text-[#E67E22] rotate-[90deg] -translate-x-1/2 -translate-y-[2px] drop-shadow-[0_0_8px_rgba(230,126,34,1)]" />
                     </div>
                     
                     {/* Destination bubble */}
                     <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2">
                       <div className="w-3.5 h-3.5 rounded-full border border-[#4A5568] bg-[#131820] flex items-center justify-center">
                         <div className="w-1 h-1 bg-[#4A5568] rounded-full" />
                       </div>
                     </div>
                  </div>
                  
                  <div className="flex justify-between text-[10px] text-[#9CA3AF] font-[family-name:var(--font-mono)] mt-2">
                     <span>ETD: -</span>
                     <span>ETA: -</span>
                  </div>
                </div>
              </div>

              {/* Risk Score */}
              <InfoCard 
                 title="Risk Score" 
                 action={
                   <span className="bg-[#059669]/20 text-[#10B981] px-2.5 py-1 rounded-sm text-[10px] font-bold flex items-center gap-1 border border-[#059669]/40 font-[family-name:var(--font-mono)]">
                     <span className="text-[12px] leading-none mb-[2px]">↑</span> Infinity%
                   </span>
                 }
              >
                 <div className="flex items-center gap-8 py-2">
                    {/* Ring Chart */}
                    <div className="relative w-[110px] h-[110px] flex items-center justify-center shrink-0">
                       <svg className="w-full h-full -rotate-90">
                         <circle cx="55" cy="55" r="45" stroke="#1E252F" strokeWidth="10" fill="none" />
                         <circle cx="55" cy="55" r="45" stroke="#EF4444" strokeWidth="10" fill="none" strokeDasharray="283" strokeDashoffset="195" strokeLinecap="round" className="drop-shadow-[0_0_6px_rgba(239,68,68,0.5)]" />
                       </svg>
                       <div className="absolute inset-0 flex items-center justify-center">
                         <span className="text-xl font-bold text-white font-[family-name:var(--font-mono)] mt-1">
                           31.30
                         </span>
                       </div>
                    </div>
                    
                    {/* Line Chart Area */}
                    <div className="flex-1 flex flex-col justify-end relative h-[100px] border-l border-[#2A3441] pl-6 pb-4">
                       <div className="absolute left-4 top-0 bottom-4 flex flex-col justify-between text-[9px] text-[#6B7280] font-[family-name:var(--font-mono)] items-end">
                         <span>100</span>
                         <span>50</span>
                         <span>0</span>
                       </div>
                       
                       <div className="flex-1 w-full relative border-b border-[#2A3441]">
                          <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
                             {/* Line that jumps to 30 then stays jagged around there */}
                             <path d="M0,98 L2,98 L8,98 L10,65 L12,70 L14,68 L16,71 L18,65 L20,70 L22,66 L24,71 L26,65 L28,70 L30,67 L32,72 L34,65 L36,70 L38,68 L40,71 L42,65 L44,70 L46,67 L48,72 L50,65 L52,70 L54,68 L56,71 L58,65 L60,70 L62,67 L64,72 L66,65 L68,70 L70,68 L72,71 L74,65 L76,70 L78,67 L80,72 L82,65 L84,70 L86,68 L88,71 L90,65 L92,70 L94,67 L96,72 L98,65 L100,70" 
                                   fill="none" stroke="#E67E22" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
                          </svg>
                       </div>
                       
                       <div className="flex justify-between text-[9px] text-[#6B7280] font-[family-name:var(--font-mono)] mt-2">
                         <span>2026</span>
                         <span>2026</span>
                       </div>
                    </div>
                 </div>
              </InfoCard>
              
               <InfoCard title="Anomaly List">
                 <div className="py-6 flex items-center justify-center">
                    <p className="text-[11px] text-[#6B7280] font-[family-name:var(--font-display)] uppercase tracking-wider flex items-center gap-2">
                       {riskStatus === "BLACKLISTED" ? (
                         <><AlertTriangle className="w-3.5 h-3.5 text-[#EF4444]" /> Vessel listed in unauthorized operating zones and EEZ intrusion.</>
                       ) : (
                         <><ShieldCheck className="w-3.5 h-3.5 text-[#10B981] opacity-50" /> No anomalies detected for the selected period</>
                       )}
                    </p>
                 </div>
               </InfoCard>

            </div>
          </div>
          )}

          {/* TAB: PORTCALL LOG */}
          {activeTab === "Portcall Log" && (
            <div className="max-w-[1500px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
               <InfoCard 
                 title="Portcall History" 
                 action={<button className="px-3 py-1 bg-[#1A1E28] border border-[#2A3441] rounded shadow-sm text-white text-[10px] uppercase font-bold hover:bg-[#2A3441] transition-colors">Export CSV</button>}
               >
                  <table className="w-full text-left border-collapse mt-2">
                    <thead className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider font-[family-name:var(--font-display)] border-b border-[#2A3441]">
                      <tr>
                        <th className="py-3 px-4">Port Name</th>
                        <th className="py-3 px-4">Country</th>
                        <th className="py-3 px-4">Arrival</th>
                        <th className="py-3 px-4">Departure</th>
                        <th className="py-3 px-4">Time In Port</th>
                      </tr>
                    </thead>
                    <tbody className="text-[11px] text-[#D1D5DB] font-[family-name:var(--font-mono)]">
                       <tr className="border-b border-[#2A3441]/50 hover:bg-[#1A1E28] transition-colors">
                          <td className="py-4 px-4 font-bold text-white font-[family-name:var(--font-display)] tracking-wide">HUILAI, CN</td>
                          <td className="py-4 px-4">China (CN)</td>
                          <td className="py-4 px-4">2026-04-01 10:15</td>
                          <td className="py-4 px-4">2026-04-03 14:30</td>
                          <td className="py-4 px-4">2 Days, 4 Hrs</td>
                       </tr>
                       <tr className="border-b border-[#2A3441]/50 hover:bg-[#1A1E28] transition-colors">
                          <td className="py-4 px-4 font-bold text-white font-[family-name:var(--font-display)] tracking-wide">MANILA, PH</td>
                          <td className="py-4 px-4">Philippines (PH)</td>
                          <td className="py-4 px-4">2026-03-24 08:20</td>
                          <td className="py-4 px-4">2026-03-26 18:00</td>
                          <td className="py-4 px-4">2 Days, 9 Hrs</td>
                       </tr>
                       <tr className="hover:bg-[#1A1E28] transition-colors">
                          <td className="py-4 px-4 font-bold text-white font-[family-name:var(--font-display)] tracking-wide">TANJUNG PERAK, ID</td>
                          <td className="py-4 px-4">Indonesia (ID)</td>
                          <td className="py-4 px-4">2026-03-10 09:00</td>
                          <td className="py-4 px-4">2026-03-15 11:15</td>
                          <td className="py-4 px-4 text-[#E67E22] font-bold">5 Days, 2 Hrs</td>
                       </tr>
                    </tbody>
                  </table>
               </InfoCard>
            </div>
          )}

          {/* TAB: SANCTION LIST (Compliance & Certificates) */}
          {activeTab === "Sanction List" && (
            <div className="max-w-[1500px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col gap-6">
               
               {/* Original Risk Analysis Summary */}
               <div className={`border ${riskStatus === 'BLACKLISTED' ? 'border-[#EF4444]/30 bg-[#EF4444]/10' : 'border-[#10B981]/30 bg-[#10B981]/5'} rounded-lg p-4 flex gap-6 items-center`}>
                  <div className="shrink-0">
                     {riskStatus === "BLACKLISTED" ? (
                       <ShieldAlert className="w-8 h-8 text-[#EF4444]" />
                     ) : (
                       <ShieldCheck className="w-8 h-8 text-[#10B981]" />
                     )}
                  </div>
                  <div>
                     <h4 className={`text-sm font-[family-name:var(--font-display)] font-bold mb-1 ${riskStatus === 'BLACKLISTED' ? 'text-[#EF4444]' : 'text-[#10B981]'}`}>
                       {riskStatus === "BLACKLISTED" ? "High Compliance Risk (Sanctioned / Blacklisted)" : "Clear for Operation (No Sanctions Found)"}
                     </h4>
                     <p className="text-[#D1D5DB] text-[11px] font-[family-name:var(--font-mono)]">
                       {riskStatus === "BLACKLISTED" ? 
                         "Vessel listed in internal blocklist due to unauthorized operations. Compliance certificates and statutory documents below may be revoked or under investigation." : 
                         "Cross-referenced against global OFAC, UN, and EU sanction lists. Statutory certificates and ISM documentation indicate normal operational status."}
                     </p>
                  </div>
               </div>

               {/* ISM Company Section */}
               <InfoCard title="ISM Company">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-4 text-[10px] px-2 py-1">
                     <div className="space-y-4">
                       <div className="flex border-b border-[#2A3441] pb-2"><span className="w-[100px] text-[#6B7280]">IMO Number</span><span className="text-white font-[family-name:var(--font-mono)]">282174</span></div>
                       <div className="flex border-b border-[#2A3441] pb-2"><span className="w-[100px] text-[#6B7280]">Name</span><span className="text-white uppercase font-bold tracking-wider font-[family-name:var(--font-display)]">SHIKISHIMA KISEN KK</span></div>
                     </div>
                     <div className="space-y-4">
                       <div className="flex border-b border-[#2A3441] pb-2"><span className="w-[80px] text-[#6B7280]">Address</span><span className="text-[#D1D5DB]">1618-1, Kinoura, Hakata-cho, Imabari-shi,</span></div>
                       <div className="flex border-b border-[#2A3441] pb-2"><span className="w-[80px] text-[#6B7280]">City</span><span className="text-[#D1D5DB]">Ehime-ken, 794-2305</span></div>
                     </div>
                     <div className="space-y-4">
                       <div className="flex border-b border-[#2A3441] pb-2"><span className="w-[80px] text-[#6B7280]">Fax</span><span className="text-[#6B7280]">-</span></div>
                       <div className="flex border-b border-[#2A3441] pb-2"><span className="w-[80px] text-[#6B7280]">Phone</span><span className="text-[#6B7280]">-</span></div>
                     </div>
                  </div>
               </InfoCard>

               {/* Class Certificates */}
               <InfoCard title="Class Certificates">
                 <div className="overflow-x-auto border border-[#2A3441] rounded">
                    <table className="w-full text-left text-[10px] font-[family-name:var(--font-mono)] whitespace-nowrap">
                       <thead className="bg-[#1A1E28]">
                         <tr>
                           <th className="p-3 border-b border-[#2A3441] text-white font-bold w-1/3 text-center font-[family-name:var(--font-display)]">Class Certificate</th>
                           <th className="p-3 border-b border-[#2A3441] text-white font-bold w-1/3 text-center font-[family-name:var(--font-display)]">Issue Date</th>
                           <th className="p-3 border-b border-[#2A3441] text-white font-bold w-1/3 text-center font-[family-name:var(--font-display)]">Expiry Date</th>
                         </tr>
                       </thead>
                       <tbody>
                         <tr className="bg-[#131820] hover:bg-[#1A1E28] transition-colors">
                           <td className="p-3 text-[#D1D5DB] text-center">NKK</td>
                           <td className="p-3 text-white text-center">Sat, 15 Mar 2025</td>
                           <td className="p-3 text-white text-center">Sat, 27 Apr 2030</td>
                         </tr>
                       </tbody>
                    </table>
                 </div>
               </InfoCard>
               
               {/* Statutory Certificates */}
               <InfoCard 
                 title="Statutory Certificates" 
                 action={
                   <div className="flex items-center gap-4 text-[10px] font-[family-name:var(--font-mono)]">
                      <span className="text-[#0EA5E9] font-bold">75 Statutories</span>
                      <div className="flex items-center gap-2 text-[#9CA3AF]">
                        <button className="w-5 h-5 bg-[#1A1E28] rounded border border-[#2A3441] flex items-center justify-center hover:text-white transition-colors">«</button>
                        <button className="w-5 h-5 bg-[#1A1E28] rounded border border-[#2A3441] flex items-center justify-center hover:text-white transition-colors">‹</button>
                        <span>Page 1 / 8</span>
                        <button className="w-5 h-5 bg-[#1A1E28] rounded border border-[#2A3441] flex items-center justify-center hover:text-white transition-colors">›</button>
                        <button className="w-5 h-5 bg-[#1A1E28] rounded border border-[#2A3441] flex items-center justify-center hover:text-white transition-colors">»</button>
                      </div>
                   </div>
                 }
               >
                  <div className="overflow-x-auto border border-[#2A3441] rounded">
                    <table className="w-full text-left text-[10px] font-[family-name:var(--font-mono)] whitespace-nowrap">
                       <thead className="bg-[#1A1E28]">
                         <tr>
                           <th className="p-3 border-b border-[#2A3441] text-white font-bold font-[family-name:var(--font-display)]">Statutory Certificate</th>
                           <th className="p-3 border-b border-[#2A3441] text-white font-bold font-[family-name:var(--font-display)]">Issuing Authority</th>
                           <th className="p-3 border-b border-[#2A3441] text-white font-bold font-[family-name:var(--font-display)]">Issue Date</th>
                           <th className="p-3 border-b border-[#2A3441] text-white font-bold font-[family-name:var(--font-display)] text-center">Expiry Date</th>
                           <th className="p-3 border-b border-[#2A3441] text-white font-bold font-[family-name:var(--font-display)] text-center">Surveying Authority</th>
                           <th className="p-3 border-b border-[#2A3441] text-white font-bold font-[family-name:var(--font-display)] text-center">Last Survey Date</th>
                           <th className="p-3 border-b border-[#2A3441] text-white font-bold font-[family-name:var(--font-display)] text-center">Last Survey Place</th>
                         </tr>
                       </thead>
                       <tbody className="divide-y divide-[#2A3441]/50 text-[#D1D5DB]">
                         {[
                           { cert: "Minimum Safe Manning Document", auth: "Panama", issue: "Tue, 23 Mar 2010", exp: "-", survAuth: "-", lastSurv: "-", place: "-" },
                           { cert: "Minimum Safe Manning Document", auth: "Panama Marine Survey and Certificatio...", issue: "Tue, 23 Mar 2010", exp: "-", survAuth: "-", lastSurv: "-", place: "-" },
                           { cert: "International Anti-Fouling System", auth: "Nippon Kaiji Kyokai", issue: "Wed, 28 Apr 2010", exp: "-", survAuth: "-", lastSurv: "-", place: "-" },
                           { cert: "International Anti-Fouling System", auth: "Nippon Kaiji Kyokai", issue: "Wed, 28 Apr 2010", exp: "-", survAuth: "-", lastSurv: "-", place: "-" },
                           { cert: "International Anti-Fouling System", auth: "Nippon Kaiji Kyokai", issue: "Wed, 28 Apr 2010", exp: "-", survAuth: "-", lastSurv: "-", place: "-" },
                           { cert: "International Anti-Fouling System", auth: "Nippon Kaiji Kyokai", issue: "Wed, 28 Apr 2010", exp: "-", survAuth: "-", lastSurv: "-", place: "-" },
                           { cert: "International Anti-Fouling System", auth: "Nippon Kaiji Kyokai", issue: "Wed, 28 Apr 2010", exp: "-", survAuth: "-", lastSurv: "-", place: "-" },
                           { cert: "Cargo Ship Safety Construction", auth: "Nippon Kaiji Kyokai", issue: "Thu, 01 Jul 2010", exp: "Mon, 27 Apr 2015", survAuth: "Nippon Kaiji Kyokai", lastSurv: "Fri, 01 Jun 2012", place: "INDIA" },
                           { cert: "Cargo Ship Safety Radio", auth: "Nippon Kaiji Kyokai", issue: "Thu, 01 Jul 2010", exp: "Mon, 27 Apr 2015", survAuth: "-", lastSurv: "-", place: "-" },
                           { cert: "Load Line", auth: "Nippon Kaiji Kyokai", issue: "Thu, 01 Jul 2010", exp: "Mon, 27 Apr 2015", survAuth: "Nippon Kaiji Kyokai", lastSurv: "Sat, 20 Jul 2013", place: "LONGKOU, CHINA" },
                         ].map((c, i) => (
                           <tr key={i} className="bg-[#131820] hover:bg-[#1A1E28] transition-colors h-11">
                             <td className="px-4 text-white font-[family-name:var(--font-display)] truncate max-w-[200px]">{c.cert}</td>
                             <td className="px-4 font-[family-name:var(--font-display)] truncate max-w-[200px]">{c.auth}</td>
                             <td className="px-4">{c.issue}</td>
                             <td className="px-4 text-center">{c.exp}</td>
                             <td className="px-4 text-center font-[family-name:var(--font-display)] truncate max-w-[150px]">{c.survAuth}</td>
                             <td className="px-4 text-center">{c.lastSurv}</td>
                             <td className="px-4 font-[family-name:var(--font-display)] uppercase text-center">{c.place}</td>
                           </tr>
                         ))}
                       </tbody>
                    </table>
                  </div>
               </InfoCard>
            </div>
          )}

          {/* TAB: DATABASE */}
          {activeTab === "Database" && (
            <div className="max-w-[1500px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-1 xl:grid-cols-[380px_1fr] gap-6">
                
                {/* LEFT: Photos & Dimension */}
                <div className="flex flex-col gap-6">
                  <InfoCard title="Photographs">
                    <div className="relative w-full aspect-[4/5] bg-[#1A1E28] rounded overflow-hidden mt-3 group border border-[#2A3441]">
                       <img 
                         src="https://images.unsplash.com/photo-1559828836-e0e6b5272a08?auto=format&fit=crop&q=80&w=400&h=533" 
                         alt="Vessel" 
                         className="object-cover w-full h-full opacity-85 group-hover:opacity-100 transition-opacity" 
                       />
                       <div className="absolute bottom-0 left-0 right-0 bg-[#0C1015]/90 border-t border-[#2A3441] p-2.5 flex items-center justify-between text-[10px] text-white font-[family-name:var(--font-mono)]">
                          <span>1 of 1</span>
                          <span className="w-1.5 h-1.5 rounded-full bg-[#E67E22]" />
                          <div className="flex gap-3 text-[#6B7280]">
                            <button className="hover:text-[#E67E22] transition-colors"><ChevronLeft className="w-3.5 h-3.5" /></button>
                            <button className="hover:text-[#E67E22] transition-colors"><ChevronRight className="w-3.5 h-3.5" /></button>
                          </div>
                       </div>
                    </div>
                  </InfoCard>

                  <InfoCard title="Dimension">
                    <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-[11px] mt-3">
                      <div className="text-[#6B7280] font-[family-name:var(--font-display)]">Length Overall (LOA)</div>
                      <div className="text-white text-right font-[family-name:var(--font-mono)]">225.00 m</div>
                      
                      <div className="text-[#6B7280] font-[family-name:var(--font-display)]">Beam</div>
                      <div className="text-white text-right font-[family-name:var(--font-mono)]">32.26 m</div>

                      <div className="text-[#6B7280] font-[family-name:var(--font-display)]">Draft (Summer)</div>
                      <div className="text-white text-right font-[family-name:var(--font-mono)]">14.20 m</div>

                      <div className="text-[#6B7280] font-[family-name:var(--font-display)]">Depth</div>
                      <div className="text-white text-right font-[family-name:var(--font-mono)]">19.50 m</div>

                      <div className="text-[#6B7280] font-[family-name:var(--font-display)]">Deadweight</div>
                      <div className="text-white text-right font-[family-name:var(--font-mono)]">82,194 t</div>

                      <div className="text-[#6B7280] font-[family-name:var(--font-display)]">Gross Tonnage</div>
                      <div className="text-white text-right font-[family-name:var(--font-mono)]">43,012 pt</div>
                    </div>
                  </InfoCard>
                </div>

                {/* RIGHT: Commercial History & Sister Ships */}
                <div className="flex flex-col gap-6">
                  <InfoCard title="Commercial History">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-3">
                      {[
                        { title: "Name", cols: ["Date", "Name"], data: [["2015 Jun", vessel.name || "MEDUSA"], ["2010 Apr", "Torm Island"], ["", ""]] },
                        { title: "Manager", cols: ["Date", "Manager"], data: [["2015-06-01", "Diana Shipping Services SA"], ["2010-04-28", "Shikishima Kisen KK"], ["", ""]] },
                        { title: "Registered Owner", cols: ["Date", "Registered Owner"], data: [["2015-06-01", "Ranok Shipping Co Inc"], ["2010-04-28", "Ambitious Line SA"], ["", ""]] },
                        { title: "DOC", cols: ["Date", "DOC"], data: [["2015-01-06", "Diana Shipping Services SA"], ["2010-10-10", "Shikishima Kisen KK"], ["", ""]] },
                        { title: "Group Owner", cols: ["Date", "Group Owner"], data: [["2015-06-01", "Diana Shipping Inc"], ["2010-04-13", "Shikishima Kisen KK"], ["", ""]] },
                        { title: "Operator", cols: ["Date", "Operator"], data: [["2017-07-06", "Cargill International SA"], ["2015-06-01", "Clearlake Shipping Pte Ltd"], ["", ""]] },
                        { title: "Flag", cols: ["Date", "Flag"], data: [["2015 Jun", vessel.flagName || "Marshall Islands"], ["2010 Apr", "Panama"], ["", ""]] },
                        { title: "Gross Tonnage", cols: ["Date", "Gross Tonnage"], data: [["2010 Apr", "43012"], ["", ""], ["", ""]] },
                      ].map((table, idx) => (
                        <div key={idx} className="border border-[#2A3441] rounded overflow-hidden">
                           <table className="w-full text-left text-[10px] font-[family-name:var(--font-mono)] table-fixed">
                             <thead className="bg-[#1A1E28]">
                               <tr>
                                 <th className="p-2 border-r border-[#2A3441] text-[#9CA3AF] font-[family-name:var(--font-display)] w-[30%]">{table.cols[0]}</th>
                                 <th className="p-2 text-white text-center font-[family-name:var(--font-display)]">{table.cols[1]}</th>
                               </tr>
                             </thead>
                             <tbody className="divide-y divide-[#2A3441] border-t border-[#2A3441]">
                               {table.data.map((row, rIdx) => (
                                 <tr key={rIdx} className="bg-[#131820]">
                                   <td className="p-2 border-r border-[#2A3441] text-[#9CA3AF] whitespace-nowrap h-8">{row[0]}</td>
                                   <td className="p-2 text-[#D1D5DB] text-center truncate px-2">{row[1]}</td>
                                 </tr>
                               ))}
                             </tbody>
                           </table>
                        </div>
                      ))}
                    </div>
                  </InfoCard>

                  <InfoCard title="Ships Sister">
                    <div className="overflow-x-auto mt-3 border border-[#2A3441] rounded">
                       <table className="w-full text-left whitespace-nowrap">
                         <tbody className="text-[10px] font-[family-name:var(--font-mono)] text-[#9CA3AF] divide-y divide-[#2A3441]/50">
                            {[
                              { imo: "9461221", name: "HAKUTA", status: "In Service/Com...", gt: "82165", d1: "N/A", built: "2011", type: "Bulk Carrier", d2: "N/A", builder: "Mitsui Engineeri..." },
                              { imo: "9461324", name: "GOLDEN JAKE", status: "In Service/Com...", gt: "82168", d1: "N/A", built: "2011", type: "Bulk Carrier", d2: "N/A", builder: "Mitsui Engineeri..." },
                              { imo: "9461336", name: "GOLDEN ARION", status: "In Service/Com...", gt: "82168", d1: "N/A", built: "2011", type: "Bulk Carrier", d2: "N/A", builder: "Mitsui Engineeri..." },
                              { imo: "9510357", name: "CAPTAIN GEOR...", status: "In Service/Com...", gt: "82140", d1: "N/A", built: "2013", type: "Bulk Carrier", d2: "N/A", builder: "CSSC-MES Dies..." },
                              { imo: "9510369", name: "ARISTIDIS", status: "In Service/Com...", gt: "82153", d1: "N/A", built: "2013", type: "Bulk Carrier", d2: "N/A", builder: "CSSC-MES Dies..." },
                              { imo: "9512305", name: "NBA MONET", status: "In Service/Com...", gt: "82099", d1: "N/A", built: "2012", type: "Bulk Carrier", d2: "N/A", builder: "Mitsui Engineeri..." },
                              { imo: "9518074", name: "ENERGY GLORY", status: "In Service/Com...", gt: "82123", d1: "N/A", built: "2013", type: "Bulk Carrier", d2: "N/A", builder: "Mitsui Engineeri..." }
                            ].map((row, idx) => (
                               <tr key={idx} className="hover:bg-[#1A1E28] transition-colors h-10">
                                 <td className="px-4 font-bold text-white">{row.imo}</td>
                                 <td className="px-4 text-white font-[family-name:var(--font-display)] tracking-wider uppercase">{row.name}</td>
                                 <td className="px-4">{row.status}</td>
                                 <td className="px-4">{row.gt}</td>
                                 <td className="px-4 text-center">{row.d1}</td>
                                 <td className="px-4">{row.built}</td>
                                 <td className="px-4 font-[family-name:var(--font-display)]">{row.type}</td>
                                 <td className="px-4 text-center">{row.d2}</td>
                                 <td className="px-4 truncate max-w-[120px]">{row.builder}</td>
                               </tr>
                            ))}
                         </tbody>
                       </table>
                    </div>
                  </InfoCard>

                </div>

              </div>
            </div>
          )}

          {/* TAB: ACTIVITY REPORT */}
          {activeTab === "Activity Report" && (
            <div className="max-w-[1500px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 py-20 flex flex-col items-center justify-center">
               <FileText className="w-12 h-12 text-[#2A3441] mb-4" />
               <h3 className="text-white text-sm font-bold font-[family-name:var(--font-display)] uppercase tracking-wider mb-2">Generate PDF Report</h3>
               <p className="text-[11px] text-[#6B7280] font-[family-name:var(--font-mono)] max-w-md text-center mb-6">
                 Compile all current data, history tracks, portcalls, and risk profiles into a secure downloadable document. 
               </p>
               <button className="px-5 py-2.5 bg-[#0EA5E9] border border-[#0EA5E9] hover:bg-transparent hover:text-[#0EA5E9] transition-colors rounded text-white text-[11px] font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(14,165,233,0.3)]">
                 Generate & Download
               </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
