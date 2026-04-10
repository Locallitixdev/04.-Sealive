"use client";

import { useState } from "react";
import { 
  Globe, 
  Search, 
  Filter, 
  MapPin, 
  MessageSquare, 
  Share2, 
  Clock, 
  TrendingUp, 
  BarChart, 
  ShieldAlert,
  ArrowRight
} from "lucide-react";

// Mock Data
const MOCK_TWEETS = [
  { id: 1, user: "WargaPesisir", handle: "@pesisir_kita", text: "Lapor! Ada aktivitas bongkar muat mencurigakan tengah malam di dermaga kecil arah utara. Tidak ada lampu kapal tapi ramai orang. #Pelindo #BongkarMalam", time: "3m ago", platform: "X", location: "Tanjung Priok Area", risk: "CRITICAL" },
  { id: 2, user: "MaritimeObserver", handle: "@sea_watch", text: "Significant speed drop detected for MV PACIFIC HAWK. Possible STS transfer or engine failure. Coast guard should check.", time: "45m ago", platform: "X", location: "Malacca Strait", risk: "WARNING" },
  { id: 3, user: "JohorFishery", handle: "@johorfisher", text: "Banyak kapal pesiar tidak dikenal parkir dekat zona tangkap ikan kita. Tolong @BakamlaRI pantau.", time: "1h ago", platform: "Facebook", location: "Singapore Strait", risk: "ALERT" },
  { id: 4, user: "NewsInsider", handle: "@news_insider", text: "BREAKING: Viral video shows alleged illegal fuel smuggling across the EEZ border.", time: "2h ago", platform: "Telegram", location: "EEZ Border", risk: "CRITICAL" },
  { id: 5, user: "EcoWarrior", handle: "@eco_war", text: "Coral reefs dying because of illegal anchoring by superyachts in Labuan Bajo.", time: "3h ago", platform: "X", location: "Labuan Bajo", risk: "WARNING" }
];

const TRENDING_KEYWORDS = [
  { word: "Limbah / Oil Spill", count: 1240, trend: "+12%" },
  { word: "Kapal Asing", count: 856, trend: "+5%" },
  { word: "Penyelundupan BBM", count: 432, trend: "+24%" },
  { word: "Bakamla", count: 320, trend: "-2%" },
  { word: "AIS Mati", count: 215, trend: "+45%" },
];

