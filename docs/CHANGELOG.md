# 📝 Changelog

## [2026-04-09 Session 18] — Phase B2 Map Integration & Phase B3 Init

### Overview
Successfully wired up the Frontend MapView with the Backend WebSocket Gateway. Verified the entire Phase B2 logic by starting Docker containers, observing TypeORM sync, and seeing the mock data pushed directly to the UI. Started Phase B3 (Alerts & Cases) by scaffolding the modules, creating TypeORM entities mapped from the schema, and implementing the Cases CRUD API.

### New Files
- `sealive-api/src/modules/alerts/entities/alert.entity.ts`
- `sealive-api/src/modules/cases/entities/case.entity.ts`
- `sealive-api/src/modules/cases/entities/case-comment.entity.ts`
- `sealive-api/src/modules/cases/entities/case-attachment.entity.ts`
- `sealive-api/src/modules/cases/dto/create-case.dto.ts`
- `sealive-api/src/modules/cases/dto/update-case.dto.ts`
- `sealive-api/src/modules/cases/cases.service.ts`
- `sealive-api/src/modules/cases/cases.controller.ts`

### Modified Files
- `sealive-app/src/app/map/page.tsx` — Integrated `socket.io-client` + merged `livePositions`.
- `sealive-app/src/components/map/MapView.tsx` — Added `livePositions` props and updated MOCK_VESSEL_GEOJSON on the fly.
- `sealive-api/src/modules/cases/cases.module.ts` — TypeORM entities registered.
- `sealive-api/src/modules/alerts/alerts.module.ts` — TypeORM entities registered.

### Dependencies Added
- `socket.io-client` (Frontend)

---

## [2026-04-09 Session 17] — Phase B2: Vessels & AIS ✅

### Overview
Scaffolded Phase B2 frontend interaction API for Sealive platform. Built Vessels CRUD Module and AIS WebSocket Gateway with Mock worker. 

### New Files
- `sealive-api/src/modules/vessels/entities/vessel.entity.ts`
- `sealive-api/src/modules/vessels/entities/vessel-position.entity.ts`
- `sealive-api/src/modules/vessels/dto/create-vessel.dto.ts`
- `sealive-api/src/modules/vessels/dto/update-vessel.dto.ts`
- `sealive-api/src/modules/vessels/dto/add-position.dto.ts`
- `sealive-api/src/modules/vessels/vessels.module.ts`
- `sealive-api/src/modules/vessels/vessels.service.ts`
- `sealive-api/src/modules/vessels/vessels.controller.ts`
- `sealive-api/src/modules/vessels/vessels.gateway.ts`
- `sealive-api/src/modules/vessels/ais-polling.service.ts`

### Modified Files
- `sealive-api/src/app.module.ts` — Added VesselsModule & ScheduleModule.forRoot()
- `docs/ACTIVE_TASK.md`
- `docs/CHANGELOG.md`
- `docs/BACKLOG.md`

### Decisions
- Initialized Datalastic mockup generator in `AisPollingService` per 10s via Cron to enable unblocked frontend integration.

### Dependencies Added
- `@nestjs/websockets`, `@nestjs/platform-socket.io`, `socket.io`

---

## [2026-04-09 Session 16] — Phase B1: Auth & Users ✅

### Overview
Full authentication system implemented: User entity with Argon2id hashing, JWT access/refresh token pair with rotation, RBAC guards (4 roles), account lockout after 5 failed attempts. All endpoints tested and verified.

### New Files
- `sealive-api/src/modules/users/entities/user.entity.ts` — User entity (UUID, email, Argon2id, role enum, lockout)
- `sealive-api/src/modules/users/users.service.ts` — User CRUD, lockout management
- `sealive-api/src/modules/users/users.module.ts`
- `sealive-api/src/modules/auth/entities/refresh-token.entity.ts` — Refresh token (hash, expiry, revocation)
- `sealive-api/src/modules/auth/auth.service.ts` — Register, login, refresh, logout, lockout logic
- `sealive-api/src/modules/auth/auth.controller.ts` — 4 endpoints (register, login, refresh, logout)
- `sealive-api/src/modules/auth/auth.module.ts` — Wires Passport, JWT, TypeORM
- `sealive-api/src/modules/auth/strategies/jwt.strategy.ts` — Passport JWT strategy
- `sealive-api/src/modules/auth/dto/register.dto.ts` — Registration validation
- `sealive-api/src/modules/auth/dto/login.dto.ts` — Login validation
- `sealive-api/src/common/guards/jwt-auth.guard.ts` — JWT auth guard
- `sealive-api/src/common/guards/roles.guard.ts` — RBAC guard

