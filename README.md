# T→G — Trend to Growth (Backend Service)

> **Find the trends that matter to your business — and know what to do next.**

This repository contains the backend service for **T→G (Trend to Growth)**, an intelligence and decision-support platform designed to convert market signals into actionable business pilots.

---

## 🏗️ Backend Architecture

The backend is built with **Node.js, Express, and TypeScript**, following a clean, decoupled layered architecture:

```
┌─────────────────────────────────────────────────────────────┐
│                    Client Applications                      │
│       Frontend (Vite / React)   │   External Microservices  │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTP / REST
┌──────────────────────────────▼──────────────────────────────┐
│                     Express Application                     │
│  ├── CORS Whitelisting & Origin Guard                       │
│  ├── Safe Request Logging & Unique Request IDs              │
│  ├── Request Timeout Guards (504 Gateway Timeout)           │
│  ├── Zod Request Validation Middleware                      │
│  └── Centralized Error Handling & Uniform JSON Formatting   │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│                     Controllers Layer                       │
│  ├── HealthController       (/api/health, /api/status)       │
│  ├── TrendController        (/api/trends/*)                 │
│  ├── BusinessController     (/api/business/*)               │
│  ├── PlanController         (/api/action-plans/*, reviews)  │
│  ├── AlertController        (/api/alerts/*)                 │
│  └── SystemController       (/api/sources, analytics, demo) │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│                       Service Layer                         │
│  ├── TrendService           (filtering, search, intelligence)│
│  └── BusinessService        (profile, matching, plans)      │
└───────────────────┬─────────────────────────────────────┬───┘
                    │                                     │
┌───────────────────▼─────────────┐   ┌───────────────────▼───┐
│     AI Engine Adapter Layer     │   │   Database Repository │
│  ├── IAIEngineAdapter (Interface)│   │  ├── Supabase Client  │
│  ├── MockAIEngineAdapter (Mock) │   │  └── In-Memory Store  │
│  ├── HttpAIEngineAdapter (REST) │   │      (Zero-cost dev   │
│  └── GeminiAIEngineAdapter (AI) │   │       resilient fail- │
│                                 │   │       over fallback)  │
└─────────────────────────────────┘   └───────────────────────┘
```

---

## 🚀 Quick Start & Installation

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher (v24 LTS recommended)
- **npm**: v9.0.0 or higher

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
*(On Windows PowerShell: `Copy-Item .env.example .env`)*

By default, the backend runs in **zero-cost mock mode** (`AI_ENGINE_PROVIDER=mock`) with an in-memory data store fallback, requiring ₹0 budget and zero external API keys to start developing immediately.

### 4. Start the Server
- **Production / Standard run**:
  ```bash
  npm start
  # or
  npm run server
  ```
- **Development with hot reload**:
  ```bash
  npm run server:dev
  ```

Once started, the backend is available at:
- Base API: `http://localhost:3000/api`
- Health check: `http://localhost:3000/api/health`
- Dependency diagnostics: `http://localhost:3000/api/status`

---

## ⚙️ Environment Variables Reference

| Variable | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `PORT` | Number | `3000` | Port for the Express server to listen on. |
| `NODE_ENV` | String | `development` | Environment mode (`development`, `production`, `test`). |
| `CORS_ORIGIN` | String | `*` | Allowed CORS origins (e.g., `*` or `http://localhost:5173`). |
| `REQUEST_TIMEOUT_MS` | Number | `15000` | Timeout threshold in ms before returning a 504 Gateway Timeout. |
| `AI_ENGINE_PROVIDER` | String | `mock` | Selected AI adapter: `mock`, `http`, or `gemini`. |
| `AI_ENGINE_URL` | String | `""` | URL of external AI engine service (required if `AI_ENGINE_PROVIDER=http`). |
| `AI_ENGINE_API_KEY` | String | `""` | Optional Bearer token for authenticating with external AI engine. |
| `AI_ENGINE_TIMEOUT_MS` | Number | `10000` | HTTP timeout in ms for external AI engine calls. |
| `GEMINI_API_KEY` | String | `""` | Google Gemini API key (required if `AI_ENGINE_PROVIDER=gemini`). |
| `SUPABASE_URL` | String | `""` | Supabase project URL (e.g. `https://xyz.supabase.co`). |
| `SUPABASE_ANON_KEY` | String | `""` | Supabase anonymous public key. |
| `SUPABASE_SERVICE_ROLE_KEY`| String | `""` | Optional Supabase service role key for administrative operations. |

---

## 📡 API Endpoint Documentation

All endpoints return a standardized JSON structure:
- **Success**: `{ success: true, count?: number, data?: any, ... }`
- **Error**: `{ success: false, error: string, code?: string, details?: any }`

### 1. Health & Dependency Status

