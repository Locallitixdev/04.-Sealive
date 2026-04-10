# 🏗️ Backend Architecture — Sealive Maritime Platform

> **Version**: 2.0  
> **Date**: 2026-04-09  
> **Stack**: NestJS 10 (API) + Next.js 16 (Web) + PostgreSQL 16 + Redis 7 + MinIO  
> **Security**: OWASP Top 10 Compliant

---

## 1. System Topology

```text
                    ┌─────────────────────────────────────────────┐
                    │              NGINX / Reverse Proxy           │
                    │         (TLS Termination, Rate Limit)        │
                    └────────────┬────────────────┬───────────────┘
                                 │                │
                    ┌────────────▼───┐    ┌───────▼────────────┐
                    │  sealive-app   │    │    sealive-api      │
                    │  Next.js 16    │    │    NestJS 10        │
                    │  Port: 3000    │    │    REST + WebSocket │
                    └────────┬───────┘    └──┬──────┬──────┬───┘
                             │               │      │      │
                    ┌────────▼───────────────▼──┐   │      │
                    │     PostgreSQL 16          │   │      │
                    │     Port: 5432             │   │      │
                    └───────────────────────────┘   │      │
                                          ┌─────────▼──┐   │
                                          │  Redis 7   │   │
                                          │  Port: 6379│   │
                                          │  Cache +   │   │
                                          │  Sessions  │   │
                                          │  + PubSub  │   │
                                          └────────────┘   │
                                                    ┌──────▼─────┐
                                                    │   MinIO    │
                                                    │  Port: 9000│
                                                    │  S3-compat │
                                                    │  File Store│
                                                    └────────────┘
```

---

## 2. Monorepo Structure

```text
04. Sealive/
├── docs/                              # Documentation (unchanged)
├── prd.md                             # Product Requirements
│
├── sealive-app/                       # ← EXISTING (Next.js 16 Frontend)
│   ├── src/app/                       #   Pages & layouts
│   ├── src/components/                #   UI components
│   ├── src/lib/                       #   Utils, API client, constants
│   └── ...
│
├── sealive-api/                       # ← NEW (NestJS 10 Backend)
│   ├── src/
│   │   ├── main.ts                    #   Bootstrap (Fastify adapter)
│   │   ├── app.module.ts              #   Root module
│   │   ├── common/                    #   Shared: guards, pipes, filters, interceptors
│   │   │   ├── guards/
│   │   │   │   ├── jwt-auth.guard.ts
│   │   │   │   ├── roles.guard.ts
│   │   │   │   └── throttle.guard.ts
│   │   │   ├── filters/
│   │   │   │   └── http-exception.filter.ts
│   │   │   ├── interceptors/
│   │   │   │   ├── logging.interceptor.ts
│   │   │   │   └── transform.interceptor.ts
│   │   │   ├── pipes/
│   │   │   │   └── validation.pipe.ts
│   │   │   └── decorators/
│   │   │       ├── current-user.decorator.ts
│   │   │       └── roles.decorator.ts
│   │   │
│   │   ├── config/                    #   Env config module (@nestjs/config)
│   │   │   ├── app.config.ts
│   │   │   ├── database.config.ts
│   │   │   ├── redis.config.ts
│   │   │   ├── minio.config.ts
│   │   │   └── jwt.config.ts
│   │   │
│   │   ├── modules/
│   │   │   ├── auth/                  #   Authentication & Authorization
│   │   │   │   ├── auth.module.ts
│   │   │   │   ├── auth.controller.ts
│   │   │   │   ├── auth.service.ts
│   │   │   │   ├── strategies/
│   │   │   │   │   ├── jwt.strategy.ts
│   │   │   │   │   └── refresh-token.strategy.ts
│   │   │   │   └── dto/
│   │   │   │       ├── login.dto.ts
│   │   │   │       └── register.dto.ts
│   │   │   │
│   │   │   ├── users/                 #   User management & RBAC
│   │   │   │   ├── users.module.ts
│   │   │   │   ├── users.controller.ts
│   │   │   │   ├── users.service.ts
│   │   │   │   └── entities/user.entity.ts
│   │   │   │
│   │   │   ├── vessels/               #   Vessel CRUD & search
│   │   │   │   ├── vessels.module.ts
│   │   │   │   ├── vessels.controller.ts
│   │   │   │   ├── vessels.service.ts
│   │   │   │   └── entities/vessel.entity.ts
│   │   │   │
│   │   │   ├── ais/                   #   AIS data ingestion & broadcast
│   │   │   │   ├── ais.module.ts
│   │   │   │   ├── ais.gateway.ts     #   WebSocket gateway
│   │   │   │   ├── ais.service.ts
│   │   │   │   └── ais.scheduler.ts   #   Cron: poll external AIS API
│   │   │   │
│   │   │   ├── alerts/                #   Anomaly detection & alerts
│   │   │   │   ├── alerts.module.ts
│   │   │   │   ├── alerts.controller.ts
│   │   │   │   ├── alerts.service.ts
│   │   │   │   └── entities/alert.entity.ts
│   │   │   │
│   │   │   ├── cases/                 #   Case management
│   │   │   │   ├── cases.module.ts
│   │   │   │   ├── cases.controller.ts
│   │   │   │   ├── cases.service.ts
│   │   │   │   └── entities/case.entity.ts
│   │   │   │
│   │   │   ├── dashboard/             #   Aggregated stats & analytics
│   │   │   │   ├── dashboard.module.ts
│   │   │   │   ├── dashboard.controller.ts
│   │   │   │   └── dashboard.service.ts
│   │   │   │
│   │   │   ├── situational/           #   Weather, news, intelligence
│   │   │   │   ├── situational.module.ts
│   │   │   │   ├── situational.controller.ts
│   │   │   │   └── situational.service.ts
│   │   │   │
│   │   │   ├── files/                 #   MinIO file upload/download
│   │   │   │   ├── files.module.ts
│   │   │   │   ├── files.controller.ts
│   │   │   │   └── files.service.ts
│   │   │   │
│   │   │   └── notifications/         #   Push notifications + email
│   │   │       ├── notifications.module.ts
│   │   │       ├── notifications.gateway.ts
│   │   │       └── notifications.service.ts
│   │   │
│   │   └── database/
│   │       ├── migrations/            #   TypeORM migrations
│   │       └── seeds/                 #   Seed data
│   │
│   ├── test/                          #   E2E tests
│   ├── .env.example
│   ├── nest-cli.json
│   ├── tsconfig.json
│   └── package.json
│
└── docker-compose.yml                 # ← NEW (PostgreSQL + Redis + MinIO)
```

