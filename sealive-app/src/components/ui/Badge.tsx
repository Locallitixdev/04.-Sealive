import { SEVERITY, CASE_STATUS } from "@/lib/constants";

type SeverityKey = keyof typeof SEVERITY;
type StatusKey = keyof typeof CASE_STATUS;

export function PriorityBadge({ priority }: { priority: SeverityKey }) {
  const colors: Record<string, { bg: string; text: string }> = {
    CRITICAL: { bg: "bg-[#DC2626]", text: "text-[#DC2626]" },
    HIGH: { bg: "bg-[#DC2626]", text: "text-[#DC2626]" },
    MEDIUM: { bg: "bg-[#E67E22]", text: "text-[#E67E22]" },
    LOW: { bg: "bg-[#059669]", text: "text-[#059669]" },
  };
  const c = colors[priority] || colors.LOW;
  const label = SEVERITY[priority]?.label || priority;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase font-[family-name:var(--font-display)] ${c.text} bg-current/10 border border-current/20`}>
      <span className={`w-1.5 h-1.5 rounded-md ${c.bg}`} />
      {label}
    </span>
  );
}

export function StatusPill({ status }: { status: StatusKey }) {
  const colors: Record<string, string> = {
    NEW: "bg-[#3B82F6]/20 text-[#3B82F6] border border-[#3B82F6]/30",
    ACKNOWLEDGED: "bg-[#E67E22]/20 text-[#E67E22] border border-[#E67E22]/30",
    IN_PROGRESS: "bg-[#06B6D4]/20 text-[#06B6D4] border border-[#06B6D4]/30",
    RESOLVED: "bg-[#059669]/20 text-[#059669] border border-[#059669]/30",
    DISMISSED: "bg-[#4A5568]/20 text-[#6B7280] border border-[#4A5568]/30",
  };
  const c = colors[status] || colors.NEW;
  const label = CASE_STATUS[status]?.label || status;
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-lg text-[9px] font-semibold font-[family-name:var(--font-display)] ${c}`}>
      {label}
    </span>
  );
}
