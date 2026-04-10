import {
  Globe,
  BarChart3,
  Radar,
  FolderKanban,
  Map,
  ScrollText,
} from "lucide-react";

export const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: BarChart3 },
  { label: "Monitoring", href: "/situational", icon: Radar },
  { label: "Incidents", href: "/cases", icon: FolderKanban },
  { label: "Live Map", href: "/map", icon: Map },
] as const;

export const SEVERITY = {
  CRITICAL: { label: "Critical", color: "bg-accent-red", text: "text-accent-red" },
  HIGH: { label: "High", color: "bg-accent-red", text: "text-accent-red" },
  MEDIUM: { label: "Medium", color: "bg-accent-amber", text: "text-accent-amber" },
  LOW: { label: "Low", color: "bg-accent-green", text: "text-accent-green" },
} as const;

export const CASE_STATUS = {
  NEW: { label: "New", color: "bg-accent-blue/20 text-accent-blue" },
  ACKNOWLEDGED: { label: "Acknowledged", color: "bg-accent-amber/20 text-accent-amber" },
  IN_PROGRESS: { label: "In Progress", color: "bg-accent-cyan/20 text-accent-cyan" },
  RESOLVED: { label: "Resolved", color: "bg-accent-green/20 text-accent-green" },
  DISMISSED: { label: "Dismissed", color: "bg-text-muted/20 text-text-muted" },
} as const;

export const VESSEL_TYPES = [
  "Cargo Vessels",
  "Tankers",
  "Fishing",
  "Passenger",
  "Tugs & Special Craft",
  "Pleasure Craft",
  "Navigation Aids",
  "High Speed Craft",
  "Unspecified Ships",
  "Yacht",
  "Superyacht & Megayacht",
  "Luxury Cruise Ship",
] as const;

// Mock vessels for sidebar
export const MOCK_VESSELS = [
  { id: "V001", name: "SEVEN SEAS SPLENDOR", flag: "🇸🇬", type: "Luxury Cruise Ship", status: "Underway", speed: "9.4 kn", mmsi: "141762274", imo: "3517676", lastUpdate: "12 min ago" },
  { id: "V002", name: "AZEAM", flag: "🇲🇭", type: "Superyacht & Megayacht", status: "Underway", speed: "6.1 kn", mmsi: "103186938", imo: "7926682", lastUpdate: "19 min ago" },
  { id: "V003", name: "YACHT-022", flag: "🇭🇰", type: "Yacht", status: "Underway", speed: "14.2 kn", mmsi: "477123456", imo: "9654321", lastUpdate: "1 min ago" },
  { id: "V004", name: "MIGHTY TUG", flag: "🇳🇴", type: "Tug", status: "Moored", speed: "0.0 kn", mmsi: "563001234", imo: "9876543", lastUpdate: "3 min ago" },
  { id: "V005", name: "SWIFT EAGLE", flag: "🇯🇵", type: "Fishing", status: "Underway", speed: "8.3 kn", mmsi: "431789012", imo: "9567890", lastUpdate: "4 min ago" },
  { id: "V006", name: "PACIFIC DAWN", flag: "🇲🇭", type: "Passenger", status: "Underway", speed: "18.7 kn", mmsi: "538006789", imo: "9912345", lastUpdate: "1 min ago" },
  { id: "V007", name: "CORAL SEA", flag: "🇮🇩", type: "Cargo", status: "Anchored", speed: "0.1 kn", mmsi: "525100345", imo: "9823456", lastUpdate: "6 min ago" },
];

