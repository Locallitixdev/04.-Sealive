# 📡 API Contracts — Sealive Maritime Platform

> **Last Updated**: 2026-04-09  
> **Base URL**: `http://localhost:4000/api`  
> **Auth**: Bearer token via `Authorization` header (except public endpoints)  
> **Response Format**: `{ statusCode, message, data?, meta? }`

---

## Standard Response Envelope

```json
// Success
{
  "statusCode": 200,
  "message": "OK",
  "data": { ... },
  "meta": { "page": 1, "limit": 20, "total": 150 }
}

// Error
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Invalid or expired token"
}
```

## Standard Query Parameters (Paginated Endpoints)

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | number | 1 | Page number |
| `limit` | number | 20 | Items per page (max 100) |
| `sort` | string | `created_at` | Sort field |
| `order` | string | `DESC` | `ASC` or `DESC` |
| `search` | string | — | Full-text search |

---

## Auth (`/api/auth`)

| Method | Endpoint | Guard | Description |
|--------|----------|-------|-------------|
| POST | `/auth/register` | — | Register new user |
| POST | `/auth/login` | — | Login → `{ accessToken, refreshToken }` |
| POST | `/auth/refresh` | — | Refresh access token (httpOnly cookie) |
| POST | `/auth/logout` | @Auth | Revoke refresh token |
| GET | `/auth/me` | @Auth | Get current user profile |

### `POST /auth/register`
```json
// Request
{
  "email": "operator@sealive.id",
  "password": "SecureP@ss123!",
  "fullName": "Ahmad Operator"
}

// Response 201
{
  "statusCode": 201,
  "message": "User registered successfully",
  "data": {
    "id": "uuid",
    "email": "operator@sealive.id",
    "fullName": "Ahmad Operator",
    "role": "VIEWER"
  }
}
```

### `POST /auth/login`
```json
// Request
{
  "email": "operator@sealive.id",
  "password": "SecureP@ss123!"
}

// Response 200
{
  "statusCode": 200,
  "message": "Login successful",
  "data": {
    "accessToken": "eyJhbGciOi...",
    "user": {
      "id": "uuid",
      "email": "operator@sealive.id",
      "fullName": "Ahmad Operator",
      "role": "OPERATOR",
      "avatarUrl": null
    }
  }
}
// + Set-Cookie: refreshToken=<opaque>; HttpOnly; Secure; SameSite=Strict; Path=/api/auth
```

### `POST /auth/refresh`
```json
// No body — reads httpOnly cookie

// Response 200
{
  "statusCode": 200,
  "data": {
    "accessToken": "eyJhbGciOi..."
  }
}
```

---

## Users (`/api/users`)

| Method | Endpoint | Guard | Roles | Description |
|--------|----------|-------|-------|-------------|
| GET | `/users` | @Auth | ADMIN | List all users (paginated) |
| GET | `/users/:id` | @Auth | ADMIN, self | Get user by ID |
| PATCH | `/users/:id` | @Auth | ADMIN, self | Update user |
| DELETE | `/users/:id` | @Auth | ADMIN | Deactivate user |
| PATCH | `/users/:id/role` | @Auth | ADMIN | Change user role |

### `PATCH /users/:id`
```json
// Request
{
  "fullName": "Ahmad Operator Senior",
  "avatarUrl": "https://minio.../user-avatars/uuid.jpg"
}
```

---

## Vessels (`/api/vessels`)

| Method | Endpoint | Guard | Roles | Description |
|--------|----------|-------|-------|-------------|
| GET | `/vessels` | @Auth | ALL | List vessels (paginated, filterable) |
| GET | `/vessels/:id` | @Auth | ALL | Get vessel detail |
| GET | `/vessels/:id/positions` | @Auth | ALL | Get position history |
| GET | `/vessels/:id/alerts` | @Auth | ALL | Get vessel alerts |
| POST | `/vessels` | @Auth | ADMIN, OPERATOR | Create vessel record |
| PATCH | `/vessels/:id` | @Auth | ADMIN, OPERATOR | Update vessel |

### `GET /vessels` — Query Filters

