# AWS Setup Status - Ready to Deploy! 🚀

## ✅ Completed Setup

Great news! You've completed most of the AWS setup:

- ✅ **AWS CLI Installed**: Version 1.42.65
- ✅ **AWS Credentials Configured**: Access key and secret key set
- ✅ **AWS Connection Verified**: Can authenticate with AWS
  - Account ID: `971422717446`
  - User: `[Your Email]`
  - Region: `us-east-2`
- ✅ **TypeScript Build**: Compiles successfully
- ✅ **Serverless Framework**: Configured for v3.40.0

## ⚠️ Configuration Note

**Region Mismatch Detected**:
- Your AWS credentials are configured for: **`us-east-2`**
- Your `serverless.yml` defaults to: **`us-east-1`**

**Recommendation**: Update `serverless.yml` to match your configured region, or deploy with the `--region` flag:

```bash
# Option 1: Deploy to us-east-2 (matches your credentials)
npm run deploy:dev -- --region us-east-2

# Option 2: Update serverless.yml to default to us-east-2
# Change line 13 in serverless.yml from:
#   region: ${opt:region, 'us-east-1'}
# To:
#   region: ${opt:region, 'us-east-2'}
```

## 📋 Pre-Deployment Checklist

Before deploying, verify:

- [x] AWS credentials configured
- [x] AWS connection working
- [x] TypeScript builds successfully
- [ ] **Verify IAM permissions** (check below)
- [ ] **Test serverless offline** (optional but recommended)
- [ ] **Deploy to AWS**

## 🔍 Verify IAM Permissions

Your IAM user needs these permissions for deployment:

- ✅ `AWSLambda_FullAccess` - Create/update Lambda functions
- ✅ `IAMFullAccess` - Create Lambda execution roles
- ✅ `CloudFormationFullAccess` - Serverless Framework uses CloudFormation
- ✅ `APIGatewayAdministrator` - Create API Gateway endpoints
- ✅ `CloudWatchLogsFullAccess` - Create log groups

**To check permissions**:
1. Go to: https://console.aws.amazon.com/iam/
2. Click "Users" → `[Your Email]`
3. Click "Permissions" tab
4. Verify required policies are attached

If permissions are missing, you'll get "Access Denied" errors during deployment.

## 🧪 Test Locally (Optional but Recommended)

Before deploying to AWS, test locally:

```bash
cd apps/api

# Build TypeScript
npm run build

# Start serverless offline
npm run dev:offline
```

In another terminal, test the health endpoint:

```bash
curl http://localhost:3001/api/health
```

Should return:
```json
{
  "status": "UP",
  "timestamp": "2024-11-03T...",
  "uptime": ...
}
```

## 🚀 Deploy to AWS

Once ready, deploy to AWS:

```bash
cd apps/api

# Deploy to dev stage (us-east-2 to match your credentials)
npm run deploy:dev -- --region us-east-2

# Or if you updated serverless.yml to use us-east-2:
npm run deploy:dev
```

**First deployment may take 5-10 minutes** as it:
- Creates Lambda function
- Creates API Gateway
- Creates CloudFormation stack
- Sets up IAM roles
- Configures environment variables

## 📊 After Deployment

Once deployment completes, you'll see:

1. **Deployment URL**: 
   ```
   https://xxxxxxxxxx.execute-api.us-east-2.amazonaws.com/
   ```

2. **Test the deployed API**:
   ```bash
   curl https://[your-deployment-url]/api/health
   ```

3. **Note the API URL** for frontend configuration

## 🔧 Troubleshooting

### "Access Denied" During Deployment

**Cause**: Missing IAM permissions

**Fix**:
1. Go to IAM Console → Users → `[Your Email]`
2. Attach missing policies (see list above)
3. Wait 2-3 minutes for permissions to propagate
4. Try deployment again

### "Region mismatch" Warning

**Cause**: Region in serverless.yml doesn't match AWS credentials

**Fix**: Deploy with `--region us-east-2` flag, or update serverless.yml

### "Function not found" Error

**Cause**: Lambda function doesn't exist yet

**Fix**: This is normal on first deployment - Serverless Framework will create it

### Deployment Takes Too Long

**Cause**: First deployment creates many resources

**Fix**: This is normal - subsequent deployments are faster (1-2 minutes)

## 📝 Next Steps After Deployment

1. **Update Frontend Configuration**:
   - Add API URL to `apps/web/.env`:
     ```
     VITE_API_URL=https://[your-deployment-url]
     ```

2. **Test API Endpoints**:
   - Health: `GET /api/health`
   - Problem: `GET /api/problem`
   - Chat: `POST /api/chat`

3. **Monitor Logs**:
   ```bash
   python -m awscli logs tail /aws/lambda/ai-math-tutor-api-dev-api --follow
   ```

4. **Set Up Production** (when ready):
   ```bash
   npm run deploy:prod -- --region us-east-2
   ```

## ✅ Ready to Deploy!

You're all set! Just run:

```bash
cd apps/api
npm run deploy:dev -- --region us-east-2
```

Or if you prefer to update serverless.yml:

1. Update `serverless.yml` line 13 to use `us-east-2`
2. Run: `npm run deploy:dev`

Good luck! 🚀