// Mock cases
export const MOCK_CASES = [
  { id: "C-001", title: "Suspicious vessel near Natuna", type: "Anomaly", priority: "HIGH" as const, assigned: "Team Alpha", status: "NEW" as const, date: "2026-04-08" },
  { id: "C-002", title: "Oil spill detection — Malacca Strait", type: "Incident", priority: "CRITICAL" as const, assigned: "Team Bravo", status: "IN_PROGRESS" as const, date: "2026-04-07" },
  { id: "C-003", title: "Patrol schedule — Sunda Strait", type: "Routine", priority: "LOW" as const, assigned: "Team Charlie", status: "ACKNOWLEDGED" as const, date: "2026-04-07" },
  { id: "C-004", title: "AIS blackout near Makassar", type: "Anomaly", priority: "HIGH" as const, assigned: "Team Alpha", status: "NEW" as const, date: "2026-04-06" },
  { id: "C-005", title: "Illegal fishing report — Arafura Sea", type: "Anomaly", priority: "MEDIUM" as const, assigned: "Team Delta", status: "IN_PROGRESS" as const, date: "2026-04-06" },
  { id: "C-006", title: "Collision near Tanjung Priok", type: "Incident", priority: "CRITICAL" as const, assigned: "Team Bravo", status: "RESOLVED" as const, date: "2026-04-05" },
  { id: "C-007", title: "Route deviation — Lombok Strait", type: "Anomaly", priority: "MEDIUM" as const, assigned: "Team Charlie", status: "DISMISSED" as const, date: "2026-04-05" },
  { id: "C-008", title: "Inspection assignment — Port Surabaya", type: "Routine", priority: "LOW" as const, assigned: "Team Delta", status: "RESOLVED" as const, date: "2026-04-04" },
];

// Mock anomaly locations
export const MOCK_ANOMALY_LOCATIONS = [
  { name: "Japan Sea", percentage: 24.31, count: 154, trend: "up" as const },
  { name: "Mediterranean Sea – Western Basin", percentage: 21.89, count: 139, trend: "up" as const },
  { name: "Tasman Sea", percentage: 20.72, count: 131, trend: "up" as const },
  { name: "Arabian Sea", percentage: 17.72, count: 112, trend: "down" as const },
  { name: "Singapore Strait", percentage: 15.10, count: 96, trend: "down" as const },
];

// Mock blacklist vessels
export const MOCK_BLACKLIST_VESSELS = [
  { name: "MSC AGATA III", mou: "Paris MOU", flag: "🇵🇦", status: "Unknown", time: "5 minutes ago" },
  { name: "JOLIE", mou: "Paris MOU", flag: "🇱🇷", status: "Unknown", time: "5 minutes ago" },
  { name: "MYSTIC", mou: "Tokyo MOU", flag: "🇭🇰", status: "Unknown", time: "5 minutes ago" },
];

// Mock dashboard stats
export const MOCK_SHIP_TYPES = [
  { type: "Cargo Vessels", count: 19926 },
  { type: "Tugs & Special Craft", count: 10491 },
  { type: "Tankers", count: 5817 },
  { type: "Pleasure Craft", count: 3682 },
  { type: "Unspecified Ships", count: 3618 },
  { type: "Navigation Aids", count: 1830 },
  { type: "High Speed Craft", count: 940 },
  { type: "Passenger Vessels", count: 332 },
  { type: "Fishing", count: 1 },
  { type: "Yacht", count: 45 },
  { type: "Superyacht & Megayacht", count: 30 },
  { type: "Luxury Cruise Ship", count: 25 },
];

// Mock bottom bar stats
export const MOCK_BOTTOM_STATS = [
  { label: "Drifting", count: 1203, color: "text-accent-amber" },
  { label: "Teleporting", count: 1264, color: "text-accent-purple" },
  { label: "Black List", count: 918, color: "text-accent-red" },
  { label: "False Ident", count: 673, color: "text-accent-blue" },
];

// Phase 2: Dashboard Overview Stats
export const DASHBOARD_STATS = [
  { label: "Total Vessels", value: 47237, change: "+2.3%", trend: "up" as const, icon: "Ship" },
  { label: "Active Alerts", value: 847, change: "-12%", trend: "down" as const, icon: "AlertTriangle" },
  { label: "Anomalies", value: 2156, change: "+5%", trend: "up" as const, icon: "Activity" },
  { label: "Verifications", value: 37285, change: "+8%", trend: "up" as const, icon: "Shield" },
];

