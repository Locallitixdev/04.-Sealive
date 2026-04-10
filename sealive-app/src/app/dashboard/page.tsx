"use client";

import { MOCK_SHIP_TYPES, DASHBOARD_STATS, MOCK_ALERTS, TIMELINE_EVENTS } from "@/lib/constants";
import {
  BarChart3,
  Compass,
  PieChart,
  AlertTriangle,
  Clock,
  RotateCcw,
  Calendar,
  Download,
  Activity,
  Ship,
  Shield,
  AlertCircle,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

const maxShipCount = Math.max(...MOCK_SHIP_TYPES.map((s) => s.count));

const MOCK_ANOMALIES = [
  { type: "Black List", count: 477983, color: "bg-[#059669]" },
  { type: "Drifting", count: 210731, color: "bg-[#E67E22]" },
  { type: "Loitering", count: 103661, color: "bg-[#DC2626]" },
  { type: "Teleporting", count: 98425, color: "bg-[#DC2626]" },
];
const maxAnomalyCount = Math.max(...MOCK_ANOMALIES.map((a) => a.count));

function Card({ title, icon, children, className = "", index = 0 }: { title?: string; icon?: React.ReactNode; children: React.ReactNode; className?: string; index?: number }) {
  return (
    <div
      className={`bg-[#131820] border border-[#2A3441] rounded-lg hover-glow hover-lift stagger-slide-up ${className}`}
      style={{ "--i": index } as React.CSSProperties}
    >
      {title && (
        <div className="flex items-center gap-2 px-3 py-2 border-b border-[#2A3441]">
          {icon && <span className="text-[#6B7280]">{icon}</span>}
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF] font-[family-name:var(--font-display)]">{title}</span>
        </div>
      )}
      <div className="p-3">{children}</div>
    </div>
  );
}

