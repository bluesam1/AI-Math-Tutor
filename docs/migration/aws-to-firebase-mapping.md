# AWS to Firebase Migration Mapping

**Last Updated:** 2025-11-04  
**Status:** Planning Phase  
**Branch:** `firebase-migration-plan`

## Overview

This document maps all AWS services currently used (or planned) in AI Math Tutor to their Firebase equivalents, providing a comprehensive migration guide.

---

## Service-by-Service Mapping

### 1. Backend API Layer

#### AWS Lambda → Firebase Cloud Functions

| **AWS Service** | **Firebase Service** | **Migration Notes** |
|----------------|---------------------|---------------------|
| **AWS Lambda** (Node.js 20.x runtime) | **Firebase Cloud Functions** (Node.js 20 runtime) | Direct replacement |
| **Handler:** `src/functions/handler.handler` | **Entry Point:** `functions/index.ts` exports Express app | Need to adapt Express app to Cloud Functions HTTP trigger |
| **Memory:** 512 MB | **Default:** 256 MB (configurable up to 8 GB) | May need to increase if handling large images |
| **Timeout:** 30 seconds | **Default:** 60 seconds (HTTP), 540 seconds (background) | Timeout is actually longer in Firebase |
| **Region:** us-east-2 | **Region:** Multi-region support (us-central1 recommended) | Can deploy to multiple regions for global performance |
| **Cold Start:** ~100-500ms | **Cold Start:** ~100-500ms (similar) | Similar cold start characteristics |
| **Concurrency:** 1000 (default) | **Concurrency:** 80 per instance (auto-scales) | Firebase auto-scales instances |

**Migration Steps:**
1. Replace `serverless-http` wrapper with Firebase Functions HTTP trigger
2. Adapt Express app to work with Cloud Functions request/response format
3. Update entry point from `handler.handler` to `functions/index.ts`
4. Configure memory and timeout in `firebase.json` or `functions/package.json`

**Code Changes:**
- Remove `apps/api/src/functions/handler.ts` (Lambda-specific)
- Create `apps/api/functions/index.ts` (or `functions/index.ts` for root) with Express app export
- Update Express app to use `onRequest` from `firebase-functions/v2/https` instead of `serverless-http`
- Keep existing `env.ts` config - it already uses `process.env` which works with Firebase Functions v2 (no code changes needed!)

**Express Integration Example:**
```typescript
import { onRequest } from 'firebase-functions/v2/https';
import app from '../server'; // Your existing Express app

export const api = onRequest(app);
```

**Monorepo Structure:**
- Firebase Functions can be in `apps/api/functions/` or root `functions/` directory
- Configure in `firebase.json` with `"source": "apps/api"` for monorepo support
- Shared code in `packages/shared` can be imported via path aliases

---

#### AWS API Gateway → Firebase Hosting Rewrites

| **AWS Service** | **Firebase Service** | **Migration Notes** |
|----------------|---------------------|---------------------|
| **API Gateway HTTP API** | **Firebase Hosting Rewrites** | Direct replacement for API routing |
| **Routes:** `/{proxy+}` and `/` | **Rewrites:** `firebase.json` rewrites to Cloud Functions | Configure rewrites in `firebase.json` |
| **CORS:** Configured in API Gateway | **CORS:** Configured in Express middleware | Keep existing CORS middleware |
| **Rate Limiting:** API Gateway throttling | **Rate Limiting:** Firebase Functions quotas | Similar protection, different config |
| **Custom Domain:** API Gateway domain | **Custom Domain:** Firebase Hosting custom domain | Can configure custom domain in Firebase |

**Migration Steps:**
1. Configure `firebase.json` with rewrites to Cloud Functions
2. Keep existing CORS middleware in Express app
3. Update frontend API base URL to Firebase Hosting domain
4. Configure custom domain in Firebase Hosting (if needed)

**firebase.json Example:**
```json
{
  "hosting": {
    "rewrites": [
      {
        "source": "/api/**",
        "function": "api"
      }
    ]
  }
}
```

---

### 2. Frontend Hosting

#### AWS S3 + CloudFront → Firebase Hosting