#### `GET /api/health`
Verifies backend server availability.
- **Response `200 OK`**:
```json
{
  "status": "ok",
  "service": "T→G Backend API",
  "uptime": 42,
  "timestamp": "2026-10-19T21:55:00.000Z",
  "version": "1.0.0",
  "environment": "development"
}
```

#### `GET /api/status`
Reports actual dependency connectivity (Supabase database state, AI engine adapter status, and memory metrics).
- **Response `200 OK`**:
```json
{
  "status": "healthy",
  "timestamp": "2026-10-19T21:55:00.000Z",
  "uptime": 42,
  "dependencies": {
    "database": {
      "provider": "in-memory-fallback",
      "status": "fallback",
      "message": "Supabase credentials not configured in environment; running on resilient in-memory data fallback."
    },
    "aiEngine": {
      "provider": "mock",
      "status": "mock-active",
      "isMock": true,
      "message": "Running development Mock AI Engine adapter. Real AI engine not connected."
    }
  },
  "system": {
    "nodeVersion": "v24.19.0",
    "memoryUsageMB": 48,
    "platform": "win32"
  }
}
```

---

### 2. Trends

#### `POST /api/trends/search`
Searches trends with filtering and pagination.
- **Request Body**:
```json
{
  "query": "cold brew",
  "category": "Food & Beverage",
  "momentum": "Rising",
  "limit": 10,
  "offset": 0
}
```
- **Response `200 OK`**:
```json
{
  "success": true,
  "count": 1,
  "total": 1,
  "limit": 10,
  "offset": 0,
  "data": [
    {
      "id": "tr-01",
      "name": "Artisan Cold Brew Flights & Sparkling Cascara",
      "category": "Food & Beverage",
      "momentum": "Rising",
      "confidence": 94,
      "growth_rate": "+38% QoQ",
      "description": "Rising demand for multi-roast cold brew tasting flights.",
      "business_relevance": 92,
      "opportunity_score": 96
    }
  ]
}
```

#### `POST /api/trends/analyze`
Generates deep 10-point intelligence and a customized action plan for a trend using the configured AI engine adapter.
- **Request Body**:
```json
{
  "trendId": "tr-01",
  "businessProfile": {
    "name": "FreshBite Café",
    "category": "Food & Beverage",
    "city": "Sangamner",
    "state": "Maharashtra"
  }
}
```
- **Response `200 OK`**:
```json
{
  "success": true,
  "trend": {
    "id": "tr-01",
    "name": "Artisan Cold Brew Flights & Sparkling Cascara",
    "category": "Food & Beverage",
    "momentum": "Rising"
  },
  "business": {
    "id": "biz-freshbite-sangamner",
    "name": "FreshBite Café",
    "category": "Food & Beverage",
    "location": "Sangamner, Maharashtra"
  },
  "analysis": {
    "trend_summary": "Artisan Cold Brew Flights is accelerating across regional markets...",
    "drivers": ["Demand for localized craft coffee", "Instagram discovery"],
    "target_audience": ["College students & young professionals"],
    "business_relevance": 92,
    "opportunity_score": 94,
    "market_risk": "Short novelty cycle if not refreshed regularly",
    "competition_risk": "Low to medium organized competition",
    "adoption_risk": "Price sensitivity requiring introductory bundle",
    "execution_risk": "Batch consistency during peak afternoon rush",
    "business_opportunity": "Introduce 14-day cold brew flight to capture high gross margins",
    "recommended_actions": [
      "Formulate 14-day prototype batch",
      "Announce on VIP WhatsApp channel",
      "Track repeat purchases"
    ],
    "innovative_plan": {
      "objective": "Capture 15-20% incremental revenue from afternoon visits",
      "why_this_trend": "Matches customer demand for afternoon study refreshments",
      "recommended_action": "Launch signature chilled flight with snack pairing",
      "target_customer": "College students & remote workers",
      "product_service_idea": "3-roast artisan cold brew tasting flight (₹120)",
      "marketing_approach": "Table cards + Instagram reel preview",
      "channel": "Storefront + WhatsApp VIP List",
      "pilot": "Produce 25 units/day for 14 continuous days",
      "timeline": "2 weeks test period",
      "estimated_effort": "Low",
      "expected_opportunity": "High",
      "risks": ["Cold brew steeping turnaround"],
      "success_metrics": ["Sell-through rate > 80%", "Repeat rate > 20%"],
      "test_measure_learn": {
        "test": "Serve 25 units daily for 14 days",
        "measure": "Gross margin and customer satisfaction ratings",
        "learn": "Identify the favorite roast option",
        "adapt": "Incorporate top flavor into core daily menu"
      }
    },
    "confidence": 92,
    "isMock": true,
    "engine": "mock-ai-engine",
    "disclaimer": "MOCK RESULT: Generated by development mock adapter. Real AI engine is not connected."
  },
  "isMockAi": true
}
```