// Phase 2: Alerts
export const MOCK_ALERTS = [
  { id: "A001", vessel: "MSC AGATA III", type: "Speed Anomaly", severity: "HIGH" as const, location: "Natuna Sea", time: "2 min ago", status: "NEW" as const },
  { id: "A002", vessel: "JOLIE", type: "Zone Violation", severity: "CRITICAL" as const, location: "Malacca Strait", time: "5 min ago", status: "ACKNOWLEDGED" as const },
  { id: "A003", vessel: "MYSTIC", type: "Route Deviation", severity: "MEDIUM" as const, location: "Lombok Strait", time: "12 min ago", status: "IN_PROGRESS" as const },
  { id: "A004", vessel: "OCEAN GRACE", type: "AIS Blackout", severity: "HIGH" as const, location: "Sulawesi Sea", time: "18 min ago", status: "NEW" as const },
  { id: "A005", vessel: "SWIFT EAGLE", type: "IUU Fishing", severity: "CRITICAL" as const, location: "Arafura Sea", time: "25 min ago", status: "ACKNOWLEDGED" as const },
];

// Phase 2: Timeline Events
export const TIMELINE_EVENTS = [
  { id: "T001", time: "14:45", event: "Speed anomaly detected", vessel: "MSC AGATA III", type: "anomaly" },
  { id: "T002", time: "14:32", event: "Zone violation alert", vessel: "JOLIE", type: "alert" },
  { id: "T003", time: "14:28", event: "Vessel verified", vessel: "MYSTIC", type: "info" },
  { id: "T004", time: "14:15", event: "AIS signal lost", vessel: "OCEAN GRACE", type: "warning" },
  { id: "T005", time: "14:02", event: "New blacklisted vessel", vessel: "SWIFT EAGLE", type: "critical" },
  { id: "T006", time: "13:55", event: "Route deviation", vessel: "CORAL SEA", type: "anomaly" },
];

// Phase 5: Audit Trail Logs
export const MOCK_AUDIT_LOGS = [
  { id: "LOG-9001", timestamp: "2026-04-09 09:41:03", identity: "System Auto", action: "API Polling /datalastic/ais", entity: "Data Ingestion", status: "SUCCESS", category: "SYSTEM", ip: "10.0.0.41" },
  { id: "LOG-9002", timestamp: "2026-04-09 09:35:12", identity: "Cmdr. Pongo", action: "Toggle Map Layer [EEZ_ZONES]", entity: "Map Control", status: "SUCCESS", category: "OPERATION", ip: "192.168.1.100" },
  { id: "LOG-9003", timestamp: "2026-04-09 09:12:44", identity: "Cmdr. Pongo", action: "Login Authentication", entity: "Auth Module", status: "SUCCESS", category: "SECURITY", ip: "192.168.1.100" },
  { id: "LOG-9004", timestamp: "2026-04-09 08:55:01", identity: "API Node 3", action: "Fetch Weather Map Data", entity: "OpenWeather", status: "FAILED (Timeout)", category: "SYSTEM", ip: "10.0.0.43" },
  { id: "LOG-9005", timestamp: "2026-04-08 23:10:15", identity: "Watch OIC", action: "Flagged Vessel [JOLIE]", entity: "Vessel Tracker", status: "SUCCESS", category: "OPERATION", ip: "192.168.1.105" },
  { id: "LOG-9006", timestamp: "2026-04-08 22:45:00", identity: "System Auto", action: "Anomaly Detected: Sudden speed drop", entity: "AI Engine", status: "ALERT", category: "SECURITY", ip: "10.0.0.50" },
  { id: "LOG-9007", timestamp: "2026-04-08 20:00:23", identity: "Unknown Origin", action: "Login Attempt Failed", entity: "Auth Module", status: "BLOCKED", category: "SECURITY", ip: "45.22.19.10" },
  { id: "LOG-9008", timestamp: "2026-04-08 18:30:00", identity: "Cmdr. Pongo", action: "Created Case C-009", entity: "Case Management", status: "SUCCESS", category: "OPERATION", ip: "192.168.1.100" },
  { id: "LOG-9009", timestamp: "2026-04-08 18:00:00", identity: "System Auto", action: "Database Index Rebuild", entity: "DB Maintenance", status: "SUCCESS", category: "SYSTEM", ip: "10.0.0.1" },
  { id: "LOG-9010", timestamp: "2026-04-08 17:15:22", identity: "Watch OIC", action: "Exported Incident Report PDF", entity: "Reporting", status: "SUCCESS", category: "OPERATION", ip: "192.168.1.105" },
];
