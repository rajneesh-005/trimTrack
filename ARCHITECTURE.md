# trimTrack Architecture Diagram

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           CLIENT LAYER (Browser)                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                      React 19 + TypeScript                           │   │
│  │                                                                      │   │
│  │  ┌─────────────────────────────────────────────────────────────┐   │   │
│  │  │                    App.tsx (Router)                         │   │   │
│  │  └──────────────┬──────────────────────────────────────────────┘   │   │
│  │                 │                                                   │   │
│  │    ┌────────────┼────────────┬──────────────┬──────────────┐       │   │
│  │    │            │            │              │              │       │   │
│  │    ▼            ▼            ▼              ▼              ▼       │   │
│  │  Home.tsx   Auth.tsx    Dashboard.tsx   Stats.tsx      Profile    │   │
│  │  (Shorten   (Login/     (User Links)    (Charts)        (Settings)│   │
│  │   URL)      Register)                                             │   │
│  │    │            │            │              │              │       │   │
│  │    └────────────┼────────────┴──────────────┴──────────────┘       │   │
│  │                 │                                                   │   │
│  │  ┌──────────────▼──────────────────────────────────────────────┐   │   │
│  │  │  Shared Services Layer (Axios HTTP Client)                 │   │   │
│  │  │  ├─ authService.ts    (login, register, token mgmt)        │   │   │
│  │  │  ├─ linkService.ts    (create, list, delete links)         │   │   │
│  │  │  ├─ statsService.ts   (fetch analytics data)               │   │   │
│  │  │  └─ apiClient.ts      (base HTTP configuration)            │   │   │
│  │  └──────────────┬──────────────────────────────────────────────┘   │   │
│  │                 │                                                   │   │
│  │                 │ JWT Token (LocalStorage)                          │   │
│  │                 │ Axios Interceptors (Add Auth Header)              │   │
│  │                 │                                                   │   │
│  └─────────────────┼───────────────────────────────────────────────────┘   │
│                    │                                                        │
└────────────────────┼────────────────────────────────────────────────────────┘
                     │ HTTPS
                     │ JSON (REST)
                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                     BACKEND API LAYER (Express.js)                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ app.ts (Express Server - Port 5000)                                │   │