| **AWS Service** | **Firebase Service** | **Migration Notes** |
|----------------|---------------------|---------------------|
| **AWS S3** (Static assets) | **Firebase Hosting** | Direct replacement |
| **CloudFront** (CDN) | **Firebase Hosting CDN** (built-in) | Firebase Hosting includes global CDN |
| **Build Output:** `apps/web/dist/` | **Build Output:** `apps/web/dist/` | Same build output |
| **Custom Domain:** CloudFront distribution | **Custom Domain:** Firebase Hosting custom domain | Configure in Firebase Console |
| **SSL/TLS:** CloudFront certificates | **SSL/TLS:** Automatic (Firebase managed) | Automatic SSL certificates |
| **Cache Headers:** CloudFront behaviors | **Cache Headers:** `firebase.json` headers config | Configure in `firebase.json` |

**Migration Steps:**
1. Update `amplify.yml` → `firebase.json` for hosting config
2. Deploy frontend with `firebase deploy --only hosting`
3. Update CI/CD pipeline to use Firebase CLI instead of Amplify
4. Configure custom domain in Firebase Console (if needed)

**firebase.json Hosting Example:**
```json
{
  "hosting": {
    "public": "apps/web/dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "/api/**",
        "function": "api"
      },
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(js|css)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      }
    ]
  }
}
```

---

### 3. Session Storage

#### AWS ElastiCache (Redis) → Firestore

| **AWS Service** | **Firebase Service** | **Migration Notes** |
|----------------|---------------------|---------------------|
| **ElastiCache Redis** (in-memory) | **Firestore** (NoSQL database) | Different data model (NoSQL vs in-memory key-value) |
| **Session Storage:** Last 10 messages | **Session Storage:** Firestore collection with TTL | Use Firestore with TTL for session expiration |
| **Connection:** Redis client | **Connection:** Firebase Admin SDK | Need to use Firebase Admin SDK instead of Redis client |
| **Region:** us-east-2 | **Region:** Multi-region (select in Firebase Console) | Can configure region in Firestore settings |
| **Pricing:** Per-hour for Redis cluster | **Pricing:** Pay-per-use (reads/writes/storage) | More cost-effective for low-medium traffic |

**Migration Steps:**
1. Replace Redis client with Firebase Admin SDK
2. Create Firestore collections for session data:
   - `sessions/{sessionId}` - Session metadata
   - `sessions/{sessionId}/messages` - Conversation messages (last 10)
3. Implement TTL-based cleanup using Firestore document expiration
4. Update `contextService.ts` to use Firestore instead of Redis

**Firestore Schema Example:**
```
sessions/
  {sessionId}/
    createdAt: timestamp
    lastActivity: timestamp
    expiresAt: timestamp  // For TTL-based cleanup
    messages: [
      { messageId, role, content, timestamp }
    ]
```

**Firestore TTL Support:**
- **Firestore DOES support TTL policies!** (Available for Firestore)
- Configure TTL policy using `gcloud firestore fields ttls update`:
  ```bash
  gcloud firestore fields ttls update expiresAt --collection-group=sessions --enable-ttl
  ```
- Documents with `expiresAt` timestamp field are automatically deleted when expired
- **Alternative:** Use Cloud Scheduler with a scheduled Cloud Function for more control
- **Recommended:** Use Firestore TTL for automatic cleanup (simpler than scheduled functions)

**Alternative: Cloud Memorystore (if Redis compatibility needed)**
- If you need Redis compatibility, Google Cloud Memorystore (Redis) is available
- Requires GCP project setup (more complex)
- Firestore is recommended for simplicity and Firebase integration

---

### 4. Environment Variables & Secrets

#### AWS Lambda Environment Variables → Firebase Functions Config

| **AWS Service** | **Firebase Service** | **Migration Notes** |
|----------------|---------------------|---------------------|
| **Lambda Environment Variables** | **Firebase Functions Config** (v2) | Direct replacement (v2 uses process.env) |
| **Access:** `process.env.VAR_NAME` | **Access:** `process.env.VAR_NAME` (v2) | Same access pattern (no code changes needed) |
| **Secrets:** Plain text (not secure) | **Secrets:** Firebase Secret Manager (recommended) | Use Secret Manager for sensitive data |
| **Configuration:** `serverless.yml` | **Configuration:** `firebase.json` or `firebase functions:config:set` | Different CLI commands, but same env vars |

