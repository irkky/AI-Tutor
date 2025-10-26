# API Routes (Vercel Serverless Functions)

This folder contains Vercel serverless functions that handle all backend API requests.

## Structure

```
/api
└── conversations/
    ├── index.ts                  # Handles: GET /api/conversations, POST /api/conversations
    └── [id].ts                   # Handles: GET /api/conversations/:id, DELETE /api/conversations/:id

/server
├── storage-instance.ts           # Singleton storage instance (shared by API routes)
├── storage.ts                    # MemStorage class implementation
└── ai-service.ts                 # Google Gemini AI integration
```

## How Vercel Routes Work

Each file in `/api` automatically becomes an endpoint:

- **File**: `/api/conversations/index.ts` → **URL**: `/api/conversations`
- **File**: `/api/conversations/[id].ts` → **URL**: `/api/conversations/{id}`

The `[id]` syntax creates a dynamic route parameter.

## Request Handling

Each function exports a default handler:

```typescript
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle request
}
```

## Endpoints

### GET /api/conversations
Returns all conversations with their explanations.

**Response:**
```json
[
  {
    "id": "uuid",
    "question": "What is recursion?",
    "topic": "Algorithms",
    "createdAt": "2025-01-01T00:00:00.000Z",
    "explanation": {
      "id": "uuid",
      "definition": "...",
      "explanation": "...",
      "codeExample": "...",
      "summary": "..."
    }
  }
]
```

### POST /api/conversations
Creates a new conversation with AI-generated explanation.

**Request:**
```json
{
  "question": "What is recursion?"
}
```

**Response:**
```json
{
  "id": "uuid",
  "question": "What is recursion?",
  "topic": "Algorithms",
  "createdAt": "2025-01-01T00:00:00.000Z",
  "explanation": {
    "id": "uuid",
    "conversationId": "uuid",
    "definition": "A function that calls itself",
    "explanation": "Step-by-step explanation...",
    "codeExample": "function factorial(n) {...}",
    "summary": "Key takeaways..."
  }
}
```

### GET /api/conversations/:id
Returns a specific conversation with its explanation.

**Response:**
```json
{
  "id": "uuid",
  "question": "What is recursion?",
  "topic": "Algorithms",
  "explanation": { ... }
}
```

### DELETE /api/conversations/:id
Deletes a conversation and its associated explanation.

**Response:**
```json
{
  "success": true
}
```

## Storage

The storage singleton is located at `/server/storage-instance.ts` and provides a shared instance:

```typescript
import { getStorage } from '../../server/storage-instance.js';

const storage = getStorage();
```

**Important**: Storage is in-memory, so data persists only during the serverless instance's lifetime. Data will be lost on cold starts.

## Environment Variables

Required environment variables:
- `GEMINI_API_KEY` - Google Gemini AI API key for generating explanations

## Local Testing

To test these API routes locally with the original Express server:

```bash
npm run dev
```

The Express server in `/server` folder mirrors the same API structure.