│  │  │                                                                  │   │
│  │  ├─ Error Handler Middleware                                       │   │
│  │  ├─ CORS Middleware                                                │   │
│  │  ├─ Request Logger                                                 │   │
│  │  │                                                                  │   │
│  │  └─ Route Handler (routes/index.ts)                                │   │
│  │                                                                     │   │
│  └────────────────────┬────────────────────────────────────────────────┘   │
│                       │                                                     │
│       ┌───────────────┼───────────────┬──────────────────┐                 │
│       │               │               │                  │                 │
│       ▼               ▼               ▼                  ▼                 │
│  ┌────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐       │
│  │ Auth Route │ │Shortener Route│ │  Stats Route │ │Redirect Route│       │
│  │ /api/auth  │ │ /api/shorten  │ │/api/:code/   │ │   /:code     │       │
│  │            │ │ /api/links    │ │   stats      │ │  (Tracking)  │       │
│  └─────┬──────┘ └────────┬──────┘ └──────┬───────┘ └──────┬───────┘       │
│        │                 │               │                │               │
│        │         ┌───────▼─────────┐     │                │               │
│        │         │ Rate Limiter    │     │                │               │
│        │         │ (10 req/10 min) │     │                │               │
│        │         └───────┬─────────┘     │                │               │
│        │                 │               │                │               │
│        ▼                 ▼               ▼                ▼               │
│  ┌────────────────────────────────────────────────────────────────────┐   │
│  │              MIDDLEWARE LAYER                                      │   │
│  │  ┌──────────────────────────────────────────────────────────────┐ │   │
│  │  │ Auth Middleware                                              │ │   │
│  │  │ - Verify JWT Token                                           │ │   │
│  │  │ - Extract User ID                                            │ │   │
│  │  │ - Attach to req.user                                         │ │   │
│  │  └──────────────────────────────────────────────────────────────┘ │   │
│  │  ┌──────────────────────────────────────────────────────────────┐ │   │
│  │  │ URL Validation Middleware                                    │ │   │
│  │  │ - Validate HTTP(S) protocol only                             │ │   │
│  │  │ - Block private IP ranges (10.x, 192.168.x, etc)             │ │   │
│  │  │ - Check URL format                                           │ │   │
│  │  └──────────────────────────────────────────────────────────────┘ │   │
│  │  ┌──────────────────────────────────────────────────────────────┐ │   │
│  │  │ Error Handler Middleware                                     │ │   │
│  │  │ - Catch all errors                                           │ │   │
│  │  │ - Format error responses                                     │ │   │
│  │  └──────────────────────────────────────────────────────────────┘ │   │
│  └────────────────────────────────────────────────────────────────────┘   │
│        │                 │               │                │               │
│        ▼                 ▼               ▼                ▼               │
│  ┌────────────────────────────────────────────────────────────────────┐   │
│  │              CONTROLLER LAYER                                      │   │
│  │  ┌─────────────────┐  ┌──────────────┐  ┌──────────────────────┐ │   │
│  │  │ authController  │  │ linksContr.  │  │  statsController     │ │   │
│  │  │ ├─ register     │  │ ├─ shorten   │  │  ├─ getStats         │ │   │
│  │  │ ├─ login        │  │ ├─ getLinks  │  │  ├─ getClicksByDate  │ │   │
│  │  │ └─ logout       │  │ ├─ getOne    │  │  ├─ getDeviceStats   │ │   │
│  │  │                 │  │ └─ delete    │  │  └─ getBrowserStats  │ │   │
│  │  └─────────────────┘  └──────────────┘  └──────────────────────┘ │   │
│  └────────────────────────────────────────────────────────────────────┘   │
│        │                 │               │                │               │
│        └────────────┬────┴───────────────┴────────────────┘               │
│                     │                                                     │
│                     ▼                                                     │
│  ┌────────────────────────────────────────────────────────────────────┐   │
│  │              SERVICE LAYER (Business Logic)                        │   │
│  │  ┌──────────────────────────────────────────────────────────────┐ │   │
│  │  │ authService.ts                                               │ │   │
│  │  │ - Hash password (Bcrypt)                                     │ │   │
│  │  │ - Generate JWT token                                         │ │   │
│  │  │ - Verify JWT token                                           │ │   │
│  │  │ - Validate credentials                                       │ │   │
│  │  └──────────────────────────────────────────────────────────────┘ │   │
│  │  ┌──────────────────────────────────────────────────────────────┐ │   │
│  │  │ linkService.ts                                               │ │   │
│  │  │ - Generate short code                                        │ │   │
│  │  │ - Check code uniqueness                                      │ │   │
│  │  │ - Retrieve link from cache/DB                                │ │   │
│  │  │ - Create/update/delete link                                  │ │   │
│  │  └──────────────────────────────────────────────────────────────┘ │   │
│  │  ┌──────────────────────────────────────────────────────────────┐ │   │
│  │  │ analyticsService.ts                                          │ │   │
│  │  │ - Parse User-Agent (browser, OS, device)                     │ │   │
│  │  │ - Store click data                                           │ │   │
│  │  │ - Aggregate click statistics                                 │ │   │
│  │  │ - Calculate trends                                           │ │   │
│  │  └──────────────────────────────────────────────────────────────┘ │   │
│  └────────────────────────────────────────────────────────────────────┘   │
│        │                 │               │                                │
│        └──────────┬───────┴───────────────┘                                │
│                   │                                                        │
│                   ▼                                                        │
│  ┌────────────────────────────────────────────────────────────────────┐   │
│  │              DATA ACCESS LAYER (Queries)                           │   │
│  │  ├─ queries/auth.ts      (user insert, select, update)            │   │
│  │  ├─ queries/links.ts     (link CRUD operations)                   │   │
│  │  ├─ queries/clicks.ts    (click insert, select, aggregations)     │   │
│  │  └─ db.ts               (database connection pool)                 │   │
│  └────────────────────────────────────────────────────────────────────┘   │
│        │                                                                   │
│        ├──────────────────────────────────────┬──────────────────────┐    │
│        │                                      │                      │    │
│        ▼                                      ▼                      ▼    │
└─────────────────────────────────────────────────────────────────────────────┘
        │                                      │                      │
        │                                      │                      │
        ▼                                      ▼                      ▼
