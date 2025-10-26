# Architecture Overview

## Current Architecture (Vercel Serverless)

```
┌─────────────────────────────────────────────────────────────┐
│                         User Browser                         │
└────────────────┬────────────────────────────────────────────┘
                 │
                 │ HTTPS Request
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│                    Vercel Edge Network                        │
│                     (Global CDN)                              │
└─────────────┬───────────────────────────┬────────────────────┘
              │                           │
              │ /api/*                    │ /*
              │                           │
              ▼                           ▼
┌─────────────────────────────┐ ┌────────────────────────────┐
│   Serverless Functions       │ │   Static Frontend          │
│   (Auto-scaling)             │ │   (React SPA)              │
│                              │ │                            │
│ ┌─────────────────────────┐ │ │ ┌────────────────────────┐ │
│ │ /api/conversations      │ │ │ │ - HTML, CSS, JS        │ │
│ │   - GET: List all       │ │ │ │ - Cached at edge       │ │
│ │   - POST: Create new    │ │ │ │ - Instant load         │ │
│ └─────────────────────────┘ │ │ └────────────────────────┘ │
│                              │ │                            │
│ ┌─────────────────────────┐ │ │                            │
│ │ /api/conversations/:id  │ │ │                            │
│ │   - GET: Fetch one      │ │ │                            │
│ │   - DELETE: Remove      │ │ │                            │
│ └─────────────────────────┘ │ │                            │
│                              │ │                            │
│ ┌─────────────────────────┐ │ │                            │
│ │ Shared Storage Instance │ │ │                            │
│ │ (In-Memory)             │ │ │                            │
│ └─────────────────────────┘ │ │                            │
│               │              │ │                            │
│               ▼              │ │                            │
│ ┌─────────────────────────┐ │ │                            │
│ │  Google Gemini AI       │ │ │                            │
│ │  (External API)         │ │ │                            │
│ └─────────────────────────┘ │ │                            │
└─────────────────────────────┘ └────────────────────────────┘
```

## Request Flow Examples

### 1. Load Application
```
User → Vercel CDN → React App (Static)
                    ├─ HTML
                    ├─ CSS
                    └─ JavaScript
```

### 2. Submit Question
```
User → React App → POST /api/conversations
                   │
                   ▼
              Serverless Function
                   │
                   ├─> Google Gemini AI (Generate explanation)
                   │
                   └─> In-Memory Storage (Save)
                   │
                   ▼
              JSON Response → React App → User
```

### 3. View Chat History
```
User → React App → GET /api/conversations
                   │
                   ▼
              Serverless Function
                   │
                   └─> In-Memory Storage (Fetch all)
                   │
                   ▼
              JSON Response → React App → User
```

## File-to-Endpoint Mapping

```
/api/conversations/index.ts   →  /api/conversations
                                 ├─ GET   (list all)
                                 └─ POST  (create new)

/api/conversations/[id].ts    →  /api/conversations/:id
                                 ├─ GET    (fetch one)
                                 └─ DELETE (remove)
```

## Data Flow

```
┌──────────────┐
│   User       │
│   Question   │
└──────┬───────┘
       │
       ▼
┌──────────────────────────────────┐
│  POST /api/conversations         │
│  { question: "What is X?" }      │
└──────┬───────────────────────────┘
       │
       ▼
┌──────────────────────────────────┐
│  Serverless Function             │
│  1. Validate input               │
│  2. Call Gemini AI               │
│  3. Parse response               │
│  4. Store conversation           │
│  5. Store explanation            │
└──────┬───────────────────────────┘
       │
       ▼
┌──────────────────────────────────┐
│  Response with AI Explanation    │
│  {                               │
│    id: "uuid",                   │
│    question: "What is X?",       │
│    topic: "Category",            │
│    explanation: {                │
│      definition: "...",          │
│      explanation: "...",         │
│      codeExample: "...",         │
│      summary: "..."              │
│    }                             │
│  }                               │
└──────┬───────────────────────────┘
       │
       ▼
┌──────────────┐
│   React UI   │
│   Displays   │
│   Response   │
└──────────────┘
```

## Comparison: Before vs After

### Before (Express.js)
```
┌─────────────────────────────┐
│   Express Server (Port 5001) │
│   ┌───────────────────────┐  │
│   │  API Routes           │  │
│   │  ├─ /api/conversations │  │
│   │  └─ /api/conversations/:id │
│   └───────────────────────┘  │
│   ┌───────────────────────┐  │
│   │  Static Files         │  │
│   │  (Vite build output)  │  │
│   └───────────────────────┘  │
└─────────────────────────────┘
      ↑
      │ Single server
      │ Fixed port
      │ Manual scaling
```

### After (Vercel)
```
┌─────────────────────────────┐
│   Vercel Edge Network        │
│   ┌───────────────────────┐  │
│   │  Serverless Functions │  │
│   │  (Auto-scaling)       │  │
│   │  ├─ /api/conversations │  │
│   │  └─ /api/conversations/:id │
│   └───────────────────────┘  │
│   ┌───────────────────────┐  │
│   │  Static CDN           │  │
│   │  (Global edge cache)  │  │
│   └───────────────────────┘  │
└─────────────────────────────┘
      ↑
      │ Global distribution
      │ Auto-scaling
      │ Zero config
```

## Benefits of Vercel Serverless

✅ **Auto-scaling**: Functions scale automatically with traffic
✅ **Global CDN**: Frontend served from edge locations worldwide
✅ **Zero config**: No server management required
✅ **Cost-efficient**: Pay only for actual usage
✅ **Fast deploys**: Git push → auto-deploy
✅ **Edge optimized**: Low latency globally

## Trade-offs

⚠️ **Cold starts**: Functions may have slight delay after inactivity
⚠️ **Stateless**: In-memory storage resets (use database for persistence)
⚠️ **Timeouts**: Functions have 10-60s execution limits (plenty for this app)

---

For detailed deployment instructions, see [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)
