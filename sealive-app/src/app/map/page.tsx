"use client";

import { useState, useMemo, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { io } from "socket.io-client";
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Ship,
  Anchor,
  Navigation,
  X,
  Wind,
  Compass,
  Clock,
  MapPin,
  Play,
  Target,
  MoreHorizontal,
  Route,
  Settings2,
  Calendar,
  Download,
  Activity,
  ChevronDown,
  LayoutGrid,
  Pause,
  AlertTriangle,
  AlertCircle,
  ShieldAlert,
  Globe,
  Star
} from "lucide-react";
import { MOCK_BOTTOM_STATS } from "@/lib/constants";
import { MOCK_VESSEL_GEOJSON, VESSEL_COLORS } from "@/components/map/MapView";
import type { VesselProperties } from "@/components/map/MapView";

// Dynamic import MapView (SSR off — MapLibre needs browser APIs)
const MapView = dynamic(() => import("@/components/map/MapView"), {
  ssr: false,
  loading: () => (
    <div className="flex-1 bg-[#0C0E14] flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto border border-[#2A3441] rounded-full flex items-center justify-center mb-3 animate-glow-pulse">
          <Ship className="w-6 h-6 text-[#E67E22]" />
        </div>
        <p className="text-[10px] text-[#6B7280] uppercase tracking-wider font-[family-name:var(--font-display)]">
          Loading Map Engine...
        </p>
        <div className="mt-2 w-24 h-1 bg-[#1A1E28] rounded-full overflow-hidden mx-auto">
          <div className="h-full bg-[#E67E22] rounded-full animate-[shimmer_1.5s_ease-in-out_infinite]" style={{ width: "60%" }} />
        </div>
      </div>
    </div>
  ),
});

// Extract vessels from GeoJSON for sidebar
// Extraction helper removed from top-level to ensure proper re-rendering with HMR
const MOCK_ALERTS = [
  { id: 7, type: "CRITICAL", title: "AIS OFF DETECTED", details: "MT SHADOW TANKER • Deliberate AIS shutdown detected near border quadrant. Dark activity suspected.", time: "Just now" },
  { id: 6, type: "CRITICAL", title: "VESSEL MISSING", details: "SY OCEAN SPIRIT • Did not arrive at destination Labuan Bajo. Signal lost North Sumbawa.", time: "48h ago" },
  { id: 1, type: "WARNING", title: "AIS SIGNAL LOST", details: "MV OCEAN STAR • Missing since 12:45 UTC", time: "12m ago" },
  { id: 4, type: "OSINT", title: "SOCIAL MEDIA ANOMALY", details: "X (Twitter) • Viral keywords detected: 'bongkar malam', 'aktivitas mencurigakan'", time: "3m ago" },
  { id: 5, type: "CRITICAL", title: "SHIP TO SHIP TRANSFER", details: "Possible illegal transfer • 2 vessels adjacent < 50m for 7 days in Java Sea", time: "10m ago" },
  { id: 2, type: "WARNING", title: "UNUSUAL LOITERING", details: "MV PACIFIC HAWK • Speed drops to 0.2 kn", time: "45m ago" },
  { id: 3, type: "ALERT", title: "ZONE BREACH", details: "YACHT-022 • Entering restricted EEZ sector", time: "1h ago" },
];

