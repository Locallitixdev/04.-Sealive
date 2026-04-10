"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, ClipboardList, Megaphone, Globe } from "lucide-react";

export default function CasesLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navs = [
    { name: "Daily Report", icon: FileText, href: "/cases/daily-report" },
    { name: "Case", icon: ClipboardList, href: "/cases", exact: true },
    { name: "Social Media", icon: Globe, href: "/cases/social" },
    { name: "Publication", icon: Megaphone, href: "/cases/publication" },
  ];

  return (
    <div className="flex h-[calc(100vh-56px)] overflow-hidden bg-[#0C0E14] text-white">
      {/* Sidebar */}
      <div className="w-[88px] shrink-0 bg-[#0C0E14] border-r border-[#2A3441] flex flex-col gap-4 py-6 items-center">
        {navs.map((n) => {
           let active = false;
           if (n.exact) {
             active = pathname === n.href;
           } else {
             active = pathname?.startsWith(n.href);
           }

           return (
             <Link 
               key={n.name} 
               href={n.href} 
               className={`flex flex-col items-center justify-center gap-2 w-[70px] h-[70px] rounded-xl transition-all duration-300 border ${
                 active 
                   ? "bg-[#0EA5E9]/10 border-[#0EA5E9]/30 text-[#0EA5E9] shadow-[0_0_12px_rgba(14,165,233,0.15)]" 
                   : "bg-[#131820] border-[#2A3441] text-[#9CA3AF] hover:text-[#D1D5DB] hover:border-[#4B5563]"
               }`}
             >
                <n.icon className={`w-6 h-6 ${active ? "text-[#0EA5E9]" : "text-[#9CA3AF]"}`} strokeWidth={1.5} />
                <span className="text-[9px] font-bold font-[family-name:var(--font-display)] tracking-wider uppercase text-center leading-tight mx-1">
                  {n.name}
                </span>
             </Link>
           )
        })}
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden relative">
        {children}
      </div>
    </div>
  );
}