### Modified Files
- `sealive-api/src/app.module.ts` — Added AuthModule, UsersModule, RolesGuard
- `sealive-api/src/common/index.ts` — Added guard exports

### Verification
- `POST /api/auth/register` → 201 (user created, tokens returned)
- `POST /api/auth/login` → 200 (Argon2id verified, tokens issued)
- `POST /api/auth/login` (wrong pw) → 401 (Invalid credentials)
- `POST /api/auth/logout` → 200 (JWT validated, tokens revoked)
- `nest build` → 0 errors

### Dependencies Added
- `@nestjs/jwt`, `@nestjs/passport`, `passport`, `passport-jwt`, `argon2`, `uuid`
- Dev: `@types/passport-jwt`, `@types/uuid`

### Decisions
- D-025: PostgreSQL mapped to host port 5434 (5432/5433 occupied)
- D-026: Refresh tokens stored as SHA-256 hash in DB (not plaintext)

### Bugs Fixed
- JWT strategy type error: `secretOrKey` could be undefined — added fallback

---

## [2026-04-09 Session 15] — Phase B0: Backend Foundation ✅

### Overview
Implemented full backend foundation: NestJS 10 project scaffold, Docker infrastructure (PostgreSQL 16 + Redis 7 + MinIO), config system with Joi validation, global middleware (exception filter, logging/transform interceptors, rate limiting), and health check endpoint. All systems verified working.

### New Files
- `docker-compose.yml` — PostgreSQL 16 (port 5434), Redis 7 (6379), MinIO (9000/9001)
- `sealive-api/` — NestJS 10 project (Fastify adapter)
- `sealive-api/.env` + `.env.example` — Environment config
- `sealive-api/src/main.ts` — Bootstrap (Fastify, Helmet, CORS, Pino, ValidationPipe)
- `sealive-api/src/app.module.ts` — Root module (ConfigModule, TypeORM, Throttler, Pino, HealthModule)
- `sealive-api/src/config/` — env.validation.ts, database.config.ts, redis.config.ts, jwt.config.ts
- `sealive-api/src/common/filters/http-exception.filter.ts` — Global exception handler
- `sealive-api/src/common/interceptors/logging.interceptor.ts` — Request timing
- `sealive-api/src/common/interceptors/transform.interceptor.ts` — Response envelope
- `sealive-api/src/common/decorators/roles.decorator.ts` — @Roles() for RBAC
- `sealive-api/src/common/decorators/current-user.decorator.ts` — @CurrentUser()
- `sealive-api/src/modules/health/` — Health controller & module

### Verification
- `nest build` — 0 errors
- `GET /api/health` — 200 OK with response envelope
- Docker containers: all 3 running (postgres, redis, minio)
- TypeORM connection: verified (`SELECT version()`)

### Decisions
- D-025: PostgreSQL mapped to host port 5434 (5432/5433 occupied by existing instances)

---

## [2026-04-09 Session 14] — Backend Architecture & Documentation ✅

### Overview
Transisi proyek dari fase frontend-only ke full-stack architecture. Merancang keseluruhan backend system dengan NestJS 10, PostgreSQL 16, Redis 7, dan MinIO. Standar keamanan OWASP Top 10 diterapkan di setiap lapisan.

### Documentation Created
- **`docs/plans/BACKEND_ARCHITECTURE.md`** — System topology, monorepo structure, 10 NestJS modules, OWASP Top 10 compliance matrix, AIS real-time pipeline, caching strategy, authentication flow, RBAC model, 5-phase implementation plan, Docker Compose config, environment variables.
- **`docs/DB_SCHEMA.md`** (rewrite) — 10 PostgreSQL tables: `users`, `refresh_tokens`, `vessels`, `vessel_positions` (monthly partitioned), `alerts`, `cases`, `case_comments`, `case_attachments`, `audit_logs`, `notifications`. Complete with column types, constraints, indexes, and volume estimates.
- **`docs/API_CONTRACTS.md`** (rewrite) — 35+ REST endpoints across 7 modules (Auth, Users, Vessels, Alerts, Cases, Dashboard, Situational, Files). WebSocket events for AIS & Notifications. Standard response envelope, error codes, rate limits.

