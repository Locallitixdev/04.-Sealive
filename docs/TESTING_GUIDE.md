# 🧪 Testing Guide — Sealive Maritime Platform

> **Tujuan**: Panduan step-by-step untuk test seluruh platform.  
> **Last Updated**: 2026-04-09

---

## 📦 STEP 0: Setup & Jalankan

### Infrastructure
```bash
# Start database, cache, and file storage
docker compose up -d

# Verify all services are running
docker compose ps
# Expected: postgres (5432), redis (6379), minio (9000/9001) — all "Up"
```

### Backend (sealive-api)
```bash
cd sealive-api

# Install dependencies
npm install

# Run database migrations
npm run migration:run

# Seed initial data (admin user, sample vessels)
npm run seed

# Start dev server
npm run start:dev
# Expected: http://localhost:4000/api/health → { "status": "ok" }
```

### Frontend (sealive-app)
```bash
cd sealive-app

# Start dev server
npm run dev
# Expected: http://localhost:3000 → Redirects to /map
```

### Health Check
```bash
# Backend API
curl http://localhost:4000/api/health

# PostgreSQL
docker compose exec postgres pg_isready -U sealive

# Redis
docker compose exec redis redis-cli -a redis_dev PING

# MinIO Console
# Open browser → http://localhost:9001
```

---

## 🔑 Akun Login (Seed Data)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@sealive.id | Admin@123! |
| Operator | operator@sealive.id | Operator@123! |
| Analyst | analyst@sealive.id | Analyst@123! |
| Viewer | viewer@sealive.id | Viewer@123! |

---

## 🧪 PART 1: Authentication

| # | Step | Expected Result | ☐ |
|---|------|-----------------|---|
| 1.1 | POST `/auth/login` with valid admin credentials | 200 — `{ accessToken, user }` + httpOnly refresh cookie | ☐ |
| 1.2 | POST `/auth/login` with wrong password | 401 — `Unauthorized` | ☐ |
| 1.3 | POST `/auth/login` 5x wrong password (same email) | 429 / `Account locked for 15 minutes` | ☐ |
| 1.4 | GET `/auth/me` with valid access token | 200 — user profile | ☐ |
| 1.5 | GET `/auth/me` with expired token | 401 — `Token expired` | ☐ |
| 1.6 | POST `/auth/refresh` with valid cookie | 200 — new accessToken | ☐ |
| 1.7 | POST `/auth/logout` | 200 — refresh token revoked | ☐ |
| 1.8 | POST `/auth/register` with valid data | 201 — user created with VIEWER role | ☐ |
| 1.9 | POST `/auth/register` with duplicate email | 409 — `Email already exists` | ☐ |

---

## 🧪 PART 2: RBAC (Role-Based Access Control)

| # | Step | Expected Result | ☐ |
|---|------|-----------------|---|
| 2.1 | GET `/users` as ADMIN | 200 — list of all users | ☐ |
| 2.2 | GET `/users` as VIEWER | 403 — `Forbidden` | ☐ |
| 2.3 | PATCH `/users/:id/role` as ADMIN | 200 — role updated | ☐ |
| 2.4 | PATCH `/users/:id/role` as OPERATOR | 403 — `Forbidden` | ☐ |
| 2.5 | DELETE `/users/:id` as ADMIN | 200 — user deactivated | ☐ |

---

## 🧪 PART 3: Vessels

| # | Step | Expected Result | ☐ |
|---|------|-----------------|---|
| 3.1 | GET `/vessels` | 200 — paginated vessel list | ☐ |
| 3.2 | GET `/vessels?search=MERATUS` | 200 — filtered results (trigram search) | ☐ |
| 3.3 | GET `/vessels?type=Cargo&flag=ID` | 200 — filtered by type + flag | ☐ |
| 3.4 | GET `/vessels?bbox=105.5,-7.2,115.8,1.5` | 200 — vessels within bounding box | ☐ |
| 3.5 | GET `/vessels/:id` | 200 — full vessel detail | ☐ |
| 3.6 | GET `/vessels/:id/positions?from=...&to=...` | 200 — position history array | ☐ |
| 3.7 | POST `/vessels` as OPERATOR | 201 — vessel created | ☐ |
| 3.8 | POST `/vessels` as VIEWER | 403 — `Forbidden` | ☐ |

