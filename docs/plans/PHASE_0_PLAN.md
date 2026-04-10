# 🏗️ Phase 0: Foundation & Frontend-First — Implementation Plan

> **Project**: Sealive — Maritime Monitoring Platform  
> **Phase**: 0 of 5  
> **Priority**: 🔴 HIGH  
> **Created**: 2026-04-08  
> **Status**: 📋 Planned  
> **Approach**: Frontend-First — Bangun semua visual/UI dulu, integrasi data belakangan

---

## 🎯 Phase Goal

Bangun keseluruhan tampilan frontend yang sudah **terasa jadi** secara visual — dark command-center theme, navigasi lengkap, semua halaman dengan layout dan komponen UI yang proper (menggunakan dummy/mock data). User harus bisa "mengelilingi" seluruh aplikasi dan merasakan pengalaman akhir meskipun belum ada data real.

---

## 📐 Strategy: Frontend-First

```
Phase 0A: Project Init + Design System          ← fondasi
Phase 0B: Application Shell (Navbar + Layout)    ← kerangka
Phase 0C: Maps Page UI (static/mock)             ← halaman utama
Phase 0D: Dashboard Page UI (mock charts)        ← data viz
Phase 0E: Situational Awareness Page UI          ← intel view
Phase 0F: Case Management Page UI                ← CRUD tables
Phase 0G: Polish & Micro-interactions            ← premium feel
```

---

## 📦 Sub-Tasks

---

### 0A — Project Initialization + Design System (~45 min)

**Objective**: Project berjalan, design tokens terkonfigurasi, font loaded, global styles applied.

#### Steps:
1. Initialize Next.js 15 App Router + TypeScript + Tailwind CSS
2. Setup `next/font/google` → Inter font
3. Konfigurasi design tokens di `tailwind.config.ts`
4. Setup `globals.css` dengan base dark styles
5. Buat file `src/lib/constants.ts` untuk shared values

#### Design Tokens (tailwind.config.ts):

| Category | Token | Value | Usage |
|----------|-------|-------|-------|
| **BG** | `bg-primary` | `#0B111D` | Main background |
| | `bg-secondary` | `#111927` | Card/panel bg |
| | `bg-tertiary` | `#1A2332` | Hover/elevated |
| | `bg-surface` | `#0F1A2A` | Sidebar, modal bg |
| **Border** | `border-default` | `#1E2D3D` | Subtle borders |
| | `border-active` | `#22D3EE33` | Active element glow |
| **Text** | `text-primary` | `#E2E8F0` | Main text |
| | `text-secondary` | `#94A3B8` | Muted text |
| | `text-muted` | `#64748B` | Placeholder, disabled |
| **Accent** | `accent-cyan` | `#22D3EE` | Active nav, highlights |
| | `accent-blue` | `#3B82F6` | Links, info badges |
| | `accent-red` | `#EF4444` | Critical, anomaly |
| | `accent-amber` | `#F59E0B` | Warning, medium |
| | `accent-green` | `#22C55E` | Success, verified |
| | `accent-purple` | `#A855F7` | Special markers |

#### Deliverables:
- `tailwind.config.ts` — extended theme
- `src/app/globals.css` — base styles, scrollbar styling, selection colors
- `src/app/layout.tsx` — root layout with font & metadata
- `src/lib/constants.ts` — nav items, severity levels, etc.

#### ✅ Acceptance:
- [x] `npm run dev` works
- [x] Dark background, Inter font, custom scrollbar visible

---

### 0B — Application Shell: Navbar + Layout (~1 hour)

**Objective**: Navbar fungsional dengan routing ke semua halaman, responsive, premium feel.

#### Navbar Spec (ref Glassocean):

```
┌──────────────────────────────────────────────────────────────────────┐
│ 🌊 SEALIVE │ 🔍 Search IMO, MMSI... │ Interops │ Dashboard │       │
│             │                        │ Situational │ Cases │ 🗺 Map │
│             │                        │                    │ 🔔 👤  │
└──────────────────────────────────────────────────────────────────────┘
```

- **Height**: 56px, fixed top, z-50
- **Background**: `bg-primary` + `backdrop-blur` + bottom border
- **Logo**: "SEALIVE" text + wave icon, cyan accent
- **Nav Pills**: Rounded pills, active = cyan bg with glow, inactive = ghost
- **Search**: Rounded input, search icon, subtle border
- **Right side**: Notification bell (with badge count), user avatar circle
- **Active indicator**: Bottom glow line or pill highlight

#### Components:

| Component | File | Description |
|-----------|------|-------------|
| `Navbar` | `components/layout/Navbar.tsx` | Main top bar |
| `NavLink` | `components/layout/NavLink.tsx` | Individual tab pill (active/inactive state) |
| `SearchBar` | `components/layout/SearchBar.tsx` | IMO/MMSI search input |
| `Logo` | `components/layout/Logo.tsx` | Sealive brand mark |
| `UserMenu` | `components/layout/UserMenu.tsx` | Avatar + notification area |

#### Pages (placeholder with title + icon):

| Route | Page | Placeholder Content |
|-------|------|-------------------|
| `/` | Redirect → `/map` | — |
| `/map` | Maps View | "🗺️ Maps View — AIS Coverage" + dark placeholder box |
| `/dashboard` | Executive Dashboard | "📊 Executive Dashboard" + grid placeholder |
| `/situational` | Situational Awareness | "🌐 Situational Awareness" + 3-panel placeholder |
| `/cases` | Case Management | "📋 Case Management" + table placeholder |
| `/interops` | Interops | "🔗 Interops" + placeholder |

#### ✅ Acceptance:
- [ ] Klik setiap nav tab → routing benar, active state highlight
- [ ] Navbar tetap di atas saat scroll
- [ ] Smooth transition antar halaman
- [ ] Responsive (desktop priority, tablet acceptable)

---

### 0C — Maps Page UI (~1.5 hour)

**Objective**: Tampilan Maps View lengkap secara visual (tanpa data AIS real). Map bisa menggunakan Mapbox static atau placeholder visual sementara.

#### Layout (ref Gambar 1 — Glassocean Map):

```
┌─────────────────────────────────────────────────────────────┐
│ NAVBAR                                                       │
├────────┬────────────────────────────────────────────┬────────┤
│ SEARCH │                                            │ MAP    │
│ PANEL  │              MAP AREA                      │ CTRL   │
│        │         (full viewport)                    │ +/-    │
│ Filter │                                            │ 🧭     │
│ vessel │                                            │ layers │
│ type   │                                            │        │
│        │                                            │        │
├────────┴────────────────────────────────────────────┴────────┤
│ BOTTOM BAR: Drifting: 1203 | Teleporting: 1264 | Black..    │
└─────────────────────────────────────────────────────────────┘
```

#### Components:

| Component | Description |
|-----------|-------------|
| `MapContainer` | Main map area (placeholder dark box / static map image) |
| `MapSidebar` | Left collapsible panel — search, filters, vessel list |
| `MapControls` | Right-side floating controls (zoom +/-, layers, compass) |
| `MapBottomBar` | Bottom status bar (vessel counts by category) |
| `VesselListItem` | Vessel entry in sidebar (flag icon, name, status) |
| `LayerToggle` | Checkbox-style layer on/off switches |

#### Mock Data:
- 5-10 hardcoded vessel entries di sidebar
- Dummy counts di bottom bar (Drifting: 1203, Teleporting: 1264, etc.)
- Static dark map image atau solid dark placeholder

#### ✅ Acceptance:
- [ ] Sidebar collapsible (toggle buka/tutup)
- [ ] Vessel list dengan mock data tampil rapi
- [ ] Map controls (visual only, belum fungsional)
- [ ] Bottom bar dengan status counts
- [ ] Keseluruhan look & feel sesuai referensi Glassocean

---

### 0D — Dashboard Page UI (~1.5 hour)

**Objective**: Executive Dashboard dengan grid cards dan mock charts (ref Gambar 3).

#### Layout:

```
┌─────────────────────────────────────────────────────────────┐
│ NAVBAR                                                       │
├─────────────────────────────────────────────────────────────┤
│ Period: April 2026          🔄 Reset  📅 Date  📥 Export   │
├───────────────┬──────────────────┬──────────────────────────┤
│ Top 10 Ships  │ Heading by Speed │ Verified vs Unverified   │
│ (Bar Chart)   │ (Polar/Radar)    │ (Pie Chart)              │
├───────────────┼──────────────────┼──────────────────────────┤
│ Top 10        │ (space)          │ Anomaly Hours            │
│ Anomaly       │                  │ (Bubble Timeline)        │
│ (H-Bar)       │                  │                          │
└───────────────┴──────────────────┴──────────────────────────┘
```

#### Components:

| Component | Description |
|-----------|-------------|
| `DashboardHeader` | Period selector, Reset, Date picker, Export button |
| `DashboardGrid` | CSS Grid layout (3 col, 2 row) |
| `ChartCard` | Reusable card wrapper (title, menu dots, chart area) |
| `BarChartMock` | Static/CSS-based horizontal bar chart |
| `PieChartMock` | Static/CSS-based donut/pie chart |
| `RadarChartMock` | Placeholder for polar wind-rose chart |
| `TimelineMock` | Placeholder for bubble timeline |