### Documentation Updated
- **`docs/PROJECT_STATUS.md`** — Updated stack definition, added backend roadmap (Phase B0–B4), preserved frontend completion status.
- **`docs/DECISION_LOG.md`** — 9 new decisions (D-016 to D-024): NestJS, PostgreSQL, TypeORM, Redis, MinIO, Argon2id, JWT strategy, OWASP compliance, Fastify adapter.
- **`docs/ACTIVE_TASK.md`** — Reset to Phase B0 with detailed checklist and dependency list.
- **`docs/BACKLOG.md`** — Added 10 backend queue items (BB-001 to BB-010), 3 new parking lot ideas.

### Decisions Made
- D-016: NestJS 10 (over Express/Hono)
- D-017: PostgreSQL 16 (over MySQL/MongoDB)
- D-018: TypeORM 0.3.x (over Prisma/Drizzle)
- D-019: Redis 7 (over Memcached)
- D-020: MinIO (over local FS/S3 direct)
- D-021: Argon2id (over bcrypt)
- D-022: JWT Access + Opaque Refresh (over session-only)
- D-023: OWASP Top 10 Compliance
- D-024: Fastify adapter (over Express)

### Files Modified
- `docs/plans/BACKEND_ARCHITECTURE.md` — NEW
- `docs/DB_SCHEMA.md` — Full rewrite
- `docs/API_CONTRACTS.md` — Full rewrite
- `docs/PROJECT_STATUS.md` — Full rewrite
- `docs/DECISION_LOG.md` — Appended D-016 to D-024
- `docs/ACTIVE_TASK.md` — Full rewrite
- `docs/BACKLOG.md` — Full rewrite
- `docs/CHANGELOG.md` — This entry

---

## [2026-04-09 Session 13] — Vessel Detail Dashboard ✅

### Overview
Implementasi halaman penuh Detail Vessel (`/vessel/[id]`) untuk memantau profil komprehensif, riwayat komersial, dan rute navigasi sebuah kapal dari UI Tactical OS.

### Features Added
- **Full Vessel Dashboard Page**:
  - Laman dinamis `/vessel/[id]` dengan routing ID kapal terintegrasi dari Map.
  - Komponen **InfoCards** memuat 7 panel spesifik: Summary, Vessel Detail, Ownership, Portcall History, Route Map, Risk Score, & Anomaly List.
  - Redesign identitas visual widget profil & tab (Orange Command Center theme) agar seragam dengan Map & Navbar.
- **Dynamic Map Libre Integration**:
  - Mengganti *static placeholder image* dari widget peta menjadi komponen Peta Interaktif `MapView` asli.
  - Kamera peta secara cerdas melakukan `flyTo` *auto-focus* pada lokasi kapal tersebut di mode Detail.

### Bug Fixes
- **B-022**: Mengatasi kegagalan build `SyntaxError` (unexpected token) yang dikarenakan tag div ganda saat transisi implementasi UI pada `vessel/[id]/page.tsx`.

### Files Modified
- `src/app/vessel/[id]/page.tsx` — Full implementation
- `src/app/map/page.tsx` — Menambahkan import `Link` dari Next.js ke tombol "Detail" di Sidebar.

---

## [2026-04-09 Session 12] — History Track Panel & Playback Simulation ✅

### Overview
Implementasi panel detail riwayat pergerakan kapal (*History Track*) yang interaktif dengan fitur pemutar simulasi (*Playback*) dan kontrol kecepatan.

### Features Added
- **Dynamic History Track Panel**: 
  - Panel bawah yang muncul otomatis saat kapal dipilih.
  - Tabel log riwayat dengan konversi koordinat ke format DMS (Degrees, Minutes, Seconds).
  - Filter riwayat fleksibel (1 s/d 30 hari) dengan label tanggal yang dinamis.
  - Tombol **"Center"** untuk memusatkan kamera kembali ke kapal dari panel detail.