---

## 3. NestJS Module Breakdown

| Module | Responsibility | Key Dependencies |
|--------|---------------|-----------------|
| **AuthModule** | JWT login/register, refresh tokens, password hashing (Argon2id) | `@nestjs/jwt`, `@nestjs/passport`, `passport-jwt` |
| **UsersModule** | User CRUD, role management (ADMIN, OPERATOR, ANALYST, VIEWER) | TypeORM `UserEntity` |
| **VesselsModule** | Vessel registry CRUD, search/filter, vessel detail | TypeORM `VesselEntity` |
| **AisModule** | External AIS API polling (Datalastic), WebSocket broadcast, position history | `@nestjs/schedule`, `@nestjs/websockets`, Redis PubSub |
| **AlertsModule** | Anomaly detection rules engine, alert CRUD, severity management | TypeORM `AlertEntity`, Redis queue |
| **CasesModule** | Case lifecycle (create → assign → track → resolve), attachments | TypeORM `CaseEntity`, MinIO |
| **DashboardModule** | Aggregated queries: vessel count, alert stats, traffic density | Redis cache (TTL 30s) |
| **SituationalModule** | Proxy to weather API, news RSS, social media feeds | `@nestjs/axios`, Redis cache |
| **FilesModule** | S3-compatible upload/download via MinIO, presigned URLs | `minio` SDK |
| **NotificationsModule** | WebSocket push, email (future), in-app notifications | `@nestjs/websockets`, Redis PubSub |

---

## 4. OWASP Top 10 Compliance

| # | Threat | Mitigation Strategy |
|---|--------|---------------------|
| A01 | **Broken Access Control** | JWT + RBAC guards on every route. `@Roles()` decorator + `RolesGuard`. Row-level ownership checks in services. |
| A02 | **Cryptographic Failures** | Argon2id for password hashing. TLS 1.3 in transit. AES-256 for sensitive fields at rest. JWT secrets from env only. |
| A03 | **Injection** | TypeORM parameterized queries (no raw SQL). `class-validator` DTOs on all inputs. `ValidationPipe` globally. |
| A04 | **Insecure Design** | Threat modeling per module. Rate limiting (`@nestjs/throttler` — 100 req/min). CORS whitelist to `sealive-app` origin only. |
| A05 | **Security Misconfiguration** | Helmet middleware. Remove default headers. Strict `.env` — no secrets in code. Docker non-root user. |
| A06 | **Vulnerable Components** | `npm audit` in CI. Dependabot/Renovate for dependency updates. Lock files committed. |
| A07 | **Auth Failures** | Access token TTL 15min + Refresh token 7d (rotated). Account lockout after 5 failed attempts (Redis counter). |
| A08 | **Software & Data Integrity** | Signed Docker images. `integrity` field in package-lock. CI/CD pipeline validation. |
| A09 | **Logging & Monitoring** | Structured JSON logging (Pino via `nestjs-pino`). Audit trail table for sensitive actions. Request correlation IDs. |
| A10 | **SSRF** | Whitelist external API domains (Datalastic, weather). No user-supplied URLs in server-side fetch. Validate all redirect URIs. |