┌──────────────────┐              ┌──────────────────┐    ┌──────────────────┐
│   PostgreSQL     │              │     Redis        │    │   File System    │
│   (Persistence)  │              │     (Cache)      │    │    (Logs)        │
│                  │              │                  │    │                  │
│ Tables:          │              │ Keys:            │    │ - Access logs    │
│ - users          │              │ - short_codes    │    │ - Error logs     │
│ - links          │              │ - sessions       │    │                  │
│ - clicks         │              │ - stats_cache    │    │                  │
│                  │              │                  │    │                  │
└──────────────────┘              └──────────────────┘    └──────────────────┘
```

---

## Data Flow Diagrams

### 1. URL Shortening Flow
```
┌──────────────────────────────────────────────────────────────────────┐
│ Frontend: User enters URL and clicks "Shorten"                       │
│ ├─ Input validation (URL format)                                     │
│ └─ POST /api/shorten with JWT token                                  │
└──────────────────────┬───────────────────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────────────────┐
│ Backend: Auth Middleware                                             │
│ ├─ Verify JWT token                                                  │
│ ├─ Extract user ID                                                   │
│ └─ Attach to req.user                                                │
└──────────────────────┬───────────────────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────────────────┐
│ Backend: URL Validation Middleware                                   │
│ ├─ Check protocol (HTTP/HTTPS)                                       │
│ ├─ Block private IPs                                                 │
│ └─ Validate URL format                                               │
└──────────────────────┬───────────────────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────────────────┐
│ Backend: Rate Limiter                                                │
│ ├─ Check user's request count (last 10 minutes)                      │
│ ├─ Allow: 10 requests per 10 minutes                                 │
│ └─ Return 429 if exceeded                                            │
└──────────────────────┬───────────────────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────────────────┐
│ linksController.shorten()                                            │
│ └─ Call linkService.shorten()                                        │
└──────────────────────┬───────────────────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────────────────┐
│ linkService.shorten()                                                │
│ ├─ Generate 7-character short code                                   │
│ ├─ Check uniqueness in DB/Cache                                      │
│ ├─ Regenerate if exists (max 5 attempts)                             │
│ └─ Call DB query to insert link                                      │
└──────────────────────┬───────────────────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────────────────┐
│ Database Insert                                                      │
│ ├─ INSERT INTO links (short_code, original_url, user_id, created_at) │
│ └─ Store in links table                                              │
└──────────────────────┬───────────────────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────────────────┐
│ Cache Insert (Background)                                            │
│ ├─ SET short_code:original_url in Redis                              │
│ ├─ TTL: 24 hours                                                     │
│ └─ For fast redirects                                                │
└──────────────────────┬───────────────────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────────────────┐
│ Return Response to Frontend                                          │
│ ├─ short_code, original_url, created_at                              │
│ ├─ Short URL: yourdomain.com/{short_code}                            │
│ └─ Status: 201 Created                                               │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Click Tracking & Redirect Flow
```
┌──────────────────────────────────────────────────────────────────────┐
│ User/External: Click shortened link (yourdomain.com/abc123)          │
│ ├─ GET /:code                                                        │
│ └─ No authentication required                                        │
└──────────────────────┬───────────────────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────────────────┐
│ linksController.redirect()                                           │
│ └─ Call linkService.getLink(code)                                    │
└──────────────────────┬───────────────────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────────────────┐
│ linkService.getLink()                                                │
│ ├─ Check Redis Cache                                                 │
│ │  └─ If HIT: Return original_url (1ms response)                     │
│ ├─ If MISS: Query PostgreSQL                                         │
│ │  ├─ SELECT original_url FROM links WHERE short_code=code           │
│ │  └─ Cache result for future requests                               │
│ └─ Return original_url or 404 if not found                           │
└──────────────────────┬───────────────────────────────────────────────┘
                       │
                ┌──────┴──────┐
                │             │
                ▼             ▼
         Cache HIT      Cache MISS
         (~1ms)         (~50ms)
                │             │
                └──────┬──────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────────────────┐
│ Async: Track Click (Non-blocking)                                    │
│ ├─ Extract User-Agent from request headers                           │
│ ├─ Extract IP address                                                │
│ ├─ Extract referrer (if present)                                     │
│ └─ Queue click for analytics processing                              │
└──────────────────────┬───────────────────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────────────────┐
│ analyticsService.parseUserAgent()                                    │
│ ├─ Use ua-parser-js library                                          │
│ ├─ Extract: browser, version, OS, device type                        │
│ └─ Return structured data                                            │
└──────────────────────┬───────────────────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────────────────┐
│ Insert Click Record (Background Queue)                               │
│ ├─ INSERT INTO clicks (short_code, ip, user_agent, browser, os,     │
│ │                     device, referrer, clicked_at)                  │
│ └─ Update clicks_count on links table                                │
└──────────────────────┬───────────────────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────────────────┐
│ Return to User                                                       │
│ ├─ HTTP 302 Redirect to original_url                                 │
│ └─ Click tracking queued asynchronously (user doesn't wait)          │
└──────────────────────────────────────────────────────────────────────┘
```