- **Vessel Playback System**: 
  - Simulasi pergerakan kapal mengikuti garis lintasan (*track line*).
  - **Marker Alignment**: Ikon kapal otomatis berputar menghadap arah tujuan berdasarkan perhitungan *heading* antar titik.
  - **60fps Interpolation**: Pergerakan kapal sangat mulus meluncur di atas air antar koordinat berkat `requestAnimationFrame`.
  - **Multi-Speed Control**: Pilihan kecepatan 1x, 2x, 4x, 8x, hingga 16x, dengan dasar 1x = 4 detik/titik.
  - **Auto-Pan**: Kamera peta mengikuti pergerakan kapal secara otomatis selama pemutaran.
  - **Live Telemetry HUD**: Panel *glassmorphism* instrumen maritim yang mengambang memamerkan perubahan **Speed**, **Heading**, dan **Time** realtime saat simulasi.

### Bug Fixes
- **B-019 & B-020**: Memperbaiki `ReferenceError` akibat hilangnya import `useEffect` dan `useMemo` saat penggabungan kode logika baru.
- **B-021**: Menonaktifkan `renderWorldCopies` di MapLibre GL agar tampilan dunia tidak terduplikasi secara memanjang yang mengakibatkan kapal terlihat berulang pada *zoom out* ekstrem.
- **MapLibre Filter Crash**: Memperbaiki *crash* fatal saat pembatalan pilihan kapal dengan mengganti filter `undefined` menjadi filter `has` yang valid.

### Files Modified
- `src/app/map/page.tsx` — Logika playback, state management kecepatan, filter hari, dan UI panel bawah.
- `src/components/map/MapView.tsx` — Sinkronisasi playback state ke layer peta, animasi marker, dan fix filter crash.
- `generate_organic_spread.js` — Penambahan data historis 30 hari untuk simulasi yang lebih mendalam.

---

## [2026-04-09 Session 11] — Navigation Accuracy & Vessel Telemetry Polish ✅

### Overview
Penyempurnaan simulasi maritim untuk akurasi geografis tinggi dan penambahan fitur telemetri sinyal historis.

### Features Added
- **Maritime Waypoints**: Segmentasi rute otomatis menggunakan titik navigasi laut lepas untuk mencegah kapal "terbang" di atas daratan Java, Sumatra, Malaysia, Filipina, Vietnam, dan Jepang.
- **Signal Track History**: Jejak kapal kini memiliki data titik waktu (`timestamp`) penerimaan sinyal AIS asli (format UTC+7).
- **Track Label Rendering**: Menambahkan layer label di peta untuk menampilkan jam penerimaan sinyal langsung di sepanjang garis jejak kapal yang terpilih.
- **Ocean Bounding Spawn**: Membatasi area kemunculan acak kapal nelayan (Fishing) agar hanya muncul di zona perairan dalam (Ocean Boxes), bukan di pegunungan/pedalaman pulau.

### UI/UX Refinement
- **Popup Removal**: Menghapus popup info pada penanda kapal (Vessel Marker) untuk mengurangi gangguan visual; informasi lengkap kini hanya ditampilkan secara elegan di sidebar kanan.
- **Enhanced Accuracy**: Penyesuaian kordinat pelabuhan dan jalur Selat Malaka & Selat Karimata.

### Bug Fixes
- **B-018**: Memperbaiki kerusakan struktur file `MapView.tsx` akibat kegagalan integrasi tool replacement otomatis tadi.

### Files Modified
- `generate_organic_spread.js` — Logic waypoints, UTC+7 timestamp format, & ocean bounding spawn.
- `src/components/map/MapView.tsx` — Track point & label rendering, popup removal, import cleanup.

---

## [2026-04-09 Session 5] — Map Layers, EEZ GeoJSON & Stability Polish ✅

### Overview
Fokus peningkatan UI/UX terkait layer peta, fitur custom SVG MapLibre, integrasi *authentic geodata*, & perbaikan peringatan *runtime* di React.