---

## 🧪 PART 4: Alerts

| # | Step | Expected Result | ☐ |
|---|------|-----------------|---|
| 4.1 | GET `/alerts` | 200 — paginated alerts | ☐ |
| 4.2 | GET `/alerts?severity=CRITICAL,HIGH` | 200 — filtered by severity | ☐ |
| 4.3 | PATCH `/alerts/:id/acknowledge` as OPERATOR | 200 — status → ACKNOWLEDGED | ☐ |
| 4.4 | PATCH `/alerts/:id/resolve` as OPERATOR | 200 — status → RESOLVED | ☐ |
| 4.5 | PATCH `/alerts/:id/acknowledge` as VIEWER | 403 — `Forbidden` | ☐ |

---

## 🧪 PART 5: Cases

| # | Step | Expected Result | ☐ |
|---|------|-----------------|---|
| 5.1 | POST `/cases` as OPERATOR | 201 — case created with auto case_number | ☐ |
| 5.2 | GET `/cases/:id` | 200 — case detail with comments | ☐ |
| 5.3 | PATCH `/cases/:id` status → IN_PROGRESS | 200 — status updated | ☐ |
| 5.4 | POST `/cases/:id/comments` | 201 — comment added | ☐ |
| 5.5 | POST `/cases/:id/attachments` (multipart file upload) | 201 — file uploaded to MinIO | ☐ |
| 5.6 | GET `/cases/:id/attachments/:fileId` | 200 — presigned download URL | ☐ |

---

## 🧪 PART 6: Dashboard & Situational

| # | Step | Expected Result | ☐ |
|---|------|-----------------|---|
| 6.1 | GET `/dashboard/stats` | 200 — summary numbers (cached 30s) | ☐ |
| 6.2 | GET `/dashboard/stats` (repeat within 30s) | 200 — same data (cache hit, faster response) | ☐ |
| 6.3 | GET `/situational/weather?lat=-6.2&lon=106.8` | 200 — weather data | ☐ |
| 6.4 | GET `/situational/news` | 200 — cached news feed | ☐ |

---

## 🧪 PART 7: WebSocket

| # | Step | Expected Result | ☐ |
|---|------|-----------------|---|
| 7.1 | Connect to `ws://localhost:4000/ais` | Connection established | ☐ |
| 7.2 | Wait 30s | Receive `positions:update` event with vessel array | ☐ |
| 7.3 | Send `subscribe:vessel` with vesselId | Receive position updates for that vessel only | ☐ |
| 7.4 | Connect to `ws://localhost:4000/notifications` | Connection established | ☐ |
| 7.5 | Trigger alert in another tab | Receive `alert:new` event | ☐ |

---

## 🧪 PART 8: Security (OWASP)

| # | Step | Expected Result | ☐ |
|---|------|-----------------|---|
| 8.1 | Send SQL injection in search: `'; DROP TABLE users;--` | 200 — empty results (parameterized query, no injection) | ☐ |
| 8.2 | Send XSS in comment: `<script>alert(1)</script>` | Stored as plain text, not executed on render | ☐ |
| 8.3 | Send request without Authorization header | 401 — `Unauthorized` | ☐ |
| 8.4 | Send 150 requests in 1 minute | 429 after 100th request — `Too Many Requests` | ☐ |
| 8.5 | Check response headers | Has Helmet headers (X-Frame-Options, CSP, etc) | ☐ |
| 8.6 | Check audit_logs after login | Row created with `user.login` action | ☐ |

---

## 🐛 Format Laporan Bug

```
### BUG-[nomor]

**Severity**: 🔴 Critical / 🟠 High / 🟡 Medium / 🟢 Low
**Part**: [Part berapa dan step berapa]
**Module**: [auth / vessels / alerts / cases / dashboard]

**Steps to Reproduce**:
1. ...
2. ...

**Expected**: Apa yang seharusnya terjadi
**Actual**: Apa yang terjadi (error/salah)

**Request/Response**:
```json
// paste curl command or response body
```

**Console Error**: [paste dari terminal/F12 jika ada]
```
