# Vercel Import Path Fix

## Problem

When deploying to Vercel, you may encounter:
```
Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/var/task/api/storage-instance' 
imported from /var/task/api/conversations/index.js
```

## Root Cause

Vercel bundles each API route as a **separate serverless function**. When files within `/api` try to import from other files in `/api` using relative paths, the module bundler may not include them correctly in the deployment package.

## Solution Applied ✅

### 1. Moved Shared Code Outside `/api`

**Before:**
```
/api/
  ├── storage-instance.ts  ❌ Problematic location
  └── conversations/
      ├── index.ts
      └── [id].ts
```

**After:**
```
/server/
  ├── storage-instance.ts  ✅ Proper location
  ├── storage.ts
  └── ai-service.ts

/api/
  └── conversations/
      ├── index.ts
      └── [id].ts
```

### 2. Updated Import Paths with `.js` Extension

**Before:**
```typescript
import { getStorage } from '../storage-instance';  // ❌ Fails in Vercel
```

**After:**
```typescript
import { getStorage } from '../../server/storage-instance.js';  // ✅ Works in Vercel
```

### 3. Updated TypeScript Configuration

Added `/api` folder to `tsconfig.json` includes:
```json
{
  "include": ["client/src/**/*", "shared/**/*", "server/**/*", "api/**/*"]
}
```

## Why This Works

1. **Separate Concerns**: `/api` contains only serverless function handlers
2. **Shared Logic**: `/server` contains reusable business logic
3. **Proper Bundling**: Vercel can correctly bundle imports from `/server` into each API function
4. **ESM Compatibility**: `.js` extensions are required for ES modules in Node.js

## File Structure Best Practices for Vercel

```
/app
├── api/                    # Vercel Serverless Functions (route handlers only)
│   └── [endpoint]/
│       └── handler.ts      # Minimal logic, imports from /server
│
├── server/                 # Shared Business Logic
│   ├── storage.ts          # Data layer
│   ├── storage-instance.ts # Singleton instances
│   ├── ai-service.ts       # External API integrations
│   └── utils.ts            # Helper functions
│
├── shared/                 # Shared Types
│   └── schema.ts           # Type definitions
│
└── client/                 # Frontend
    └── src/
```

## Import Pattern

For API routes importing from `/server`:
```typescript
// In /api/conversations/index.ts
import { getStorage } from '../../server/storage-instance.js';
import { generateExplanation } from '../../server/ai-service.js';

// In /server/storage-instance.ts
import { MemStorage } from './storage.js';
```

## Verification

After applying the fix:
```bash
# Check TypeScript
npm run check  # Should pass ✅

# Check build
npm run build  # Should succeed ✅

# Deploy to Vercel
vercel --prod  # Should work ✅
```

## Other Common Module Errors

### "Cannot find module '@shared/schema'"
**Fix**: Ensure `tsconfig.json` has proper path aliases and that `/shared` is in `include`

### "Cannot find package 'zod'"
**Fix**: Ensure all dependencies are in `package.json`, not just `devDependencies`

### ".ts extension not resolved"
**Fix**: Use `.js` extension in imports (TypeScript/Node ESM requirement)

## Related Files Modified

- ✅ `/server/storage-instance.ts` - Created/moved from `/api`
- ✅ `/api/conversations/index.ts` - Updated imports
- ✅ `/api/conversations/[id].ts` - Updated imports
- ✅ `/tsconfig.json` - Added `/api` to includes

## Status

✅ **Fixed** - Module resolution now works correctly in Vercel serverless environment