#### `GET /api/trends/alerts`
Retrieves available smart trend alerts.
- **Response `200 OK`**:
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "id": "alt-01",
      "trendId": "tr-04",
      "trendName": "Millet-Based Protein Crunch Bowls",
      "urgency": "HIGH",
      "businessFit": 94,
      "potential": "HIGH",
      "headline": "Regional Surge: +46% Growth in Millet Protein Snacks",
      "whyItMatters": "Over 46% surge in localized searches matching patron demand.",
      "recommendedNextStep": "Launch a 14-day counter trial with ₹85 grab-and-go jars.",
      "dismissed": false
    }
  ]
}
```

---

### 3. Business Matching & Action Plans

#### `POST /api/business/match`
Ranks available trends against a business profile using scoring heuristics and AI matching.
- **Request Body**:
```json
{
  "category": "Food & Beverage",
  "minScore": 60,
  "limit": 5
}
```
- **Response `200 OK`**:
```json
{
  "success": true,
  "businessId": "biz-freshbite-sangamner",
  "businessName": "FreshBite Café",
  "category": "Food & Beverage",
  "location": "Sangamner, Maharashtra",
  "matchedCount": 5,
  "matches": [
    {
      "trendId": "tr-01",
      "trendName": "Artisan Cold Brew Flights & Sparkling Cascara",
      "category": "Food & Beverage",
      "momentum": "Rising",
      "relevanceScore": 92,
      "opportunityScore": 96,
      "customerMatchScore": 87,
      "marketTimingScore": 95,
      "whyItMatters": "Strong momentum matching target demographic.",
      "potentialAction": "Pilot test 14-day tasting flights"
    }
  ],
  "isMock": true,
  "engine": "mock-ai-engine"
}
```

#### `POST /api/business/plan`
Creates a structured business action plan ready for expert review and pilot execution.
- **Request Body**:
```json
{
  "trendName": "Cold Brew Cascara Flight",
  "category": "Food & Beverage",
  "objective": "Pilot 14-day counter trial during afternoon hours",
  "timeline": "2 weeks test period",
  "pilot": "25 units daily",
  "estimatedEffort": "Low",
  "expectedOpportunity": "High"
}
```
- **Response `201 Created`**:
```json
{
  "success": true,
  "data": {
    "id": "plan-1792427276599",
    "businessId": "biz-freshbite-sangamner",
    "trendId": "tr-custom",
    "trendName": "Cold Brew Cascara Flight",
    "category": "Food & Beverage",
    "objective": "Pilot 14-day counter trial during afternoon hours",
    "validationStatus": "PENDING EXPERT REVIEW",
    "createdAt": "2026-10-19T21:55:00.000Z",
    "updatedAt": "2026-10-19T21:55:00.000Z"
  }
}
```

---

### 4. Complete Endpoint Reference Table

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Backend health, uptime, and version. |
| `GET` | `/api/status` | Real dependency status (database, AI engine, system). |
| `GET` | `/api/trends` | List all trends (supports `category`, `momentum`, `search` query params). |
| `POST` | `/api/trends/search` | Search trends with structured JSON payload & pagination. |
| `GET` | `/api/trends/:id` | Get single trend by ID. |
| `POST` | `/api/trends/:id/save` | Toggle save / bookmark on a trend. |
| `POST` | `/api/trends/analyze` | Run 10-point intelligence & plan generation with AI engine. |
| `GET` | `/api/trends/alerts` | Get smart trend alerts. |
| `GET` | `/api/business/profile` | Get current business profile. |
| `PUT` | `/api/business/profile` | Update business profile details. |
| `POST` | `/api/business/match` | Match business profile against market trends. |
| `POST` | `/api/business/plan` | Generate & store an action plan. |
| `GET` | `/api/business/opportunities` | Get top-ranked business opportunities. |
| `GET` | `/api/action-plans` | Retrieve all action plans (supports `status` query filter). |
| `GET` | `/api/action-plans/:id` | Retrieve single action plan. |
| `POST` | `/api/action-plans` | Create action plan (alias to `/api/business/plan`). |
| `GET` | `/api/expert/pending` | Get action plans awaiting human expert review. |
| `POST` | `/api/expert/review` | Submit human expert validation decision (`APPROVED`, `NEEDS REVISION`, `REJECTED`). |
| `GET` | `/api/alerts` | Retrieve alerts. |
| `POST` | `/api/alerts/:id/dismiss` | Dismiss an alert by ID. |
| `GET` | `/api/experiments` | List test-measure-learn experiments. |
| `POST` | `/api/experiments` | Create a new pilot experiment. |
| `POST` | `/api/experiments/:id/result` | Record results & adaptation decisions for an experiment. |
| `GET` | `/api/sources` | List trend registry data sources. |
| `GET` | `/api/analytics` | Retrieve platform performance & validation analytics. |
| `POST` | `/api/demo/reset` | Reset demo data to initial FreshBite Café baseline. |

---

## 🤖 AI Engine Integration Guide (For AI Teammate)

The backend is built with a pluggable adapter interface (`IAIEngineAdapter`) located at `server/services/ai/`. **Your AI Engine can be built in any language** (Python, FastAPI, PyTorch, LangChain, Node.js, Go, etc.).

### Connecting Your AI Engine via HTTP Microservice:

1. **Build your microservice** to listen on any port (e.g., `http://localhost:8000`).
2. Implement three HTTP POST endpoints:
   - `POST /analyze`
   - `POST /match`
   - `POST /plan`