### 3. Analytics Fetch Flow
```
┌──────────────────────────────────────────────────────────────────────┐
│ Frontend: User navigates to Stats page                               │
│ ├─ GET /api/:code/stats with JWT token                               │
│ └─ Display loading state                                             │
└──────────────────────┬───────────────────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────────────────┐
│ Backend: Auth Middleware                                             │
│ ├─ Verify JWT token                                                  │
│ └─ Verify user owns this short_code                                  │
└──────────────────────┬───────────────────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────────────────┐
│ statsController.getStats()                                           │
│ ├─ short_code parameter                                              │
│ └─ Call analyticsService                                             │
└──────────────────────┬───────────────────────────────────────────────┘
                       │
        ┌──────────────┼──────────────┬──────────────┐
        │              │              │              │
        ▼              ▼              ▼              ▼
    Total      Daily        Browser        Device
    Clicks   Breakdown     Breakdown      Types
        │              │              │              │
        │    ┌─────────┴──────────────┴──────────────┤
        │    │                                       │
        └────┴─ analyticsService (Aggregation)      │
             │ - SUM(clicks) per date               │
             │ - GROUP BY browser                   │
             │ - GROUP BY device_type               │
             │ - Get last 30 days                   │
             └─── Query PostgreSQL clicks table ────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────────────────┐
│ Database: Complex Aggregations                                       │
│ SELECT date, COUNT(*) FROM clicks WHERE short_code=code             │
│ GROUP BY date ORDER BY date DESC LIMIT 30                            │
│                                                                      │
│ SELECT browser, COUNT(*) FROM clicks WHERE short_code=code          │
│ GROUP BY browser                                                     │
│                                                                      │
│ SELECT device_type, COUNT(*) FROM clicks WHERE short_code=code      │
│ GROUP BY device_type                                                 │
└──────────────────────┬───────────────────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────────────────┐
│ Format Response with All Metrics                                     │
│ ├─ total_clicks                                                      │
│ ├─ unique_visitors (COUNT DISTINCT ip_address)                       │
│ ├─ daily_breakdown (array of {date, count})                          │
│ ├─ browser_breakdown (array of {browser, count})                     │
│ ├─ device_breakdown (array of {device, count})                       │
│ └─ created_at, last_click_at                                         │
└──────────────────────┬───────────────────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────────────────┐
│ Frontend: Receive & Render                                           │
│ ├─ Update state with analytics data                                  │
│ ├─ Render Recharts components:                                       │
│ │  ├─ LineChart (daily clicks trend)                                 │
│ │  ├─ BarChart (browser/device breakdown)                            │
│ │  └─ PieChart (device distribution)                                 │
│ └─ Display with TailwindCSS styling                                  │
└──────────────────────────────────────────────────────────────────────┘
```