export default function SocialMediaMonitoring() {
  const [selectedAlert, setSelectedAlert] = useState<typeof MOCK_TWEETS[0] | null>(null);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "CRITICAL": return "text-[#EF4444] border-[#EF4444]/30 bg-[#EF4444]/10";
      case "WARNING": return "text-[#EAB308] border-[#EAB308]/30 bg-[#EAB308]/10";
      case "ALERT": return "text-[#E67E22] border-[#E67E22]/30 bg-[#E67E22]/10";
      default: return "text-[#6B7280] border-[#2A3441] bg-[#1A1E28]";
    }
  };

  return (
    <div className="h-full flex flex-col overflow-hidden bg-[#0C0E14] page-enter">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-[#2A3441] bg-[#131820]">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-[#8B5CF6]" />
          <span className="text-xs font-bold uppercase tracking-wider text-[#D1D5DB] font-[family-name:var(--font-display)]">OSINT & Social Media Monitoring</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="relative group">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-[#6B7280] group-focus-within:text-[#8B5CF6] transition-colors" />
            <input type="text" placeholder="SEARCH KEYWORDS..." className="w-48 bg-[#0C0E14] border border-[#2A3441] rounded-lg pl-7 pr-2 py-1 text-[9px] text-[#D1D5DB] placeholder:text-[#6B7280] outline-none focus:border-[#8B5CF6]/50 focus:shadow-[0_0_12px_rgba(139,92,246,0.1)] transition-all duration-200 font-[family-name:var(--font-mono)] uppercase" />
          </div>
          <button className="flex items-center gap-1 px-2 py-1 bg-[#0C0E14] border border-[#2A3441] rounded-lg text-[9px] text-[#6B7280] hover:text-[#D1D5DB] hover:border-[#8B5CF6]/50 btn-press transition-all duration-200 uppercase tracking-wider font-[family-name:var(--font-display)]">
            <Filter className="w-2.5 h-2.5" />Filter
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="flex-1 flex overflow-hidden p-3 gap-3">
        
        {/* Left Col: Live Feed */}
        <div className="w-[360px] flex flex-col bg-[#131820] border border-[#2A3441] rounded-lg overflow-hidden shrink-0 stagger-slide-up" style={{ "--i": 1 } as React.CSSProperties}>
          <div className="p-3 border-b border-[#2A3441] bg-[#0C0E14]/50 flex justify-between items-center">
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
               <span className="text-[10px] font-bold text-[#D1D5DB] uppercase tracking-wider font-[family-name:var(--font-display)]">Live Feed</span>
            </div>
            <span className="text-[9px] text-[#6B7280] font-[family-name:var(--font-mono)] text-right">Updated 1s ago</span>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
             {MOCK_TWEETS.map((tweet) => (
                <div 
                   key={tweet.id} 
                   onClick={() => setSelectedAlert(tweet)}
                   className={`p-3 bg-[#0C0E14] border border-[#2A3441] rounded-lg cursor-pointer hover:border-[#8B5CF6]/50 transition-colors group ${selectedAlert?.id === tweet.id ? 'ring-1 ring-[#8B5CF6]/50 shadow-[0_0_15px_rgba(139,92,246,0.15)] bg-[#1A1E28]' : ''}`}
                >
                   <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                         <div className="w-6 h-6 rounded-full bg-[#2A3441] flex items-center justify-center text-[10px] font-bold text-[#D1D5DB]">{tweet.user.charAt(0)}</div>
                         <div>
                            <div className="text-[10px] font-bold text-[#F3F4F6] font-[family-name:var(--font-display)]">{tweet.user}</div>
                            <div className="text-[8px] text-[#6B7280]">{tweet.handle} • {tweet.platform}</div>
                         </div>
                      </div>
                      <span className="text-[8px] text-[#6B7280] font-[family-name:var(--font-mono)]">{tweet.time}</span>
                   </div>
                   <p className="text-[11px] text-[#D1D5DB] leading-relaxed mb-3">
                      {tweet.text}
                   </p>
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-[#6B7280]">
                         <span className="flex items-center gap-1 text-[9px] hover:text-[#8B5CF6] transition-colors"><MessageSquare className="w-3 h-3" /> 12</span>
                         <span className="flex items-center gap-1 text-[9px] hover:text-[#10B981] transition-colors"><Share2 className="w-3 h-3" /> 45</span>
                      </div>
                      <div className={`px-1.5 py-0.5 rounded border text-[8px] font-bold uppercase tracking-wider font-[family-name:var(--font-display)] ${getRiskColor(tweet.risk)}`}>
                         {tweet.risk}
                      </div>
                   </div>
                </div>
             ))}
          </div>
        </div>

        {/* Middle Col: Analytics Dashboard */}
        <div className="flex-1 flex flex-col gap-3 min-w-0 stagger-slide-up" style={{ "--i": 2 } as React.CSSProperties}>
          <div className="grid grid-cols-2 gap-3 h-[180px] shrink-0">
             {/* Trending Keywords */}
             <div className="bg-[#131820] border border-[#2A3441] rounded-lg p-3 flex flex-col">
                <div className="flex items-center gap-2 mb-3">
                   <TrendingUp className="w-3.5 h-3.5 text-[#3B82F6]" />
                   <span className="text-[10px] font-bold text-[#D1D5DB] uppercase tracking-wider font-[family-name:var(--font-display)]">Trending Keywords</span>
                </div>
                <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                   {TRENDING_KEYWORDS.map((kw, i) => (
                      <div key={i} className="flex items-center justify-between group">
                         <div className="flex items-center gap-2">
                           <span className="text-[10px] text-[#6B7280] w-3">{i + 1}.</span>
                           <span className="text-[11px] text-[#D1D5DB] group-hover:text-[#3B82F6] transition-colors">{kw.word}</span>
                         </div>
                         <div className="flex items-center gap-2">
                            <span className="text-[9px] text-[#9CA3AF] font-[family-name:var(--font-mono)]">{kw.count}</span>
                            <span className={`text-[8px] font-[family-name:var(--font-mono)] ${kw.trend.startsWith('+') ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>{kw.trend}</span>
                         </div>
                      </div>
                   ))}
                </div>
             </div>

             {/* Sentiment Chart Mock */}
             <div className="bg-[#131820] border border-[#2A3441] rounded-lg p-3 flex flex-col">
                <div className="flex items-center justify-between mb-3">
                   <div className="flex items-center gap-2">
                     <BarChart className="w-3.5 h-3.5 text-[#EAB308]" />
                     <span className="text-[10px] font-bold text-[#D1D5DB] uppercase tracking-wider font-[family-name:var(--font-display)]">Global Sentiment</span>
                   </div>
                   <select className="bg-[#0C0E14] border border-[#2A3441] rounded text-[8px] text-[#6B7280] px-1 py-0.5 outline-none">
                      <option>Last 24h</option>
                      <option>Last 7d</option>
                   </select>
                </div>
                <div className="flex-1 flex flex-col justify-end gap-2 relative">
                   {/* Mock Bar Chart */}
                   <div className="flex items-end justify-between h-full px-2">
                      <div className="w-6 bg-[#EF4444]/60 rounded-t-sm h-[60%] hover:bg-[#EF4444] transition-colors relative group">
                         <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[8px] text-[#EF4444] opacity-0 group-hover:opacity-100 transition-opacity">60%</span>
                      </div>
                      <div className="w-6 bg-[#6B7280]/40 rounded-t-sm h-[20%] hover:bg-[#6B7280] transition-colors relative group">
                         <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[8px] text-[#6B7280] opacity-0 group-hover:opacity-100 transition-opacity">20%</span>
                      </div>
                      <div className="w-6 bg-[#10B981]/60 rounded-t-sm h-[20%] hover:bg-[#10B981] transition-colors relative group">
                         <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[8px] text-[#10B981] opacity-0 group-hover:opacity-100 transition-opacity">20%</span>
                      </div>
                   </div>
                   <div className="flex justify-between text-[8px] text-[#6B7280] uppercase border-t border-[#2A3441] pt-1">
                      <span>Negative</span>
                      <span>Neutral</span>
                      <span>Positive</span>
                   </div>
                </div>
             </div>
          </div>

          {/* Anomaly Highlight / Escalation Panel */}
          <div className="flex-1 bg-[#131820] border border-[#2A3441] rounded-lg p-4 flex flex-col relative overflow-hidden">
             {/* Background glow effect for critical */}
             <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#8B5CF6]/10 blur-[60px] rounded-full pointer-events-none" />
             
             <div className="flex items-center gap-2 mb-4">
               <ShieldAlert className="w-4 h-4 text-[#8B5CF6]" />
               <span className="text-[11px] font-bold text-[#D1D5DB] uppercase tracking-wider font-[family-name:var(--font-display)]">Anomaly Investigation</span>
             </div>

             {selectedAlert ? (
               <div className="flex-1 flex flex-col bg-[#0C0E14] border border-[#2A3441] rounded-lg p-4 animate-in fade-in slide-in-from-bottom-4 relative">
                  <div className="absolute top-0 right-0 px-2 py-1 bg-[#8B5CF6]/10 border-b border-l border-[#8B5CF6]/30 rounded-bl-lg rounded-tr-lg">
                     <span className="text-[8px] text-[#8B5CF6] font-bold font-[family-name:var(--font-mono)]">OSINT ANOMALY METADATA</span>
                  </div>
                  
                  <h3 className="text-sm font-bold text-white mb-1 font-[family-name:var(--font-display)]">Potential {selectedAlert.risk} Event Detected</h3>
                  <div className="flex items-center gap-3 text-[10px] text-[#6B7280] font-[family-name:var(--font-mono)] border-b border-[#2A3441] pb-3 mb-3">
                     <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {selectedAlert.time}</span>
                     <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-[#E67E22]" /> {selectedAlert.location}</span>
                  </div>

                  <div className="bg-[#1A1E28] border-l-2 border-[#8B5CF6] p-3 rounded-r text-[12px] text-[#D1D5DB] italic mb-4">
                     "{selectedAlert.text}"
                  </div>

                  <div className="space-y-2 mb-auto">
                     <div className="text-[9px] uppercase text-[#6B7280] font-bold tracking-wider font-[family-name:var(--font-display)]">Cross-referenced Data</div>
                     <div className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between text-[10px] bg-[#131820] p-1.5 rounded border border-[#2A3441]">
                           <span className="text-[#9CA3AF]">AIS Anomaly Log</span>
                           <span className="text-[#10B981] flex items-center gap-1">High Correlation <div className="w-1.5 h-1.5 bg-[#10B981] rounded-full" /></span>
                        </div>
                        <div className="flex items-center justify-between text-[10px] bg-[#131820] p-1.5 rounded border border-[#2A3441]">
                           <span className="text-[#9CA3AF]">Satellite Imagery Match</span>
                           <span className="text-[#EAB308] flex items-center gap-1">Pending <div className="w-1.5 h-1.5 bg-[#EAB308] rounded-full animate-pulse" /></span>
                        </div>
                     </div>
                  </div>

                  <div className="pt-4 flex gap-3 mt-4 border-t border-[#2A3441]">
                     <button className="flex-1 py-2 bg-[#0C0E14] border border-[#2A3441] rounded text-[10px] text-[#D1D5DB] uppercase hover:bg-[#1A1E28] hover:border-[#8B5CF6]/50 transition-colors font-bold font-[family-name:var(--font-display)]">
                        Dismiss
                     </button>
                     <button className="flex-1 py-2 bg-[#8B5CF6]/10 border border-[#8B5CF6]/40 rounded text-[10px] text-[#8B5CF6] uppercase hover:bg-[#8B5CF6]/20 transition-colors font-bold flex items-center justify-center gap-2 font-[family-name:var(--font-display)]">
                        Escalate To Case Management <ArrowRight className="w-3 h-3" />
                     </button>
                  </div>
               </div>
             ) : (
                <div className="flex-1 flex flex-col items-center justify-center border border-dashed border-[#2A3441] rounded-lg bg-[#0C0E14]/50">
                  <Search className="w-8 h-8 text-[#2A3441] mb-2" />
                  <p className="text-[11px] text-[#6B7280] max-w-[200px] text-center font-[family-name:var(--font-display)]">
                     Select an incoming OSINT feed item from the left panel to investigate cross-referenced anomalies.
                  </p>
                </div>
             )}
          </div>

        </div>
      </div>
    </div>
  );
}