function StatCard({ label, value, change, trend, icon }: { label: string; value: number; change: string; trend: "up" | "down"; icon: string }) {
  const IconComponent = icon === "Ship" ? Ship : icon === "AlertTriangle" ? AlertCircle : icon === "Activity" ? Activity : Shield;
  return (
    <div className="bg-[#131820] border border-[#2A3441] rounded-lg p-3 hover:border-[#E67E22]/30 transition-colors">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[9px] text-[#6B7280] uppercase tracking-wider font-[family-name:var(--font-display)]">{label}</span>
        <div className="w-7 h-7 rounded-lg bg-[#0C0E14] border border-[#2A3441] flex items-center justify-center">
          <IconComponent className="w-3.5 h-3.5 text-[#E67E22]" />
        </div>
      </div>
      <div className="flex items-end justify-between">
        <span className="text-xl font-bold text-[#E2E8F0] font-[family-name:var(--font-mono)] count-flash">{value.toLocaleString('en-US')}</span>
        <div className={`flex items-center gap-0.5 text-[9px] font-[family-name:var(--font-mono)] ${trend === "up" ? "text-[#059669]" : "text-[#DC2626]"}`}>
          {trend === "up" ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
          {change}
        </div>
      </div>
    </div>
  );
}

function AlertCard({ alert }: { alert: typeof MOCK_ALERTS[0] }) {
  const severityColors = {
    CRITICAL: "bg-[#DC2626]/20 text-[#DC2626] border-[#DC2626]/30",
    HIGH: "bg-[#E67E22]/20 text-[#E67E22] border-[#E67E22]/30",
    MEDIUM: "bg-[#F59E0B]/20 text-[#F59E0B] border-[#F59E0B]/30",
  };
  return (
    <div className="flex items-center gap-2 px-2 py-1.5 hover:bg-[#1A1E28] rounded cursor-pointer transition-colors">
      <div className={`w-1.5 h-1.5 rounded-full ${alert.severity === "CRITICAL" ? "bg-[#DC2626]" : alert.severity === "HIGH" ? "bg-[#E67E22]" : "bg-[#F59E0B]"}`} />
      <div className="flex-1 min-w-0">
        <div className="text-[10px] text-[#D1D5DB] truncate font-[family-name:var(--font-display)]">{alert.vessel}</div>
        <div className="text-[8px] text-[#6B7280] font-[family-name:var(--font-mono)]">{alert.type} • {alert.location}</div>
      </div>
      <span className={`text-[7px] px-1.5 py-0.5 rounded font-bold uppercase font-[family-name:var(--font-display)] ${severityColors[alert.severity]}`}>
        {alert.severity}
      </span>
    </div>
  );
}

function TimelineItem({ event }: { event: typeof TIMELINE_EVENTS[0] }) {
  const typeColors = {
    critical: "bg-[#DC2626]",
    alert: "bg-[#E67E22]",
    warning: "bg-[#F59E0B]",
    anomaly: "bg-[#3B82F6]",
    info: "bg-[#06B6D4]",
  };
  return (
    <div className="flex items-start gap-2 py-1.5 hover:bg-[#1A1E28] rounded px-1 cursor-pointer transition-colors">
      <span className="text-[8px] text-[#4A5568] font-[family-name:var(--font-mono)] shrink-0 w-9">{event.time}</span>
      <div className={`w-1.5 h-1.5 rounded-full mt-1 ${typeColors[event.type as keyof typeof typeColors]}`} />
      <div className="flex-1 min-w-0">
        <div className="text-[9px] text-[#D1D5DB] font-[family-name:var(--font-display)]">{event.event}</div>
        <div className="text-[8px] text-[#6B7280] font-[family-name:var(--font-mono)]">{event.vessel}</div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="h-[calc(100vh-56px)] flex flex-col overflow-hidden bg-[#0C0E14] page-enter">
      {/* Header Bar - Rounded control panel */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-[#2A3441] bg-[#131820] stagger-in" style={{ "--i": 0 } as React.CSSProperties}>
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-[#6B7280] uppercase tracking-wider font-[family-name:var(--font-display)]">Period</span>
          <span className="text-xs font-bold text-[#E67E22] font-[family-name:var(--font-mono)]">2026-04</span>
        </div>
        <div className="flex items-center gap-1">
          <button className="flex items-center gap-1.5 px-2 py-1.5 bg-[#0C0E14] border border-[#2A3441] rounded-lg text-[9px] text-[#6B7280] hover:text-[#D1D5DB] hover:border-[#E67E22]/50 btn-press transition-all duration-200 uppercase tracking-wider font-[family-name:var(--font-display)]">
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
          <button className="flex items-center gap-1.5 px-2 py-1.5 bg-[#0C0E14] border border-[#2A3441] rounded-lg text-[9px] text-[#6B7280] hover:text-[#D1D5DB] hover:border-[#E67E22]/50 btn-press transition-all duration-200 uppercase tracking-wider font-[family-name:var(--font-mono)]">
            <Calendar className="w-3 h-3" />
            01 APR — 08 APR
          </button>
          <button className="flex items-center gap-1.5 px-2 py-1.5 bg-[#E67E22]/10 border border-[#E67E22]/30 rounded-lg text-[9px] text-[#E67E22] hover:bg-[#E67E22]/20 btn-press transition-all duration-200 uppercase tracking-wider font-[family-name:var(--font-display)]">
            <Download className="w-3 h-3" />
            Export
          </button>
        </div>
      </div>

      {/* Dashboard Grid */}
      <div className="flex-1 overflow-y-auto p-3">
        {/* Overview Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
          {DASHBOARD_STATS.map((stat, i) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {/* === Row 1 === */}

          {/* Top 10 Ships Type — Horizontal Bar */}
          <Card title="Vessel Type Distribution" icon={<BarChart3 className="w-3 h-3" />} index={0}>
            <div className="space-y-1.5">
              {MOCK_SHIP_TYPES.map((ship, i) => (
                <div key={ship.type} className="flex items-center gap-2">
                  <span className="text-[9px] text-[#6B7280] w-24 text-right shrink-0 truncate uppercase tracking-wider font-[family-name:var(--font-display)]">
                    {ship.type}
                  </span>
                  <div className="flex-1 h-4 bg-[#0C0E14] border border-[#1E252F] overflow-hidden rounded-sm">
                    <div
                      className="h-full bg-gradient-to-r from-[#E67E22] to-[#059669] flex items-center justify-end pr-1.5 bar-grow"
                      style={{ width: `${(ship.count / maxShipCount) * 100}%`, "--i": i } as React.CSSProperties}
                    >
                      <span className="text-[8px] font-bold text-[#0C0E14] font-[family-name:var(--font-mono)]">
                        {ship.count.toLocaleString('en-US')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Heading by Speed — Radar */}
          <Card title="Heading by Speed" icon={<Compass className="w-3 h-3" />} index={1}>
            <div className="flex items-center justify-center py-2">
              <div className="relative w-40 h-40">
                {/* Concentric circles */}
                {[100, 75, 50, 25].map((size) => (
                  <div
                    key={size}
                    className="absolute border border-[#2A3441] rounded-full"
                    style={{
                      width: `${size}%`,
                      height: `${size}%`,
                      top: `${(100 - size) / 2}%`,
                      left: `${(100 - size) / 2}%`,
                    }}
                  />
                ))}
                {/* Compass lines */}
                <div className="absolute top-0 left-1/2 w-px h-full bg-[#2A3441] -translate-x-1/2" />
                <div className="absolute top-1/2 left-0 w-full h-px bg-[#2A3441] -translate-y-1/2" />
                <div className="absolute top-0 left-0 w-full h-full origin-center rotate-45">
                  <div className="absolute top-0 left-1/2 w-px h-full bg-[#1E252F] -translate-x-1/2" />
                </div>
                <div className="absolute top-0 left-0 w-full h-full origin-center -rotate-45">
                  <div className="absolute top-0 left-1/2 w-px h-full bg-[#1E252F] -translate-x-1/2" />
                </div>
                {/* Direction labels */}
                {[
                  { label: "N", top: "-8%", left: "46%" },
                  { label: "E", top: "44%", left: "102%" },
                  { label: "S", top: "102%", left: "46%" },
                  { label: "W", top: "44%", left: "-12%" },
                ].map((d) => (
                  <span
                    key={d.label}
                    className="absolute text-[8px] text-[#4A5568] font-bold font-[family-name:var(--font-mono)]"
                    style={{ top: d.top, left: d.left }}
                  >
                    {d.label}
                  </span>
                ))}
                {/* Radar sweep */}
                <div className="absolute inset-0 rounded-full overflow-hidden">
                  <div
                    className="absolute top-0 left-1/2 w-1/2 h-1/2 origin-bottom-left animate-spin-slow"
                    style={{ background: "linear-gradient(to right, transparent, rgba(230, 126, 34, 0.08))" }}
                  />
                </div>
                {/* Data points with pulse */}
                <div className="absolute top-[15%] left-[45%] w-8 h-10 bg-[#E67E22]/20 rounded-full blur-sm dot-pulse" style={{ "--i": 0 } as React.CSSProperties} />
                <div className="absolute top-[35%] left-[55%] w-6 h-8 bg-[#E67E22]/15 rounded-full blur-sm dot-pulse" style={{ "--i": 1 } as React.CSSProperties} />
                <div className="absolute top-[60%] left-[40%] w-5 h-6 bg-[#E67E22]/10 rounded-full blur-sm dot-pulse" style={{ "--i": 2 } as React.CSSProperties} />
              </div>
            </div>
            {/* Legend */}
            <div className="flex items-center justify-center gap-3 mt-1">
              {[
                { label: "0", color: "bg-[#3B82F6]" },
                { label: "0-3", color: "bg-[#06B6D4]" },
                { label: "3-10", color: "bg-[#059669]" },
                { label: ">10", color: "bg-[#E67E22]" },
              ].map((l) => (
                <div key={l.label} className="flex items-center gap-1">
                  <span className={`w-1.5 h-1.5 rounded-sm ${l.color}`} />
                  <span className="text-[8px] text-[#6B7280] font-[family-name:var(--font-mono)]">{l.label}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Verified vs Unverified — Donut */}
          <Card title="Vessel Verification Status" icon={<PieChart className="w-3 h-3" />} index={2}>
            <p className="text-[9px] text-[#6B7280] mb-3">
              Verified: IMO assigned | Unverified: IMO undefined
            </p>
            <div className="flex items-center justify-center">
              <div className="relative w-36 h-36 group">
                <div
                  className="w-full h-full rounded-full transition-transform duration-500 group-hover:scale-105"
                  style={{
                    background: `conic-gradient(
                      #E67E22 0deg 284.4deg,
                      #059669 284.4deg 360deg
                    )`,
                  }}
                />
                <div className="absolute top-[20%] left-[20%] w-[60%] h-[60%] rounded-full bg-[#131820] flex items-center justify-center border border-[#2A3441]">
                  <div className="text-center">
                    <div className="text-base font-bold text-[#E67E22] font-[family-name:var(--font-mono)] count-flash" style={{ "--i": 0 } as React.CSSProperties}>78.9%</div>
                    <div className="text-[8px] text-[#6B7280] uppercase tracking-wider font-[family-name:var(--font-display)]">Verified</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-4 mt-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-sm bg-[#E67E22]" />
                <span className="text-[9px] text-[#6B7280] font-[family-name:var(--font-mono)]">78.9%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-sm bg-[#059669]" />
                <span className="text-[9px] text-[#6B7280] font-[family-name:var(--font-mono)]">21.1%</span>
              </div>
            </div>
          </Card>

          {/* === Row 2 === */}

          {/* Top Anomaly */}
          <Card title="Anomaly Detection" icon={<AlertTriangle className="w-3 h-3" />} index={3}>
            <div className="space-y-2">
              {MOCK_ANOMALIES.map((anomaly, i) => (
                <div key={anomaly.type} className="flex items-center gap-2">
                  <span className="text-[9px] text-[#6B7280] w-16 text-right shrink-0 uppercase tracking-wider font-[family-name:var(--font-display)]">
                    {anomaly.type}
                  </span>
                  <div className="flex-1 h-4 bg-[#0C0E14] border border-[#1E252F] overflow-hidden rounded-sm">
                    <div
                      className={`h-full ${anomaly.color} flex items-center pl-1.5 bar-grow`}
                      style={{
                        width: `${(anomaly.count / maxAnomalyCount) * 100}%`,
                        "--i": i,
                      } as React.CSSProperties}
                    >
                      <span className="text-[8px] font-bold text-[#0C0E14] font-[family-name:var(--font-mono)]">
                        {anomaly.count.toLocaleString('en-US')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Empty placeholder */}
          <Card title="Active Alerts" icon={<AlertCircle className="w-3 h-3" />} index={4}>
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {MOCK_ALERTS.map((alert) => (
                <AlertCard key={alert.id} alert={alert} />
              ))}
            </div>
          </Card>

          {/* Anomaly Hours — Timeline */}
          <Card title="Anomaly Timeline (24h)" icon={<Clock className="w-3 h-3" />} index={5}>
            <div className="space-y-1.5 text-[9px]">
              {[
                { label: "7 Days", dots: [0, 1, 0, 2, 0, 1, 0, 2, 1, 0, 1, 2, 0, 1, 0, 2, 1, 0, 1, 0, 0, 1, 2, 1] },
                { label: "AIS Gap", dots: [1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0] },
                { label: "Black List", dots: [2, 2, 3, 2, 2, 3, 2, 3, 2, 2, 3, 2, 3, 2, 2, 3, 2, 3, 2, 2, 3, 2, 3, 2] },
                { label: "Drifting", dots: [1, 2, 1, 2, 1, 2, 3, 2, 1, 2, 1, 2, 1, 2, 3, 2, 1, 2, 1, 2, 1, 2, 3, 2] },
              ].map((row, rowIdx) => (
                <div key={row.label} className="flex items-center gap-2 row-enter" style={{ "--i": rowIdx } as React.CSSProperties}>
                  <span className="w-16 text-right text-[#6B7280] shrink-0 text-[8px] uppercase tracking-wider font-[family-name:var(--font-display)] truncate">
                    {row.label}
                  </span>
                  <div className="flex-1 flex items-center gap-[2px]">
                    {row.dots.map((d, i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-sm transition-all duration-200 hover:scale-125 cursor-pointer ${
                          d === 0
                            ? "bg-[#0C0E14] hover:bg-[#1A1E28]"
                            : d === 1
                            ? "bg-[#E67E22]/40 hover:bg-[#E67E22]/60"
                            : d === 2
                            ? "bg-[#E67E22]/70 hover:bg-[#E67E22]/90"
                            : "bg-[#E67E22] hover:bg-[#E67E22] hover:shadow-[0_0_6px_rgba(230,126,34,0.5)]"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}