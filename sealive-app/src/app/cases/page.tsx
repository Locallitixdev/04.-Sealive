"use client";

import { useState } from "react";
import { PriorityBadge, StatusPill } from "@/components/ui/Badge";
import { MOCK_CASES, CASE_STATUS } from "@/lib/constants";
import {
  Plus,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  FolderOpen,
  Clock,
  CheckCircle2,
  XCircle,
  ClipboardList,
  X,
  FileText,
  Calendar,
  User,
} from "lucide-react";

type StatusKey = keyof typeof CASE_STATUS;

const statusCounts = {
  NEW: MOCK_CASES.filter((c) => c.status === "NEW").length,
  IN_PROGRESS: MOCK_CASES.filter((c) => c.status === "IN_PROGRESS").length,
  RESOLVED: MOCK_CASES.filter((c) => c.status === "RESOLVED").length,
  DISMISSED: MOCK_CASES.filter((c) => c.status === "DISMISSED").length,
};

const summaryCards = [
  { label: "Open Cases", count: statusCounts.NEW, icon: FolderOpen, color: "text-[#3B82F6]", borderHover: "hover:border-[#3B82F6]/40" },
  { label: "In Progress", count: statusCounts.IN_PROGRESS, icon: Clock, color: "text-[#06B6D4]", borderHover: "hover:border-[#06B6D4]/40" },
  { label: "Resolved", count: statusCounts.RESOLVED, icon: CheckCircle2, color: "text-[#059669]", borderHover: "hover:border-[#059669]/40" },
  { label: "Dismissed", count: statusCounts.DISMISSED, icon: XCircle, color: "text-[#6B7280]", borderHover: "hover:border-[#6B7280]/40" },
];

function ReportCard({ title, value, trend }: { title: string; value: string; trend: string }) {
  const isPositive = trend.startsWith("+") || trend === "0%";
  return (
    <div className="bg-[#131820] border border-[#2A3441] rounded-lg p-2 flex items-center justify-between">
      <div>
        <div className="text-[8px] text-[#6B7280] uppercase tracking-wider font-[family-name:var(--font-display)]">{title}</div>
        <div className="text-[12px] font-bold text-[#D1D5DB] font-[family-name:var(--font-mono)]">{value}</div>
      </div>
      <span className={`text-[8px] font-[family-name:var(--font-mono)] ${isPositive ? "text-[#059669]" : "text-[#DC2626]"}`}>{trend}</span>
    </div>
  );
}

