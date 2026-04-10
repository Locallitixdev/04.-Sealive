"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/lib/constants";
import { Search, Bell, Anchor, ScrollText, LogOut, ChevronDown } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-14 flex items-center justify-between px-4 bg-[#131820] border-b border-[#2A3441]">
      {/* Left — Logo */}
      <Link href="/map" className="flex items-center gap-2 shrink-0 group">
        <div className="relative">
          <div className="w-9 h-9 bg-[#0C0E14] border border-[#2A3441] rounded-lg flex items-center justify-center group-hover:border-[#E67E22]/40 transition-all duration-300">
            <Anchor className="w-4 h-4 text-[#E67E22] group-hover:scale-110 transition-transform duration-300" />
          </div>
          <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#E67E22] rounded-full animate-glow-pulse" />
        </div>
        <div className="flex items-baseline">
          <span className="text-sm font-bold tracking-[0.2em] text-[#D1D5DB] font-[family-name:var(--font-display)]">
            SEA
          </span>
          <span className="text-sm font-bold tracking-[0.2em] text-[#E67E22] font-[family-name:var(--font-display)]">
            LIVE
          </span>
        </div>
      </Link>

      {/* Center — Navigation - Rounded tabs */}
      <div className="hidden lg:flex items-center gap-1">
        {NAV_ITEMS.map((item, idx) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex items-center gap-2 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider rounded-lg btn-press nav-active-indicator ${
                isActive ? "active" : ""
              } ${
                isActive
                  ? "bg-[#E67E22]/15 text-[#E67E22] border border-[#E67E22]/30 shadow-[0_0_12px_rgba(230,126,34,0.1)]"
                  : "text-[#6B7280] hover:text-[#D1D5DB] hover:bg-[#1A1E28] border border-transparent"
              } transition-all duration-200`}
              style={{ "--i": idx } as React.CSSProperties}
            >
              <Icon className={`w-3.5 h-3.5 transition-transform duration-200 ${isActive ? "scale-110" : "group-hover:scale-105"}`} />
              <span className="hidden xl:inline font-[family-name:var(--font-display)]">{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Right — Search, Notifications, Avatar */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="relative hidden md:block group">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-[#6B7280] group-focus-within:text-[#E67E22] transition-colors duration-200" />
          <input
            type="text"
            placeholder="IMO / MMSI / CALLSIGN"
            className="w-48 bg-[#0C0E14] border border-[#2A3441] rounded-lg pl-8 pr-3 py-1.5 text-[10px] text-[#D1D5DB] placeholder:text-[#6B7280] focus:border-[#E67E22]/50 focus:shadow-[0_0_12px_rgba(230,126,34,0.1)] transition-all duration-200 outline-none font-[family-name:var(--font-mono)] uppercase"
          />
        </div>

        {/* Notifications */}
        <button className="relative p-2 border border-[#2A3441] bg-[#0C0E14] rounded-lg hover:bg-[#1A1E28] hover:border-[#E67E22]/30 btn-press transition-all duration-200 tooltip-hint" data-tooltip="Notifications">
          <Bell className="w-3.5 h-3.5 text-[#6B7280]" />
          <span className="absolute top-0 right-0 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#DC2626] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#DC2626]" />
          </span>
        </button>

        {/* User Dropdown */}
        <div className="relative group">
          <button className="flex items-center gap-2 px-2 py-1 border border-[#2A3441] bg-[#0C0E14] rounded-lg hover:bg-[#1A1E28] hover:border-[#E67E22]/30 btn-press transition-all duration-200">
            <div className="w-5 h-5 bg-[#E67E22]/20 border border-[#E67E22]/30 rounded-md flex items-center justify-center">
              <span className="text-[9px] font-bold text-[#E67E22]">U</span>
            </div>
            <span className="text-[10px] text-[#9CA3AF] hidden sm:inline font-[family-name:var(--font-mono)]">OP-001</span>
            <ChevronDown className="w-3 h-3 text-[#6B7280]" />
          </button>
          
          <div className="absolute right-0 mt-2 w-48 bg-[#0C0E14] border border-[#2A3441] rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 flex flex-col py-1 0 translate-y-2 group-hover:translate-y-0">
            <div className="px-4 py-2 border-b border-[#2A3441] mb-1">
              <p className="text-[10px] uppercase font-bold text-[#9CA3AF] font-[family-name:var(--font-display)]">Signed in as</p>
              <p className="text-xs font-semibold text-white truncate">operator001@sealive.net</p>
            </div>
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
    </nav>
  );
}