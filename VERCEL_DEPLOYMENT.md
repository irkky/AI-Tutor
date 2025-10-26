# Vercel Deployment Guide

This guide will help you deploy the AI Tutoring Application to Vercel.

## 🎯 What Changed for Vercel

Your application has been converted from a traditional Express.js server to Vercel's serverless architecture:

### Before (Express.js)
- Single Express server handling both API and frontend
- Long-running server on port 5001
- Traditional REST API routes

### After (Vercel Serverless)
- Frontend: Static React app served by Vercel CDN
- Backend: Serverless API functions in `/api` folder
- Auto-scaling and edge deployment

## 📁 New Project Structure

```
/app
├── api/                          # 🆕 Vercel Serverless Functions
│   ├── storage-instance.ts       # Shared storage singleton
│   └── conversations/
│       ├── index.ts              # GET /api/conversations, POST /api/conversations
│       └── [id].ts               # GET /api/conversations/:id, DELETE /api/conversations/:id
├── client/                       # React frontend (unchanged)
├── server/                       # Original server code (kept for reference/local dev)
├── shared/                       # Shared types (unchanged)
├── vercel.json                   # 🆕 Vercel configuration
├── .env.example                  # 🆕 Environment variables template
└── VERCEL_DEPLOYMENT.md          # 🆕 This guide
```

## 🚀 Deployment Steps

### 1. Prerequisites

- Create a [Vercel account](https://vercel.com/signup) (free)
- Install Vercel CLI (optional): `npm install -g vercel`
- Get your [Google Gemini API Key](https://ai.google.dev/)

### 2. Deploy via Vercel Dashboard (Recommended)

#### Step 1: Import Project
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import your Git repository (GitHub, GitLab, or Bitbucket)
   - Or use **"Deploy from GitHub"** button

#### Step 2: Configure Project
Vercel will auto-detect the settings. Verify:
- **Framework Preset**: Other (or Vite)
- **Build Command**: `npm run build` ✅ (already configured)
- **Output Directory**: `dist/public` ✅ (already configured)
- **Install Command**: `npm install` ✅ (default)

#### Step 3: Set Environment Variables
Before deploying, add your environment variables:
1. In the project configuration, find **"Environment Variables"**
2. Add the following:
   ```
   GEMINI_API_KEY = your_actual_gemini_api_key_here
   ```
3. Click **"Deploy"**

#### Step 4: Wait for Deployment
- Vercel will build and deploy your application
- You'll get a live URL like: `https://your-project.vercel.app`
- Future commits will auto-deploy! 🎉

### 3. Deploy via Vercel CLI (Alternative)

```bash
# Login to Vercel
vercel login

# Deploy to production
vercel --prod

# Follow prompts and add GEMINI_API_KEY when asked
```

### 4. Verify Deployment

After deployment, test your application:

1. **Visit your Vercel URL**: `https://your-project.vercel.app`
2. **Test the chat**: Ask a question like "What is recursion?"
3. **Check API**: Visit `https://your-project.vercel.app/api/conversations`

## ⚙️ Environment Variables

### Required Variables

| Variable | Description | Where to Get |
|----------|-------------|--------------|
| `GEMINI_API_KEY` | Google Gemini AI API Key | [Get API Key](https://ai.google.dev/) |

### Setting Environment Variables in Vercel

**Method 1: Dashboard**
1. Go to your project in Vercel Dashboard
2. Click **Settings** → **Environment Variables**
3. Add `GEMINI_API_KEY` with your key
4. Click **Save**
5. Redeploy for changes to take effect

**Method 2: CLI**
```bash
vercel env add GEMINI_API_KEY
# Enter your API key when prompted
```

## 🏗️ How It Works

### API Routes (Serverless Functions)

Each file in `/api` becomes a serverless endpoint:

| File | Endpoint | Method | Description |
|------|----------|--------|-------------|
| `/api/conversations/index.ts` | `/api/conversations` | GET | Get all conversations |
| `/api/conversations/index.ts` | `/api/conversations` | POST | Create new conversation |
| `/api/conversations/[id].ts` | `/api/conversations/:id` | GET | Get specific conversation |
| `/api/conversations/[id].ts` | `/api/conversations/:id` | DELETE | Delete conversation |

### Storage Behavior

⚠️ **Important**: Your app uses **in-memory storage** which means:
- Data persists during a serverless instance's lifetime
- Data is **lost** when the instance is recycled (cold starts)
- This is fine for demos/testing but not for production

**For persistent storage**, you would need to:
1. Set up a PostgreSQL database (Vercel Postgres, Neon, Supabase)
2. Add `DATABASE_URL` to environment variables
3. Switch from `MemStorage` to database implementation

## 🔧 Local Development

You can still run the original Express server locally:

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY

# Run development server
npm run dev

# Visit http://localhost:5001
```

## 🐛 Troubleshooting

### Build Fails on Vercel

**Error**: "Cannot find module '@vercel/node'"
- **Fix**: Already added as dev dependency. Redeploy.

**Error**: "DATABASE_URL is not defined"
- **Fix**: Already fixed in `drizzle.config.ts`. Redeploy.

### API Returns 500 Error

**Error**: "Failed to generate explanation"
- **Fix**: Check that `GEMINI_API_KEY` is set in Vercel environment variables
- Verify your API key is valid at [Google AI Studio](https://aistudio.google.com/apikey)

### CORS Issues

**Error**: "CORS policy blocked"
- **Fix**: CORS headers are already configured in all API routes
- Check browser console for specific error

### Data Disappears

**Expected behavior** with in-memory storage:
- Data resets on cold starts (serverless instance recycling)
- Happens after inactivity or deployments
- To persist data, implement database connection

## 📦 What to Keep in Git

**Do commit:**
- All source code
- `vercel.json`
- `.env.example`
- `package.json` and `package-lock.json`

**Don't commit:**
- `.env` (sensitive data)
- `node_modules/`
- `.vercel/` (Vercel CLI data)
- `dist/` (build output)

## 🎉 Next Steps

After successful deployment:

1. **Custom Domain**: Add a custom domain in Vercel Dashboard → Settings → Domains
2. **Analytics**: Enable Vercel Analytics in project settings
3. **Monitoring**: Check Function Logs in Vercel Dashboard
4. **Database**: Consider adding PostgreSQL for persistent storage
5. **Auth**: Add authentication if needed

## 📚 Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Serverless Functions](https://vercel.com/docs/functions/serverless-functions)
- [Google Gemini AI](https://ai.google.dev/docs)
- [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables)

## 🆘 Need Help?

- [Vercel Support](https://vercel.com/support)
- [Vercel Community](https://github.com/vercel/vercel/discussions)
- Check Vercel Function Logs for error details