function CaseDetailPanel({ caseData, onClose }: { caseData: typeof MOCK_CASES[0]; onClose: () => void }) {
  return (
    <div className="w-[320px] min-w-[320px] border-l border-[#2A3441] bg-[#0C0E14] overflow-y-auto animate-slide-in-right">
      <div className="p-3 border-b border-[#2A3441] bg-[#131820] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-[#E67E22]" />
          <span className="text-[10px] font-bold text-[#E67E22] font-[family-name:var(--font-display)] uppercase">{caseData.id}</span>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-[#1A1E28] rounded transition-colors">
          <X className="w-3 h-3 text-[#6B7280]" />
        </button>
      </div>
      <div className="p-3 space-y-3">
        <div>
          <h3 className="text-[11px] font-semibold text-[#D1D5DB] font-[family-name:var(--font-display)]">{caseData.title}</h3>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-[8px] text-[#6B7280] px-1.5 py-0.5 bg-[#0C0E14] border border-[#2A3441] rounded font-[family-name:var(--font-display)] uppercase">{caseData.type}</span>
            <PriorityBadge priority={caseData.priority} />
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[#6B7280]">
              <User className="w-3 h-3" />
              <span className="text-[8px] uppercase tracking-wider font-[family-name:var(--font-display)]">Assigned</span>
            </div>
            <span className="text-[9px] text-[#D1D5DB] font-[family-name:var(--font-mono)]">{caseData.assigned}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[#6B7280]">
              <Calendar className="w-3 h-3" />
              <span className="text-[8px] uppercase tracking-wider font-[family-name:var(--font-display)]">Date</span>
            </div>
            <span className="text-[9px] text-[#D1D5DB] font-[family-name:var(--font-mono)]">{caseData.date}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[8px] text-[#6B7280] uppercase tracking-wider font-[family-name:var(--font-display)]">Status</span>
            <StatusPill status={caseData.status as StatusKey} />
          </div>
        </div>
        <div className="pt-3 border-t border-[#2A3441] space-y-2">
          <button className="w-full py-2 bg-[#E67E22]/10 border border-[#E67E22]/30 rounded text-[9px] text-[#E67E22] uppercase font-bold tracking-wider hover:bg-[#E67E22]/20 transition-colors font-[family-name:var(--font-display)]">
            Update Status
          </button>
          <div className="flex gap-2">
            <button className="flex-1 py-2 bg-[#0C0E14] border border-[#2A3441] rounded text-[9px] text-[#6B7280] uppercase hover:border-[#3B82F6]/50 transition-colors font-[family-name:var(--font-display)]">Assign</button>
            <button className="flex-1 py-2 bg-[#0C0E14] border border-[#2A3441] rounded text-[9px] text-[#6B7280] uppercase hover:border-[#DC2626]/50 transition-colors font-[family-name:var(--font-display)]">Close</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function NewCaseModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-[480px] bg-[#131820] border border-[#2A3441] rounded-lg shadow-2xl animate-scale-in">
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#2A3441] bg-[#0C0E14] rounded-t-lg">
          <div className="flex items-center gap-2">
            <Plus className="w-4 h-4 text-[#E67E22]" />
            <span className="text-[11px] font-bold text-[#E67E22] uppercase tracking-wider font-[family-name:var(--font-display)]">Create New Case</span>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-[#1A1E28] rounded transition-colors">
            <X className="w-3 h-3 text-[#6B7280]" />
          </button>
        </div>
        <div className="p-4 space-y-3">
          <div>
            <label className="text-[8px] text-[#6B7280] uppercase tracking-wider font-[family-name:var(--font-display)]">Case Title</label>
            <input type="text" placeholder="Enter case title..." className="w-full mt-1 bg-[#0C0E14] border border-[#2A3441] rounded-lg px-3 py-2 text-[10px] text-[#D1D5DB] placeholder:text-[#4A5568] outline-none focus:border-[#E67E22]/50 transition-colors font-[family-name:var(--font-display)]" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[8px] text-[#6B7280] uppercase tracking-wider font-[family-name:var(--font-display)]">Type</label>
              <select className="w-full mt-1 bg-[#0C0E14] border border-[#2A3441] rounded-lg px-3 py-2 text-[10px] text-[#D1D5DB] outline-none focus:border-[#E67E22]/50 transition-colors font-[family-name:var(--font-display)]">
                <option>Incident</option><option>Anomaly</option><option>Routine</option>
              </select>
            </div>
            <div>
              <label className="text-[8px] text-[#6B7280] uppercase tracking-wider font-[family-name:var(--font-display)]">Priority</label>
              <select className="w-full mt-1 bg-[#0C0E14] border border-[#2A3441] rounded-lg px-3 py-2 text-[10px] text-[#D1D5DB] outline-none focus:border-[#E67E22]/50 transition-colors font-[family-name:var(--font-display)]">
                <option>CRITICAL</option><option>HIGH</option><option>MEDIUM</option><option>LOW</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-[8px] text-[#6B7280] uppercase tracking-wider font-[family-name:var(--font-display)]">Description</label>
            <textarea placeholder="Enter case details..." rows={3} className="w-full mt-1 bg-[#0C0E14] border border-[#2A3441] rounded-lg px-3 py-2 text-[10px] text-[#D1D5DB] placeholder:text-[#4A5568] outline-none focus:border-[#E67E22]/50 transition-colors font-[family-name:var(--font-display)] resize-none" />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={onClose} className="px-3 py-1.5 bg-[#0C0E14] border border-[#2A3441] rounded-lg text-[9px] text-[#6B7280] hover:text-[#D1D5DB] transition-colors font-[family-name:var(--font-display)] uppercase">Cancel</button>
            <button className="px-3 py-1.5 bg-[#E67E22]/10 border border-[#E67E22]/30 rounded-lg text-[9px] text-[#E67E22] hover:bg-[#E67E22]/20 transition-colors font-[family-name:var(--font-display)] uppercase font-bold">Create Case</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CasesPage() {
  const [currentPage] = useState(1);
  const [selectedCase, setSelectedCase] = useState<typeof MOCK_CASES[0] | null>(null);
  const [showNewCaseModal, setShowNewCaseModal] = useState(false);

  return (
    <div className="h-full flex flex-col overflow-hidden bg-[#0C0E14] page-enter">
      <div className="flex items-center justify-between px-4 py-2 border-b border-[#2A3441] bg-[#131820]">
        <div className="flex items-center gap-2">
          <ClipboardList className="w-4 h-4 text-[#E67E22]" />
          <span className="text-xs font-bold uppercase tracking-wider text-[#D1D5DB] font-[family-name:var(--font-display)]">Case Management</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="relative group">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-[#6B7280] group-focus-within:text-[#E67E22] transition-colors" />
            <input type="text" placeholder="CASE ID / KEYWORDS" className="w-40 bg-[#0C0E14] border border-[#2A3441] rounded-lg pl-7 pr-2 py-1 text-[9px] text-[#D1D5DB] placeholder:text-[#6B7280] outline-none focus:border-[#E67E22]/50 focus:shadow-[0_0_12px_rgba(230,126,34,0.1)] transition-all duration-200 font-[family-name:var(--font-mono)] uppercase" />
          </div>
          <button className="flex items-center gap-1 px-2 py-1 bg-[#0C0E14] border border-[#2A3441] rounded-lg text-[9px] text-[#6B7280] hover:text-[#D1D5DB] hover:border-[#E67E22]/50 btn-press transition-all duration-200 uppercase tracking-wider font-[family-name:var(--font-display)]">
            <Filter className="w-2.5 h-2.5" />Filter
          </button>
          <button onClick={() => setShowNewCaseModal(true)} className="flex items-center gap-1 px-2 py-1 bg-[#E67E22]/10 border border-[#E67E22]/30 rounded-lg text-[9px] text-[#E67E22] hover:bg-[#E67E22]/20 hover:shadow-[0_0_12px_rgba(230,126,34,0.15)] btn-press transition-all duration-200 uppercase tracking-wider font-[family-name:var(--font-display)]">
            <Plus className="w-3 h-3" />New Case
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
            {summaryCards.map((card, i) => {
              const Icon = card.icon;
              return (
                <div key={card.label} className={`bg-[#131820] border border-[#2A3441] rounded-lg p-3 flex items-center gap-3 ${card.borderHover} hover-lift transition-all duration-200 cursor-pointer stagger-slide-up`} style={{ "--i": i } as React.CSSProperties}>
                  <div className="w-8 h-8 border border-[#2A3441] rounded-lg flex items-center justify-center"><Icon className={`w-4 h-4 ${card.color}`} /></div>
                  <div>
                    <div className="text-lg font-bold text-[#D1D5DB] font-[family-name:var(--font-mono)] count-flash" style={{ "--i": i } as React.CSSProperties}>{card.count}</div>
                    <div className="text-[8px] text-[#6B7280] uppercase tracking-wider font-[family-name:var(--font-display)]">{card.label}</div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-[#131820] border border-[#2A3441] rounded-lg overflow-hidden stagger-slide-up" style={{ "--i": 4 } as React.CSSProperties}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#2A3441] bg-[#0C0E14]">
                    {["Case ID", "Title", "Type", "Priority", "Assigned", "Status", "Date"].map((header) => (
                      <th key={header} className="text-left px-3 py-2 text-[9px] font-bold text-[#6B7280] uppercase tracking-wider font-[family-name:var(--font-display)]">{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {MOCK_CASES.map((c, i) => (
                    <tr key={c.id} onClick={() => setSelectedCase(c)} className={`border-b border-[#1E252F] hover:bg-[#1A1E28] transition-all duration-200 cursor-pointer group row-enter ${i % 2 === 0 ? "bg-[#131820]" : "bg-[#0C0E14]"}`} style={{ "--i": i } as React.CSSProperties}>
                      <td className="px-3 py-2.5 text-[10px] text-[#6B7280] font-[family-name:var(--font-mono)] group-hover:text-[#E67E22] transition-colors">{c.id}</td>
                      <td className="px-3 py-2.5 text-[10px] text-[#D1D5DB] font-[family-name:var(--font-display)] max-w-[240px] truncate group-hover:text-white transition-colors">{c.title}</td>
                      <td className="px-3 py-2.5"><span className="text-[8px] text-[#6B7280] px-1.5 py-0.5 bg-[#0C0E14] border border-[#2A3441] rounded-md font-[family-name:var(--font-display)] uppercase">{c.type}</span></td>
                      <td className="px-3 py-2.5"><PriorityBadge priority={c.priority} /></td>
                      <td className="px-3 py-2.5 text-[9px] text-[#6B7280] font-[family-name:var(--font-display)]">{c.assigned}</td>
                      <td className="px-3 py-2.5"><StatusPill status={c.status as StatusKey} /></td>
                      <td className="px-3 py-2.5 text-[9px] text-[#6B7280] font-[family-name:var(--font-mono)]">{c.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between px-3 py-2 border-t border-[#2A3441]">
              <span className="text-[8px] text-[#6B7280] font-[family-name:var(--font-mono)]">Showing 1-{MOCK_CASES.length} of {MOCK_CASES.length} records</span>
              <div className="flex items-center gap-0.5">
                <button className="p-1 border border-[#2A3441] rounded-md hover:bg-[#1A1E28] btn-press transition-all duration-200"><ChevronLeft className="w-3 h-3 text-[#6B7280]" /></button>
                {[1, 2, 3].map((page) => (
                  <button key={page} className={`w-6 h-6 text-[9px] rounded-md btn-press transition-all duration-200 border ${page === currentPage ? "bg-[#E67E22]/10 text-[#E67E22] border-[#E67E22]/30 shadow-[0_0_8px_rgba(230,126,34,0.15)]" : "text-[#6B7280] border-[#2A3441] hover:bg-[#1A1E28]"}`}>{page}</button>
                ))}
                <span className="text-[#4A5568] text-[8px] px-1">...</span>
                <button className="w-6 h-6 text-[9px] text-[#6B7280] border border-[#2A3441] rounded-md hover:bg-[#1A1E28] btn-press transition-all duration-200">10</button>
                <button className="p-1 border border-[#2A3441] rounded-md hover:bg-[#1A1E28] btn-press transition-all duration-200"><ChevronRight className="w-3 h-3 text-[#6B7280]" /></button>
              </div>
            </div>
          </div>

          <div className="p-3 pt-0 space-y-2">
            <h3 className="text-[9px] text-[#6B7280] uppercase tracking-wider font-[family-name:var(--font-display)]">Quick Reports</h3>
            <div className="grid grid-cols-3 gap-2">
              <ReportCard title="Resolution Rate" value="78%" trend="+5%" />
              <ReportCard title="Avg Response" value="2.4h" trend="-12%" />
              <ReportCard title="Active Cases" value="24" trend="0%" />
            </div>
          </div>
        </div>

        {selectedCase && <CaseDetailPanel caseData={selectedCase} onClose={() => setSelectedCase(null)} />}
        {showNewCaseModal && <NewCaseModal onClose={() => setShowNewCaseModal(false)} />}
      </div>
    </div>
  );
}