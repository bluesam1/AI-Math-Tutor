# Troubleshooting 500 Error on API Endpoint

If you're getting a 500 error from the API endpoint, follow these steps to diagnose and fix the issue.

## Step 1: Check CloudWatch Logs

The most important step is to check the Lambda function logs for the actual error:

1. **Go to AWS Lambda Console**:
   - https://console.aws.amazon.com/lambda/
   - Find function: `ai-math-tutor-api-dev-api` (or `-prod-api`)
   - Click on the function name

2. **Check Logs**:
   - Click **Monitor** tab
   - Click **View CloudWatch logs**
   - Or go directly to: https://console.aws.amazon.com/cloudwatch/
   - Find log group: `/aws/lambda/ai-math-tutor-api-dev-api`
   - Check recent log streams for errors

3. **Common Errors to Look For**:
   - `Cannot find module`
   - `Error: Cannot find module '../server'`
   - `SyntaxError: Unexpected token`
   - `TypeError: Cannot read property`

## Step 2: Common Issues and Fixes

### Issue 1: ES Module Import Errors

**Error**: `Cannot find module '../server'` or similar import errors

**Cause**: ES modules might not be resolving correctly in Lambda

**Fix**: Ensure package.json includes ES module configuration:

```json
{
  "type": "module",
  "main": "dist/functions/handler.js"
}
```

### Issue 2: Missing Dependencies

**Error**: `Cannot find module 'serverless-http'` or other modules

**Cause**: Dependencies not included in Lambda package

**Fix**: Check serverless.yml package configuration:

- Ensure `excludeDevDependencies: true` is set
- Verify dependencies are in `package.json` (not devDependencies)

### Issue 3: Handler Path Incorrect

**Error**: Handler not found

**Cause**: Handler path in serverless.yml doesn't match actual file location

**Fix**: Verify handler path in serverless.yml:

```yaml
functions:
  api:
    handler: dist/functions/handler.handler
```

### Issue 4: Environment Variables Missing

**Error**: `Cannot read property` or undefined errors

**Cause**: Environment variables not set in Lambda

**Fix**: Check Lambda function environment variables:

- Go to Lambda function → Configuration → Environment variables
- Verify required variables are set

### Issue 5: CORS Configuration

**Error**: CORS errors or preflight failures

**Cause**: CORS not configured correctly

**Fix**: Check serverless.yml CORS configuration and API Gateway settings

## Step 3: Verify Deployment Package

Check what was actually deployed:

1. **Check Lambda Function Code**:
   - Lambda function → Code tab
   - Verify files are present in deployment package
   - Check if `dist/functions/handler.js` exists

2. **Check Package Contents**:
   - The deployment should include:
     - `dist/**` (all compiled files)
     - `package.json`
     - `node_modules/**` (production dependencies only)

## Step 4: Test Locally

Test the handler locally before deploying:

```bash
cd apps/api
npm run build
node dist/functions/handler.js
```

Or test with serverless offline:

```bash
npm run dev:offline
curl http://localhost:3001/api/health
```

## Step 5: Rebuild and Redeploy

If the issue persists, try rebuilding and redeploying:

```bash
cd apps/api

# Clean build
rm -rf dist node_modules
npm install
npm run build

# Verify build
ls -la dist/functions/

# Redeploy
npm run deploy:dev
```

## Quick Fixes

### Fix 1: Ensure ES Module Support

Verify `package.json` has:

```json
{
  "type": "module"
}
```

### Fix 2: Check Handler Export

Ensure `dist/functions/handler.js` exports handler correctly:

```javascript
export const handler = serverless(app);
```

### Fix 3: Verify Dependencies

Ensure all dependencies are in `dependencies` (not `devDependencies`):

- `express`
- `serverless-http`
- `cors`
- `dotenv`

## Getting More Information

### Enable Detailed Logging

Add more logging to handler:

```javascript
export const handler = async (event, context) => {
  console.log('Event:', JSON.stringify(event, null, 2));
  console.log('Context:', JSON.stringify(context, null, 2));
  try {
    return await serverless(app)(event, context);
  } catch (error) {
    console.error('Handler error:', error);
    throw error;
  }
};
```

### Check API Gateway Logs

1. Go to API Gateway Console
2. Find your API
3. Check **Logs** tab for API Gateway errors

## Next Steps

1. Check CloudWatch logs for specific error
2. Share the error message for targeted help
3. Try rebuilding and redeploying
4. Test locally with serverless offline
