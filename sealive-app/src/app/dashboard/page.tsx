"use client";

import { MOCK_SHIP_TYPES, DASHBOARD_STATS, MOCK_ALERTS } from "@/lib/constants";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  ScatterChart,
  Scatter,
  ZAxis,
  CartesianGrid,
  Legend,
  ComposedChart,
  Bar,
  Line,
  Cell
} from 'recharts';
import {
  Activity,
  Ship,
  Shield,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Clock,
  Radio,
  MapPin,
  AlertTriangle,
  Zap,
  Crosshair
} from "lucide-react";

// --- MOCK DATA TRANSFORMATIONS ---

// 1. AreaChart (Timeline Heartbeat)
const MOCK_AREA_TIMELINE = Array.from({ length: 24 }).map((_, i) => ({
  time: `${i.toString().padStart(2, '0')}:00`,
  anomalies: Math.floor(Math.random() * 50) + (i > 10 && i < 15 ? 80 : 10), // Spike in middle
  verifications: Math.floor(Math.random() * 30) + 20,
}));

// 2. RadialBar (Vessel Types)
const MOCK_RADIAL_TYPES = MOCK_SHIP_TYPES.slice(0, 6).map((ship, index) => {
  const colors = ["#E67E22", "#F59E0B", "#10B981", "#059669", "#3B82F6", "#6366F1"];
  return {
    name: ship.type,
    count: ship.count,
    fill: colors[index % colors.length],
  };
});

// 3. Scatter (Sonar Blips) - Cartesian mapped to look like polar
const MOCK_SONAR_BLIPS = Array.from({ length: 40 }).map((_, i) => {
  const radius = Math.random() * 100;
  const angle = Math.random() * Math.PI * 2;
  return {
    x: Math.round(Math.cos(angle) * radius),
    y: Math.round(Math.sin(angle) * radius),
    z: Math.floor(Math.random() * 5) + 1, // Size/Speed
    type: Math.random() > 0.8 ? "anomaly" : "normal"
  };
});

// 4. ComposedChart (Alerts Trend)
const MOCK_TREND = [
  { day: 'Mon', critical: 12, high: 24, handled: 30 },
  { day: 'Tue', critical: 5, high: 15, handled: 20 },
  { day: 'Wed', critical: 18, high: 22, handled: 15 },
  { day: 'Thu', critical: 8, high: 10, handled: 28 },
  { day: 'Fri', critical: 25, high: 35, handled: 10 },
  { day: 'Sat', critical: 4, high: 8, handled: 40 },
  { day: 'Sun', critical: 2, high: 5, handled: 45 },
];


