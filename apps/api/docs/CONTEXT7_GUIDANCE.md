# Backend Configuration Based on Context7 Documentation

This document outlines the best practices and configuration patterns derived from Context7 documentation for Serverless Framework, Express, and AWS Lambda deployment.

## Key Findings

### 1. Serverless Framework Version

**Issue**: Serverless Framework v4+ requires authentication/login
**Solution**: Use Serverless Framework v3.40.0 (does not require authentication)

```json
"serverless": "^3.40.0"
```

### 2. Lambda Handler Pattern

Based on Context7 documentation, the handler should follow this pattern:

```typescript
import serverless from 'serverless-http';
import app from '../server';

export const handler = serverless(app);
```

**Current Implementation**: ✅ Already correct

### 3. Serverless.yml Configuration

Key patterns from Context7:

#### Package Configuration

Exclude dev dependencies from deployment (default behavior):

```yaml
package:
  excludeDevDependencies: true # Default, but can be explicit
```

#### HTTP API Events

Proper pattern for catch-all routes:

```yaml
functions:
  api:
    handler: dist/functions/handler.handler
    events:
      - httpApi:
          path: /{proxy+}
          method: ANY
      - httpApi:
          path: /
          method: ANY
```

**Current Implementation**: ✅ Already correct

#### CORS Configuration

Configure CORS at both API Gateway level (serverless.yml) and Express app level:

- API Gateway CORS: Handles preflight OPTIONS requests
- Express CORS: Handles actual request headers

**Current Implementation**: ✅ Configured in both places

### 4. Environment Variables

Best practice: Define in serverless.yml and access via `process.env`:

```yaml
provider:
  environment:
    NODE_ENV: ${self:provider.stage}
    FRONTEND_URL: ${env:FRONTEND_URL, 'http://localhost:3000'}
```

**Current Implementation**: ✅ Already correct

### 5. Local Development

Use `serverless-offline` plugin for local testing:

```yaml
plugins:
  - serverless-offline

custom:
  serverless-offline:
    httpPort: 3001
    host: localhost
```

**Command**: `npm run dev:offline` (after downgrading to v3)

**Current Implementation**: ✅ Already configured

### 6. Build and Deployment Workflow

1. **Build TypeScript**: `npm run build` (compiles to `dist/`)
2. **Deploy**: `serverless deploy --stage dev`
3. **Remove**: `serverless remove --stage dev`

**Current Implementation**: ✅ Scripts already configured

### 7. TypeScript Configuration

Ensure `tsconfig.json` compiles to `dist/` directory:

```json
{
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  }
}
```

### 8. Express App Configuration

Key points:

- Remove `app.listen()` when running in Lambda (serverless-http handles it)
- Keep CORS middleware for proper header handling
- Use environment variables for configuration

**Current Implementation**: ✅ Already correct (conditional listen in server.ts)

## Recommended Updates

### 1. Downgrade Serverless Framework

```bash
npm install --save-dev serverless@^3.40.0
```

### 2. Add Package Configuration (Optional)

Add explicit package configuration to `serverless.yml`:

```yaml
package:
  patterns:
    - '!node_modules/**'
    - '!src/**'
    - 'dist/**'
    - 'package.json'
  excludeDevDependencies: true
```

### 3. Add Deployment Bucket Configuration (Optional)

For production deployments, configure deployment bucket:

```yaml
provider:
  deploymentBucket:
    name: ai-math-tutor-api-deployments
    serverSideEncryption: AES256
```

### 4. Add Logging Configuration

Configure CloudWatch Logs retention:

```yaml
provider:
  logs:
    httpApi:
      accessLogging: true
      format: '$context.requestId $context.status'
```

## Testing Locally

After downgrading to v3:

```bash
# Build TypeScript
npm run build

# Run serverless offline
npm run dev:offline

# Test health endpoint
curl http://localhost:3001/api/health
```

## Deployment to AWS

1. **Configure AWS credentials**:

   ```bash
   aws configure
   ```

2. **Build and deploy**:

   ```bash
   npm run deploy:dev
   ```

3. **Get deployment info**:
   ```bash
   serverless info --stage dev
   ```

## Troubleshooting

### "You must sign in" Error

- **Cause**: Using Serverless Framework v4+
- **Fix**: Downgrade to v3.40.0

### Handler Not Found

- **Cause**: Handler path incorrect or build output wrong
- **Fix**: Verify `dist/functions/handler.handler` exists after build

### CORS Issues

- **Cause**: CORS not configured at API Gateway level
- **Fix**: Ensure CORS is configured in `serverless.yml` under `httpApi.cors`

### Cold Start Performance

- **Cause**: Large bundle size
- **Fix**: Exclude dev dependencies, use `excludeDevDependencies: true`

## References

- Serverless Framework v3.40.0: `/serverless/serverless/v3.40.0`
- Serverless Express: `/codegenieapp/serverless-express`
- AWS Lambda Web Adapter: `/awslabs/aws-lambda-web-adapter`