---

## 5. Data Flow

### 5.1 AIS Real-Time Pipeline

```text
┌──────────────┐     ┌──────────────┐     ┌──────────┐     ┌──────────────┐
│  Datalastic   │────▶│  AIS Scheduler│────▶│  Redis   │────▶│  AIS Gateway │
│  (External)   │     │  (Cron 30s)  │     │  PubSub  │     │  (WebSocket) │
└──────────────┘     └──────┬───────┘     └──────────┘     └──────┬───────┘
                            │                                      │
                            ▼                                      ▼
                     ┌──────────────┐                      ┌──────────────┐
                     │  PostgreSQL  │                      │  sealive-app │
                     │  (positions) │                      │  (Live Map)  │
                     └──────────────┘                      └──────────────┘
```

1. **AIS Scheduler** (cron job every 30s) polls Datalastic API for vessel positions.
2. New positions are **batch-upserted** into PostgreSQL `vessel_positions` table.
3. Positions are **published** to Redis PubSub channel `ais:positions`.
4. **AIS Gateway** (WebSocket) subscribes to Redis and broadcasts to connected clients.
5. `sealive-app` receives positions via WebSocket and updates the MapLibre layer.

### 5.2 Alert Detection Flow

```text
┌──────────────┐     ┌──────────────┐     ┌──────────┐     ┌──────────────┐
│  New Position │────▶│  Rules Engine│────▶│  Alert   │────▶│  Notification│
│  (AIS data)  │     │  (speed/route)│     │  Created │     │  (WebSocket) │
└──────────────┘     └──────────────┘     └──────────┘     └──────────────┘
```

---

## 6. Caching Strategy (Redis 7)

| Key Pattern | TTL | Purpose |
|-------------|-----|---------|
| `session:{userId}` | 15min | JWT session / refresh token store |
| `vessel:list` | 30s | Cached vessel list for dashboard |
| `vessel:{mmsi}:pos` | 60s | Latest position per vessel |
| `dashboard:stats` | 30s | Aggregated dashboard numbers |
| `weather:{regionId}` | 5min | Weather data per region |
| `news:feed` | 10min | Cached news articles |
| `throttle:{ip}` | 1min | Rate-limit counters |
| `lockout:{email}` | 15min | Failed login attempt counter |

---

## 7. File Storage (MinIO)

| Bucket | Purpose | Access |
|--------|---------|--------|
| `case-attachments` | Case evidence files (images, PDFs, docs) | Private — presigned URL (15min TTL) |
| `vessel-documents` | Vessel registration docs, certificates | Private — presigned URL |
| `user-avatars` | Profile pictures | Public-read |
| `exports` | Generated PDF/CSV reports | Private — presigned URL (1hr TTL) |

---

## 8. Authentication Flow

```text
┌──────────┐     POST /auth/login      ┌──────────────┐
│  Client  │ ──────────────────────────▶│  AuthService  │
│          │                            │               │
│          │     { accessToken,         │  1. Validate  │
│          │◀──────refreshToken }───────│  2. Argon2    │
│          │                            │  3. Sign JWT  │
│          │                            └───────────────┘
│          │
│          │     GET /api/vessels        ┌──────────────┐
│          │ ──────────────────────────▶│  JwtAuthGuard │
│          │     Authorization:         │  → verify JWT │
│          │     Bearer <accessToken>   │  → attach user│
│          │                            └───────┬──────┘
│          │                                    │
│          │                            ┌───────▼──────┐
│          │◀───────── { data } ────────│  Controller  │
└──────────┘                            └──────────────┘
```

**Token Strategy:**
- **Access Token**: JWT, 15 min TTL, stored in memory (frontend)
- **Refresh Token**: Opaque UUID, 7 days TTL, stored in httpOnly secure cookie + Redis
- **Rotation**: Each refresh invalidates old token, issues new pair

---

## 9. Role-Based Access Control (RBAC)