### Features Added
- **Base Map Switcher**: Menambahkan pemilih tema *Base Map* di dalam panel *Layers Flyout* (Dark, Light/Positron, Bright/Liberty).
- **MarineRegions EEZ API**: Mengganti kotak koordinat *dummy* batas Zone Ekonomi Eksklusif (EEZ) dengan file `eez_indonesia.geojson` (45MB) akurasi-tinggi dari dataset resmi *Marine Regions* OGC WFS (MRGID: 8492).
- **MapLibre Engine Refinement**: Menangani rotasi siklus asinkronus peta di event `onStyleData` sehingga *custom SVG markers* tetap kembali muncul apabila pergantian *Base Map* melenyapkan *sprite/style* bawaan.

### Bug Fixes
- **B-016 (MapLibre)**: Menyembunyikan dan memberikan solusi elegan (*1x1 pixel dummy*) dari respon peringatan "*Image could not be loaded*" maplibre untuk *native icons* (`circle-11`, dll) yang hilang pada gaya OpenFreeMap melalui fungsi penangkap *event* `styleimagemissing`.
- **B-017 (React Warning)**: Menyetop peringatan "*Cannot update component MapPage while rendering MapView*" dengan cara mengeluarkan logika `onLayerChange` dari dalam kantong fungsional kemurnian *state updater* (`setLayers(prev => ...)`).

---

> Semua perubahan dicatat per tanggal sesi.

---

## [2026-04-09 Session 10] — Bug Fix + Triangle Markers

### Overview
Fix build error dan ganti vessel markers dari circle ke triangle.

### Changes
- **Triangle Markers** - Vessel markers sekarang menggunakan icon segitiga (bukan circle)
  - Icon di-load via SVG saat map load
  - Setiap vessel type punya warna berbeda (Cargo=orange, Tanker=blue, Fishing=green, Passenger=purple, Tug=cyan)
  - Rotasi mengikuti heading vessel
- **Default Layers** - Hanya vessels yang aktif di halaman map (layer lain off by default)

### Files Modified
- `src/components/map/MapView.tsx` — Triangle marker layers, SVG icon loading, color by vessel type
- `src/components/map/mapData.ts` — Added exports: SHIPPING_ROUTES, EEZ_ZONES, PORTS, ANOMALY_ZONES, MAP_LAYERS
- `src/app/map/page.tsx` — Default layer visibility (vessels only)

### Bug Fixes
- B-015: Build error "Export ANOMALY_ZONES doesn't exist" → Added all map data exports to mapData.ts

### Status
- All pages HTTP 200 ✅

### Overview
Fix vessel toggle functionality dan beberapa bug MapLibre.

### Changes
- **Vessel Toggle** - AIS vessel layer dapat di-toggle on/off melalui layer panel
- **MapLibre `_loaded` Error Fix** - Menambahkan mapLoaded state, sync layerVisibility hanya setelah map loads

### Files Modified
- `src/components/map/MapView.tsx` — Added mapLoaded state, vessel conditional rendering, sync layers after load
- `src/app/map/page.tsx` — Added layerVisibility state, passed to MapView

### Bug Fixes
- B-013: Vessel toggle not functioning → Added conditional rendering
- B-014: MapLibre `_loaded` error → Added mapLoaded state + onLoad callback

### Status
- All pages HTTP 200 ✅

---

## [2026-04-08 Session 8] — Phase 3: 3D Globe + All Phases Complete

### Overview
Menambahkan 3D Globe ke Situational Awareness page dan menyelesaikan semua 5 phase.

