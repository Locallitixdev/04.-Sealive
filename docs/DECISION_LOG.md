# 📋 Decision Log

> **Last Updated**: 2026-04-09

Setiap keputusan arsitektur/desain dicatat di sini agar AI dan developer tahu **kenapa** sesuatu dibuat begitu.

## Frontend Decisions (D-001 — D-015)

| # | Tanggal | Keputusan | Alasan | Alternatif Ditolak |
|---|---------|-----------|--------|--------------------| 
| D-001 | 2026-04-08 | CSS: Tailwind CSS | Data-dense UI, utility-first cepat untuk prototyping dashboard maritim | Vanilla CSS (terlalu lambat untuk kompleksitas UI ini) |
| D-002 | 2026-04-08 | Map: Mapbox GL JS + Deck.gl | WebGL rendering 10K+ markers, 3D support, dark style built-in, industri standard | Leaflet (tidak WebGL native), OpenLayers (learning curve tinggi) |
| D-003 | 2026-04-08 | Chart Library: Defer ke Phase 2 | Belum dibutuhkan di Phase 0-1, evaluasi setelah dashboard requirements jelas | — |
| D-004 | 2026-04-08 | State Management: Defer ke Phase 1 | Evaluasi setelah data flow dan kompleksitas terlihat | — |
| D-005 | 2026-04-08 | 3D Globe: Defer ke Phase 3 | Hanya dibutuhkan di Situational Awareness page | — |
| D-006 | 2026-04-08 | UI Theme: Dark Command-Center (ref Glassocean) | Long-duration monitoring, reduce eye strain, data readability prioritas | Light theme (kurang cocok untuk command center) |
| D-007 | 2026-04-08 | Charts Phase 0: CSS mock, bukan library | Fokus visual dulu, plug chart library (ECharts/Recharts) di Phase 2 | Langsung pakai library (overkill untuk mock) |
| D-008 | 2026-04-08 | Map Phase 0: Static placeholder | Mapbox integration di Phase 1, Phase 0 fokus layout & styling | Langsung integrasi Mapbox (premature) |
| D-009 | 2026-04-08 | Frontend-First approach | Semua halaman di-build UI-nya dulu dengan mock data, integration belakangan | Vertical slice (1 halaman complete end-to-end) |
| D-010 | 2026-04-08 | Aesthetic: Tactical Military | Districtive, tidak generik seperti AI-generated design, maritime/operations feel | AI-generated style (cyan/purple gradients, glassmorphism) |
| D-011 | 2026-04-08 | Mono Font: Geist Mono | bersih dan modern, mendukung aesthetic tactical | JetBrains Mono (terlalu developer-focused) |
| D-012 | 2026-04-08 | Layout: Rounded corners | Lebih modern dan friendly, tetap professional | Sharp/square corners (terlalu brutalist) |
| D-013 | 2026-04-08 | Hydration: Use 'en-US' locale | toLocaleString() tanpa locale causing SSR mismatch | — |
| D-014 | 2026-04-08 | Map: MapLibre GL JS (bukan Mapbox) | Open-source, no token, fork of Mapbox GL v1, react-map-gl compatible | Mapbox GL JS (butuh access token, commercial license) |
| D-015 | 2026-04-08 | Map tiles: OpenFreeMap dark | Free dark tiles, no API key, cocok aesthetic tactical | MapTiler (butuh key), standard OSM (no dark style) |

## Backend Decisions (D-016 — D-024)

| # | Tanggal | Keputusan | Alasan | Alternatif Ditolak |
|---|---------|-----------|--------|--------------------| 
| D-016 | 2026-04-09 | Backend: NestJS 10 | Modular architecture (modules/guards/pipes), TypeScript native, decorator-based DI, enterprise-ready. Tim sudah familiar dengan Angular-style patterns. | Express.js (too minimal, no structure), Fastify standalone (no DI framework), Hono (too new, ecosystem kecil) |
| D-017 | 2026-04-09 | Database: PostgreSQL 16 | ACID compliance, PostGIS support (future geo-fencing), pg_trgm (fuzzy vessel search), table partitioning (vessel_positions), JSON/JSONB (alert metadata). | MySQL (no native partitioning triggers), MongoDB (maritime data is relational), SQLite (not production-grade) |
| D-018 | 2026-04-09 | ORM: TypeORM 0.3.x | Native NestJS integration, migration system, decorator-based entities, query builder. | Prisma (schema-first → less flexible for complex queries), Drizzle (newer, less NestJS docs), Sequelize (JS-first, less TS support) |
| D-019 | 2026-04-09 | Cache: Redis 7 | In-memory speed for session/throttle, PubSub for real-time AIS broadcast, sorted sets for leaderboards. | Memcached (no PubSub, no persistence), in-memory cache (no horizontal scaling) |
| D-020 | 2026-04-09 | File Storage: MinIO | S3-compatible API (easy prod migration to AWS S3), self-hosted, presigned URL support, bucket policies. | Local filesystem (no scaling, no presigned URLs), Cloudflare R2 (external dependency), AWS S3 directly (vendor lock-in for dev) |
| D-021 | 2026-04-09 | Password Hashing: Argon2id | Winner of Password Hashing Competition 2015, resistant to GPU/ASIC attacks, configurable memory cost. OWASP recommended. | bcrypt (lower memory-hardness), scrypt (less tooling), SHA-256 (not a KDF — insecure for passwords) |
| D-022 | 2026-04-09 | Auth: JWT Access + Opaque Refresh | Access token (15min, stateless verification) + Refresh token (7d, httpOnly cookie, Redis-stored). Balances performance with security. | Session-only (not scalable for WebSocket), OAuth2 (overkill for internal platform v1) |
| D-023 | 2026-04-09 | Security: OWASP Top 10 Compliance | Platform handles sensitive maritime intelligence data. Government/coast guard users require enterprise-grade security posture. | Basic auth only (insufficient for maritime operations) |
| D-024 | 2026-04-09 | HTTP Adapter: Fastify | 2-3x faster than Express for JSON serialization, schema-based validation, built-in logging hooks. NestJS has first-class Fastify adapter. | Express (slower, but more middleware ecosystem) |