#### Approach: CSS-first mock charts
- Bar charts: CSS `width` bars dengan gradient fills
- Pie chart: CSS `conic-gradient` donut
- Radar/Timeline: Styled placeholder boxes dengan label
- **Tujuan**: Visual sudah representative, chart library (ECharts/Recharts) di-plug di Phase 2

#### ✅ Acceptance:
- [ ] Grid layout responsive (3 col desktop, 1 col mobile)
- [ ] Bar chart visual terlihat proporsional
- [ ] Pie chart terlihat seperti donut chart
- [ ] Overall dashboard terasa data-rich meski mock

---

### 0E — Situational Awareness Page UI (~1.5 hour)

**Objective**: Tampilan 3-panel intelligence view (ref Gambar 2).

#### Layout:

```
┌─────────────────────────────────────────────────────────────┐
│ NAVBAR                                                       │
├─────────────┬───────────────────────────┬───────────────────┤
│ LEFT PANEL  │      CENTER              │   RIGHT PANEL     │
│             │                           │                   │
│ Top 5       │   GLOBE / MAP            │  CASUALTIES       │
│ Anomaly     │   (placeholder)          │  (news cards)     │
│ Locations   │                           │                   │
│             │   ● Blacklist Vessel     │  PIRACY           │
│ Anomalous   │   ● Anomaly Vessel      │  (alert cards)    │
│ Vessel      │                           │                   │
│ Summary     │                           │  EARTHQUAKE       │
│             │                           │  (event cards)    │
│ Blacklist   │                           │                   │
│ Vessels     │                           │                   │
├─────────────┴───────────────────────────┴───────────────────┤
│ STATUS BAR: Drifting | Teleporting | Black List | ...       │
└─────────────────────────────────────────────────────────────┘
```

#### Components:

| Component | Description |
|-----------|-------------|
| `SituationalLayout` | 3-column layout (left 25%, center 50%, right 25%) |
| `AnomalyLocationList` | Top 5 locations with percentage badges |
| `VesselSummaryPanel` | Flag composition, anomalous count |
| `BlacklistPanel` | List of blacklisted vessels with flags |
| `GlobePlaceholder` | Dark circle/sphere visual placeholder |
| `NewsCard` | Casualty/piracy/earthquake event cards with thumbnails |
| `LiveBadge` | Pulsing "LIVE" indicator |
| `StatusBar` | Bottom count bar (same pattern as Maps) |

#### Mock Data:
- 5 anomaly locations (Japan Sea, Mediterranean, etc.)
- 3-5 blacklist vessel entries
- 3-4 news cards (casualties, piracy, earthquake)
- Live indicator pulsing animation

#### ✅ Acceptance:
- [ ] 3-panel layout proporsional
- [ ] Left panel scrollable dengan data mock
- [ ] Globe placeholder terlihat premium (mungkin radial gradient + dots)
- [ ] News cards dengan thumbnail placeholder
- [ ] Live pulsing badge berfungsi

---

### 0F — Case Management Page UI (~1 hour)

**Objective**: Tampilan manajemen kasus dengan tabel data dan form modal.

#### Layout:

```
┌─────────────────────────────────────────────────────────────┐
│ NAVBAR                                                       │
├─────────────────────────────────────────────────────────────┤
│ Case Management    [+ New Case]    🔍 Search   🔽 Filter   │
├─────────────────────────────────────────────────────────────┤
│ Summary Cards: Open(12) | In Progress(8) | Resolved(45)    │
├─────────────────────────────────────────────────────────────┤
│ TABLE                                                        │
│ ID | Title | Type | Priority | Assigned | Status | Date     │
│ C-001 | Suspicious vessel... | Anomaly | 🔴 HIGH | ...     │
│ C-002 | Oil spill report...  | Incident | 🟡 MED  | ...    │
│ C-003 | Patrol schedule...   | Routine | 🟢 LOW   | ...    │
│ ...                                                          │
├─────────────────────────────────────────────────────────────┤
│ Pagination: < 1 2 3 ... 10 >                                │
└─────────────────────────────────────────────────────────────┘
```

#### Components:

| Component | Description |
|-----------|-------------|
| `CaseHeader` | Title, New Case button, search, filter controls |
| `CaseSummaryCards` | Row of stat cards (Open, In Progress, Resolved, Closed) |
| `CaseTable` | Data table with sortable columns |
| `CaseTableRow` | Individual row with priority badge, status pill |
| `PriorityBadge` | Color-coded priority indicator |
| `StatusPill` | Status chip (New/Acknowledged/Resolved/Dismissed) |
| `Pagination` | Page navigation controls |
| `CaseDetailModal` | Slide-over or modal for case detail (stretch goal) |

