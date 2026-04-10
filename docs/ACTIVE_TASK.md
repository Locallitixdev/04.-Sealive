# 🎯 Active Task

> **Last Updated**: 2026-04-09

## Current Status: 🔧 Phase B3 — Alerts, Cases & Dashboard (NEXT)

## Phase Completion Summary

| Phase | Status | Progress |
|-------|--------|----------|
| Phase 0–4: Frontend | ✅ Complete | 100% |
| **Phase B0: Backend Foundation** | **✅ Complete** | **100%** |
| **Phase B1: Auth & Users** | **✅ Complete** | **100%** |
| **Phase B2: Vessels & AIS** | **✅ Complete** | **100%** |
| Phase B3: Alerts, Cases & Dashboard | 🟡 WIP | 20% |
| Phase B4: Situational & Polish | ⬜ Queued | 0% |

## Phase B2 — Completed ✅

- [x] Entity `Vessel` & `VesselPosition`
- [x] CRUD API `/vessels`
- [x] `VesselsGateway` (WebSocket pada namespace `/ais`)
- [x] `AisPollingService` (Scheduler mock memancarkan event emit 10 detik sekali)
- [x] Integrate Frontend: `MapView.tsx` (socket.io-client merge data livePositions)

## Phase B3 — Next Tasks

- [x] Module Scaffolding `cases` & `alerts`
- [x] Entity implementation for Cases & Alerts
- [x] Cases CRUD Controller & Service (`/cases` & comments)
- [ ] Alert Rules Engine `alerts.service.ts`
- [ ] Attachments MinIO upload (`POST /cases/:id/attachments`)
- [ ] Dashboard Aggregation API (Redis-cached)

## Context Notes
- **Ports**: API=4000, Frontend=3000, PostgreSQL=5434, Redis=6379, MinIO=9000/9001
- **Auth files**:
  - `src/modules/auth/` — controller, service, module, strategies/, dto/, entities/
  - `src/modules/users/` — service, module, entities/
  - `src/common/guards/` — jwt-auth.guard.ts, roles.guard.ts
  - `src/common/decorators/` — roles.decorator.ts, current-user.decorator.ts
- **Deps added**: @nestjs/jwt, @nestjs/passport, passport, passport-jwt, argon2, uuid
- **Test user**: admin@sealive.io / Admin123! (role: VIEWER)
- **Docker**: 3 containers running (postgres, redis, minio)
- **Socket Client**: Frontend `sealive-app` telah dipasangi `socket.io-client` 
- **Last edited file**: `sealive-api/src/modules/cases/cases.controller.ts`
- **Build**: `npm run start:dev` jalan stabil (0 errors)
- **Open Bugs**: 0

## Queue (Next Tasks)
1. Phase B3 → Alerts, Cases, Dashboard APIs
2. Phase B4 → Situational proxy, files, tests, Swagger