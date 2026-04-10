"use client";

import React, { useState } from "react";
import { Search, Calendar, Flag, Hash, ChevronDown, MoreHorizontal } from "lucide-react";

// Mock data array mimicking the image exactly
const MOCK_PUBLICATIONS = [
  { id: 23689, title: "Bea Cukai Periksa 82 Yacht di Ancol, Tegakkan Keadilan Fiskal", date: "18/04/2026", type: "Other", tags: ["#Kapal", "#Yacht", "#Petugas", "#Beacukai", "#Dermaga Batavia..."], img: "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?w=500&q=80" },
  { id: 23679, title: "11 Nelayan KM Elnas III Ditemukan Selamat Setelah Dua Hari Terombang-ambing di Perairan Teluk Tomini", date: "03/04/2026", type: "Other", tags: ["#Nelayan", "#Evakuasi", "#Tim Sar", "#Perairan Teluk..."], img: "https://images.unsplash.com/photo-1544321798-251f15858cf8?w=500&q=80" },
  { id: 23696, title: "Polsek Pelabuhan Manado Gagalkan Penyelundupan 75 Liter Cap Tikus di Area Pelabuhan", date: "19/03/2026", type: "Contraband Smuggling", tags: ["#Kapal", "#Penyelundupan", "#Barang", "#Pelabuhan..."], img: "https://images.unsplash.com/photo-1517594422361-5e18a94a20e8?w=500&q=80" },
  { id: 23695, title: "Ditpolairud Malut Selidiki Dugaan Kapal Pengangkut Ore Nikel IWIP Tenggelam", date: "19/03/2026", type: "Maritime Accidents", tags: ["#Kapal", "#Tenggelam", "#Ditpolairud", "#Perairan Hal..."], img: "https://images.unsplash.com/photo-1534065672-887e5971bbbe?w=500&q=80" },
  { id: 23694, title: "Bea Cukai Jakarta Periksa 82 Yacht di Ancol, Sasar Barang Mewah hingga Ekonomi Bawah Tanah", date: "18/03/2026", type: "Other", tags: ["#Kapal", "#Yacht", "#Beacukai", "#Pajak", "#Dermaga Batavia..."], img: "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?w=500&q=80" },
  { id: 23693, title: "Bea Cukai Jakarta Periksa 82 Yacht di Batavia Marina, Bidik Pelanggaran Pajak Barang Mewah", date: "18/03/2026", type: "Other", tags: ["#Kapal", "#Yacht", "#Pajak", "#Beacukai", "#Dermaga Batavia..."], img: "https://images.unsplash.com/photo-1605281317010-fe5ffe798166?w=500&q=80" },
  
  { id: 23692, title: "Bea Cukai Jakarta periksa izin dan kepabeanan 82 kapal pesiar", date: "18/03/2026", type: "Other", tags: ["#Kapal", "#Yacht", "#Pajak", "#Beacukai", "#Dermaga Batavia..."], img: "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?w=500&q=80" },
  { id: 23691, title: "Bea Cukai Jakarta Periksa 82 Yacht, Sasar Kepatuhan Pajak Barang Mewah", date: "18/03/2026", type: "Other", tags: ["#Kapal", "#Yacht", "#Beacukai", "#Pajak", "#Dermaga Batavia..."], img: "https://images.unsplash.com/photo-1605281317010-fe5ffe798166?w=500&q=80" },
  { id: 23685, title: "11 ABK KM Elnas III yang Mati Mesin di Teluk Tomini Ditemukan Selamat", date: "18/03/2026", type: "Other", tags: ["#Nelayan", "#Evakuasi", "#Tim Sar", "#Perairan Teluk..."], img: "https://images.unsplash.com/photo-1544321798-251f15858cf8?w=500&q=80" },
  { id: 23680, title: "Bea Cukai Jakarta Periksa Puluhan Yacht di Ancol Jakut", date: "18/03/2026", type: "Other", tags: ["#Kapal", "#Yacht", "#Petugas", "#Beacukai", "#Dermaga Batavi..."], img: "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?w=500&q=80" },
  { id: 23684, title: "Hilang Kontak Sejak 16 Maret, KM Elnas III Ditemukan Selamat di Teluk Tomini", date: "18/03/2026", type: "Other", tags: ["#Nelayan", "#Evakuasi", "#Tim Sar", "#Perairan Teluk..."], img: "https://images.unsplash.com/photo-1544321798-251f15858cf8?w=500&q=80" },
  { id: 23683, title: "Mesin Kapal Mati, 11 Nelayan di Touna Terjebak di Tengah laut", date: "18/03/2026", type: "Other", tags: ["#Nelayan", "#11 Abk Selamat", "#Tim Sar", "#Peraira..."], img: "https://images.unsplash.com/photo-1544321798-251f15858cf8?w=500&q=80" },
];