#### Mock Data: 8-10 dummy cases

#### ✅ Acceptance:
- [ ] Tabel rapi dengan alternating row bg
- [ ] Priority badges berwarna sesuai severity
- [ ] Status pills terlihat jelas
- [ ] Summary cards dengan angka mock
- [ ] Pagination visual berfungsi

---

### 0G — Polish & Micro-interactions (~45 min)

**Objective**: Sentuhan akhir agar UI terasa **premium dan hidup**.

#### Checklist:

| Category | Item | Detail |
|----------|------|--------|
| **Transitions** | Page transitions | Fade-in saat navigasi antar halaman |
| | Sidebar collapse | Smooth slide animation |
| | Hover states | Scale + glow effect on cards & buttons |
| **Animations** | Live indicators | Pulsing dot/ring animation (CSS) |
| | Loading skeleton | Shimmer effect placeholder saat "loading" |
| | Number counters | Count-up animation on summary cards |
| **Micro-UX** | Tooltip | Hover tooltip on nav items & icons |
| | Focus rings | Cyan glow on focused inputs |
| | Active states | Button press feedback (scale down) |
| **Visual** | Glassmorphism | Subtle blur on panels/sidebars |
| | Gradient accents | Subtle gradient on key cards |
| | Glow effects | Box-shadow glow on active elements |
| | Custom scrollbar | Thin, dark themed scrollbar |

#### ✅ Acceptance:
- [ ] Navigasi terasa smooth, tidak "patah"
- [ ] Hover effects pada semua interactive elements
- [ ] Minimal 1 animasi per halaman
- [ ] Overall app terasa premium, bukan template kosong

---

## 🔗 Dependencies

| Dependency | Type | Sub-task | Notes |
|-----------|------|----------|-------|
| Node.js ≥ 18 | Runtime | 0A | Required |
| Inter font | Google Fonts | 0A | Via `next/font` |
| Mapbox Token | API Key | 0C (optional) | Bisa pakai static placeholder dulu |
| Chart Library | npm | 0D (optional) | CSS mock dulu, library di Phase 2 |

---

## 🧭 Decisions

| # | Keputusan | Pilihan | Alasan |
|---|-----------|---------|--------|
| D-001 | CSS Framework | Tailwind CSS | Utility-first, cepat untuk data-dense UI |
| D-006 | Theme | Dark Command-Center | Ref Glassocean, long-duration monitoring |
| D-007 | Charts di Phase 0 | CSS mock, bukan library | Fokus visual dulu, plug library di Phase 2 |
| D-008 | Map di Phase 0 | Static placeholder | Mapbox integration di Phase 1, fokus layout dulu |
| D-009 | Globe di Phase 0 | CSS radial gradient placeholder | Three.js/react-globe di Phase 3 |

---

## ⏱️ Estimated Effort

| Sub-Task | Focus | Effort |
|----------|-------|--------|
| 0A | Project Init + Design System | ~45 min |
| 0B | Navbar + Layout + Routing | ~1 hour |
| 0C | Maps Page UI (static) | ~1.5 hour |
| 0D | Dashboard Page UI (mock charts) | ~1.5 hour |
| 0E | Situational Awareness UI | ~1.5 hour |
| 0F | Case Management UI | ~1 hour |
| 0G | Polish & Micro-interactions | ~45 min |
| **Total** | | **~8 hours** |

---

## ✅ Phase 0 — Definition of Done

- [ ] `npm run dev` berjalan tanpa error
- [ ] Semua 5 halaman bisa diakses via navbar
- [ ] Dark command-center theme konsisten di semua halaman
- [ ] Maps page: sidebar + map placeholder + controls + bottom bar
- [ ] Dashboard page: grid dengan mock charts (bar, pie, radar)
- [ ] Situational page: 3-panel layout dengan mock data
- [ ] Cases page: data table dengan mock entries
- [ ] Micro-interactions: hover, transitions, animations
- [ ] Overall: terasa seperti production app, bukan skeleton

---

## ➡️ After Phase 0

Masuk ke **Phase 1: Maps View & Vessel Monitoring** — di mana kita:
- Plug Mapbox GL JS + Deck.gl ke MapContainer
- Integrasi AIS API (Datalastic) untuk real vessel data
- Replace mock data dengan live data
- Implement vessel detail panel & search functionality

> **Prinsip**: Phase 0 = **semua terlihat jadi**. Phase 1+ = **semua benar-benar jadi**.