**Migration Steps:**
1. **For Firebase Functions v2 (recommended):** Use `process.env` directly (same as Lambda):
   ```typescript
   const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
   ```
   - Set environment variables in `firebase.json` or during deployment:
     ```json
     {
       "functions": {
         "runtime": "nodejs20",
         "env": {
           "FRONTEND_URL": "https://your-domain.com",
           "NODE_ENV": "production"
         }
       }
     }
     ```
   - Or use Firebase CLI: `firebase functions:config:set env.frontend_url="https://your-domain.com"`

2. **For sensitive data (API keys), use Firebase Secret Manager:**
   ```typescript
   import { onRequest } from 'firebase-functions/v2/https';
   import { defineSecret } from 'firebase-functions/params';
   
   const openaiApiKey = defineSecret('OPENAI_API_KEY');
   
   export const api = onRequest(
     { secrets: [openaiApiKey] },
     async (req, res) => {
       // Access secret via process.env (same as Lambda)
       const key = process.env.OPENAI_API_KEY;
       // Or use .value() method:
       // const key = openaiApiKey.value();
       // ... rest of handler
     }
   );
   ```
   - Set secrets: `firebase functions:secrets:set OPENAI_API_KEY`
   - Secrets are automatically available as `process.env` variables (no code changes needed!)

3. **Legacy v1 (deprecated):** Use `functions.config()` only if using Functions v1:
   ```typescript
   const frontendUrl = functions.config().env.frontend_url;
   ```

**Current Environment Variables (from serverless.yml):**
- `NODE_ENV` → `process.env.NODE_ENV` (v2) or `functions.config().env.node_env` (v1)
- `FRONTEND_URL` → `process.env.FRONTEND_URL` (v2) or `functions.config().env.frontend_url` (v1)
- `OPENAI_API_KEY` → Secret Manager (recommended for v2)
- `ANTHROPIC_API_KEY` → Secret Manager (recommended for v2)
- `REDIS_HOST` → Not needed (using Firestore)
- `REDIS_PORT` → Not needed (using Firestore)

**Note:** Firebase Functions v2 uses `process.env` directly (same as Lambda), making migration simpler. v1's `functions.config()` is deprecated.

---

### 5. Logging & Monitoring

#### AWS CloudWatch → Firebase Functions Logging

| **AWS Service** | **Firebase Service** | **Migration Notes** |
|----------------|---------------------|---------------------|
| **CloudWatch Logs** | **Firebase Functions Logs** (Google Cloud Logging) | Integrated with Google Cloud Logging |
| **Access:** AWS Console / CloudWatch | **Access:** Firebase Console / Google Cloud Console | Similar functionality, different UI |
| **Log Retention:** 30 days (default) | **Log Retention:** 30 days (default) | Similar retention |
| **Log Streaming:** Real-time | **Log Streaming:** Real-time | Similar real-time streaming |
| **Error Tracking:** CloudWatch Alarms | **Error Tracking:** Firebase Error Reporting | Built-in error tracking in Firebase |

**Migration Steps:**
1. Use `console.log()` / `console.error()` (same as Lambda)
2. View logs in Firebase Console → Functions → Logs
3. Set up Firebase Error Reporting for error tracking
4. Configure Cloud Logging alerts if needed

**Logging Example:**
```typescript
console.log('Function invoked:', { path: req.path });
console.error('Error occurred:', error);
```

---

### 6. IAM & Permissions

#### AWS IAM → Firebase IAM / Cloud IAM

| **AWS Service** | **Firebase Service** | **Migration Notes** |
|----------------|---------------------|---------------------|
| **AWS IAM Roles** | **Cloud IAM Roles** | Similar permission model |
| **Lambda Execution Role** | **Cloud Functions Service Account** | Automatic service account created |
| **Permissions:** CloudWatch Logs | **Permissions:** Cloud Logging (automatic) | Automatic permissions for logging |
| **Custom Permissions:** IAM policies | **Custom Permissions:** Cloud IAM roles | Configure in Google Cloud Console |

**Migration Steps:**
1. Default service account is created automatically
2. For custom permissions (e.g., Firestore, Secret Manager), configure in Google Cloud Console
3. Use service account JSON key for local development (if needed)

**Default Permissions (Automatic):**
- Cloud Functions execution
- Cloud Logging write
- Cloud Error Reporting write

**Custom Permissions (If Needed):**
- Firestore read/write
- Secret Manager access
- Cloud Storage access (if using Firebase Storage)

---

### 7. Deployment & CI/CD

#### Serverless Framework → Firebase CLI