| Role | Description | Permissions |
|------|-------------|-------------|
| `ADMIN` | System administrator | Full access. User management, system config. |
| `OPERATOR` | Maritime operations officer | Vessel monitoring, alert management, case CRUD. |
| `ANALYST` | Intelligence analyst | Read vessels/alerts, situational awareness, dashboard. Read-only cases. |
| `VIEWER` | Read-only stakeholder | View dashboard, map, cases. No mutations. |

---

## 10. Phased Implementation Plan

### Phase B0: Foundation & Infrastructure (Week 1)
- [ ] Initialize NestJS 10 project (`sealive-api/`)
- [ ] Docker Compose: PostgreSQL 16 + Redis 7 + MinIO
- [ ] TypeORM setup + initial migration
- [ ] Config module (`@nestjs/config`) with validation (Joi)
- [ ] Global pipes, filters, interceptors
- [ ] Helmet, CORS, throttling
- [ ] Health check endpoint (`/api/health`)
- [ ] Structured logging (nestjs-pino)

### Phase B1: Auth & Users (Week 2)
- [ ] User entity + migration
- [ ] Registration (Argon2id hashing)
- [ ] Login (JWT access + refresh tokens)
- [ ] Token refresh endpoint
- [ ] RBAC guards (`@Roles()` + `RolesGuard`)
- [ ] Account lockout (Redis counter)
- [ ] Connect `sealive-app` login page to API

### Phase B2: Vessels & AIS (Week 3-4)
- [ ] Vessel entity + migration
- [ ] Vessel CRUD endpoints
- [ ] Vessel position history entity
- [ ] AIS Scheduler (Datalastic API polling)
- [ ] AIS WebSocket Gateway (real-time broadcast)
- [ ] Redis PubSub for position updates
- [ ] Connect `sealive-app` map to live WebSocket data

### Phase B3: Alerts, Cases & Dashboard (Week 5-6)
- [ ] Alert entity + anomaly detection rules engine
- [ ] Alert CRUD + acknowledgment workflow
- [ ] Case entity + full lifecycle endpoints
- [ ] Case attachments (MinIO integration)
- [ ] Dashboard aggregation endpoints (Redis-cached)
- [ ] Notification WebSocket gateway

### Phase B4: Situational & Polish (Week 7-8)
- [ ] Weather API proxy + cache
- [ ] News RSS aggregator + cache
- [ ] File management (MinIO presigned URLs)
- [ ] PDF/CSV export generation
- [ ] Audit trail logging
- [ ] E2E tests (Jest + Supertest)
- [ ] API documentation (Swagger/OpenAPI)

---

## 11. Environment Variables

```env
# -- App --
NODE_ENV=development
API_PORT=4000
API_PREFIX=api
CORS_ORIGIN=http://localhost:3000

# -- Database --
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=sealive
DB_PASSWORD=<secure-password>
DB_NAME=sealive_db

# -- Redis --
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=<secure-password>

# -- JWT --
JWT_ACCESS_SECRET=<64-char-random>
JWT_ACCESS_TTL=15m
JWT_REFRESH_SECRET=<64-char-random>
JWT_REFRESH_TTL=7d

# -- MinIO --
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_ACCESS_KEY=<access-key>
MINIO_SECRET_KEY=<secret-key>
MINIO_USE_SSL=false

# -- External APIs --
AIS_API_KEY=<datalastic-api-key>
AIS_API_URL=https://api.datalastic.com/api/v0
WEATHER_API_KEY=<weather-api-key>
```

---

## 12. Docker Compose (Development)

```yaml
# docker-compose.yml
version: "3.9"

services:
  postgres:
    image: postgres:16-alpine
    ports: ["5432:5432"]
    environment:
      POSTGRES_DB: sealive_db
      POSTGRES_USER: sealive
      POSTGRES_PASSWORD: ${DB_PASSWORD:-sealive_dev}
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U sealive"]
      interval: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    ports: ["6379:6379"]
    command: redis-server --requirepass ${REDIS_PASSWORD:-redis_dev}
    volumes:
      - redisdata:/data

  minio:
    image: minio/minio:latest
    ports:
      - "9000:9000"
      - "9001:9001"
    environment:
      MINIO_ROOT_USER: ${MINIO_ACCESS_KEY:-minioadmin}
      MINIO_ROOT_PASSWORD: ${MINIO_SECRET_KEY:-minioadmin}
    command: server /data --console-address ":9001"
    volumes:
      - miniodata:/data

volumes:
  pgdata:
  redisdata:
  miniodata:
```

---

*Document Version: 2.0*  
*Last Updated: 2026-04-09*
