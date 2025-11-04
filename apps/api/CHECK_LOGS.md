# How to Check AWS CloudWatch Logs for 500 Error

This guide explains how to check CloudWatch logs to diagnose the 500 error.

## Quick Steps

### Step 1: Go to CloudWatch Logs

1. **Go to AWS CloudWatch Console**:
   - Direct link: https://console.aws.amazon.com/cloudwatch/
   - Or go to AWS Console → Services → CloudWatch → Logs

2. **Find Your Lambda Function Logs**:
   - Look for log group: `/aws/lambda/ai-math-tutor-api-dev-api`
   - (For production: `/aws/lambda/ai-math-tutor-api-prod-api`)

3. **Click on the Log Group**:
   - You'll see log streams (one per deployment/invocation)
   - Click on the most recent log stream

### Step 2: Check Recent Logs

1. **Look for Error Messages**:
   - Scroll to the bottom (most recent logs)
   - Look for red error messages
   - Check for stack traces

2. **Common Error Patterns**:
   - `Cannot find module`
   - `SyntaxError`
   - `TypeError`
   - `Error: Cannot read property`
   - Import errors

### Step 3: Check Lambda Function Logs

**Alternative Method - From Lambda Console:**

1. **Go to Lambda Console**:
   - https://console.aws.amazon.com/lambda/
   - Find function: `ai-math-tutor-api-dev-api`

2. **Check Logs Tab**:
   - Click on your function
   - Go to **Monitor** tab
   - Click **View CloudWatch logs** button
   - This takes you directly to the logs

3. **Check Recent Invocations**:
   - Look for recent invocations (when you hit the /api/health endpoint)
   - Check for errors in the logs

## What to Look For

### Common Errors

1. **Module Not Found**:

   ```
   Error: Cannot find module '../server'
   ```

   - **Cause**: Import path issue or missing file
   - **Fix**: Check if dist/server.js exists in deployment

2. **ES Module Error**:

   ```
   SyntaxError: Unexpected token 'export'
   ```

   - **Cause**: ES modules not configured correctly
   - **Fix**: Check package.json has `"type": "module"`

3. **Environment Variable Missing**:

   ```
   Error: Cannot read property 'port' of undefined
   ```

   - **Cause**: Environment variable not set
   - **Fix**: Check Lambda environment variables

4. **Handler Not Found**:

   ```
   Cannot find module 'dist/functions/handler'
   ```

   - **Cause**: Handler path incorrect or file not deployed
   - **Fix**: Check serverless.yml handler path

5. **Import Error**:

   ```
   Error: Cannot find module 'express'
   ```

   - **Cause**: Dependencies not included in deployment
   - **Fix**: Check serverless.yml package configuration

## Using AWS CLI

If you have AWS CLI configured, you can check logs from command line:

```bash
# Get recent logs
aws logs tail /aws/lambda/ai-math-tutor-api-dev-api --follow

# Get logs from last 10 minutes
aws logs tail /aws/lambda/ai-math-tutor-api-dev-api --since 10m

# Get logs from specific time
aws logs tail /aws/lambda/ai-math-tutor-api-dev-api --since 1h
```

## Quick Diagnosis Checklist

1. **Check Log Group Exists**:
   - `/aws/lambda/ai-math-tutor-api-dev-api` should exist
   - If not, function might not be deployed correctly

2. **Check Recent Log Streams**:
   - Should see new log stream when you hit the endpoint
   - If no new streams, function might not be invoked

3. **Check for Errors**:
   - Look for ERROR or Exception in logs
   - Check stack traces for root cause

4. **Check Handler Invocation**:
   - Should see "Lambda handler invoked:" log message
   - If not, handler might not be called

5. **Check Function Execution**:
   - Should see "Lambda handler completed successfully"
   - If not, function crashed before completion

## Next Steps After Finding Error

1. **Note the Error Message**: Copy the exact error message
2. **Check the Stack Trace**: Look for where the error occurred
3. **Fix the Issue**: Based on the error, fix the code
4. **Redeploy**: Push changes and redeploy
5. **Test Again**: Hit the endpoint and check logs again

## Still Can't Find Logs?

If you can't find logs:

1. **Check Function Name**: Verify function name matches
2. **Check Region**: Make sure you're in the correct AWS region (us-east-2)
3. **Check Deployment**: Verify function was deployed successfully
4. **Wait a Few Minutes**: Logs can take 1-2 minutes to appear
