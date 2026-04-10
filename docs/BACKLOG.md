# 📥 Backlog — Feature Requests & Ideas

> **Last Updated**: 2026-04-09

## Prioritized Queue

| # | Tanggal | Request | Prioritas | Target Phase | Status |
|---|---------|---------|-----------|--------------|--------|
| B-001 | 2026-04-08 | Polish & Micro-interactions (0G) | 🔴 HIGH | Phase 0 | ✅ Done |
| B-002 | 2026-04-08 | Browser visual review & layout refinement | 🔴 HIGH | Phase 0 | ✅ Done |
| B-003 | 2026-04-08 | MapLibre GL JS integration | 🔴 HIGH | Phase 1 | ✅ Done |
| B-004 | 2026-04-08 | Map layers: shipping routes, EEZ, ports, anomaly zones | 🔴 HIGH | Phase 1 | ✅ Done |
| B-005 | 2026-04-08 | Vessel detail panel in sidebar | 🔴 HIGH | Phase 1 | ✅ Done |
| B-006 | 2026-04-08 | Layer toggle button overlap fix | 🔴 HIGH | Phase 1 | ✅ Done |
| B-007 | 2026-04-08 | Dashboard stats, alerts, timeline | 🟡 MED | Phase 2 | ✅ Done |
| B-008 | 2026-04-08 | Weather widget, news, intelligence DB | 🟡 MED | Phase 3 | ✅ Done |
| B-009 | 2026-04-08 | 3D Globe with react-globe.gl | 🟡 MED | Phase 3 | ✅ Done |
| B-010 | 2026-04-08 | Case table, detail panel, modal, reports | 🟢 LOW | Phase 4 | ✅ Done |
| B-011 | 2026-04-08 | Globe fullscreen sizing fix | 🟡 MED | Phase 3 | ✅ Done |
| B-012 | 2026-04-08 | Vessel toggle not functioning | 🟡 MED | Phase 1 | ✅ Done |
| B-013 | 2026-04-08 | MapLibre _loaded error fix | 🔴 HIGH | Phase 1 | ✅ Done |
| B-014 | 2026-04-08 | AIS data API integration (Datalastic) | 🔴 HIGH | Phase B2 | 📋 Planned |
| B-015 | 2026-04-08 | Real chart library (Recharts/ECharts) | 🟡 MED | Phase B4 | 📋 Planned |
| B-016 | 2026-04-09 | Replace Risk Score dummy SVGs with dynamic charts | 🟢 LOW | Phase B4 | 📋 Planned |

## Backend Queue (NEW)

| # | Tanggal | Request | Prioritas | Target Phase | Status |
|---|---------|---------|-----------|--------------|--------|
| BB-001 | 2026-04-09 | NestJS 10 project init + Docker infra | 🔴 HIGH | Phase B0 | ✅ Done |
| BB-002 | 2026-04-09 | JWT Auth + Argon2id + RBAC guards | 🔴 HIGH | Phase B1 | ✅ Done |
| BB-003 | 2026-04-09 | Vessel CRUD + position history API | 🔴 HIGH | Phase B2 | ✅ Done |
| BB-004 | 2026-04-09 | AIS WebSocket gateway + Datalastic polling mock | 🔴 HIGH | Phase B2 | ✅ Done |
| BB-005 | 2026-04-09 | Alert rules engine + anomaly detection | 🟡 MED | Phase B3 | 📋 Planned |
| BB-006 | 2026-04-09 | Case lifecycle API + MinIO attachments | 🟡 MED | Phase B3 | 🟡 WIP |
| BB-007 | 2026-04-09 | Dashboard aggregation API (Redis-cached) | 🟡 MED | Phase B3 | 📋 Planned |
| BB-008 | 2026-04-09 | Weather + News proxy with Redis cache | 🟢 LOW | Phase B4 | 📋 Planned |
| BB-009 | 2026-04-09 | Swagger/OpenAPI auto-generated docs | 🟢 LOW | Phase B4 | 📋 Planned |
| BB-010 | 2026-04-09 | E2E tests (Jest + Supertest) | 🟢 LOW | Phase B4 | 📋 Planned |
| BB-011 | 2026-04-09 | Rule: vessel idle for 7 days in port (Cron) | 🔴 HIGH | Phase B3 | 🟡 WIP |
| BB-012 | 2026-04-09 | Rule: vessel turn off AIS / AIS Gap (Cron) | 🔴 HIGH | Phase B3 | 🟡 WIP |
| BB-013 | 2026-04-09 | Vessel Blacklist/Whitelist state management | 🔴 HIGH | Phase B3 | 🟡 WIP |
| BB-014 | 2026-04-09 | Filter Vessels by Blacklist/Whitelist status | 🟡 MED | Phase B3 | 📋 Planned |
| BB-015 | 2026-04-09 | Rule: Foreign vessel detected inside EEZ | 🔴 HIGH | Phase B3 | 🟡 WIP |

## Parking Lot (ide jangka panjang, belum prioritas)

| # | Ide | Notes |
|---|-----|-------|
| P-001 | Mobile responsive optimization | PRD menyebutkan responsive tapi Phase 0 fokus desktop-first |
| P-002 | Dark/Light theme toggle | Theme toggle ada di navbar tapi belum fungsional |
| P-003 | Notification system | Bell icon ada, backend push via WebSocket planned for Phase B3 |
| P-004 | Drag & drop widgets in Intelligence DB | Phase 3 implemented as static widgets |
| P-005 | PDF/CSV export for Cases | Phase 4 has UI, backend generation planned for Phase B4 |
| P-006 | CI/CD pipeline (GitHub Actions) | Docker build + test + deploy automation |
| P-007 | PostGIS geo-fencing alerts | Spatial queries for zone entry/exit |
| P-008 | Email notifications (Nodemailer/Resend) | Alert escalation via email |

---

## ✅ COMPLETED — Frontend (All 5 Phases)

```
sealive-app/
├── Phase 0: Foundation ✅
├── Phase 1: Maps & Vessel Monitoring ✅
├── Phase 2: Dashboard ✅
├── Phase 3: Situational Awareness ✅ (with 3D Globe)
└── Phase 4: Case Management ✅
```

## 🔧 IN PROGRESS — Backend (5 Phases)

```
sealive-api/
├── Phase B0: Foundation & Infrastructure ✅
├── Phase B1: Auth & Users ✅
├── Phase B2: Vessels & AIS ✅
├── Phase B3: Alerts, Cases & Dashboard ← CURRENT
└── Phase B4: Situational & Polish
```