| Param | Type | Example | Description |
|-------|------|---------|-------------|
| `type` | string | `Cargo` | Filter by vessel type |
| `flag` | string | `ID` | Filter by flag state |
| `status` | string | `Underway` | Filter by navigation status |
| `search` | string | `MERATUS` | Search name, MMSI, IMO |
| `bbox` | string | `105.5,-7.2,115.8,1.5` | Bounding box `minLon,minLat,maxLon,maxLat` |
| `minSpeed` | number | `0` | Minimum speed (knots) |
| `maxSpeed` | number | `25` | Maximum speed (knots) |

### `GET /vessels/:id/positions`

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `from` | ISO date | 24h ago | Start datetime |
| `to` | ISO date | now | End datetime |
| `limit` | number | 500 | Max points |

```json
// Response 200
{
  "statusCode": 200,
  "data": [
    {
      "latitude": 3.181666,
      "longitude": 119.488333,
      "speed": 12.5,
      "heading": 45.2,
      "recordedAt": "2026-04-09T06:30:00Z"
    }
  ],
  "meta": { "total": 48 }
}
```

---

## Alerts (`/api/alerts`)

| Method | Endpoint | Guard | Roles | Description |
|--------|----------|-------|-------|-------------|
| GET | `/alerts` | @Auth | ALL | List alerts (paginated, filterable) |
| GET | `/alerts/:id` | @Auth | ALL | Get alert detail |
| PATCH | `/alerts/:id/acknowledge` | @Auth | OPERATOR, ADMIN | Acknowledge alert |
| PATCH | `/alerts/:id/resolve` | @Auth | OPERATOR, ADMIN | Resolve alert |
| PATCH | `/alerts/:id/dismiss` | @Auth | OPERATOR, ADMIN | Dismiss alert |

### `GET /alerts` — Query Filters

| Param | Type | Description |
|-------|------|-------------|
| `severity` | string | `CRITICAL,HIGH` (comma-separated) |
| `status` | string | `NEW,ACKNOWLEDGED` |
| `type` | string | `SPEED_ANOMALY` |
| `vesselId` | UUID | Filter by vessel |
| `from` | ISO date | Start date |
| `to` | ISO date | End date |

### `PATCH /alerts/:id/acknowledge`
```json
// No body required — sets acknowledged_by = current user, acknowledged_at = now
// Response 200
{
  "statusCode": 200,
  "message": "Alert acknowledged",
  "data": { "id": "uuid", "status": "ACKNOWLEDGED" }
}
```

---

## Cases (`/api/cases`)

| Method | Endpoint | Guard | Roles | Description |
|--------|----------|-------|-------|-------------|
| GET | `/cases` | @Auth | ALL | List cases (paginated) |
| GET | `/cases/:id` | @Auth | ALL | Get case detail + comments |
| POST | `/cases` | @Auth | OPERATOR, ADMIN | Create case |
| PATCH | `/cases/:id` | @Auth | OPERATOR, ADMIN | Update case |
| POST | `/cases/:id/comments` | @Auth | OPERATOR, ADMIN, ANALYST | Add comment |
| POST | `/cases/:id/attachments` | @Auth | OPERATOR, ADMIN | Upload attachment (multipart) |
| GET | `/cases/:id/attachments/:fileId` | @Auth | ALL | Get presigned download URL |

### `POST /cases`
```json
// Request
{
  "title": "Suspicious vessel near Natuna",
  "description": "Vessel MV UNKNOWN turned off AIS transponder for 6 hours",
  "type": "ANOMALY_FOLLOWUP",
  "category": "Suspicious vessel",
  "priority": "HIGH",
  "vesselId": "uuid",
  "alertId": "uuid",
  "assignedTo": "uuid",
  "latitude": 3.5,
  "longitude": 108.2,
  "deadline": "2026-04-15T00:00:00Z"
}

// Response 201
{
  "statusCode": 201,
  "message": "Case created",
  "data": {
    "id": "uuid",
    "caseNumber": "CS-20260409-0001",
    "title": "Suspicious vessel near Natuna",
    "status": "OPEN",
    ...
  }
}
```

---

## Dashboard (`/api/dashboard`)

