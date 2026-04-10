"use client";

import { useState } from "react";
import { Download, Search, Filter, ShieldAlert, Activity, User, Server } from "lucide-react";
import Card from "@/components/ui/Card";
import { MOCK_AUDIT_LOGS } from "@/lib/constants";

export default function AuditTrailPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Filter logs based on search and selected category
  const filteredLogs = MOCK_AUDIT_LOGS.filter(log => {
    const matchesSearch = log.action.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          log.identity.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          log.entity.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory ? log.category === activeCategory : true;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    switch(category) {
      case "SYSTEM": return "text-[#3B82F6] bg-[#3B82F6]/10 border-[#3B82F6]/30";
      case "OPERATION": return "text-[#E67E22] bg-[#E67E22]/10 border-[#E67E22]/30";
      case "SECURITY": return "text-[#EF4444] bg-[#EF4444]/10 border-[#EF4444]/30";
      default: return "text-[#6B7280] bg-[#6B7280]/10 border-[#6B7280]/30";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch(category) {
      case "SYSTEM": return <Server className="w-3 h-3" />;
      case "OPERATION": return <Activity className="w-3 h-3" />;
      case "SECURITY": return <ShieldAlert className="w-3 h-3" />;
      default: return <User className="w-3 h-3" />;
    }
  };

  const getStatusColor = (status: string) => {
    if (status.includes("SUCCESS")) return "text-[#10B981]";
    if (status.includes("FAILED") || status.includes("BLOCKED")) return "text-[#EF4444]";
    if (status.includes("ALERT")) return "text-[#F59E0B]";
    return "text-[#D1D5DB]";
  };

  return (
    <div className="h-[calc(100vh-48px)] bg-[#0B111D] text-[#D1D5DB] overflow-y-auto page-enter">
      <div className="max-w-[1600px] mx-auto p-4 lg:p-6 space-y-4 lg:space-y-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#1A1E28] rounded-xl border border-[#2A3441] shadow-lg animate-glow-pulse">
              <ShieldAlert className="w-6 h-6 text-[#E67E22]" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white font-[family-name:var(--font-display)] tracking-wide uppercase">
                Activity Audit Trail
              </h1>
              <p className="text-sm text-[#9CA3AF]">
                System Health: <span className="text-[#10B981] font-bold">99.9%</span> • Last 24 Hours Logging
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="h-9 px-4 flex items-center gap-2 bg-[#1A1E28] hover:bg-[#2A3441] border border-[#2A3441] hover:border-[#4A5568] rounded-lg text-xs font-semibold text-[#D1D5DB] transition-all hover-lift btn-press">
              <Download className="w-3.5 h-3.5" />
              EXPORT CSV
            </button>
          </div>
        </div>

        {/* Toolbar Section */}
        <Card noPadding className="border-[#2A3441] shadow-lg flex flex-col md:flex-row justify-between items-stretch stagger-in mb-6">
          <div className="flex-1 flex items-center relative border-b md:border-b-0 md:border-r border-[#2A3441] group">
            <Search className="w-4 h-4 text-[#6B7280] absolute left-4 group-focus-within:text-[#E67E22] transition-colors" />
            <input
              type="text"
              placeholder="Search signatures, IP addresses, or action logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-12 bg-transparent text-sm pl-11 pr-4 focus:outline-none placeholder:text-[#4B5563] text-white"
            />
          </div>
          <div className="flex items-center px-2 py-2 md:py-0 overflow-x-auto">
            <span className="text-[10px] uppercase font-bold text-[#6B7280] px-3 font-[family-name:var(--font-display)] flex items-center gap-1.5">
              <Filter className="w-3 h-3" /> Filters:
            </span>
            {["SYSTEM", "OPERATION", "SECURITY"].map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                className={`mx-1 px-3 py-1.5 rounded-md text-xs font-bold font-[family-name:var(--font-display)] uppercase border transition-all ${activeCategory === cat ? 'bg-[#E67E22] border-[#E67E22] text-white shadow-[0_0_10px_rgba(230,126,34,0.3)]' : 'bg-[#1A1E28] border-[#2A3441] text-[#9CA3AF] hover:text-white hover:border-[#4A5568]'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </Card>

        {/* Audit Log Table */}
        <Card className="shadow-lg border-[#2A3441] overflow-hidden" noPadding>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="border-b border-[#2A3441] bg-[#1A1E28]">
                  <th className="py-3 px-4 text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider font-[family-name:var(--font-display)]">Timestamp</th>
                  <th className="py-3 px-4 text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider font-[family-name:var(--font-display)]">Category</th>
                  <th className="py-3 px-4 text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider font-[family-name:var(--font-display)]">Action & Entity</th>
                  <th className="py-3 px-4 text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider font-[family-name:var(--font-display)]">Identity</th>
                  <th className="py-3 px-4 text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider font-[family-name:var(--font-display)]">Client IP</th>
                  <th className="py-3 px-4 text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider font-[family-name:var(--font-display)]">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E252F]">
                {filteredLogs.map((log, index) => (
                  <tr key={log.id} className="group hover:bg-[#1A1E28]/60 transition-colors row-enter" style={{ animationDelay: `${index * 0.05}s` }}>
                    <td className="py-3 px-4">
                      <div className="flex flex-col">
                        <span className="text-xs text-white font-[family-name:var(--font-mono)]">{log.timestamp.split(" ")[1]}</span>
                        <span className="text-[10px] text-[#6B7280]">{log.timestamp.split(" ")[0]}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded border text-[9px] uppercase font-bold tracking-wider font-[family-name:var(--font-display)] ${getCategoryColor(log.category)}`}>
                        {getCategoryIcon(log.category)}
                        {log.category}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-col">
                        <span className="text-sm text-white font-medium group-hover:text-[#E67E22] transition-colors">{log.action}</span>
                        <span className="text-[11px] text-[#9CA3AF] flex items-center gap-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#3B82F6]" />
                          {log.entity}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-xs text-[#D1D5DB] border-b border-dashed border-[#4B5563] pb-0.5">{log.identity}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-xs text-[#9CA3AF] font-[family-name:var(--font-mono)]">{log.ip}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-[11px] font-bold uppercase tracking-wide font-[family-name:var(--font-display)] ${getStatusColor(log.status)}`}>
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredLogs.length === 0 && (
              <div className="py-12 text-center flex flex-col items-center">
                <Search className="w-8 h-8 text-[#4B5563] mb-3" />
                <p className="text-sm text-[#9CA3AF]">No audit logs match your search.</p>
              </div>
            )}
          </div>
        </Card>

      </div>
    </div>
  );
}
