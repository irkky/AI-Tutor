# AI Tutoring Application

## Overview

An AI-powered educational tutoring application that provides structured, easy-to-understand explanations on coding, math, science, and AI/ML topics. The application uses Google's Gemini AI to generate comprehensive educational responses with definitions, step-by-step explanations, code examples, and summaries. Users can ask questions via a chat interface and access their conversation history.

## 🚀 Deployment

### Deploy to Vercel (Serverless)

This application is ready to deploy to Vercel! See **[VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)** for complete deployment instructions.

**Quick Deploy:**
1. Push to GitHub
2. Import to [Vercel](https://vercel.com/new)
3. Add `GEMINI_API_KEY` environment variable
4. Deploy! 🎉

**Or run locally:**
```bash
npm install
cp .env.example .env  # Add your GEMINI_API_KEY
npm run dev           # Visit http://localhost:5001
```

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework:** React with TypeScript using Vite as the build tool

**UI Component System:** shadcn/ui with Radix UI primitives
- Design system based on Material Design with educational adaptations
- Custom Tailwind configuration with CSS variables for theming
- Supports both light and dark modes
- Component library includes accordion, dialog, toast, scroll area, and form components

**State Management:**
- TanStack React Query for server state management and API caching
- Local React state for UI interactions
- Query client configured with infinite stale time and disabled auto-refetching for stability

**Routing:** Wouter for client-side routing (lightweight alternative to React Router)

**Styling Approach:**
- Tailwind CSS with custom design tokens
- Typography: Inter for UI text, JetBrains Mono for code
- Generous spacing system (2, 4, 6, 8, 12, 16 units) for readability
- Maximum content width of 4xl for optimal reading of educational content

**Key UI Components:**
- `QuestionInput`: Textarea with character count and submit functionality
- `AIResponse`: Displays structured explanations with definition, explanation, code examples, and summary sections
- `ChatHistory`: Sidebar showing past conversations with topic badges
- `EmptyState`: Onboarding with example questions
- `LoadingState`: Animated loading indicator during AI processing

### Backend Architecture

**Runtime:** Node.js with Express.js server

**API Design:** RESTful endpoints
- `GET /api/conversations` - Retrieve all conversations
- `GET /api/conversations/:id` - Retrieve specific conversation with explanation
- `POST /api/conversations` - Submit question and generate AI explanation

**Data Storage Strategy:**
- In-memory storage implementation (`MemStorage`) using Maps
- Abstracted storage interface (`IStorage`) for easy migration to persistent storage
- Database schema defined with Drizzle ORM ready for PostgreSQL migration
- Schema includes `conversations` table (questions) and `explanations` table (AI responses)

**AI Integration:**
- Google Gemini AI (gemini-2.5-flash model)
- Structured JSON responses using response schema validation
- System prompt engineered for educational clarity and structured output
- Automatic topic categorization (Python, JavaScript, Data Science, Machine Learning, Web Development, Algorithms, General)

**Response Structure:**
```typescript
{
  definition?: string,      // Concise definition if applicable
  explanation: string,       // Step-by-step educational explanation
  codeExample?: string,      // Practical code with comments
  summary?: string,          // 2-3 key takeaways
  topic: TopicCategory      // Auto-categorized topic
}
```

**Error Handling:**
- Request validation using Zod schemas
- Try-catch blocks with appropriate error responses
- Detailed error logging for debugging

**Development Tools:**
- Hot module replacement via Vite middleware in development
- Request logging with duration tracking
- TypeScript strict mode enabled

### Database Schema

**Conversations Table:**
- `id` (varchar, primary key, auto-generated UUID)
- `question` (text, required)
- `topic` (text, optional)
- `createdAt` (timestamp, auto-set)

**Explanations Table:**
- `id` (varchar, primary key, auto-generated UUID)
- `conversationId` (varchar, foreign key to conversations)
- `definition` (text, optional)
- `explanation` (text, required)
- `codeExample` (text, optional)
- `summary` (text, optional)
- `createdAt` (timestamp, auto-set)

**Migration Strategy:**
- Drizzle Kit configured for PostgreSQL dialect
- Schema defined in TypeScript for type safety
- Migration files generated in `/migrations` directory
- Current implementation uses in-memory storage but is ready for database connection via `DATABASE_URL` environment variable

### Build and Deployment

**Development:**
- `npm run dev` - Runs Express server with Vite middleware and HMR
- TypeScript files executed via `tsx` for development speed

**Production Build:**
- `npm run build` - Bundles client with Vite, bundles server with esbuild
- Client output: `dist/public`
- Server output: `dist/index.js` (ESM format)
- `npm start` - Runs bundled production server

**Type Checking:**
- Shared types between client and server via `shared/schema.ts`
- Path aliases configured: `@/` for client, `@shared/` for shared code
- Incremental compilation enabled for faster type checking

## External Dependencies

### AI Service
- **Google Gemini AI** (`@google/genai`)
  - Model: gemini-2.5-flash
  - Requires `GEMINI_API_KEY` environment variable
  - Structured JSON output with schema validation
  - Response format enforced via `responseMimeType` and `responseSchema`

### Database (Prepared but not yet connected)
- **PostgreSQL** via Neon Database driver (`@neondatabase/serverless`)
- **Drizzle ORM** for type-safe database queries and schema management
- Connection requires `DATABASE_URL` environment variable
- Session storage prepared with `connect-pg-simple`

### UI Libraries
- **Radix UI** - Unstyled, accessible component primitives for 20+ components
- **shadcn/ui** - Pre-built styled components using Radix primitives
- **Tailwind CSS** - Utility-first styling with custom design tokens
- **Lucide React** - Icon library for UI elements

### Code Rendering
- **Prism.js** - Syntax highlighting for code examples (loaded via CDN)
- **ReactMarkdown** - Markdown parsing for AI-generated explanations

### Utilities
- **date-fns** - Date formatting and manipulation
- **Zod** - Runtime schema validation for API requests and database inserts
- **class-variance-authority** - Type-safe variant styling for components
- **clsx** & **tailwind-merge** - Conditional class name utilities

### Development Tools
- **Vite** - Build tool and dev server with HMR
- **TypeScript** - Type safety across full stack
- **esbuild** - Fast server bundling for production
- **Replit plugins** - Error overlay, cartographer, and dev banner for Replit environment