| Method | Endpoint | Guard | Roles | Description |
|--------|----------|-------|-------|-------------|
| GET | `/dashboard/stats` | @Auth | ALL | Summary statistics |
| GET | `/dashboard/vessel-distribution` | @Auth | ALL | Vessel type distribution |
| GET | `/dashboard/alert-trends` | @Auth | ALL | Alert trends (7d/30d) |
| GET | `/dashboard/traffic-density` | @Auth | ALL | Traffic density heatmap data |

### `GET /dashboard/stats`
```json
// Response 200 (Redis-cached 30s)
{
  "statusCode": 200,
  "data": {
    "totalVessels": 12458,
    "activeAlerts": 23,
    "openCases": 7,
    "underway": 8932,
    "anchored": 2156,
    "moored": 1370
  }
}
```

---

## Situational (`/api/situational`)

| Method | Endpoint | Guard | Roles | Description |
|--------|----------|-------|-------|-------------|
| GET | `/situational/weather` | @Auth | ALL | Weather data by region |
| GET | `/situational/news` | @Auth | ALL | Maritime news feed |
| GET | `/situational/intelligence` | @Auth | OPERATOR, ANALYST, ADMIN | Intelligence reports |

### `GET /situational/weather`
| Param | Type | Description |
|-------|------|-------------|
| `lat` | number | Latitude center |
| `lon` | number | Longitude center |
| `regionId` | string | Predefined region ID |

---

## Files (`/api/files`)

| Method | Endpoint | Guard | Roles | Description |
|--------|----------|-------|-------|-------------|
| POST | `/files/upload` | @Auth | OPERATOR, ADMIN | Upload file to MinIO |
| GET | `/files/:key/url` | @Auth | ALL | Get presigned download URL |
| DELETE | `/files/:key` | @Auth | ADMIN | Delete file |

### `POST /files/upload`
```
Content-Type: multipart/form-data
Fields: file (binary), bucket (string), path (string)

// Response 201
{
  "statusCode": 201,
  "data": {
    "key": "case-attachments/2026/04/uuid-original.pdf",
    "fileName": "evidence-report.pdf",
    "fileSize": 2048576,
    "mimeType": "application/pdf",
    "url": "https://minio.../presigned..."
  }
}
```

---

## WebSocket Events

### AIS Gateway (`ws://localhost:4000/ais`)

| Event | Direction | Payload | Description |
|-------|-----------|---------|-------------|
| `positions:update` | Server → Client | `VesselPosition[]` | Batch position updates (every 30s) |
| `subscribe:vessel` | Client → Server | `{ vesselId }` | Subscribe to single vessel updates |
| `unsubscribe:vessel` | Client → Server | `{ vesselId }` | Unsubscribe |

### Notifications Gateway (`ws://localhost:4000/notifications`)

| Event | Direction | Payload | Description |
|-------|-----------|---------|-------------|
| `alert:new` | Server → Client | `Alert` | New alert created |
| `alert:update` | Server → Client | `Alert` | Alert status changed |
| `case:update` | Server → Client | `Case` | Case status changed |
| `notification:new` | Server → Client | `Notification` | General notification |

---

## Error Codes

| Status | Code | Description |
|--------|------|-------------|
| 400 | `BAD_REQUEST` | Validation error (details in `error` field) |
| 401 | `UNAUTHORIZED` | Missing or invalid token |
| 403 | `FORBIDDEN` | Insufficient role permissions |
| 404 | `NOT_FOUND` | Resource not found |
| 409 | `CONFLICT` | Duplicate resource (e.g. email exists) |
| 422 | `UNPROCESSABLE` | Business logic error |
| 429 | `TOO_MANY_REQUESTS` | Rate limit exceeded |
| 500 | `INTERNAL_ERROR` | Server error (logged, correlation ID returned) |

---

## Rate Limits

| Endpoint Group | Limit | Window |
|----------------|-------|--------|
| `/auth/login` | 5 requests | 1 minute |
| `/auth/register` | 3 requests | 1 minute |
| `/api/*` (authenticated) | 100 requests | 1 minute |
| `/files/upload` | 10 requests | 1 minute |
| WebSocket connections | 5 per user | concurrent |

---

*Document Version: 2.0*  
*Last Updated: 2026-04-09*