| **AWS Service** | **Firebase Service** | **Migration Notes** |
|----------------|---------------------|---------------------|
| **Serverless Framework** | **Firebase CLI** | Different deployment tool |
| **Deployment:** `serverless deploy` | **Deployment:** `firebase deploy` | Unified deployment for all services |
| **Configuration:** `serverless.yml` | **Configuration:** `firebase.json` + `functions/package.json` | Different config files |
| **Build:** `npm run build` | **Build:** `npm run build` (same) | Same build step |
| **Packaging:** Serverless Framework | **Packaging:** Firebase CLI (automatic) | No manual packaging needed |
| **Monorepo:** `serverless-plugin-monorepo` | **Monorepo:** Firebase CLI works with monorepos | Configure in `firebase.json` |

**Migration Steps:**
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Initialize Firebase project: `firebase init`
3. Update CI/CD pipeline to use `firebase deploy` instead of `serverless deploy`
4. Configure `firebase.json` for monorepo structure

**firebase.json Example (Monorepo):**
```json
{
  "functions": [
    {
      "source": "apps/api",
      "codebase": "default",
      "runtime": "nodejs20",
      "predeploy": [
        "npm --prefix \"$RESOURCE_DIR\" run build"
      ]
    }
  ],
  "hosting": {
    "public": "apps/web/dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "/api/**",
        "function": "api"
      },
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

**Monorepo Structure:**
- Firebase expects a `functions/` directory inside the `source` path
- Structure: `apps/api/functions/index.ts` (not `apps/api/src/functions/`)
- Or use root: `functions/index.ts` and set `"source": "functions"`
- The `source` field points to the directory containing the `functions/` subdirectory
- Firebase CLI automatically finds `functions/index.ts` or `functions/index.js` inside the source directory

**CI/CD Pipeline Update:**
```yaml
# Before (AWS)
- npm run build:api
- cd apps/api && serverless deploy

# After (Firebase)
- npm run build:web
- npm run build:api
- firebase deploy --only functions,hosting
```

---

### 8. Image Storage (Future)

#### AWS S3 → Firebase Storage

| **AWS Service** | **Firebase Service** | **Migration Notes** |
|----------------|---------------------|---------------------|
| **AWS S3** (Image uploads) | **Firebase Storage** | Direct replacement |
| **File Upload:** S3 SDK | **File Upload:** Firebase Storage SDK | Different SDK |
| **Access Control:** IAM policies | **Access Control:** Firebase Storage Rules | Different security model |
| **CDN:** CloudFront | **CDN:** Firebase Storage CDN (built-in) | Built-in CDN |
| **Max File Size:** 10 MB (Lambda limit) | **Max File Size:** Configurable (up to 32 MB) | Similar limits |

**Migration Steps (When Needed):**
1. Install Firebase Storage SDK: `npm install firebase-admin`
2. Update image upload endpoints to use Firebase Storage
3. Configure Firebase Storage rules for access control
4. Update frontend to use Firebase Storage SDK for uploads

**Firebase Storage Rules Example:**
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /problem-images/{imageId} {
      allow read: if true;  // Public read
      allow write: if request.auth != null;  // Authenticated write (if auth needed)
    }
  }
}
```

---

## Migration Priority Matrix

### Phase 1: Core Infrastructure (High Priority)
1. ✅ **Backend API:** AWS Lambda → Firebase Cloud Functions
2. ✅ **Frontend Hosting:** AWS S3 + CloudFront → Firebase Hosting
3. ✅ **API Routing:** API Gateway → Firebase Hosting Rewrites
4. ✅ **Deployment:** Serverless Framework → Firebase CLI

### Phase 2: Data & State (Medium Priority)
5. ⏳ **Session Storage:** ElastiCache Redis → Firestore
6. ⏳ **Environment Variables:** Lambda env vars → Firebase Functions Config
7. ⏳ **Secrets:** Plain env vars → Firebase Secret Manager

### Phase 3: Monitoring & Optimization (Low Priority)
8. ⏳ **Logging:** CloudWatch → Firebase Functions Logs
9. ⏳ **Error Tracking:** CloudWatch Alarms → Firebase Error Reporting
10. ⏳ **Image Storage:** AWS S3 → Firebase Storage (when needed)

---

## Key Differences & Considerations

