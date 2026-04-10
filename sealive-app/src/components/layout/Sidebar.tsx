"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/lib/constants";
import { Search, Bell, Anchor, ScrollText, LogOut, ChevronDown, ChevronRight, ChevronLeft } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <aside className={`fixed top-0 left-0 bottom-0 z-50 flex flex-col bg-[#131820] border-r border-[#2A3441] transition-all duration-300 ${isExpanded ? "w-64" : "w-16 lg:w-[72px] items-center"}`}>
      {/* Top — Logo & Toggle */}
      <div className={`h-16 w-full flex items-center border-b border-[#2A3441] shrink-0 ${isExpanded ? "justify-between px-4" : "justify-center"}`}>
        <Link href="/map" className="relative group flex items-center justify-center gap-3">
          <div className="w-10 h-10 bg-[#0C0E14] border border-[#2A3441] rounded-xl flex items-center justify-center group-hover:border-[#E67E22]/40 transition-all duration-300 shadow-[0_0_10px_rgba(0,0,0,0.5)] group-hover:shadow-[0_0_15px_rgba(230,126,34,0.2)] shrink-0 relative">
            <Anchor className="w-5 h-5 text-[#E67E22] group-hover:scale-110 transition-transform duration-300" />
            {!isExpanded && <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#E67E22] rounded-full animate-glow-pulse" />}
          </div>
          {isExpanded && (
            <div className="flex items-baseline flex-nowrap overflow-hidden">
               <span className="text-xl font-bold tracking-[0.2em] text-[#D1D5DB] font-[family-name:var(--font-display)]">
                 SEA
               </span>
               <span className="text-xl font-bold tracking-[0.2em] text-[#E67E22] font-[family-name:var(--font-display)]">
                 LIVE
               </span>
            </div>
          )}
        </Link>
        {isExpanded && (
          <button onClick={() => setIsExpanded(false)} className="p-1.5 rounded-lg hover:bg-[#1A1E28] text-[#6B7280] hover:text-[#D1D5DB] transition-colors bg-[#0C0E14] border border-[#2A3441]">
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Middle — Navigation */}
      <div className={`flex-1 w-full flex flex-col gap-3 py-6 overflow-y-auto custom-scrollbar ${isExpanded ? "px-4" : "items-center"}`}>
        {NAV_ITEMS.map((item, idx) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex items-center rounded-xl group transition-all duration-200 ${!isExpanded && "w-10 h-10 justify-center"} ${isExpanded && "w-full h-11 px-3.5 gap-3.5"} ${
                isActive
                  ? "bg-[#E67E22]/15 text-[#E67E22] border border-[#E67E22]/30 shadow-[0_0_12px_rgba(230,126,34,0.1)]"
                  : "text-[#6B7280] hover:text-[#D1D5DB] hover:bg-[#1A1E28] border border-transparent"
              } btn-press nav-active-indicator`}
              style={{ "--i": idx } as React.CSSProperties}
            >
              <Icon className={`w-5 h-5 shrink-0 transition-transform duration-200 ${isActive ? "scale-110" : "group-hover:scale-110"}`} />
              {isExpanded && (
                <span className={`text-[11px] font-semibold tracking-wider font-[family-name:var(--font-display)] uppercase truncate ${isActive ? "text-[#E67E22]" : "text-[#D1D5DB]"}`}>
                  {item.label}
                </span>
              )}
              {isActive && !isExpanded && (
                <div className="absolute left-0 w-1 h-6 bg-[#E67E22] rounded-r-md -ml-[14px] lg:-ml-[18px]" />
              )}
              {isActive && isExpanded && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#E67E22] rounded-r-md -ml-[5px]" />
              )}
            </Link>
          );
        })}
      </div>

      {/* Bottom — Utilities & User */}
      <div className={`w-full flex pb-4 pt-4 border-t border-[#2A3441] shrink-0 ${isExpanded ? "flex-col gap-3 px-4" : "flex-col items-center gap-4"}`}>
        {!isExpanded && (
          <button onClick={() => setIsExpanded(true)} className="w-10 h-10 flex items-center justify-center border border-[#2A3441] bg-[#0C0E14] rounded-xl hover:bg-[#1A1E28] hover:border-[#E67E22]/30 btn-press transition-all duration-200">
            <ChevronRight className="w-5 h-5 text-[#6B7280]" />
          </button>
        )}
        
        {isExpanded && (
          <div className="flex items-center gap-2 mb-1">
            <button className="flex-1 h-10 flex items-center justify-center gap-2 border border-[#2A3441] bg-[#0C0E14] rounded-xl hover:bg-[#1A1E28] hover:border-[#E67E22]/30 btn-press transition-all duration-200">
              <Search className="w-4 h-4 text-[#6B7280]" />
              <span className="text-[10px] text-[#6B7280] font-medium font-[family-name:var(--font-mono)] uppercase">Search</span>
            </button>
            <button className="relative w-10 h-10 shrink-0 flex items-center justify-center border border-[#2A3441] bg-[#0C0E14] rounded-xl hover:bg-[#1A1E28] hover:border-[#E67E22]/30 btn-press transition-all duration-200">
              <Bell className="w-4 h-4 text-[#6B7280]" />
              <span className="absolute top-2 right-2 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#DC2626] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#DC2626]" />
              </span>
            </button>
          </div>
        )}

        {!isExpanded && (
          <button className="relative w-10 h-10 flex items-center justify-center border border-[#2A3441] bg-[#0C0E14] rounded-xl hover:bg-[#1A1E28] hover:border-[#E67E22]/30 btn-press transition-all duration-200">
            <Bell className="w-5 h-5 text-[#6B7280]" />
            <span className="absolute top-2 right-2 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#DC2626] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#DC2626]" />
            </span>
          </button>
        )}

        {/* User Dropdown / Trigger */}
        <div className="relative group w-full">
          {!isExpanded ? (
            <button className="w-10 h-10 flex items-center justify-center border border-[#2A3441] bg-[#0C0E14] rounded-xl hover:bg-[#1A1E28] hover:border-[#E67E22]/30 btn-press transition-all duration-200">
              <div className="w-8 h-8 bg-[#E67E22]/20 border border-[#E67E22]/30 rounded-lg flex items-center justify-center">
                <span className="text-[14px] font-bold text-[#E67E22]">U</span>
              </div>
            </button>
          ) : (
            <button className="w-full h-12 flex items-center justify-between px-3 border border-[#2A3441] bg-[#0C0E14] rounded-xl hover:bg-[#1A1E28] hover:border-[#E67E22]/30 btn-press transition-all duration-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#E67E22]/20 border border-[#E67E22]/30 rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-[14px] font-bold text-[#E67E22]">U</span>
                </div>
                <div className="flex flex-col items-start truncate overflow-hidden">
                  <span className="text-[11px] font-bold text-white font-[family-name:var(--font-display)] truncate">operator001</span>
                  <span className="text-[9px] text-[#6B7280] font-[family-name:var(--font-mono)] uppercase">Admin</span>
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-[#6B7280] shrink-0" />
            </button>
          )}

          {/* Pop-out menu */}
          <div className={`absolute ${isExpanded ? "left-0 bottom-full mb-3 w-full" : "left-14 bottom-0 w-48 -translate-x-2"} bg-[#0C0E14] border border-[#2A3441] rounded-lg shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 flex flex-col py-1 ${isExpanded ? "translate-y-2 group-hover:translate-y-0" : "group-hover:translate-x-0"}`}>
            {!isExpanded && (
              <div className="px-4 py-2 border-b border-[#2A3441] mb-1">
                <p className="text-[10px] uppercase font-bold text-[#9CA3AF] font-[family-name:var(--font-display)]">Signed in as</p>
                <p className="text-xs font-semibold text-white truncate">operator001@sealive.net</p>
              </div>
            )}
            <Link href="/audit" className="px-4 py-2 text-xs text-[#D1D5DB] hover:bg-[#1A1E28] hover:text-[#E67E22] flex items-center gap-2 font-medium transition-colors">
              <ScrollText className="w-3.5 h-3.5" />
              Activity Audit Trail
            </Link>
            <div className="h-px bg-[#2A3441] my-1 mx-2" />
            <button className="px-4 py-2 text-xs text-[#EF4444] hover:bg-[#1A1E28] text-left flex items-center gap-2 font-medium transition-colors">
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
