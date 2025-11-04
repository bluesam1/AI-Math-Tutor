# How to Verify API Deployment

This guide explains how to verify that your API has been successfully deployed to AWS and is working correctly.

## Step 1: Check GitHub Actions Workflow

### 1.1 Check Workflow Status

1. **Go to GitHub Actions**:
   - Navigate to your repository on GitHub
   - Click on the **Actions** tab
   - Find the **"Deploy API to AWS"** workflow run

2. **Verify Success**:
   - Look for a green checkmark (✅) next to the workflow run
   - All steps should show green checkmarks:
     - ✅ Checkout code
     - ✅ Setup Node.js
     - ✅ Install dependencies
     - ✅ Build API
     - ✅ Configure AWS credentials
     - ✅ Deploy API to AWS Lambda
     - ✅ Deployment summary

3. **Check Workflow Logs**:
   - Click on the workflow run to see detailed logs
   - Look for the deployment output at the end
   - Check for any error messages

### 1.2 Get Deployment Information

In the workflow output, look for:

- **Deployment stage** (dev or prod)
- **Region** (e.g., us-east-2)
- **CloudFormation stack name** (e.g., `ai-math-tutor-api-dev`)

## Step 2: Verify AWS Lambda Function

### 2.1 Check Lambda Function

1. **Go to AWS Lambda Console**:
   - Go to: https://console.aws.amazon.com/lambda/
   - Select the correct region (e.g., `us-east-2`)

2. **Find Your Function**:
   - Look for function name: `ai-math-tutor-api-dev-api` (for dev) or `ai-math-tutor-api-prod-api` (for prod)
   - Click on the function name

3. **Verify Function Details**:
   - **Runtime**: Should be `Node.js 20.x`
   - **Handler**: Should be `dist/functions/handler.handler`
   - **Last modified**: Should show recent timestamp
   - **Status**: Should be "Active"

4. **Check Environment Variables**:
   - Go to **Configuration** tab → **Environment variables**
   - Verify required variables are set (if any)

### 2.2 Check Function Logs

1. **Go to CloudWatch Logs**:
   - In Lambda function page, click **Monitor** tab
   - Click **View CloudWatch logs**
   - Or go to: https://console.aws.amazon.com/cloudwatch/

2. **Check Recent Logs**:
   - Look for recent log streams
   - Check for any errors or warnings
   - Verify function is executing correctly

## Step 3: Verify API Gateway Endpoint

### 3.1 Get API Endpoint URL

1. **From GitHub Actions Output**:
   - Check the deployment summary in the workflow logs
   - Look for API endpoint URL

2. **From AWS Console**:
   - Go to: https://console.aws.amazon.com/apigateway/
   - Find your API: `ai-math-tutor-api-dev` or `ai-math-tutor-api-prod`
   - Click on the API
   - Go to **Stages** → Select stage (`dev` or `prod`)
   - Copy the **Invoke URL** (e.g., `https://xxxxxxxxxx.execute-api.us-east-2.amazonaws.com`)

3. **From CloudFormation Stack**:
   - Go to: https://console.aws.amazon.com/cloudformation/
   - Find stack: `ai-math-tutor-api-dev` or `ai-math-tutor-api-prod`
   - Click **Outputs** tab
   - Look for API endpoint URL

### 3.2 Verify API Gateway Configuration

1. **Check API Gateway Console**:
   - Verify API exists and is deployed
   - Check routes are configured correctly
   - Verify CORS settings (if needed)

## Step 4: Test the Deployed API

### 4.1 Test Health Endpoint

The health endpoint should be available at: `https://[your-api-endpoint]/api/health`

**Using curl:**

```bash
curl https://[your-api-endpoint]/api/health
```

**Expected Response:**

```json
{
  "status": "UP",
  "timestamp": "2025-11-04T...",
  "uptime": ...
}
```

**Using browser:**

- Open: `https://[your-api-endpoint]/api/health`
- Should return JSON response with status "UP"

### 4.2 Test Root Endpoint

**Using curl:**

```bash
curl https://[your-api-endpoint]/
```

**Expected Response:**

```json
{
  "message": "AI Math Tutor API"
}
```

### 4.3 Test Other Endpoints

Test other endpoints if they exist:

- `GET /api/problem` (if implemented)
- `POST /api/chat` (if implemented)

## Step 5: Verify Deployment Checklist

### ✅ Complete Checklist

- [ ] GitHub Actions workflow completed successfully
- [ ] Lambda function exists and is active
- [ ] Lambda function has recent deployment timestamp
- [ ] API Gateway endpoint is accessible
- [ ] Health endpoint returns 200 OK
- [ ] Health endpoint returns correct JSON response
- [ ] No errors in CloudWatch logs
- [ ] API endpoint URL is accessible

## Troubleshooting

### Issue: Workflow Failed

**Check:**

- GitHub Secrets are configured correctly
- AWS credentials have required permissions
- Review workflow logs for specific error messages

**Common Errors:**

- "Access Denied" → Check IAM permissions
- "Region mismatch" → Verify AWS_REGION secret
- "Function not found" → Normal on first deployment, wait for completion

### Issue: Lambda Function Not Found

**Check:**

- Correct region selected in AWS Console
- Function name matches: `ai-math-tutor-api-{stage}-api`
- Deployment completed successfully in GitHub Actions

**Solution:**

- Wait for deployment to complete (first deployment takes 5-10 minutes)
- Check CloudFormation stack status

### Issue: API Endpoint Not Accessible

**Check:**

- API Gateway is deployed
- Correct stage is selected (dev or prod)
- API endpoint URL is correct

**Solution:**

- Verify API Gateway stage is active
- Check CORS configuration if needed
- Test endpoint with curl first

### Issue: 502 Bad Gateway

**Check:**

- Lambda function is active
- Handler path is correct
- Function code is deployed correctly

**Solution:**

- Check Lambda function logs in CloudWatch
- Verify function handler matches: `dist/functions/handler.handler`
- Rebuild and redeploy if needed

### Issue: 403 Forbidden

**Check:**

- API Gateway permissions
- Lambda function permissions
- CORS configuration

**Solution:**

- Check API Gateway resource policies
- Verify Lambda execution role permissions

## Quick Verification Commands

### Get API Endpoint (from command line)

If you have AWS CLI configured:

```bash
# Get API endpoint from CloudFormation stack
aws cloudformation describe-stacks \
  --stack-name ai-math-tutor-api-dev \
  --query 'Stacks[0].Outputs[?OutputKey==`ServiceEndpoint`].OutputValue' \
  --output text
```

### Test API Endpoint

```bash
# Replace with your actual API endpoint
API_ENDPOINT="https://xxxxxxxxxx.execute-api.us-east-2.amazonaws.com"

# Test health endpoint
curl "$API_ENDPOINT/api/health"

# Test root endpoint
curl "$API_ENDPOINT/"
```

## Next Steps After Verification

1. **Update Frontend Configuration**:
   - Add API endpoint URL to frontend environment variables
   - Update CORS settings if needed

2. **Set Up Monitoring**:
   - Configure CloudWatch alarms
   - Set up error notifications

3. **Document API Endpoint**:
   - Save the API endpoint URL for reference
   - Update configuration files if needed

## Success Indicators

Your deployment is successful if:

- ✅ GitHub Actions workflow completed without errors
- ✅ Lambda function exists and is active
- ✅ API Gateway endpoint is accessible
- ✅ Health endpoint returns 200 OK with correct response
- ✅ No errors in CloudWatch logs