// --- CUSTOM COMPONENTS ---

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#10141C]/90 backdrop-blur-md border border-[#2A3441] p-3 rounded-lg shadow-xl z-50">
        <p className="text-[10px] text-[#9CA3AF] uppercase font-[family-name:var(--font-display)] mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={`item-${index}`} className="flex items-center gap-2 mt-1">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color || entry.fill }} />
            <span className="text-xs font-bold font-[family-name:var(--font-mono)] text-white">
              {entry.name}: {entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

function AlertCard({ alert }: { alert: typeof MOCK_ALERTS[0] }) {
  const severityColors = {
    CRITICAL: "border-l-[#DC2626] bg-[#DC2626]/10 text-[#DC2626]",
    HIGH: "border-l-[#E67E22] bg-[#E67E22]/10 text-[#E67E22]",
    MEDIUM: "border-l-[#F59E0B] bg-[#F59E0B]/10 text-[#F59E0B]",
  };
  return (
    <div className={`p-2.5 mb-2 rounded border-l-2 bg-[#131820] hover:bg-[#1A1E28] cursor-pointer transition-colors border border-t-[#2A3441] border-r-[#2A3441] border-b-[#2A3441] ${severityColors[alert.severity]}`}>
      <div className="flex justify-between items-start mb-1">
        <div className="text-[11px] font-bold text-[#E2E8F0] uppercase tracking-wider font-[family-name:var(--font-display)]">{alert.vessel}</div>
        <span className="text-[8px] font-bold uppercase rounded px-1 py-0.5 bg-black/20">{alert.severity}</span>
      </div>
      <div className="flex items-center gap-1.5 mt-1 text-[9px] text-[#9CA3AF] font-[family-name:var(--font-mono)]">
        <AlertTriangle className="w-3 h-3 shrink-0" />
        <span className="truncate">{alert.type}</span>
      </div>
      <div className="flex items-center gap-1.5 mt-1 text-[8px] text-[#6B7280] font-[family-name:var(--font-mono)]">
        <MapPin className="w-2.5 h-2.5 shrink-0" />
        <span className="truncate">{alert.location}</span>
      </div>
    </div>
  );
}

function StatCardCompact({ label, value, trend, icon }: { label: string; value: number; trend: "up" | "down"; icon: string }) {
  const IconComponent = icon === "Ship" ? Ship : icon === "AlertTriangle" ? AlertTriangle : icon === "Activity" ? Activity : Shield;
  return (
    <div className="bg-[#131820] border border-[#2A3441] rounded-lg p-3 hover:border-[#E67E22]/30 transition-all stagger-slide-up flex flex-col justify-center">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-[#0C0E14] border border-[#2A3441] flex items-center justify-center">
            <IconComponent className="w-4 h-4 text-[#E67E22]" />
          </div>
          <div>
            <div className="text-lg font-bold text-white font-[family-name:var(--font-mono)] count-flash">{value.toLocaleString('en-US')}</div>
            <div className="text-[9px] text-[#6B7280] uppercase tracking-widest font-[family-name:var(--font-display)]">{label}</div>
          </div>
        </div>
        <div className={`flex items-center justify-center w-6 h-6 rounded-full bg-opacity-20 ${trend === "up" ? "bg-[#059669] text-[#059669]" : "bg-[#DC2626] text-[#DC2626]"}`}>
          {trend === "up" ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
        </div>
      </div>
    </div>
  );
}

// --- PAGE COMPONENT ---

export default function DashboardPage() {
  return (
    <div className="h-full flex flex-col overflow-hidden bg-[#0C0E14] page-enter font-[family-name:var(--font-display)]">
      
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between px-4 py-3 border-b border-[#2A3441] bg-[#10141C] shrink-0 z-10 w-full overflow-hidden">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="w-2 h-2 rounded-full bg-[#059669] animate-pulse" />
          <span className="text-[12px] font-bold text-white uppercase tracking-[0.2em]">Live Operation Center</span>
        </div>
        <div className="flex items-center gap-4 mt-3 md:mt-0 overflow-x-auto w-full md:w-auto custom-scrollbar pb-1 md:pb-0 hide-scrollbar">
          <div className="flex items-center gap-2 text-[10px] text-[#6B7280] uppercase tracking-widest shrink-0">
            <Radio className="w-3 h-3" /> Sync: <span className="text-[#059669]">Realtime</span>
          </div>
          <span className="text-[#2A3441]">|</span>
          <div className="text-[10px] text-[#6B7280] uppercase tracking-widest shrink-0">
            Node: <span className="text-white font-[family-name:var(--font-mono)]">Jakarta-HQ-01</span>
          </div>
        </div>
      </div>

      {/* Main Asymmetric Grid Layout */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden p-2 lg:p-4 gap-4">
        
        {/* === LEFT COLUMN (25%) - LIVE ALERT FEED === */}
        <div className="w-full lg:w-1/4 flex flex-col shrink-0 gap-3 h-[400px] lg:h-full">
          <div className="flex items-center gap-2 px-1 shrink-0 mt-1">
            <Zap className="w-4 h-4 text-[#F59E0B]" />
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-[#D1D5DB]">Live Critical Feed</h2>
          </div>
          <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar space-y-1">
            {/* Duplicated for scroll effect demonstration */}
            {[...MOCK_ALERTS, ...MOCK_ALERTS].map((alert, idx) => (
              <AlertCard key={`${alert.id}-${idx}`} alert={alert} />
            ))}
          </div>
        </div>

        {/* === CENTER COLUMN (50%) - PRIMARY VISUALIZATIONS === */}
        <div className="w-full lg:w-2/4 flex flex-col gap-4 h-[800px] lg:h-full min-h-[600px]">
          
          {/* Top Half: Area Heartbeat */}
          <div className="flex-1 bg-[#131820] border border-[#2A3441] rounded-lg p-3 flex flex-col hover-glow relative overflow-hidden">
            <div className="flex items-center justify-between mb-2 shrink-0 relative z-10">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#E67E22]" />
                <h2 className="text-[10px] font-bold uppercase tracking-widest text-[#D1D5DB]">Vessel Fleet Heartbeat (24H)</h2>
              </div>
            </div>
            <div className="flex-1 relative z-10">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={MOCK_AREA_TIMELINE} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorAnomalies" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#DC2626" stopOpacity={0.6}/>
                      <stop offset="95%" stopColor="#DC2626" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorVerified" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#E67E22" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#E67E22" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2A3441" vertical={false} />
                  <XAxis dataKey="time" tick={{ fill: '#6B7280', fontSize: 9, fontFamily: 'var(--font-mono)' }} stroke="#2A3441" />
                  <YAxis tick={{ fill: '#6B7280', fontSize: 9, fontFamily: 'var(--font-mono)' }} stroke="#2A3441" />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                  <Area type="monotone" dataKey="verifications" stroke="#E67E22" strokeWidth={2} fillOpacity={1} fill="url(#colorVerified)" />
                  <Area type="monotone" dataKey="anomalies" stroke="#DC2626" strokeWidth={2} fillOpacity={1} fill="url(#colorAnomalies)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bottom Half: Single Chart Now */}
          <div className="flex-1 flex flex-col md:flex-row gap-4">
            
            {/* Radial Bar Vessely Types */}
            <div className="flex-1 bg-[#131820] border border-[#2A3441] rounded-lg p-3 flex flex-col hover-glow">
              <div className="flex items-center gap-2 mb-2 shrink-0">
                <Ship className="w-4 h-4 text-[#10B981]" />
                <h2 className="text-[10px] font-bold uppercase tracking-widest text-[#D1D5DB]">Vessel Class Density</h2>
              </div>
              <div className="flex-1">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart 
                    cx="50%" 
                    cy="50%" 
                    innerRadius="30%" 
                    outerRadius="100%" 
                    barSize={20} 
                    data={MOCK_RADIAL_TYPES}
                  >
                    <RadialBar
                      background={{ fill: '#1A1E28' }}
                      dataKey="count"
                      cornerRadius={6}
                    />
                    <Legend 
                      iconSize={8} 
                      layout="horizontal" 
                      verticalAlign="bottom"
                      align="center"
                      wrapperStyle={{ 
                        paddingTop: '20px',
                        lineHeight: '24px',
                        fontSize: '10px',
                        fontFamily: 'var(--font-display)',
                        color: '#9CA3AF',
                        textTransform: 'uppercase'
                      }} 
                    />
                    <Tooltip content={<CustomTooltip />} />
                  </RadialBarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        </div>

        {/* === RIGHT COLUMN (25%) - STATS & VERIFICATION === */}
        <div className="w-full lg:w-1/4 flex flex-col gap-4 h-[800px] lg:h-full">
          
          {/* Vertical KPIs */}
          <div className="flex flex-col gap-3 shrink-0">
            {DASHBOARD_STATS.map((stat) => (
              <StatCardCompact key={stat.label} {...stat} />
            ))}
          </div>

          {/* Alert Handled Trends (Composed Chart) */}
          <div className="flex-1 bg-[#131820] border border-[#2A3441] rounded-lg p-3 flex flex-col hover-glow overflow-hidden">
            <div className="flex items-center gap-2 mb-2 shrink-0">
              <Shield className="w-4 h-4 text-[#3B82F6]" />
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-[#D1D5DB]">Intervention Trends</h2>
            </div>
            <div className="flex-1 mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={MOCK_TREND} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid stroke="#2A3441" vertical={false} strokeDasharray="3 3"/>
                  <XAxis dataKey="day" tick={{ fill: '#6B7280', fontSize: 9 }} stroke="#2A3441" />
                  <YAxis tick={{ fill: '#6B7280', fontSize: 9 }} stroke="#2A3441" />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend iconSize={8} wrapperStyle={{ fontSize: '9px', textTransform: 'uppercase' }} />
                  <Bar dataKey="critical" stackId="a" fill="#DC2626" radius={[0,0,4,4]} />
                  <Bar dataKey="high" stackId="a" fill="#E67E22" radius={[4,4,0,0]} />
                  <Line type="monotone" dataKey="handled" stroke="#10B981" strokeWidth={3} dot={{ r: 4, fill: '#10B981', strokeWidth: 2, stroke: '#0C0E14' }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}