export default function MapPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedVesselId, setSelectedVesselId] = useState<string | null>(null);
  const [livePositions, setLivePositions] = useState<Record<string, any>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [riskStatusFilter, setRiskStatusFilter] = useState("ALL");
  const [vesselSourceFilter, setVesselSourceFilter] = useState("ALL"); // ALL, AIS, SATELLITE
  const [layerVisibility, setLayerVisibility] = useState<Record<string, boolean>>({
    vessels: true,
    "vessel-labels": false,
    "shipping-routes": false,
    eez: false,
    ports: false,
    "port-labels": false,
    "anomaly-zones": false,
    "anomaly-labels": false,
    "tactical-alerts": true,
  });
  const [centerTrigger, setCenterTrigger] = useState(0);
  const [historyDays, setHistoryDays] = useState(7);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackIdx, setPlaybackIdx] = useState(-1);
  const [playbackSpeed, setPlaybackSpeed] = useState(8);

  // Memoize vessels from GeoJSON for sidebar and filtering
  const VESSELS = useMemo(() => {
    return MOCK_VESSEL_GEOJSON.features.map((f, i) => ({
      ...f.properties,
      // Add mock riskStatus to visualize filtering
      riskStatus: (i === 1 || i === 4) ? "BLACKLISTED" : (i === 3) ? "WATCHLIST" : "NORMAL",
      // Add mock vessel source
      source: f.properties?.source || (i % 4 === 0 ? "SATELLITE" : "AIS"),
      coordinates: (f.geometry as { type: "Point"; coordinates: [number, number] }).coordinates,
    } as unknown as VesselProperties & { coordinates: [number, number], riskStatus: string, source: string }));
  }, []);

  // Helper to calculate heading between two coordinates
  const calculateHeading = (p1: [number, number], p2: [number, number]) => {
    const lon1 = (p1[0] * Math.PI) / 180;
    const lat1 = (p1[1] * Math.PI) / 180;
    const lon2 = (p2[0] * Math.PI) / 180;
    const lat2 = (p2[1] * Math.PI) / 180;
    const y = Math.sin(lon2 - lon1) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1);
    const brng = (Math.atan2(y, x) * 180) / Math.PI;
    return (brng + 360) % 360;
  };

  useEffect(() => {
    const socket = io("http://localhost:4000/ais");
    socket.on("connect", () => {
       console.log("Connected to AIS WebSocket");
    });
    socket.on("positionUpdate", (data) => {
       setLivePositions(prev => ({ ...prev, [data.mmsi]: data }));
    });
    return () => {
       socket.disconnect();
    };
  }, []);

  // Get selected vessel details
  const selectedVessel = selectedVesselId ? VESSELS.find(v => v.id === selectedVesselId) : null;

  // Filtered tracks for the selected vessel
  const filteredTracks = useMemo(() => {
    if (!selectedVessel || !selectedVessel.track) return [];
    const baseDate = new Date("2026-04-09");
    const startDate = new Date(baseDate);
    startDate.setDate(baseDate.getDate() - historyDays);

    return selectedVessel.track.filter((log: any) => {
      if (!log.timestamp) return true;
      const match = log.timestamp.match(/(\d{4}-\d{2}-\d{2})/);
      if (match) {
         const logDate = new Date(match[1]);
         return logDate >= startDate;
      }
      return true;
    });
  }, [selectedVessel, historyDays]);

  // Reset playback when changing vessel or days
  useEffect(() => {
    setPlaybackIdx(-1);
    setIsPlaying(false);
  }, [selectedVesselId, historyDays]);

  // Playback loop
  useEffect(() => {
    if (!isPlaying) return;
    if (filteredTracks.length === 0) { setIsPlaying(false); return; }

    const interval = setInterval(() => {
      setPlaybackIdx(prev => {
        const next = prev === -1 ? 0 : prev + 1;
        if (next >= filteredTracks.length) {
          setIsPlaying(false);
          return filteredTracks.length - 1;
        }
        return next;
      });
    }, 4000 / playbackSpeed); // Base 4000ms. 1x=4000ms, 2x=2000ms, 4x=1000ms, 8x=500ms, 16x=250ms

    return () => clearInterval(interval);
  }, [isPlaying, filteredTracks.length, playbackSpeed]);

  // Filtered vessels
  const filteredVessels = useMemo(() => {
    let baseList = VESSELS.map(v => {
       // Merge live positions into the sidebar list
       if (livePositions[v.mmsi]) {
          return {
             ...v,
             speed: livePositions[v.mmsi].speed,
             heading: livePositions[v.mmsi].heading,
             lastUpdate: new Date(livePositions[v.mmsi].timestamp).toLocaleTimeString(),
          };
       }
       return v;
    });

    const q = searchQuery.toUpperCase();
    return baseList.filter(
      (v) =>
        (riskStatusFilter === "ALL" || v.riskStatus === riskStatusFilter) &&
        (vesselSourceFilter === "ALL" || v.source === vesselSourceFilter) &&
        (!searchQuery || 
         v.name.toUpperCase().includes(q) ||
         v.mmsi.includes(q) ||
         v.imo.includes(q))
    );
  }, [searchQuery, livePositions, riskStatusFilter, vesselSourceFilter]);

  return (
    <div className="h-full flex flex-col overflow-hidden bg-[#0C0E14] page-enter">
      <div className="flex-1 relative flex overflow-hidden">
        {/* === LEFT SIDEBAR - Tactical Panel === */}
      <aside
        className={`absolute md:relative z-30 md:z-10 h-full bg-[#0C0E14] border-r border-[#2A3441] flex flex-col transition-all duration-300 ${sidebarOpen ? "w-[280px] md:w-[300px] md:min-w-[300px] translate-x-0 shadow-2xl md:shadow-none" : "w-[280px] md:w-0 md:min-w-0 -translate-x-full md:translate-x-0 opacity-0 overflow-hidden"
          }`}
      >
        {/* Header with scan line effect */}
        <div className="p-3 border-b border-[#2A3441] bg-[#131820] scan-line">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#E67E22] font-[family-name:var(--font-display)]">
              ◆ Vessel Registry
            </span>
            <span className="flex items-center gap-1.5 text-[9px] text-[#6B7280] font-[family-name:var(--font-mono)]">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#059669] opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#059669]" />
              </span>
              LIVE
            </span>
          </div>

          {/* Search - Inset style */}
          <div className="relative group">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-[#6B7280] group-focus-within:text-[#E67E22] transition-colors" />
            <input
              type="text"
              placeholder="NAME / IMO / MMSI"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0C0E14] border border-[#2A3441] rounded-lg pl-8 pr-3 py-2 text-[10px] text-[#D1D5DB] placeholder:text-[#6B7280] focus:border-[#E67E22]/50 focus:shadow-[0_0_12px_rgba(230,126,34,0.1)] transition-all duration-200 outline-none font-[family-name:var(--font-mono)] uppercase"
            />
          </div>
        </div>

        {/* Filter buttons */}
        <div className="px-3 py-2 border-b border-[#2A3441] flex flex-wrap items-center gap-1.5">
          <select 
             value={riskStatusFilter}
             onChange={e => setRiskStatusFilter(e.target.value)}
             className="bg-[#131820] border border-[#2A3441] rounded-lg text-[9px] text-[#6B7280] py-1.5 px-2 uppercase outline-none focus:border-[#E67E22] font-[family-name:var(--font-display)] tracking-wider"
          >
            <option value="BLACKLISTED">Blacklisted</option>
            <option value="WHITELISTED">Whitelisted</option>
          </select>

          {/* Source Toggle */}
          <div className="flex bg-[#131820] border border-[#2A3441] rounded-lg p-0.5 ml-auto">
            <button 
              onClick={() => setVesselSourceFilter("ALL")}
              className={`px-2 py-1 text-[8px] font-bold rounded uppercase transition-all duration-200 ${vesselSourceFilter === 'ALL' ? 'bg-[#E67E22] text-white' : 'text-[#6B7280] hover:text-[#D1D5DB]'}`}
            >
              All
            </button>
            <button 
              onClick={() => setVesselSourceFilter("AIS")}
              className={`px-2 py-1 text-[8px] font-bold rounded uppercase transition-all duration-200 ${vesselSourceFilter === 'AIS' ? 'bg-[#3B82F6] text-white' : 'text-[#6B7280] hover:text-[#D1D5DB]'}`}
            >
              AIS
            </button>
            <button 
              onClick={() => setVesselSourceFilter("SATELLITE")}
              className={`px-2 py-1 text-[8px] font-bold rounded uppercase transition-all duration-200 ${vesselSourceFilter === 'SATELLITE' ? 'bg-[#8B5CF6] text-white' : 'text-[#6B7280] hover:text-[#D1D5DB]'}`}
            >
              SAT
            </button>
          </div>


        </div>

        {/* Vessel Count */}
        <div className="px-3 py-2 border-b border-[#2A3441] bg-[#131820] flex items-center justify-between">
          <span className="text-[9px] text-[#6B7280] uppercase tracking-wider font-[family-name:var(--font-display)]">
            Coverage
          </span>
          <div className="flex items-center gap-2">
            {/* Vessel type legend */}
            <div className="flex items-center gap-1.5">
              {Object.entries(VESSEL_COLORS).filter(([k]) => k !== "default").map(([type, color]) => (
                <div key={type} className="flex items-center gap-0.5 tooltip-hint" data-tooltip={type}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
                </div>
              ))}
            </div>
            <span className="text-[#2A3441]">|</span>
            <div className="flex items-center gap-1">
              <span className="text-xs font-bold text-[#E67E22] font-[family-name:var(--font-mono)] count-flash" style={{ "--i": 0 } as React.CSSProperties}>{filteredVessels.length.toLocaleString('en-US')}</span>
              <span className="text-[8px] text-[#6B7280]">VES</span>
            </div>
          </div>
        </div>

        {/* Vessel List */}
        <div className="flex-1 overflow-y-auto min-h-0">
          {filteredVessels.map((vessel, idx) => (
            <div
              key={vessel.id}
              onClick={() => {
                const isSelected = vessel.id === selectedVesselId;
                setSelectedVesselId(isSelected ? null : vessel.id);
                if (!isSelected) setSidebarOpen(false);
              }}
              className={`px-3 py-2 border-b border-[#1E252F] hover:bg-[#1A1E28] cursor-pointer transition-all duration-200 group row-enter ${vessel.id === selectedVesselId ? "bg-[#1A1E28] border-l-2 border-l-[#E67E22]" : ""
                }`}
              style={{ "--i": idx } as React.CSSProperties}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                   <span className="w-2 h-2 rounded-full" style={{ backgroundColor: VESSEL_COLORS[vessel.type] || VESSEL_COLORS.default }} />
                  <span className="text-sm">{vessel.flag}</span>
                  <span className={`text-[11px] font-semibold transition-colors duration-200 font-[family-name:var(--font-display)] ${vessel.riskStatus === 'BLACKLISTED' ? 'text-[#EF4444]' : vessel.riskStatus === 'WATCHLIST' ? 'text-[#E67E22]' : 'text-[#D1D5DB] group-hover:text-[#E67E22]'}`}>
                    {vessel.name}
                  </span>
                </div>
                <span className="text-[8px] text-[#6B7280] font-[family-name:var(--font-mono)]">{vessel.lastUpdate}</span>
              </div>
              <div className="flex items-center gap-2 text-[9px] text-[#6B7280]">
                <span className="flex items-center gap-1 uppercase tracking-wider font-[family-name:var(--font-display)]">
                  <Ship className="w-2 h-2" />
                  {vessel.type}
                </span>
                <span className="text-[#2A3441]">|</span>
                <span className="flex items-center gap-1 uppercase tracking-wider font-[family-name:var(--font-display)]">
                  {vessel.status === "Anchored" || vessel.status === "Moored" ? (
                    <Anchor className="w-2 h-2" />
                  ) : (
                    <Navigation className="w-2 h-2" />
                  )}
                  {vessel.status}
                </span>
                <span className="text-[#2A3441]">|</span>
                <span className="font-[family-name:var(--font-mono)]">{vessel.speed} kn</span>
              </div>
              <div className="mt-0.5 text-[8px] text-[#4A5568] font-[family-name:var(--font-mono)] group-hover:text-[#6B7280] transition-colors">
                {vessel.mmsi} / {vessel.imo}
              </div>
            </div>
          ))}
          {filteredVessels.length === 0 && (
            <div className="px-3 py-8 text-center">
              <p className="text-[10px] text-[#4A5568] font-[family-name:var(--font-display)]">No vessels match query</p>
            </div>
          )}
        </div>

      </aside>

      {/* Sidebar Toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className={`absolute z-40 md:z-20 top-3 bg-[#131820] border border-[#2A3441] border-l-0 rounded-r-lg p-1.5 hover:bg-[#1A1E28] hover:border-[#E67E22]/30 btn-press transition-all duration-300 ${sidebarOpen ? "left-[280px] md:left-[300px]" : "left-0"}`}
      >
        {sidebarOpen ? (
          <ChevronLeft className="w-3 h-3 text-[#6B7280]" />
        ) : (
          <ChevronRight className="w-3 h-3 text-[#6B7280]" />
        )}
      </button>

      <div className="flex-1 flex flex-col relative overflow-hidden">
        <div className="flex-1 relative">
          
          {/* Live Telemetry HUD (Visible during playback) */}
          {(isPlaying || playbackIdx !== -1) && filteredTracks[playbackIdx] && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
              <div className="bg-[#10141C]/90 backdrop-blur-md border border-[#E67E22]/30 px-5 py-2.5 rounded-lg flex items-center gap-6 shadow-[0_0_20px_rgba(230,126,34,0.15)] animate-in slide-in-from-top-4 duration-300">
                  <div className="flex flex-col items-center">
                    <span className="text-[9px] text-[#9CA3AF] uppercase font-[family-name:var(--font-display)] tracking-wider">Speed</span>
                    <span className="text-sm text-[#E67E22] font-bold font-[family-name:var(--font-mono)] text-shadow-glow">
                        {(selectedVessel?.speed || 12.4).toFixed(1)} <span className="text-[10px] text-[#E67E22]/70 font-normal">kn</span>
                    </span>
                  </div>
                  <div className="w-px h-8 bg-[#2A3441]" />
                  <div className="flex flex-col items-center">
                    <span className="text-[9px] text-[#9CA3AF] uppercase font-[family-name:var(--font-display)] tracking-wider">Heading</span>
                    <span className="text-sm text-white font-bold font-[family-name:var(--font-mono)]">
                        {Math.round(
                          (playbackIdx < filteredTracks.length - 1)
                            ? calculateHeading(filteredTracks[playbackIdx].coord, filteredTracks[playbackIdx + 1].coord)
                            : (selectedVessel?.heading || 0)
                        )}°
                    </span>
                  </div>
                  <div className="w-px h-8 bg-[#2A3441]" />
                  <div className="flex flex-col items-center">
                    <span className="text-[9px] text-[#9CA3AF] uppercase font-[family-name:var(--font-display)] tracking-wider">Time (UTC+7)</span>
                    <span className="text-sm text-white font-bold font-[family-name:var(--font-mono)]">
                        {filteredTracks[playbackIdx].timestamp ? filteredTracks[playbackIdx].timestamp.split(' ')[1] : "--:--"}
                    </span>
                  </div>
              </div>
            </div>
          )}

          {/* Tactical Alerts Card */}
          {layerVisibility["tactical-alerts"] && (
             <div 
               className="absolute top-4 left-12 z-20 w-[280px] animate-in slide-in-from-left-8 duration-300 shadow-[0_10px_40px_rgba(0,0,0,0.5)] transition-all"
             >
               <div className="bg-[#10141C]/80 backdrop-blur-md border border-[#EF4444]/30 rounded-lg flex flex-col overflow-hidden">
                 <div className="h-8 bg-[#EF4444]/10 border-b border-[#EF4444]/20 flex items-center justify-between px-3 shrink-0 box-border">
                    <div className="flex items-center gap-2">
                       <AlertTriangle className="w-3.5 h-3.5 text-[#EF4444]" />
                       <span className="text-[10px] font-bold text-[#EF4444] uppercase tracking-widest font-[family-name:var(--font-display)]">Active Alerts ({MOCK_ALERTS.length})</span>
                    </div>
                    <button onClick={() => setLayerVisibility(prev => ({...prev, "tactical-alerts": false}))} className="text-[#6B7280] hover:text-[#D1D5DB] transition-colors">
                       <X className="w-3.5 h-3.5" />
                    </button>
                 </div>
                 <div className="flex flex-col p-2 space-y-1.5 overflow-y-auto max-h-[260px] custom-scrollbar">
                    {MOCK_ALERTS.map(alt => (
                       <div 
                          key={alt.id} 
                          onClick={() => {
                            if (alt.id === 5) {
                              setSelectedVesselId("STS-01");
                              setCenterTrigger(prev => prev + 1);
                            } else if (alt.id === 6) {
                              setSelectedVesselId("MISS-01");
                              setCenterTrigger(prev => prev + 1);
                            }
                          }}
                          className="bg-[#1A1E28]/80 border border-[#2A3441] rounded p-2 hover:border-[#EF4444]/50 transition-colors cursor-pointer group hover:bg-[#1E252F]"
                       >
                          <div className="flex items-start justify-between mb-1.5">
                             <div className="flex items-center gap-1.5">
                                {alt.type === "CRITICAL" ? <ShieldAlert className="w-3 h-3 text-[#EF4444] shrink-0" /> : 
                                 alt.type === "OSINT" ? <Globe className="w-3 h-3 text-[#8B5CF6] shrink-0" /> :
                                 <AlertCircle className="w-3 h-3 text-[#EAB308] shrink-0" />}
                                <span className={`text-[10px] font-bold font-[family-name:var(--font-display)] ${alt.type === 'CRITICAL' ? 'text-[#EF4444]' : alt.type === 'OSINT' ? 'text-[#8B5CF6]' : alt.type === 'WARNING' ? 'text-[#EAB308]' : 'text-[#E67E22]'}`}>{alt.title}</span>
                             </div>
                             <span className="text-[8px] text-[#6B7280] font-[family-name:var(--font-mono)] whitespace-nowrap">{alt.time}</span>
                          </div>
                          <div className="text-[9px] text-[#D1D5DB] leading-relaxed font-[family-name:var(--font-mono)] ml-[18px]">{alt.details}</div>
                       </div>
                    ))}
                 </div>
                 <button className="h-7 bg-[#1A1E28] hover:bg-[#1E252F] text-[9px] text-[#9CA3AF] hover:text-[#EF4444] uppercase font-bold tracking-widest transition-colors flex items-center justify-center border-t border-[#2A3441]">VIEW ALL ALERTS</button>
               </div>
             </div>
          )}

          <MapView
            selectedVesselId={selectedVesselId}
            onVesselSelect={(v) => {
              setSelectedVesselId(v?.id || null);
              if (v?.id) setSidebarOpen(true);
              setPlaybackIdx(-1);
              setIsPlaying(false);
            }}
            layerVisibility={layerVisibility}
            onLayerChange={(layerId, visible) => setLayerVisibility(prev => ({ ...prev, [layerId]: visible }))}
            centerTrigger={centerTrigger}
            playbackState={
              playbackIdx !== -1 && filteredTracks[playbackIdx] 
                ? { 
                    vesselId: selectedVesselId!, 
                    coord: filteredTracks[playbackIdx].coord,
                    nextCoord: (isPlaying && playbackIdx < filteredTracks.length - 1) ? filteredTracks[playbackIdx + 1].coord : undefined,
                    speed: playbackSpeed,
                    heading: (playbackIdx < filteredTracks.length - 1)
                      ? calculateHeading(filteredTracks[playbackIdx].coord, filteredTracks[playbackIdx + 1].coord)
                      : (selectedVessel?.heading || 0)
                  } 
                : null
            }
              playbackTrack={
              playbackIdx !== -1
                ? filteredTracks.slice(0, playbackIdx + 1)
                : filteredTracks
            }
            livePositions={livePositions}
            sourceFilter={vesselSourceFilter}
          />

          {/* === RIGHT SIDEBAR (VESSEL DETAIL) REMOVED - using map popup instead === */}

        </div>

        {/* === BOTTOM DRAGGABLE PANEL (HISTORY TRACK) === */}
        {selectedVessel && (
          <div className="absolute top-[40%] bottom-0 left-0 right-0 md:top-auto md:relative h-auto md:h-[280px] shrink-0 bg-[#0C0E14] border-t border-[#2A3441] flex flex-col animate-in slide-in-from-bottom-8 duration-300 z-20 shadow-[0_-8px_24px_rgba(0,0,0,0.5)]">
            <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
              {/* Left Column - Vessel Tracking */}
              <div className="w-full md:w-[240px] flex flex-col border-b md:border-b-0 border-r border-[#2A3441] bg-[#131820] shrink-0">
                <div className="h-10 flex items-center justify-between px-3 border-b border-[#2A3441] shrink-0">
                  <span className="text-[11px] font-bold text-white font-[family-name:var(--font-display)]">Vessel Tracking (1)</span>
                  <button className="text-[#6B7280] hover:text-[#D1D5DB]">
                    <Settings2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex-1 p-3">
                  <div className="border border-[#2A3441] bg-[#1A1E28] rounded flex items-center p-2 relative overflow-hidden group">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#DC2626]" />
                    <div className="flex items-center gap-2 pl-2">
                       <span className="text-sm">{selectedVessel.flag}</span>
                       <span className="text-[11px] font-bold text-white tracking-widest font-[family-name:var(--font-display)] uppercase">{selectedVessel.name}</span>
                    </div>
                  </div>
                </div>
                <div className="h-10 flex items-center justify-between px-3 border-t border-[#2A3441] shrink-0">
                  <button className="flex items-center gap-1.5 text-[#6B7280] hover:text-white transition-colors"
                     onClick={() => { setSelectedVesselId(null); setSidebarOpen(true); }}>
                    <span className="text-[11px] font-medium tracking-wide">✕ Clear Vessel</span>
                  </button>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input type="checkbox" className="rounded border-[#2A3441] bg-[#1A1E28]" checked={false} readOnly />
                    <span className="text-[10px] text-[#6B7280]">All Vessel</span>
                  </label>
                </div>
              </div>

              {/* Right Column - History Track */}
              <div className="flex-1 flex flex-col bg-[#0B111D] relative">
                <div className="h-10 flex items-center justify-between px-3 border-b border-[#2A3441] shrink-0 bg-[#131820]">
                  <span className="text-[11px] text-white font-[family-name:var(--font-display)] tracking-wide">
                    History Track ({historyDays} days selected)
                  </span>
                  
                  <div className="flex items-center gap-2">
                    {/* Days selector */}
                    <div className="flex items-center border border-[#2A3441] rounded bg-[#10141C] overflow-hidden">
                      <button onClick={() => setHistoryDays(Math.max(1, historyDays - 1))} className="px-2 py-0.5 hover:bg-[#1E252F] text-[#9CA3AF] transition-colors">-</button>
                      <div className="px-2 py-0.5 text-[10px] text-white border-l border-r border-[#2A3441] min-w-[75px] text-center">{historyDays} Days Ago</div>
                      <button onClick={() => setHistoryDays(Math.min(30, historyDays + 1))} className="px-2 py-0.5 hover:bg-[#1E252F] text-[#9CA3AF] transition-colors">+</button>
                    </div>

                    {/* Date picker */}
                    <div className="flex items-center gap-2 border border-[#2A3441] rounded bg-[#10141C] px-2 py-1">
                      <span className="text-[10px] text-white font-[family-name:var(--font-mono)]">
                        {(() => {
                          const baseDate = new Date("2026-04-09");
                          const startDate = new Date(baseDate);
                          startDate.setDate(baseDate.getDate() - historyDays);
                          const fmt = (d: Date) => `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
                          return `${fmt(startDate)} - ${fmt(baseDate)}`;
                        })()}
                      </span>
                      <Calendar className="w-3 h-3 text-[#6B7280]" />
                    </div>

                    <button className="flex items-center gap-1.5 border border-[#2A3441] rounded bg-[#1A1E28] hover:bg-[#1E252F] px-2 py-1 transition-colors">
                      <Download className="w-3 h-3 text-[#D1D5DB]" />
                      <span className="text-[10px] text-[#D1D5DB]">Export</span>
                    </button>
                    
                    <button className="flex items-center gap-1.5 border border-[#2A3441] rounded bg-[#1A1E28] hover:bg-[#1E252F] px-2 py-1 transition-colors ml-2">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 text-[#D1D5DB]"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                      <span className="text-[10px] text-[#D1D5DB]">Speed (knot)</span>
                      <ChevronDown className="w-3 h-3 text-[#6B7280]" />
                    </button>

                    <button className="flex items-center justify-center p-1 border border-[#0EA5E9] bg-[#0EA5E9] rounded hover:bg-[#0284C7] transition-colors ml-1">
                      <LayoutGrid className="w-3 h-3 text-white" />
                    </button>
                    <button className="flex items-center justify-center p-1 border border-[#2A3441] bg-[#1A1E28] rounded hover:bg-[#1E252F] transition-colors">
                      <ChevronDown className="w-3 h-3 text-[#6B7280]" />
                    </button>
                  </div>
                </div>

                {/* Table */}
                <div className="flex-1 overflow-auto bg-[#131820]">
                  <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 bg-[#143B52] text-[#E2E8F0] z-10">
                      <tr className="text-[10px] font-bold font-[family-name:var(--font-display)] border-b border-[#224A61]">
                        <th className="py-2.5 px-4 font-normal">Time ▲</th>
                        <th className="py-2.5 px-4 font-normal">Coordinate</th>
                        <th className="py-2.5 px-4 font-normal text-center">Name</th>
                        <th className="py-2.5 px-4 font-normal text-center">MMSI</th>
                        <th className="py-2.5 px-4 font-normal text-center">IMO</th>
                      </tr>
                    </thead>
                    <tbody className="text-[10px] text-[#D1D5DB] font-[family-name:var(--font-mono)]">
                      {(() => {
                        const tableTracks = [...filteredTracks].reverse();
                          
                        if (tableTracks.length === 0) return (
                          <tr><td colSpan={5} className="py-8 text-center text-[#6B7280]">No track history found for the selected {historyDays} days.</td></tr>
                        );
                        
                        return tableTracks.map((log: any, i: number) => {
                          const lat = log.coord?.[1] || 0;
                          const lng = log.coord?.[0] || 0;
                          const formatDMS = (deg: number, isLng: boolean) => {
                            const d = Math.abs(deg);
                            const degInt = Math.floor(d);
                            const minFloat = (d - degInt) * 60;
                            const minInt = Math.floor(minFloat);
                            const sec = ((minFloat - minInt) * 60).toFixed(2);
                            const dir = isLng ? (deg >= 0 ? "E" : "W") : (deg >= 0 ? "N" : "S");
                            return `${degInt}°${minInt}'${sec}"${dir}`; // Match screenshot 7°5'35.80"S
                          };
                          const coordStr = `${formatDMS(lat, false)} ${formatDMS(lng, true)}`;
                          const tsStr = (log.timestamp || "").replace("\n", " ");

                          const isRowActive = playbackIdx !== -1 && (tableTracks.length - 1 - i) === playbackIdx;

                          return (
                            <tr 
                              key={i} 
                              onClick={() => {
                                 setPlaybackIdx(tableTracks.length - 1 - i);
                                 setIsPlaying(false);
                              }}
                              className={`border-b border-[#1A212D] hover:brightness-110 transition-colors cursor-pointer ${isRowActive ? "bg-[#0EA5E9]/30 border-l-[3px] border-l-[#0EA5E9]" : (i % 2 === 0 ? "bg-[#181E29]" : "bg-[#1C2330]")}`}
                            >
                              <td className="py-2.5 px-4">{tsStr}</td>
                              <td className="py-2.5 px-4">{coordStr}</td>
                              <td className="py-2.5 px-4 text-white font-[family-name:var(--font-display)] uppercase font-bold text-center">{selectedVessel.name}</td>
                              <td className="py-2.5 px-4 text-center">{selectedVessel.mmsi}</td>
                              <td className="py-2.5 px-4 text-center">{selectedVessel.imo}</td>
                            </tr>
                          );
                        });
                      })()}
                    </tbody>
                  </table>
                </div>

                {/* Bottom Player Toolbar */}
                <div className="h-10 border-t border-[#2A3441] bg-[#131820] flex items-center shrink-0 z-30 relative">
                  <div className="flex items-center h-full">
                    <button 
                      onClick={() => {
                        if (isPlaying) {
                           setIsPlaying(false);
                        } else {
                           if (playbackIdx >= filteredTracks.length - 1) {
                              setPlaybackIdx(0);
                           }
                           setIsPlaying(true);
                        }
                      }}
                      className="h-full w-12 flex items-center justify-center bg-[#0EA5E9] hover:bg-[#0284C7] transition-colors"
                    >
                      {isPlaying ? <Pause className="w-5 h-5 text-white fill-current" /> : <Play className="w-5 h-5 text-white fill-current" />}
                    </button>
                    <button 
                      onClick={() => {
                        const speeds = [1, 2, 4, 8, 16];
                        const nextIdx = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
                        setPlaybackSpeed(speeds[nextIdx]);
                      }}
                      className="h-full px-3 flex items-center gap-1.5 border-r border-[#2A3441] hover:bg-[#1A1E28] transition-colors"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#6B7280]"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      <span className="text-[10px] text-[#D1D5DB] w-3 text-center">{playbackSpeed}x</span>
                      <ChevronDown className="w-3 h-3 text-[#6B7280]" />
                    </button>
                  </div>
                  
                   <div className="flex items-center gap-5 px-4 h-full">
                    {["Tracks", "Line", "Names", "Speed", "Nearby"].map((lbl, idx) => {
                      const isDefaultChecked = idx === 0 || idx === 2;
                      return (
                        <label key={lbl} className="flex items-center gap-1.5 cursor-pointer h-full group">
                          <input type="checkbox" className={`rounded ${isDefaultChecked ? 'bg-[#0EA5E9] border-[#0EA5E9]' : 'border-[#4B5563] bg-transparent group-hover:border-[#6B7280]'} form-checkbox accent-[#0EA5E9] cursor-pointer`} defaultChecked={isDefaultChecked} />
                          <span className={`text-[10px] font-bold ${isDefaultChecked ? 'text-[#38BDF8]' : 'text-[#6B7280]'}`}>{lbl}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      </div>
      {/* === BOTTOM STATUS BAR === */}
      <div className="h-7 bg-[#131820]/95 backdrop-blur-sm border-t border-[#2A3441] flex items-center justify-between px-4 z-10 shrink-0 relative">
        <div className="flex items-center gap-4">
          {MOCK_BOTTOM_STATS.map((stat, i) => (
            <div key={stat.label} className="flex items-center gap-1.5 stagger-in" style={{ "--i": i } as React.CSSProperties}>
              <span className="text-[9px] text-[#6B7280] uppercase tracking-wider font-[family-name:var(--font-display)]">{stat.label}</span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 font-[family-name:var(--font-mono)] num-highlight ${stat.color === "text-accent-amber" ? "text-[#E67E22]" :
                  stat.color === "text-accent-purple" ? "text-[#8B5CF6]" :
                    stat.color === "text-accent-red" ? "text-[#DC2626]" :
                      "text-[#3B82F6]"
                }`}>
                {stat.count.toLocaleString('en-US')}
              </span>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#059669] opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#059669]" />
            </span>
            <span className="text-[8px] text-[#059669] font-[family-name:var(--font-mono)]">MapLibre GL</span>
          </div>
          <span className="text-[8px] text-[#4A5568] font-[family-name:var(--font-mono)]">UTC 2026-04-08 14:45:23</span>
        </div>
      </div>
    </div>
  );
}