### 1. **Cold Starts**
- **AWS Lambda:** ~100-500ms cold start
- **Firebase Functions:** ~100-500ms cold start (similar)
- **Mitigation:** Both platforms support warming strategies

### 2. **Cost Model**
- **AWS:** Pay per request + compute time + storage
- **Firebase:** Free tier (2M function invocations/month) + pay-per-use
- **Recommendation:** Firebase free tier is generous for MVP

### 3. **Scaling**
- **AWS Lambda:** Auto-scales to 1000 concurrent executions
- **Firebase Functions:** Auto-scales instances (80 concurrent per instance)
- **Impact:** Both handle high traffic, Firebase may be more cost-effective

### 4. **Monorepo Support**
- **AWS:** Requires `serverless-plugin-monorepo`
- **Firebase:** Native monorepo support via `firebase.json`
- **Benefit:** Simpler configuration in Firebase

### 5. **Deployment Speed**
- **AWS:** ~2-5 minutes (Serverless Framework)
- **Firebase:** ~1-3 minutes (Firebase CLI)
- **Benefit:** Faster deployments with Firebase

---

## Migration Checklist

### Pre-Migration
- [ ] Create Firebase project in Firebase Console
- [ ] Install Firebase CLI: `npm install -g firebase-tools`
- [ ] Login to Firebase: `firebase login`
- [ ] Initialize Firebase project: `firebase init`

### Phase 1: Backend API
- [ ] Create `apps/api/functions/` directory (or `functions/` at root)
- [ ] Create `apps/api/functions/index.ts` with Express app export using `onRequest` from `firebase-functions/v2/https`
- [ ] Remove `serverless-http` dependency
- [ ] Import Express app: `import app from '../server'` (or adjust path)
- [ ] Export function: `export const api = onRequest(app);`
- [ ] Keep existing `env.ts` config (already uses `process.env` which works with v2 - no code changes!)
- [ ] Test locally with `firebase emulators:start`
- [ ] Deploy to Firebase: `firebase deploy --only functions`

### Phase 2: Frontend Hosting
- [ ] Update `firebase.json` with hosting configuration
- [ ] Update frontend API base URL to Firebase Hosting domain
- [ ] Test locally with Firebase emulators
- [ ] Deploy to Firebase: `firebase deploy --only hosting`

### Phase 3: API Routing
- [ ] Configure rewrites in `firebase.json`
- [ ] Test API routes through Firebase Hosting
- [ ] Update CORS configuration if needed

### Phase 4: Session Storage
- [ ] Install Firebase Admin SDK: `npm install firebase-admin`
- [ ] Create Firestore collections for session data with `expiresAt` timestamp field
- [ ] Update `contextService.ts` to use Firestore instead of Redis
- [ ] Configure Firestore TTL policy: `gcloud firestore fields ttls update expiresAt --collection-group=sessions --enable-ttl`
- [ ] Test session management and automatic expiration

### Phase 5: Environment Variables
- [ ] For Functions v2: Keep using `process.env` (no code changes needed)
- [ ] Set environment variables in `firebase.json` or via Firebase CLI
- [ ] Move sensitive secrets to Firebase Secret Manager
- [ ] Update function definitions to include secrets in `secrets` array
- [ ] Test configuration access

### Phase 6: CI/CD
- [ ] Update CI/CD pipeline to use Firebase CLI
- [ ] Remove Serverless Framework dependencies
- [ ] Test deployment pipeline
- [ ] Document new deployment process

### Post-Migration
- [ ] Update documentation (deployment guides, architecture docs)
- [ ] Remove AWS-specific code and dependencies
- [ ] Clean up AWS resources (S3, Lambda, API Gateway, etc.)
- [ ] Monitor Firebase Functions performance
- [ ] Set up Firebase Error Reporting alerts

---

## Next Steps

1. **Review this mapping document** and confirm all AWS services are covered
2. **Create Firebase project** and initialize Firebase CLI
3. **Start Phase 1 migration** (Backend API → Cloud Functions)
4. **Test locally** with Firebase emulators before deploying
5. **Deploy incrementally** (functions first, then hosting, then other services)

---

## References

- [Firebase Cloud Functions Documentation](https://firebase.google.com/docs/functions)
- [Firebase Hosting Documentation](https://firebase.google.com/docs/hosting)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Firebase CLI Documentation](https://firebase.google.com/docs/cli)
- [Firebase Functions Config](https://firebase.google.com/docs/functions/config-env)

