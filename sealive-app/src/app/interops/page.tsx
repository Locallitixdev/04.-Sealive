"use client";

import {
  Globe,
  Radio,
  Shield,
  Users,
  Activity,
  Database,
  ArrowRight,
  Cable,
  Server,
} from "lucide-react";

const integrations = [
  {
    name: "AIS Data Provider",
    description: "Real-time vessel positions via Datalastic API",
    status: "PENDING",
    icon: Radio,
    color: "text-[#06B6D4]",
    borderColor: "hover:border-[#06B6D4]/40",
  },
  {
    name: "Weather Service",
    description: "Meteorological data overlay for maritime conditions",
    status: "PENDING",
    icon: Globe,
    color: "text-[#3B82F6]",
    borderColor: "hover:border-[#3B82F6]/40",
  },
  {
    name: "News Aggregator",
    description: "Maritime news and incident feeds via RSS",
    status: "PENDING",
    icon: Activity,
    color: "text-[#E67E22]",
    borderColor: "hover:border-[#E67E22]/40",
  },
  {
    name: "Social Media Monitor",
    description: "Maritime hashtag tracking and geotagged posts",
    status: "PENDING",
    icon: Users,
    color: "text-[#8B5CF6]",
    borderColor: "hover:border-[#8B5CF6]/40",
  },
  {
    name: "Internal Database",
    description: "Case management, user data, audit logs",
    status: "PENDING",
    icon: Database,
    color: "text-[#059669]",
    borderColor: "hover:border-[#059669]/40",
  },
  {
    name: "External APIs",
    description: "Webhook support, RESTful API for third-party systems",
    status: "PENDING",
    icon: Shield,
    color: "text-[#DC2626]",
    borderColor: "hover:border-[#DC2626]/40",
  },
];

export default function InteropsPage() {
  return (
    <div className="h-[calc(100vh-56px)] flex flex-col overflow-hidden bg-[#0C0E14] page-enter">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-[#2A3441] bg-[#131820]">
        <div className="flex items-center gap-2">
          <Cable className="w-4 h-4 text-[#E67E22]" />
          <span className="text-xs font-bold uppercase tracking-wider text-[#D1D5DB] font-[family-name:var(--font-display)]">
            Interops — Integrations
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[8px] text-[#6B7280] font-[family-name:var(--font-mono)]">6 PENDING</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {/* Status Overview - Row style */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[
            { label: "Total", value: "6", color: "text-[#D1D5DB]" },
            { label: "Active", value: "0", color: "text-[#E67E22]" },
            { label: "Pending", value: "6", color: "text-[#6B7280]" },
          ].map((stat, i) => (
            <div
              key={stat.label}
              className="bg-[#131820] border border-[#2A3441] rounded-lg p-3 text-center hover-glow transition-all duration-200 stagger-slide-up"
              style={{ "--i": i } as React.CSSProperties}
            >
              <div className={`text-xl font-bold ${stat.color} font-[family-name:var(--font-mono)] count-flash`} style={{ "--i": i } as React.CSSProperties}>{stat.value}</div>
              <div className="text-[8px] text-[#6B7280] uppercase tracking-wider font-[family-name:var(--font-display)]">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Integration Cards - Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {integrations.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={item.name}
                className={`bg-[#131820] border border-[#2A3441] rounded-lg p-3 ${item.borderColor} hover-lift transition-all duration-200 cursor-pointer group stagger-slide-up`}
                style={{ "--i": i + 3 } as React.CSSProperties}
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-[#0C0E14] border border-[#2A3441] rounded-lg flex items-center justify-center shrink-0 group-hover:border-current/30 transition-all duration-200">
                    <Icon className={`w-4 h-4 ${item.color} transition-transform duration-200 group-hover:scale-110`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[11px] font-semibold text-[#D1D5DB] font-[family-name:var(--font-display)] group-hover:text-white transition-colors">{item.name}</h3>
                    <p className="text-[9px] text-[#6B7280] mt-0.5 leading-tight">
                      {item.description}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[8px] text-[#6B7280] px-2 py-1 bg-[#0C0E14] border border-[#2A3441] rounded-md font-[family-name:var(--font-mono)] uppercase">
                        {item.status}
                      </span>
                      <span className="flex items-center gap-1 text-[8px] text-[#E67E22] opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-2 transition-all duration-200 font-[family-name:var(--font-display)] uppercase">
                        Configure
                        <ArrowRight className="w-2.5 h-2.5" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* API Status */}
        <div className="mt-4 bg-[#131820] border border-[#2A3441] rounded-lg overflow-hidden stagger-slide-up" style={{ "--i": 9 } as React.CSSProperties}>
          <div className="flex items-center gap-2 px-3 py-2 border-b border-[#2A3441]">
            <Server className="w-3 h-3 text-[#6B7280]" />
            <span className="text-[9px] font-bold text-[#6B7280] uppercase tracking-wider font-[family-name:var(--font-display)]">API Health Monitor</span>
          </div>
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto border border-[#2A3441] rounded-lg flex items-center justify-center mb-2 animate-float">
                <Activity className="w-5 h-5 text-[#2A3441]" />
              </div>
              <p className="text-[9px] text-[#4A5568] font-[family-name:var(--font-display)]">API health monitoring</p>
              <p className="text-[8px] text-[#2A3441] font-[family-name:var(--font-mono)]">Phase 1+</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}