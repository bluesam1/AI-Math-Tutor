# Testing Auto API Deployment

This guide explains how to test the automatic API deployment workflow.

## Prerequisites

Before testing, ensure you have:

1. **GitHub Secrets Configured** (Required):
   - Go to: Repository → Settings → Secrets and variables → Actions
   - Verify these secrets exist:
     - `AWS_ACCESS_KEY_ID`
     - `AWS_SECRET_ACCESS_KEY`
     - `AWS_REGION` (optional, defaults to `us-east-2`)

2. **AWS IAM Permissions**:
   - Your IAM user needs permissions for Serverless Framework (see `DEPLOYMENT.md`)

## Method 1: Manual Trigger (Recommended for Testing)

This is the easiest way to test the deployment without pushing code:

1. **Go to GitHub Actions**:
   - Navigate to your repository on GitHub
   - Click on the **Actions** tab

2. **Select the Workflow**:
   - Click on **"Deploy API to AWS"** in the left sidebar

3. **Trigger Manual Deployment**:
   - Click **"Run workflow"** button (top right)
   - Select deployment stage:
     - `dev` - For development testing
     - `prod` - For production (use carefully!)
   - Click **"Run workflow"**

4. **Monitor the Deployment**:
   - Watch the workflow run in real-time
   - Check each step for errors
   - The deployment will show progress in the GitHub Actions UI

5. **Verify Success**:
   - Check the workflow summary for deployment status
   - Look for the API endpoint URL in the output
   - Test the deployed API endpoint

## Method 2: Push Changes to Trigger Deployment

The workflow automatically triggers when you push changes to:

- `main` branch → deploys to `prod` stage
- `develop` branch → deploys to `dev` stage

**Only triggers when files in these paths change:**

- `apps/api/**`
- `packages/shared/**`
- `.github/workflows/deploy-api.yaml`
- `package.json` or `package-lock.json`

### Test Steps:

1. **Make a small change to trigger deployment**:

   ```bash
   # Make a small change to an API file
   echo "# Test deployment" >> apps/api/README.md
   git add apps/api/README.md
   git commit -m "test: trigger API deployment"
   git push origin main  # or develop
   ```

2. **Watch GitHub Actions**:
   - Go to Actions tab
   - The workflow should start automatically
   - Monitor the deployment progress

3. **Verify Deployment**:
   - Check workflow logs for success
   - Get the API endpoint from the deployment output
   - Test the deployed endpoint

## Method 3: Create a Test Branch

Create a test branch to safely test deployment:

```bash
# Create and switch to test branch
git checkout -b test/api-deployment

# Make a small change
echo "# Test deployment" >> apps/api/README.md
git add apps/api/README.md
git commit -m "test: trigger API deployment"

# Push to test branch
git push origin test/api-deployment
```

**Note:** The workflow only triggers on `main` and `develop` branches, so you'll need to manually trigger it or merge to `develop` to test.

## Verifying Deployment Success

### 1. Check GitHub Actions Logs

- Go to Actions tab → Latest workflow run
- Look for green checkmarks on all steps
- Check the "Deployment summary" step for API endpoint URL

### 2. Check AWS Lambda Console

- Go to [AWS Lambda Console](https://console.aws.amazon.com/lambda/)
- Look for function: `ai-math-tutor-api-dev-api` (for dev) or `ai-math-tutor-api-prod-api` (for prod)
- Verify function exists and has recent deployment

### 3. Check API Gateway Console

- Go to [API Gateway Console](https://console.aws.amazon.com/apigateway/home)
- Find your API: `ai-math-tutor-api-dev` or `ai-math-tutor-api-prod`
- Get the API endpoint URL

### 4. Test the Deployed API

```bash
# Get the API endpoint from GitHub Actions output or AWS Console
# Example: https://xxxxxxxxxx.execute-api.us-east-2.amazonaws.com

# Test health endpoint
curl https://[your-api-endpoint]/api/health

# Should return:
# {
#   "status": "UP",
#   "timestamp": "...",
#   "uptime": ...
# }
```

## Troubleshooting

### Workflow Doesn't Trigger

**Issue:** Workflow doesn't start when pushing code

- **Check:** Are you pushing to `main` or `develop` branch?
- **Check:** Did you change files in `apps/api/**` or other trigger paths?
- **Solution:** Use manual trigger (Method 1) instead

### Deployment Fails

**Issue:** "Access Denied" errors

- **Check:** GitHub Secrets are configured correctly
- **Check:** IAM user has required permissions
- **Solution:** Review workflow logs for specific error messages

**Issue:** "Region mismatch" errors

- **Check:** `AWS_REGION` secret matches your AWS credentials region
- **Solution:** Update `AWS_REGION` secret or serverless.yml

**Issue:** "Function not found"

- **Check:** This is normal on first deployment
- **Solution:** Wait for deployment to complete - Serverless Framework creates resources

### Can't Find API Endpoint

**Issue:** Don't see API endpoint URL in workflow output

- **Check:** AWS Console for CloudFormation stack output
- **Check:** API Gateway Console for API endpoint
- **Solution:** Use `serverless info` command locally or check AWS Console

## Expected Workflow Steps

When you run the deployment, you should see these steps:

1. ✅ Checkout code
2. ✅ Setup Node.js
3. ✅ Install root dependencies
4. ✅ Install API dependencies
5. ✅ Build API
6. ✅ Determine deployment stage
7. ✅ Configure AWS credentials
8. ✅ Deploy API to AWS Lambda
9. ✅ Get deployment info
10. ✅ Deployment summary

## Quick Test Checklist

- [ ] GitHub Secrets configured
- [ ] AWS IAM permissions set
- [ ] Workflow can be triggered manually
- [ ] Deployment completes successfully
- [ ] API endpoint is accessible
- [ ] Health endpoint returns 200 OK

## Next Steps After Successful Test

1. **Update Frontend Configuration**:
   - Add API endpoint URL to frontend environment variables
   - Update CORS settings if needed

2. **Set Up Monitoring**:
   - Monitor CloudWatch logs
   - Set up alerts for deployment failures

3. **Automate Further**:
   - Consider adding deployment notifications
   - Set up staging environments if needed