### New Features
- **3D Globe** (`react-globe.gl`)
  - Dark earth + night sky background
  - Orange atmosphere glow (#E67E22)
  - Red anomaly markers (Natuna Sea, Lombok Strait, Sulawesi Sea, Arafura Sea, Sulu Sea)
  - Pulsing red rings on anomalies
  - Port labels (Jakarta, Surabaya, Medan, Makassar, Singapore)
  - Fullscreen responsive sizing
  - Interactive: click & drag to rotate, scroll to zoom

### Dependencies Added
- `react-globe.gl` — 3D globe rendering

### Bug Fixes
- Layer toggle panel overlap with map controls → moved NavigationControl to bottom-left
- Globe not fullscreen → added useEffect for responsive dimensions

### Status
- All 5 phases COMPLETE (100%)
- All pages HTTP 200

---

## [2026-04-08 Session 7] — Phase 2: Dashboard + Phase 4: Case Management

### Overview
Integrasi MapLibre GL JS sebagai map engine (open-source, no token). Peta sekarang hidup dengan vessel markers.

### New Files
- `sealive-app/src/components/map/MapView.tsx` — MapLibre map component with vessel markers, popups, flyTo
- `sealive-app/src/components/map/mapData.ts` — Created then cleared by user (layer data)

### Modified Files
- `sealive-app/src/app/map/page.tsx` — Rebuilt with real map (dynamic import, SSR off)
- `sealive-app/src/app/globals.css` — MapLibre CSS overrides (popup, controls, scale)
- `docs/DECISION_LOG.md` — D-014, D-015

### Dependencies Added
- `maplibre-gl` — Open-source map rendering engine
- `react-map-gl` — React wrapper for MapLibre/Mapbox

### Decisions
- D-014: MapLibre GL JS over Mapbox (open-source, no token)
- D-015: OpenFreeMap dark tiles (free, no API key)

### Notes
- Multi-layer additions (shipping routes, EEZ, ports, anomaly zones) were created but reverted by user
- Current state: vessel-only map with basic interactions

---

## [2026-04-08 Session 4] — Phase 0G: Polish & Micro-interactions ✅

### Overview
Menambahkan animasi, transisi, dan interaksi mikro ke seluruh UI untuk membuat interface terasa hidup, responsive, dan premium.

### Design System (globals.css)
- **10+ new keyframes**: stagger-in, slide-up, shimmer, radar-sweep, glow-pulse, bar-grow, count-up-flash, float, spin-slow, fade-in-scale, seismo, row-slide-in, dot-pulse
- **16+ new utility classes**: hover-lift, hover-glow, btn-press, skeleton, stagger-in, stagger-slide-up, row-enter, bar-grow, count-flash, radar-sweep, dot-pulse, page-enter, sidebar-slide, nav-active-indicator, tooltip-hint, num-highlight
- CSS custom property `--i` system for stagger animation delays

### Component Upgrades
- **Navbar**: Logo hover glow/scale, active nav glow shadow, notification ping, btn-press, search focus glow, tooltip hints
- **Card**: Stagger animation via `index` prop, hover-glow + hover-lift, `noPadding` option
- **Badge**: No change (already polished)

### Page Animations
- **All Pages**: `page-enter` fade-in transition
- **Map**: Sidebar slide transition, scan-line header, live dot ping, staggered vessel rows, marker hover rings + pulse, radar sweep, tooltip controls
- **Dashboard**: Stagger-slide-up cards, animated bar-grow charts, radar spin-slow, donut hover scale, count-flash numbers, timeline dot hover glow, floating placeholder
- **Situational**: Stagger-in panels, hover-lift cards, radar sweep overlay, anomaly dot tooltip + scale, LIVE badge glow-pulse, seismograph SVG draw animation, system ping indicator
- **Cases**: Stagger-slide-up summary cards, count-flash, color-specific hover borders, staggered table row entrance, group hover highlight
- **Interops**: Stagger-slide-up cards, count-flash stats, color-specific borders, icon scale hover, "Configure" slide effect, floating placeholder

### Status
- All 5 pages HTTP 200 ✅
- Phase 0 fully COMPLETE (100%)

---

## [2026-04-08 Session 3] — Design Redesign: Tactical Military Aesthetic

### Overview
Mengubah frontend dari "AI-generated style" menjadi **Tactical Military** aesthetic yang lebih distinctive dan tidak generik.

### Design System Changes
- **Color Palette**: Dari cyan/blue gradient → Gunmetal + Orange (#E67E22)
- **Typography**: 
  - Display: Chakra Petch (bold, military feel)
  - Body: Inter
  - Mono: Geist Mono (sebelumnya JetBrains Mono)
- **UI Elements**: 
  - Square corners → Rounded (rounded-lg)
  - Glassmorphism → Sharp borders, inset boxes
  - Clip-corner accents dihapus

### Files Modified
- `sealive-app/src/app/globals.css` — Design tokens di-update ke tactical theme
- `sealive-app/src/app/layout.tsx` — Font imports (Chakra Petch, Geist Mono)
- `sealive-app/src/components/layout/Navbar.tsx` — Rounded tabs, buttons, search input
- `sealive-app/src/components/ui/Card.tsx` — Rounded corners
- `sealive-app/src/components/ui/Badge.tsx` — Rounded badges/pills
- `sealive-app/src/app/map/page.tsx` — Rounded sidebar, controls, buttons
- `sealive-app/src/app/dashboard/page.tsx` — Rounded header buttons, cards
- `sealive-app/src/app/situational/page.tsx` — Rounded panels, news cards
- `sealive-app/src/app/cases/page.tsx` — Rounded inputs, summary cards
- `sealive-app/src/app/interops/page.tsx` — Rounded integration cards

### Bug Fixes
- Hydration mismatch error — `toLocaleString()` → `toLocaleString('en-US')` untuk konsistensi server/client

### Decisions
- D-010: Tactical Military sebagai aesthetic direction (bukan AI-generated)
- D-011: Geist Mono untuk monospace (bukan JetBrains Mono)
- D-012: Rounded corners untuk semua kotak/layout

---

## [2026-04-08 Session 2] — Phase 0 Frontend Build (0A–0F)

### New Files
- `sealive-app/` — Next.js 16 project initialized (App Router, TypeScript, Tailwind v4)
- `sealive-app/src/app/globals.css` — Complete design system (dark command-center theme, 13+ color tokens, animations, scrollbar, glassmorphism)
- `sealive-app/src/app/layout.tsx` — Root layout with Inter font, Navbar, metadata
- `sealive-app/src/app/page.tsx` — Redirect to /map
- `sealive-app/src/lib/constants.ts` — Nav items, mock vessels, cases, anomaly data, ship types
- `sealive-app/src/components/layout/Navbar.tsx` — Top navigation (logo, nav pills, search, notifications, avatar)
- `sealive-app/src/components/ui/Card.tsx` — Reusable dark card panel
- `sealive-app/src/components/ui/Badge.tsx` — PriorityBadge & StatusPill components
- `sealive-app/src/app/map/page.tsx` — Maps View (collapsible sidebar, vessel list, mock map, controls, bottom bar)
- `sealive-app/src/app/dashboard/page.tsx` — Executive Dashboard (bar charts, donut, radar, timeline bubbles)
- `sealive-app/src/app/situational/page.tsx` — Situational Awareness (3-panel, globe, news/piracy/earthquake)
- `sealive-app/src/app/cases/page.tsx` — Case Management (summary cards, data table, pagination)
- `sealive-app/src/app/interops/page.tsx` — Interops (integration cards with status)

### Modified Files
- `docs/plans/PHASE_0_PLAN.md` — Rewritten with frontend-first approach (7 sub-tasks)
- `docs/ACTIVE_TASK.md` — Updated with completed sub-tasks 0A–0F
- `docs/DECISION_LOG.md` — Added D-007, D-008, D-009

### Decisions
- D-007: Charts Phase 0 — CSS mock instead of chart library
- D-008: Map Phase 0 — Static placeholder instead of Mapbox integration
- D-009: Frontend-First approach — all pages built with mock data before integration

### Dependencies Added
- `lucide-react` — Icon library

---

## [2026-04-08 Session 1] — Project Kickoff & Phase 0 Planning

### New Files
- `prd.md` — Product Requirements Document v1.0 (Maritime Monitoring Platform)
- `docs/plans/PHASE_0_PLAN.md` — Detailed implementation plan for Foundation & Setup

### Modified Files
- `docs/PROJECT_STATUS.md` — Diselaraskan dengan PRD: 5 phases roadmap, UI/UX design system reference (Glassocean)
- `docs/ACTIVE_TASK.md` — Set to Phase 0, next steps defined
- `docs/DECISION_LOG.md` — 6 keputusan arsitektur dicatat (D-001 s/d D-006)

### Decisions
- D-001: Tailwind CSS sebagai CSS framework
- D-002: Mapbox GL JS + Deck.gl sebagai map library
- D-003~D-005: Chart, State Management, 3D Globe di-defer
- D-006: Dark Command-Center theme (ref Glassocean)

---