### 4. Authentication Flow
```
┌──────────────────────────────────────────────────────────────────────┐
│ Frontend: Register Form Submission                                   │
│ ├─ Email validation (frontend)                                       │
│ ├─ Password strength validation                                      │
│ └─ POST /api/register {email, password}                              │
└──────────────────────┬───────────────────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────────────────┐
│ authController.register()                                            │
│ ├─ Call authService.register()                                       │
│ └─ Validate email doesn't exist                                      │
└──────────────────────┬───────────────────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────────────────┐
│ authService.register()                                               │
│ ├─ Hash password with Bcrypt (10 salt rounds)                        │
│ ├─ Call DB query to insert user                                      │
│ │  └─ INSERT INTO users (email, password_hash, created_at)           │
│ └─ Return user data (without password)                               │
└──────────────────────┬───────────────────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────────────────┐
│ Return Success (Status 201)                                          │
│ ├─ Message: "User registered successfully"                           │
│ └─ (Frontend redirects to login)                                     │
└──────────────────────┬───────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────┐
│ Frontend: Login Form Submission                                      │
│ └─ POST /api/login {email, password}                                 │
└──────────────────────┬───────────────────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────────────────┐
│ authController.login()                                               │
│ ├─ Call authService.login()                                          │
│ └─ Validate credentials                                              │
└──────────────────────┬───────────────────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────────────────┐
│ authService.login()                                                  │
│ ├─ Query DB: SELECT * FROM users WHERE email=email                   │
│ ├─ Compare passwords with Bcrypt.compare()                           │
│ ├─ If valid:                                                         │
│ │  ├─ Generate JWT token (sign with secret, 24h expiry)              │
│ │  └─ Return {token, user_id, email}                                 │
│ └─ If invalid: Return 401 Unauthorized                               │
└──────────────────────┬───────────────────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────────────────┐
│ Frontend: Store & Use Token                                          │
│ ├─ Save JWT in localStorage                                          │
│ ├─ Set Axios interceptor to add Authorization header:                │
│ │  └─ Authorization: Bearer {token}                                  │
│ ├─ Redirect to dashboard                                             │
│ └─ (Token sent with every API request)                               │
└──────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────┐
│ Subsequent API Requests: Auth Middleware Validation                  │
│ ├─ Extract token from Authorization header                           │
│ ├─ Verify JWT signature with secret                                  │
│ ├─ Check expiration time                                             │
│ ├─ Extract user_id from token payload                                │
│ ├─ If valid: Attach to req.user & continue                           │
│ └─ If invalid/expired: Return 401 Unauthorized                       │
└──────────────────────────────────────────────────────────────────────┘
```

---

## Component Dependencies

### Frontend Dependencies
```
React Router
    ├─ App.tsx
    │   ├─ Home.tsx (Route: /)
    │   ├─ Auth.tsx (Route: /login, /register)
    │   ├─ Dashboard.tsx (Route: /dashboard)
    │   └─ Stats.tsx (Route: /stats/:code)
    └─ Shared Services
        ├─ authService
        │   ├─ Uses axios
        │   └─ Manages localStorage tokens
        ├─ linkService
        │   └─ Uses axios
        └─ statsService
            └─ Uses axios
            
Styling
    ├─ TailwindCSS (global)
    └─ Components (pages)

Charts
    ├─ Recharts library
    └─ Stats.tsx displays:
        ├─ LineChart (daily clicks)
        ├─ BarChart (browsers)
        └─ PieChart (devices)
```

### Backend Dependencies
```
Express.js
    ├─ middleware/
    │   ├─ auth.ts (JWT verification)
    │   ├─ urlValidator.ts (URL validation)
    │   └─ errorHandler.ts
    ├─ routes/
    │   └─ index.ts
    ├─ controllers/
    │   ├─ auth.ts
    │   ├─ links.ts
    │   └─ stats.ts
    ├─ services/
    │   ├─ authService.ts
    │   │   ├─ Uses bcrypt
    │   │   └─ Uses jsonwebtoken
    │   ├─ linkService.ts
    │   │   ├─ Uses cache/redis
    │   │   └─ Uses db/queries
    │   └─ analyticsService.ts
    │       ├─ Uses ua-parser-js
    │       └─ Uses db/queries
    ├─ cache/
    │   └─ redis.ts (Redis client)
    └─ db/
        ├─ queries/
        │   ├─ auth.ts
        │   ├─ links.ts
        │   └─ clicks.ts
        └─ Pool (PostgreSQL connection)

External Libraries
    ├─ bcryptjs (password hashing)
    ├─ jsonwebtoken (JWT generation/verification)
    ├─ ua-parser-js (User-Agent parsing)
    ├─ redis (caching)
    ├─ express-rate-limit (rate limiting)
    └─ pg (PostgreSQL driver)
```

---

## Database Schema Relationships

```
Users Table
┌─────────────┬──────────┐
│ id (PK)     │ Integer  │
│ email (UK)  │ String   │
│ password    │ String   │
│ created_at  │ Datetime │
└─────────────┴──────────┘
       │
       │ (1:N)
       │
       ▼
Links Table
┌──────────────────┬──────────┐
│ id (PK)          │ Integer  │
│ user_id (FK)     │ Integer  │─┐
│ short_code (UK)  │ String   │ │
│ original_url     │ String   │ │
│ clicks_count     │ Integer  │ │
│ created_at       │ Datetime │ │
└──────────────────┴──────────┘ │
       │                        │
       │ (1:N)                 │
       │                        │
       ▼                        │
Clicks Table                    │
┌──────────────────┬──────────┐ │
│ id (PK)          │ Integer  │ │
│ short_code (FK)  │ String   │◄┤
│ ip_address       │ String   │ │
│ user_agent       │ String   │ │
│ browser          │ String   │ │
│ os               │ String   │ │
│ device           │ String   │ │
│ referrer         │ String   │ │
│ clicked_at       │ Datetime │ │
└──────────────────┴──────────┘ │
                                 │
                    ┌────────────┘
                    │ (N:1)
                    │
            FK relationship
```