3. Update your `.env` file in this repository:
   ```env
   AI_ENGINE_PROVIDER=http
   AI_ENGINE_URL=http://localhost:8000
   AI_ENGINE_API_KEY=optional_secret_token
   AI_ENGINE_TIMEOUT_MS=10000
   ```
4. Restart the backend: `npm run server`.

### Contract Specification:

#### 1. Trend Analysis: `POST /analyze`
- **Request Payload sent from Backend**:
```json
{
  "trend": {
    "name": "Artisan Cold Brew Flights",
    "category": "Food & Beverage",
    "description": "Rising localized interest in cold brew flights",
    "location": "Sangamner, Maharashtra",
    "momentum": "Rising",
    "growthRate": "+38% QoQ",
    "confidence": 94
  },
  "business": {
    "name": "FreshBite Café",
    "category": "Food & Beverage",
    "location": "Sangamner, Maharashtra",
    "targetCustomers": "Students and young professionals",
    "productsServices": "Artisan sandwiches, cold brews, bakery pastries",
    "businessSize": "Small (1-10)",
    "channels": ["Instagram", "WhatsApp VIP Club", "Storefront Footfall"],
    "goals": ["Increase customer visits", "Introduce healthy options"]
  }
}
```
- **Expected Response from Your AI Engine**:
```json
{
  "trend_summary": "string (2-3 sentences)",
  "drivers": ["string", "string"],
  "target_audience": ["string", "string"],
  "business_relevance": 92,
  "opportunity_score": 94,
  "market_risk": "string",
  "competition_risk": "string",
  "adoption_risk": "string",
  "execution_risk": "string",
  "business_opportunity": "string",
  "recommended_actions": ["step 1", "step 2", "step 3"],
  "innovative_plan": {
    "objective": "string",
    "why_this_trend": "string",
    "recommended_action": "string",
    "target_customer": "string",
    "product_service_idea": "string",
    "marketing_approach": "string",
    "channel": "string",
    "pilot": "string",
    "timeline": "string",
    "estimated_effort": "Low | Medium | High",
    "expected_opportunity": "Low | Medium | High",
    "risks": ["risk 1", "risk 2"],
    "success_metrics": ["metric 1", "metric 2"],
    "test_measure_learn": {
      "test": "string",
      "measure": "string",
      "learn": "string",
      "adapt": "string"
    }
  },
  "confidence": 92
}
```

#### 2. Opportunity Matching: `POST /match`
- **Request Payload**: `{ "trends": [...], "business": {...}, "minScore": 60, "limit": 5 }`
- **Expected Response**: `{ "businessId": "...", "matches": [{ "trendId": "...", "relevanceScore": 90, "opportunityScore": 95, ... }] }`

#### 3. Action Plan Generation: `POST /plan`
- **Request Payload**: `{ "trend": {...}, "business": {...}, "customRequirements": {...} }`
- **Expected Response**: Structured ActionPlan matching the schema.

---

## 🧪 Testing

The backend includes a comprehensive automated test suite testing:
1. Server startup & port binding
2. `/api/health` and `/api/status` endpoints
3. Zod request schema validation & parameter bounds
4. Trend routes & pagination
5. Business routes (profile, opportunity matching, action plans)
6. Centralized error handling (404, invalid JSON, 504 timeouts)
7. AI Engine adapter isolation & mock labelling
8. Supabase database fallback resilience

### Run Tests:
```bash
npm test
```

### Typecheck & Linting:
```bash
npm run lint
```

---

## 🔒 Security & Data Integrity

- **Environment Isolation**: Secrets and keys are never hardcoded or committed to git (`.gitignore` excludes `.env`).
- **Safe Logging**: Request loggers strip sensitive credentials and tokens.
- **Fail-Safe Defaults**: If external AI or database services are unavailable or misconfigured, the backend gracefully provides fallback data without crashing.
- **CORS Protection**: Configurable origin controls with secure header exposition.
