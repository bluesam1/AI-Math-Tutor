# How to Update AWS Secrets for the API

This guide explains where and how to update AWS secrets and environment variables for the API.

## 1. GitHub Secrets (For Deployment Authentication)

These secrets are used by GitHub Actions to authenticate with AWS and deploy your API.

**Location:** GitHub Repository → Settings → Secrets and variables → Actions

**Steps:**

1. Go to your GitHub repository
2. Click **Settings** (top menu)
3. Click **Secrets and variables** → **Actions** (left sidebar)
4. Click **New repository secret** to add new secrets
5. Click on any secret name to edit it

**Required Secrets:**

- `AWS_ACCESS_KEY_ID` - AWS access key for deployment
- `AWS_SECRET_ACCESS_KEY` - AWS secret key for deployment
- `AWS_REGION` - AWS region (e.g., `us-east-2`)

**Optional Secrets** (used as environment variables during deployment):

- `FRONTEND_URL` - Frontend URL for CORS configuration
- `OPENAI_API_KEY` - OpenAI API key
- `ANTHROPIC_API_KEY` - Anthropic API key
- `REDIS_HOST` - ElastiCache Redis host
- `REDIS_PORT` - Redis port (default: `6379`)

**Note:** Changes to GitHub Secrets take effect immediately on the next deployment.

## 2. Serverless Configuration (Code-Based)

Environment variables are defined in `apps/api/serverless.yml`:

```yaml
environment:
  NODE_ENV: ${self:provider.stage}
  FRONTEND_URL: ${env:FRONTEND_URL, 'http://localhost:3000'}
  OPENAI_API_KEY: ${env:OPENAI_API_KEY, ''}
  ANTHROPIC_API_KEY: ${env:ANTHROPIC_API_KEY, ''}
  REDIS_HOST: ${env:REDIS_HOST, ''}
  REDIS_PORT: ${env:REDIS_PORT, '6379'}
```

**How it works:**

- Values come from environment variables during deployment (from GitHub Secrets)
- If not set, falls back to default values (after the comma)
- After updating `serverless.yml`, commit and push to trigger a new deployment

**To update:**

1. Edit `apps/api/serverless.yml`
2. Commit and push changes
3. Deployment workflow will automatically deploy with new values

## 3. AWS Lambda Console (Runtime Environment Variables)

You can directly update environment variables in the AWS Lambda Console, but they will be overwritten on the next deployment.

**Location:** AWS Lambda Console → Function → Configuration → Environment variables

**Steps:**

1. Go to [AWS Lambda Console](https://console.aws.amazon.com/lambda/)
2. Select your function: `ai-math-tutor-api-{stage}-api`
3. Click **Configuration** tab
4. Click **Environment variables** (left sidebar)
5. Click **Edit** to update variables
6. Add/update/delete environment variables
7. Click **Save**

**⚠️ Warning:** Changes made here will be overwritten on the next deployment from GitHub. Use this only for temporary changes or testing.

**Permanent changes should be made in:**

- GitHub Secrets (for values that change)
- `serverless.yml` (for default values or hardcoded values)

## 4. Update Secrets Workflow

### For AWS Credentials (Deployment Authentication):

1. **Get new AWS credentials:**
   - Go to [AWS IAM Console](https://console.aws.amazon.com/iam/)
   - Create a new IAM user or use existing one
   - Create access key with required permissions

2. **Update GitHub Secrets:**
   - Go to GitHub → Settings → Secrets → Actions
   - Update `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`

3. **Test deployment:**
   - Trigger a manual deployment from GitHub Actions
   - Verify deployment succeeds

### For Application Environment Variables:

1. **Update GitHub Secrets:**
   - Go to GitHub → Settings → Secrets → Actions
   - Add/update the secret (e.g., `OPENAI_API_KEY`)

2. **Or update serverless.yml:**
   - Edit `apps/api/serverless.yml`
   - Update default values or add new environment variables

3. **Deploy:**
   - Push changes to trigger automatic deployment
   - Or manually trigger deployment from GitHub Actions

## Quick Reference

| Variable Type             | Location           | Used For                  | Persists?                  |
| ------------------------- | ------------------ | ------------------------- | -------------------------- |
| AWS Credentials           | GitHub Secrets     | Deployment authentication | Yes                        |
| App Environment Variables | GitHub Secrets     | Runtime configuration     | Yes                        |
| Default Values            | `serverless.yml`   | Fallback values           | Yes                        |
| Runtime Variables         | AWS Lambda Console | Temporary changes         | No (overwritten on deploy) |

## Best Practices

1. **Never commit secrets to code** - Always use GitHub Secrets
2. **Use different secrets for dev/prod** - Consider using different GitHub environments
3. **Rotate credentials regularly** - Update AWS access keys periodically
4. **Use AWS Secrets Manager** - For production, consider using AWS Secrets Manager instead of environment variables
5. **Document changes** - Keep track of when and why secrets were updated

## Troubleshooting

**Issue:** Changes to GitHub Secrets not taking effect

- **Solution:** Trigger a new deployment (push code or manual trigger)

**Issue:** Environment variables not available in Lambda

- **Solution:** Check `serverless.yml` configuration and ensure variables are defined

**Issue:** AWS credentials not working

- **Solution:** Verify IAM user has required permissions (see `apps/api/DEPLOYMENT.md`)

## Next Steps

After updating secrets:

1. Verify GitHub Secrets are set correctly
2. Trigger a deployment (push code or manual trigger)
3. Check deployment logs in GitHub Actions
4. Verify environment variables in AWS Lambda Console