---

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Docker Container                        │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Backend Service (Node.js Express)                           │
│  ├─ Port: 5000                                               │
│  └─ ENV variables: DB_URL, REDIS_URL, JWT_SECRET, etc.      │
│                                                               │
│  Frontend Assets (Static)                                    │
│  ├─ Build: npm run build                                     │
│  ├─ Output: dist/ folder                                     │
│  └─ Served via Express static middleware                     │
│                                                               │
└─────────────────────────────────────────────────────────────┘
        │                       │                       │
        │                       │                       │
        ▼                       ▼                       ▼
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│  PostgreSQL      │  │  Redis           │  │   File System    │
│  (Docker)        │  │  (Docker)        │  │   Volumes        │
│                  │  │                  │  │                  │
│  Port: 5432      │  │  Port: 6379      │  │  /logs           │
│  Volume: /data   │  │  Memory: 256MB   │  │  /uploads        │
│                  │  │                  │  │                  │
└──────────────────┘  └──────────────────┘  └──────────────────┘
       ▲                       ▲
       │                       │
       └───────────┬───────────┘
            docker-compose.yml
```

---

## Technology Stack Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     PRESENTATION TIER                       │
│                                                               │
│  Browser                                                      │
│  ├─ React 19 (UI framework)                                  │
│  ├─ React Router (navigation)                                │
│  ├─ TypeScript (type safety)                                 │
│  ├─ TailwindCSS (styling)                                    │
│  ├─ Recharts (data visualization)                            │
│  └─ Axios (HTTP client)                                      │
│                                                               │
└─────────────────────────────────────────────────────────────┘
              │ HTTPS REST API │
              └────────┬────────┘
┌─────────────────────────────────────────────────────────────┐
│                     APPLICATION TIER                        │
│                                                               │
│  Node.js Runtime                                              │
│  ├─ Express.js (web framework)                               │
│  ├─ TypeScript (type safety)                                 │
│  ├─ JWT / Bcrypt (security)                                  │
│  ├─ Express-rate-limit (throttling)                          │
│  ├─ UA-parser-js (analytics)                                 │
│  └─ Axios (external APIs)                                    │
│                                                               │
└─────────────────────────────────────────────────────────────┘
           │           │            │
           ▼           ▼            ▼
┌─────────────────┐ ┌──────────┐ ┌──────────────────┐
│    DATA TIER    │ │ CACHE    │ │  FILE STORAGE    │
│                 │ │          │ │                  │
│  PostgreSQL     │ │  Redis   │ │   Local          │
│  ├─ Users       │ │  ├─ URLs │ │   Filesystem     │
│  ├─ Links       │ │  ├─ Sesh │ │   /logs          │
│  └─ Clicks      │ │  └─ Meta │ │   /uploads       │
└─────────────────┘ └──────────┘ └──────────────────┘
```

---

## Request Flow Summary

| Operation | Latency | Flow |
|-----------|---------|------|
| **Shorten URL** | ~100ms | Auth → Validate → Rate Limit → Generate → DB Insert → Cache → Response |
| **Redirect (Cache Hit)** | ~2ms | Lookup Redis → Redirect (async click tracking) |
| **Redirect (Cache Miss)** | ~50ms | Query DB → Redirect → Cache Result (async click tracking) |
| **Get Stats** | ~200ms | Auth → Validate Owner → Aggregate Clicks → Format → Response |
| **List Links** | ~50ms | Auth → Query DB → Format → Response |
| **Login** | ~150ms | Validate → Hash Verify → Generate JWT → Response |

---

## Key Architectural Patterns

1. **MVC + Services**: Controllers → Services → Data Access
2. **Middleware Chain**: Auth → Validation → Rate Limit → Controller
3. **Caching Layer**: Redis for frequent reads (redirects)
4. **Async Processing**: Click tracking doesn't block redirects
5. **JWT Stateless Auth**: No session storage, scalable
6. **Type Safety**: Full TypeScript (backend & frontend)
7. **Separation of Concerns**: UI, API, Business Logic, Data Access

