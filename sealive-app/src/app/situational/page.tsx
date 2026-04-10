"use client";

import { useState, useRef, useMemo, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  MOCK_ANOMALY_LOCATIONS,
  MOCK_BLACKLIST_VESSELS,
  MOCK_BOTTOM_STATS,
} from "@/lib/constants";
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Skull,
  Zap,
  ExternalLink,
  Settings,
  Globe as GlobeIcon,
  Activity,
  Wind,
  Waves,
  CloudRain,
  Thermometer,
  Eye,
  MapPin,
  Layers,
} from "lucide-react";

const GLOBE_THEMES = [
  { id: "dark", label: "Tactical Dark", url: "//unpkg.com/three-globe/example/img/earth-dark.jpg" },
  { id: "night", label: "Satellite Night", url: "//unpkg.com/three-globe/example/img/earth-night.jpg" },
  { id: "blue", label: "Blue Marble", url: "//unpkg.com/three-globe/example/img/earth-blue-marble.jpg" },
  { id: "day", label: "Topology Day", url: "//unpkg.com/three-globe/example/img/earth-day.jpg" },
];

const Globe = dynamic(() => import("react-globe.gl"), { ssr: false });

export default function SituationalPage() {
  const [activeThemeId, setActiveThemeId] = useState("dark");
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);
  const activeGlobeUrl = GLOBE_THEMES.find(t => t.id === activeThemeId)?.url || GLOBE_THEMES[0].url;
  return (
    <div className="h-full flex flex-col overflow-hidden bg-[#0C0E14] page-enter">
      {/* Header - Rounded control */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-[#2A3441] bg-[#131820]">
        <div className="flex items-center gap-3">
          <GlobeIcon className="w-4 h-4 text-[#E67E22]" />
          <span className="text-xs font-bold uppercase tracking-wider text-[#D1D5DB] font-[family-name:var(--font-display)]">
            Situational Awareness
          </span>
          <span className="text-[9px] text-[#6B7280] px-2 py-0.5 bg-[#0C0E14] border border-[#2A3441] rounded-lg font-[family-name:var(--font-mono)]">
            T+01:23:45
          </span>
        </div>
        <div className="flex items-center gap-3">
          {/* Legend */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-md bg-[#059669]" />
              <span className="text-[8px] text-[#6B7280] uppercase tracking-wider font-[family-name:var(--font-display)]">Blacklist</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-md bg-[#DC2626]" />
              <span className="text-[8px] text-[#6B7280] uppercase tracking-wider font-[family-name:var(--font-display)]">Anomaly</span>
            </div>
          </div>
          <button className="p-1.5 border border-[#2A3441] bg-[#0C0E14] rounded-lg hover:bg-[#1A1E28] hover:border-[#E67E22]/30 btn-press transition-all duration-200">
            <Settings className="w-3 h-3 text-[#6B7280]" />
          </button>
        </div>
      </div>

      {/* 3-Panel Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* === LEFT PANEL === */}
        <div className="w-[280px] min-w-[280px] border-r border-[#2A3441] overflow-y-auto bg-[#0C0E14]">
          {/* Weather Widget */}
          <div className="p-3 border-b border-[#2A3441]">
            <h3 className="text-[9px] text-[#06B6D4] font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5 font-[family-name:var(--font-display)]">
              <CloudRain className="w-3 h-3" />
              Local Conditions
            </h3>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <WeatherCard icon={<Wind className="w-3 h-3" />} label="Wind" value="12 kt" sub="NE" />
              <WeatherCard icon={<Waves className="w-3 h-3" />} label="Wave" value="1.5 m" sub="moderate" />
              <WeatherCard icon={<Thermometer className="w-3 h-3" />} label="Temp" value="28°C" sub="humid" />
              <WeatherCard icon={<Eye className="w-3 h-3" />} label="Visibility" value="10 km" sub="good" />
            </div>
            <div className="flex items-center gap-1 text-[8px] text-[#4A5568] font-[family-name:var(--font-mono)]">
              <MapPin className="w-2.5 h-2.5" />
              <span>Indonesia Maritime Region</span>
            </div>
          </div>
          {/* Top 5 Anomaly Locations */}
          <div className="p-3 border-b border-[#2A3441]">
            <h3 className="text-[9px] text-[#E67E22] font-bold uppercase tracking-wider mb-2 font-[family-name:var(--font-display)]">
              ◆ Anomaly Hotspots
            </h3>
            <div className="space-y-1.5">
              {MOCK_ANOMALY_LOCATIONS.map((loc, i) => (
                <div
                  key={loc.name}
                  className="flex items-center justify-between p-2 bg-[#131820] border border-[#2A3441] rounded-lg hover:border-[#E67E22]/50 hover-lift transition-all duration-200 cursor-pointer stagger-in"
                  style={{ "--i": i } as React.CSSProperties}
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] text-[#D1D5DB] truncate font-[family-name:var(--font-display)]">
                      {loc.name}
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      {loc.trend === "up" ? (
                        <TrendingUp className="w-2 h-2 text-[#DC2626]" />
                      ) : (
                        <TrendingDown className="w-2 h-2 text-[#059669]" />
                      )}
                      <span className={`text-[9px] font-bold font-[family-name:var(--font-mono)] ${
                        loc.trend === "up" ? "text-[#DC2626]" : "text-[#059669]"
                      }`}>
                        {loc.percentage}%
                      </span>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-[#E67E22] ml-2 font-[family-name:var(--font-mono)] num-highlight">{loc.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Flag Composition */}
          <div className="p-3 border-b border-[#2A3441]">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-[9px] text-[#6B7280] font-bold uppercase tracking-wider font-[family-name:var(--font-display)]">
                Flag Detection Freq
              </h3>
            </div>
            <div className="h-1.5 bg-[#0C0E14] border border-[#1E252F] rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#DC2626] via-[#E67E22] to-[#059669] bar-grow" style={{ width: "60%", "--i": 0 } as React.CSSProperties} />
            </div>
            <p className="text-[8px] text-[#4A5568] mt-1 font-[family-name:var(--font-mono)]">Loading data...</p>
          </div>

          {/* Blacklist Vessel */}
          <div className="p-3">
            <h3 className="text-[9px] text-[#DC2626] font-bold uppercase tracking-wider mb-2 font-[family-name:var(--font-display)]">
              ◆ Blacklist Vessels
            </h3>
            <div className="space-y-1.5">
              {MOCK_BLACKLIST_VESSELS.map((vessel, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2 bg-[#131820] border border-[#2A3441] rounded-lg hover:border-[#DC2626]/50 hover-lift transition-all duration-200 cursor-pointer stagger-in"
                  style={{ "--i": i + 5 } as React.CSSProperties}
                >
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm">{vessel.flag}</span>
                      <span className="text-[10px] font-semibold text-[#D1D5DB] font-[family-name:var(--font-display)]">{vessel.name}</span>
                    </div>
                    <div className="text-[8px] text-[#6B7280] mt-0.5 font-[family-name:var(--font-mono)]">{vessel.mou}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[8px] text-[#6B7280] font-[family-name:var(--font-mono)]">{vessel.time}</div>
                    <div className="text-[8px] text-[#E67E22] font-[family-name:var(--font-mono)]">{vessel.status}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* === CENTER — GLOBE === */}
        <div className="flex-1 relative bg-[#0C0E14] overflow-hidden">
          <Globe3D globeUrl={activeGlobeUrl} />
          
          {/* THEME PICKER DROPDOWN */}
          <div className="absolute top-4 left-4 z-20">
            <button 
              onClick={() => setIsThemeDropdownOpen(!isThemeDropdownOpen)}
              className={`flex items-center gap-2 px-3 py-1.5 bg-[#131820]/90 backdrop-blur-md border rounded-lg transition-all duration-200 ${
                isThemeDropdownOpen ? "border-[#E67E22]" : "border-[#2A3441] hover:border-[#6B7280]"
              }`}
            >
              <Layers className="w-3 h-3 text-[#E67E22]" />
              <span className="text-[10px] text-[#D1D5DB] font-bold font-[family-name:var(--font-display)] uppercase tracking-wider">
                Globe Layer Option
              </span>
            </button>

            {isThemeDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-[#131820]/95 backdrop-blur-md border border-[#2A3441] rounded-lg shadow-xl overflow-hidden animate-in slide-in-from-top-2">
                {GLOBE_THEMES.map(theme => (
                  <button
                    key={theme.id}
                    onClick={() => {
                      setActiveThemeId(theme.id);
                      setIsThemeDropdownOpen(false);
                    }}
                    className={`block w-full text-left px-4 py-2.5 text-[10px] uppercase tracking-wider font-bold transition-colors ${
                      activeThemeId === theme.id 
                        ? "bg-[#E67E22]/10 text-[#E67E22] border-l-2 border-[#E67E22]" 
                        : "text-[#6B7280] hover:text-[#D1D5DB] hover:bg-[#1A1E28] border-l-2 border-transparent"
                    }`}
                  >
                    {theme.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* LIVE Badge */}
          <div className="absolute top-4 right-4 flex flex-col items-end stagger-in" style={{ "--i": 0 } as React.CSSProperties}>
            <div className="flex items-center gap-2 px-2 py-1 bg-[#131820] border border-[#DC2626]/50 rounded-lg animate-glow-pulse" style={{ "--color-glow-orange": "rgba(220, 38, 38, 0.2)" } as React.CSSProperties}>
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#DC2626] opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#DC2626]" />
              </span>
              <span className="text-[8px] font-bold text-[#DC2626] uppercase tracking-wider font-[family-name:var(--font-display)]">
                LIVE ANOMALY
              </span>
            </div>
            <span className="text-[8px] text-[#4A5568] mt-1 font-[family-name:var(--font-mono)]">2026-04-08 14:45:23 UTC</span>
          </div>

          {/* Fullscreen */}
          <button className="absolute top-16 right-4 p-1.5 bg-[#131820] border border-[#2A3441] rounded-lg hover:bg-[#1A1E28] hover:border-[#E67E22]/30 btn-press transition-all duration-200 tooltip-hint" data-tooltip="Fullscreen">
            <ExternalLink className="w-3 h-3 text-[#6B7280]" />
          </button>
        </div>

        {/* === RIGHT PANEL === */}
        <div className="w-[260px] min-w-[260px] border-l border-[#2A3441] overflow-y-auto bg-[#0C0E14]">
          {/* Casualties */}
          <div className="p-3 border-b border-[#2A3441] stagger-in" style={{ "--i": 1 } as React.CSSProperties}>
            <h3 className="text-[9px] text-[#E67E22] font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5 font-[family-name:var(--font-display)]">
              <AlertTriangle className="w-3 h-3" />
              Casualties
            </h3>
            <NewsCard
              date="18/12/2026"
              title="Bea Cukai Batam Amankan 1,12 Juta Batang Rokok Ilegal dalam Speedboat di Pulau Panjang"
            />
          </div>

          {/* Piracy */}
          <div className="p-3 border-b border-[#2A3441] stagger-in" style={{ "--i": 2 } as React.CSSProperties}>
            <h3 className="text-[9px] text-[#DC2626] font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5 font-[family-name:var(--font-display)]">
              <Skull className="w-3 h-3" />
              Piracy / Armed Robbery
            </h3>
            <NewsCard
              date="24/03/2026"
              title="0824 UTC: Posn: Around 400nm East of Mogadishu"
              subtitle="1° 42.426'N, 51° 39.964'E"
            />
          </div>

          {/* Earthquake */}
          <div className="p-3 stagger-in" style={{ "--i": 3 } as React.CSSProperties}>
            <h3 className="text-[9px] text-[#E67E22] font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5 font-[family-name:var(--font-display)]">
              <Zap className="w-3 h-3" />
              Seismic Activity
            </h3>
            <div className="p-2.5 bg-[#131820] border border-[#2A3441] rounded-lg hover-glow transition-all duration-200">
              <div className="flex items-center justify-between mb-1">
                <span className="text-lg font-bold text-[#D1D5DB] font-[family-name:var(--font-mono)] count-flash" style={{ "--i": 0 } as React.CSSProperties}>M 5.1</span>
                <span className="text-[8px] text-[#6B7280] font-[family-name:var(--font-mono)]">08/04 09:26</span>
              </div>
              <p className="text-[9px] text-[#6B7280]">
                90km E of Tadine, New Caledonia
              </p>
              <div className="mt-2 h-10 bg-[#0C0E14] border border-[#1E252F] rounded-md flex items-center justify-center overflow-hidden relative">
                {/* Seismograph line animation */}
                <svg className="w-full h-full" viewBox="0 0 200 40" preserveAspectRatio="none">
                  <path
                    d="M0,20 L20,20 L25,8 L30,32 L35,12 L40,28 L45,20 L60,20 L65,5 L70,35 L75,10 L80,30 L85,20 L120,20 L125,15 L130,25 L135,20 L200,20"
                    fill="none"
                    stroke="#E67E22"
                    strokeWidth="1.5"
                    opacity="0.6"
                    strokeDasharray="400"
                    strokeDashoffset="400"
                    className="animate-[seismo_3s_ease-out_forwards]"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Intelligence Widgets */}
          <div className="p-3 border-t border-[#2A3441] stagger-in" style={{ "--i": 4 } as React.CSSProperties}>
            <h3 className="text-[9px] text-[#8B5CF6] font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5 font-[family-name:var(--font-display)]">
              <Activity className="w-3 h-3" />
              Intelligence DB
            </h3>
            <div className="space-y-2">
              <WidgetCard title="Vessel Traffic" value="47,237" trend="+2.3%" color="#059669" />
              <WidgetCard title="Zone Violations" value="156" trend="+12%" color="#DC2626" />
              <WidgetCard title="Active Alerts" value="847" trend="-8%" color="#E67E22" />
            </div>
            <button className="w-full mt-2 py-1.5 text-[8px] text-[#6B7280] uppercase tracking-wider bg-[#0C0E14] border border-[#2A3441] rounded hover:border-[#8B5CF6]/50 transition-colors font-[family-name:var(--font-display)]">
              + Add Widget
            </button>
          </div>
        </div>
      </div>

      {/* === BOTTOM STATUS BAR === */}
      <div className="h-6 bg-[#131820] border-t border-[#2A3441] flex items-center justify-between px-4 rounded-b-lg">
        <div className="flex items-center gap-4">
          {MOCK_BOTTOM_STATS.map((stat, i) => (
            <div key={stat.label} className="flex items-center gap-1 stagger-in" style={{ "--i": i } as React.CSSProperties}>
              <span className="text-[8px] text-[#6B7280] uppercase tracking-wider font-[family-name:var(--font-display)]">{stat.label}</span>
              <span className={`text-[9px] font-bold px-1 font-[family-name:var(--font-mono)] num-highlight ${
                stat.color === "text-accent-amber" ? "text-[#E67E22]" :
                stat.color === "text-accent-purple" ? "text-[#8B5CF6]" :
                stat.color === "text-accent-red" ? "text-[#DC2626]" :
                "text-[#3B82F6]"
              }`}>
                {stat.count.toLocaleString('en-US')}
              </span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[8px] text-[#4A5568] font-[family-name:var(--font-mono)]">SYS: ONLINE</span>
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#059669] opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#059669]" />
          </span>
        </div>
      </div>
    </div>
  );
}

function NewsCard({
  date,
  title,
  subtitle,
}: {
  date: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="p-2.5 bg-[#131820] border border-[#2A3441] rounded-lg hover:border-[#E67E22]/30 hover-lift transition-all duration-200 cursor-pointer group">
      <div className="text-[8px] text-[#6B7280] mb-1 font-[family-name:var(--font-mono)] group-hover:text-[#9CA3AF] transition-colors">{date}</div>
      <p className="text-[10px] text-[#D1D5DB] leading-relaxed font-[family-name:var(--font-display)]">{title}</p>
      {subtitle && <p className="text-[8px] text-[#6B7280] mt-1 font-[family-name:var(--font-mono)]">{subtitle}</p>}
    </div>
  );
}

function WeatherCard({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="p-2 bg-[#131820] border border-[#2A3441] rounded-lg">
      <div className="flex items-center gap-1 mb-1">
        <span className="text-[#06B6D4]">{icon}</span>
        <span className="text-[8px] text-[#6B7280] uppercase tracking-wider font-[family-name:var(--font-display)]">{label}</span>
      </div>
      <div className="text-[11px] font-bold text-[#D1D5DB] font-[family-name:var(--font-mono)]">{value}</div>
      <div className="text-[7px] text-[#4A5568] font-[family-name:var(--font-mono)]">{sub}</div>
    </div>
  );
}

function WidgetCard({
  title,
  value,
  trend,
  color,
}: {
  title: string;
  value: string;
  trend: string;
  color: string;
}) {
  const isUp = trend.startsWith("+");
  return (
    <div className="flex items-center justify-between p-2 bg-[#131820] border border-[#2A3441] rounded-lg">
      <span className="text-[9px] text-[#6B7280] font-[family-name:var(--font-display)]">{title}</span>
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold text-[#D1D5DB] font-[family-name:var(--font-mono)]">{value}</span>
        <span className="text-[8px] font-[family-name:var(--font-mono)]" style={{ color }}>{trend}</span>
      </div>
    </div>
  );
}

function Globe3D({ globeUrl }: { globeUrl?: string }) {
  const globeEl = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);
  
  const anomalyPoints = useMemo(() => [
    { lat: 3.5, lng: 108, name: "Natuna Sea", size: 1.5 },
    { lat: -5, lng: 115, name: "Lombok Strait", size: 1 },
    { lat: 1, lng: 122, name: "Sulawesi Sea", size: 1.2 },
    { lat: -6, lng: 134, name: "Arafura Sea", size: 2 },
    { lat: 5.5, lng: 121.5, name: "Sulu Sea", size: 1.3 },
  ], []);

  const portPoints = useMemo(() => [
    { lat: -6.1, lng: 106.89, name: "Tanjung Priok" },
    { lat: -7.2, lng: 112.73, name: "Tanjung Perak" },
    { lat: 3.79, lng: 98.69, name: "Belawan" },
    { lat: -5.14, lng: 119.41, name: "Makassar" },
    { lat: 1.26, lng: 103.85, name: "Singapore" },
  ], []);

  return (
    <div ref={containerRef} className="absolute inset-0 flex items-center justify-center">
      <Globe
        ref={globeEl}
        globeImageUrl={globeUrl || "//unpkg.com/three-globe/example/img/earth-dark.jpg"}
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        width={dimensions.width}
        height={dimensions.height}
        animateIn={true}
        showAtmosphere={true}
        atmosphereColor="#E67E22"
        atmosphereAltitude={0.15}
        pointsData={anomalyPoints}
        pointColor={() => "#DC2626"}
        pointAltitude={0.02}
        pointRadius={0.5}
        pointLabel={(d: any) => `
          <div style="background: #131820; border: 1px solid #2A3441; padding: 8px; border-radius: 4px; color: #D1D5DB; font-family: monospace; font-size: 10px;">
            <strong style="color: #DC2626;">${d.name}</strong><br/>
            <span style="color: #6B7280;">Anomaly Zone</span>
          </div>
        `}
        ringsData={anomalyPoints}
        ringColor={() => "rgba(220, 38, 38, 0.3)"}
        ringMaxRadius={2}
        ringPropagationSpeed={0.5}
        ringRepeatPeriod={1000}
        htmlElementsData={portPoints}
        htmlElement={(d: any) => {
          const el = document.createElement('div');
          el.innerHTML = `<div style="background: #131820; border: 1px solid #06B6D4; padding: 4px 8px; border-radius: 4px; color: #D1D5DB; font-family: sans-serif; font-size: 9px; white-space: nowrap;">${d.name}</div>`;
          return el;
        }}
      />
    </div>
  );
}