const TABS = [
  { name: "All Publication", count: null, active: true },
  { name: "Contraband Smuggling", count: 14369 },
  { name: "Drugs Trafficking", count: 4391 },
  { name: "Excise Violations", count: 3275 },
  { name: "Illegal Export/Import", count: 553 },
  { name: "Customs Fraud", count: 471 },
  { name: "Illegal Transshipment", count: 84 },
];

export default function PublicationPage() {
  const [activeTab, setActiveTab] = useState("All Publication");

  return (
    <div className="h-full flex flex-col bg-[#0C0E14] page-enter text-white">
      
      {/* FILTER TOP BAR */}
      <div className="px-5 py-4 border-b border-[#2A3441] bg-[#131820] flex flex-col gap-4">
        {/* Row 1: Filters */}
        <div className="flex gap-3 items-center">
           <div className="relative">
             <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#6B7280]" />
             <input type="text" placeholder="Publication Search" className="w-[180px] bg-[#0C0E14] border border-[#2A3441] rounded-md pl-8 pr-3 py-1.5 text-[11px] text-[#D1D5DB] placeholder-[#6B7280] outline-none focus:border-[#0EA5E9]/50 transition-colors" />
           </div>

           <div className="relative">
             <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#6B7280]" />
             <div className="w-[190px] bg-[#0C0E14] border border-[#2A3441] rounded-md pl-8 pr-3 py-1.5 text-[11px] text-[#D1D5DB] cursor-pointer hover:border-[#4B5563] transition-colors flex items-center justify-between">
               <span>15 Jul 2023 - 18 Apr 2026</span>
               <ChevronDown className="w-3 h-3 text-[#6B7280]" />
             </div>
           </div>

           <div className="relative">
             <Flag className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#6B7280]" />
             <div className="w-[120px] bg-[#0C0E14] border border-[#2A3441] rounded-md pl-8 pr-3 py-1.5 text-[11px] text-[#D1D5DB] cursor-pointer hover:border-[#4B5563] transition-colors flex items-center justify-between">
               <span>All Country</span>
               <ChevronDown className="w-3 h-3 text-[#6B7280]" />
             </div>
           </div>

           <div className="relative">
             <Hash className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#6B7280]" />
             <div className="w-[110px] bg-[#0C0E14] border border-[#2A3441] rounded-md pl-8 pr-3 py-1.5 text-[11px] text-[#D1D5DB] cursor-pointer hover:border-[#4B5563] transition-colors flex items-center justify-between">
               <span>All Tag</span>
               <ChevronDown className="w-3 h-3 text-[#6B7280]" />
             </div>
           </div>
        </div>

        {/* Row 2: Category Badges */}
        <div className="flex gap-2 items-center overflow-x-auto no-scrollbar pb-1">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.name;
            return (
              <button 
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`flex gap-1.5 items-center px-3 py-1.5 rounded-full text-[10px] font-[family-name:var(--font-mono)] border transition-colors shrink-0 ${
                  isActive 
                    ? "bg-[#0EA5E9] text-white border-[#0EA5E9] shadow-[0_0_10px_rgba(14,165,233,0.3)]" 
                    : "bg-[#0C0E14] text-[#D1D5DB] border-[#2A3441] hover:border-[#4B5563]"
                }`}
              >
                <span>{tab.name}</span>
                {tab.count !== null && (
                   <span className={`px-1.5 py-0.5 rounded text-[9px] ${isActive ? "bg-black/20 text-white" : "bg-[#1A1E28] text-[#0EA5E9]"}`}>
                     {tab.count}
                   </span>
                )}
              </button>
            )
          })}
          <button className="flex items-center justify-center px-3 py-1.5 rounded-full border border-[#2A3441] bg-[#0C0E14] text-[#D1D5DB] hover:border-[#4B5563] shrink-0">
             <MoreHorizontal className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* CONTENT AREA */}
      <div className="flex-1 overflow-y-auto p-5">
         
         {/* Sub-header */}
         <div className="flex justify-between items-center mb-5">
            <div className="text-[11px] text-[#9CA3AF] font-[family-name:var(--font-mono)]">
               Show <strong className="text-white">1 - 12</strong> publication from 23541 total publication
            </div>
            <button className="flex items-center gap-2 px-3 py-1.5 bg-[#131820] border border-[#2A3441] rounded-md text-[10px] text-[#D1D5DB] hover:border-[#4B5563] transition-colors font-[family-name:var(--font-display)]">
               <span>↓ Newest</span>
               <ChevronDown className="w-3 h-3 text-[#6B7280]" />
            </button>
         </div>

         {/* GRID OF CARDS */}
         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 pb-10">
            {MOCK_PUBLICATIONS.map((pub, idx) => (
               <div key={idx} className="bg-[#131820] border border-[#2A3441] rounded-lg overflow-hidden hover:border-[#0EA5E9]/50 transition-all duration-300 hover:shadow-[0_4px_20px_rgba(0,0,0,0.5)] group stagger-slide-up" style={{ "--i": idx } as React.CSSProperties}>
                  
                  {/* Image Header */}
                  <div className="relative aspect-[4/3] bg-[#0C0E14] overflow-hidden">
                     <img src={pub.img} alt={pub.title} className="w-full h-full object-cover opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all duration-500" />
                     <div className="absolute top-2 left-2 bg-white rounded-full px-2 py-0.5 shadow-md flex items-center">
                        <span className="text-[9px] font-bold text-black font-[family-name:var(--font-display)]">Publication <span className="text-[#EF4444]">#{pub.id}</span></span>
                     </div>
                  </div>

                  {/* Body */}
                  <div className="p-3 flex flex-col h-[140px]">
                     {/* Title */}
                     <h3 className="text-[11px] font-semibold text-[#E5E7EB] leading-snug line-clamp-3 mb-auto group-hover:text-white transition-colors">
                        {pub.title}
                     </h3>
                     
                     {/* Specs */}
                     <div className="flex items-center justify-between mt-3 mb-2">
                        <div className="flex items-center gap-1.5 text-[9px] text-[#9CA3AF] font-[family-name:var(--font-mono)]">
                           <Calendar className="w-3 h-3" />
                           {pub.date}
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold tracking-wider uppercase font-[family-name:var(--font-display)] border ${
                          pub.type === 'Contraband Smuggling' ? 'text-[#0EA5E9] bg-[#0EA5E9]/10 border-[#0EA5E9]/30' :
                          pub.type === 'Maritime Accidents' ? 'text-[#0EA5E9] bg-[#0EA5E9]/10 border-[#0EA5E9]/30' :
                          'text-[#10B981] bg-[#10B981]/10 border-[#10B981]/30'
                        }`}>
                           {pub.type}
                        </span>
                     </div>

                     {/* Tags */}
                     <div className="flex flex-wrap gap-1 text-[9px] text-[#0EA5E9] font-[family-name:var(--font-mono)] truncate block whitespace-nowrap overflow-hidden">
                        {pub.tags.join(" ")}
                     </div>
                  </div>
               </div>
            ))}
         </div>

      </div>
    </div>
  );
}
