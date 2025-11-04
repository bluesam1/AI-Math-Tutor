# AWS Setup Checklist

This checklist helps you verify everything is set up correctly for AWS deployment.

## ✅ Completed Steps

- [x] **AWS CLI Installed**: Version 1.42.65 installed via pip
- [x] **AWS CLI Working**: Can run `python -m awscli --version`

## 📋 Remaining Steps

### Step 1: Get AWS Credentials

- [ ] **Sign up for AWS Account** (if you don't have one)
  - Go to: https://aws.amazon.com/
  - Create account and verify email/phone

- [ ] **Create IAM User**
  - Go to: https://console.aws.amazon.com/iam/
  - Click "Users" → "Create user"
  - Name: `ai-math-tutor-deploy` (or your choice)
  - Select "Access key - Programmatic access"
  - Attach policies:
    - `AWSLambda_FullAccess`
    - `IAMFullAccess`
    - `CloudFormationFullAccess`
    - `APIGatewayAdministrator`
    - `CloudWatchLogsFullAccess`
  - Create user and **save credentials**

- [ ] **Save Credentials Securely**
  - Access Key ID (starts with `AKIA...`)
  - Secret Access Key (can only see once!)
  - Download CSV or copy to password manager
  - **DO NOT commit to Git**

### Step 2: Configure AWS CLI

- [ ] **Run AWS Configure**:
  ```bash
  python -m awscli configure
  ```
  
  You'll be prompted for:
  1. AWS Access Key ID: `[paste your Access Key ID]`
  2. AWS Secret Access Key: `[paste your Secret Access Key]`
  3. Default region name: `us-east-1` (or your preferred region)
  4. Default output format: `json`

- [ ] **Verify Configuration**:
  ```bash
  python -m awscli configure list
  ```
  
  Should show your credentials (partially masked)

### Step 3: Test AWS Connection

- [ ] **Test AWS Credentials**:
  ```bash
  python -m awscli sts get-caller-identity
  ```
  
  Should return:
  ```json
  {
      "UserId": "AIDAXXXXXXXXXXXXXXXXX",
      "Account": "123456789012",
      "Arn": "arn:aws:iam::123456789012:user/your-username"
  }
  ```

- [ ] **If successful**: You're ready to deploy!
- [ ] **If error**: Check credentials and permissions

### Step 4: Verify Serverless Configuration

- [ ] **Check Serverless Framework**:
  ```bash
  cd apps/api
  npm run build
  ```
  
  Should compile TypeScript successfully

- [ ] **Test Serverless Offline**:
  ```bash
  npm run dev:offline
  ```
  
  Should start on `http://localhost:3001`

- [ ] **Test Health Endpoint** (in another terminal):
  ```bash
  curl http://localhost:3001/api/health
  ```
  
  Should return health status

### Step 5: Deploy to AWS

- [ ] **Deploy to AWS (Dev Stage)**:
  ```bash
  cd apps/api
  npm run deploy:dev
  ```
  
  This will:
  - Build TypeScript
  - Package application
  - Deploy to AWS Lambda
  - Create API Gateway
  - Output deployment URL

- [ ] **Note Deployment URL**:
  - Look for output like: `https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/`
  - Save this URL for frontend configuration

- [ ] **Test Deployed API**:
  ```bash
  curl https://[your-deployment-url]/api/health
  ```
  
  Should return health status

### Step 6: Configure Environment Variables (Optional)

For production, you may want to set environment variables:

- [ ] **Set Frontend URL**:
  ```bash
  export FRONTEND_URL=https://your-frontend-domain.com
  npm run deploy:prod
  ```

- [ ] **Set API Keys** (if needed):
  ```bash
  export OPENAI_API_KEY=sk-...
  export ANTHROPIC_API_KEY=sk-ant-...
  npm run deploy:prod
  ```

## 🔍 Verification Commands

Run these commands to verify your setup:

```bash
# Check AWS CLI version
python -m awscli --version

# Check AWS configuration
python -m awscli configure list

# Test AWS connection
python -m awscli sts get-caller-identity

# Check Serverless Framework
cd apps/api
npm run build

# Test locally
npm run dev:offline

# Deploy to AWS
npm run deploy:dev
```

## 🚨 Common Issues

### "Unable to locate credentials"
- **Cause**: AWS credentials not configured
- **Fix**: Run `python -m awscli configure`

### "Access Denied"
- **Cause**: IAM user doesn't have required permissions
- **Fix**: Attach required policies in IAM Console

### "InvalidAccessKeyId"
- **Cause**: Access Key ID is incorrect
- **Fix**: Verify credentials with `aws configure list`

### "SignatureDoesNotMatch"
- **Cause**: Secret Access Key is incorrect
- **Fix**: Recreate access key in IAM Console

### "Serverless Framework authentication required"
- **Cause**: Using Serverless Framework v4+
- **Fix**: Already fixed - using v3.40.0

## 📝 Next Steps After Deployment

Once deployed successfully:

1. **Update Frontend Configuration**:
   - Update `apps/web/.env` with API URL
   - Or configure in `apps/web/src/config/api.ts`

2. **Test API Endpoints**:
   - Health check: `GET /api/health`
   - Problem API: `GET /api/problem`
   - Chat API: `POST /api/chat`

3. **Monitor Logs**:
   ```bash
   python -m awscli logs tail /aws/lambda/ai-math-tutor-api-dev-api --follow
   ```

4. **Set Up CI/CD** (Optional):
   - Configure GitHub Actions
   - Auto-deploy on push to main

## 📚 Documentation References

- **Getting AWS Credentials**: See `GET_AWS_CREDENTIALS.md`
- **AWS CLI Setup**: See `AWS_CLI_SETUP.md`
- **AWS Setup Guide**: See `AWS_SETUP.md`
- **Deployment Guide**: See `DEPLOYMENT.md`

## ✅ Ready to Deploy?

Once you've completed:
- ✅ AWS credentials configured
- ✅ AWS connection tested
- ✅ Serverless Framework configured
- ✅ Local testing successful

You're ready to deploy! Run:
```bash
cd apps/api
npm run deploy:dev
```

## 🆘 Need Help?

If you encounter issues:
1. Check the error message
2. Review the troubleshooting section above
3. Check AWS Console → CloudWatch Logs for errors
4. Verify IAM permissions are correct

