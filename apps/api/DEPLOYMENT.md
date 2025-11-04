# API Deployment Guide

This guide explains how to set up automatic deployment of the API to AWS Lambda using GitHub Actions.

## Prerequisites

1. AWS Account with appropriate permissions
2. GitHub repository with Actions enabled
3. AWS credentials configured as GitHub Secrets

## Setup Instructions

### 1. Configure GitHub Secrets

Add the following secrets to your GitHub repository:

**Settings → Secrets and variables → Actions → New repository secret**

Required secrets:

- `AWS_ACCESS_KEY_ID` - AWS access key ID
- `AWS_SECRET_ACCESS_KEY` - AWS secret access key
- `AWS_REGION` - AWS region (default: `us-east-2`)

Optional secrets (for environment variables):

- `FRONTEND_URL` - Frontend URL for CORS (default: `http://localhost:3000`)
- `OPENAI_API_KEY` - OpenAI API key (for Vision API and LLM)
- `ANTHROPIC_API_KEY` - Anthropic API key (alternative LLM)
- `REDIS_HOST` - ElastiCache Redis host
- `REDIS_PORT` - Redis port (default: `6379`)

### 2. AWS IAM Permissions

Create an IAM user with the following permissions for Serverless Framework:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "cloudformation:*",
        "lambda:*",
        "apigateway:*",
        "iam:*",
        "logs:*",
        "s3:*",
        "ec2:DescribeSecurityGroups",
        "ec2:DescribeSubnets",
        "ec2:DescribeVpcs"
      ],
      "Resource": "*"
    }
  ]
}
```

### 3. Deployment Behavior

The workflow automatically deploys based on branch:

- **`main` branch** → Deploys to `prod` stage
- **`develop` branch** → Deploys to `dev` stage
- **Manual trigger** → Choose `dev` or `prod` stage

The workflow only triggers when files in these paths change:

- `apps/api/**`
- `packages/shared/**`
- `.github/workflows/deploy-api.yaml`
- `package.json` or `package-lock.json`

### 4. Manual Deployment

You can manually trigger a deployment:

1. Go to **Actions** tab in GitHub
2. Select **Deploy API to AWS** workflow
3. Click **Run workflow**
4. Choose the deployment stage (`dev` or `prod`)
5. Click **Run workflow**

### 5. Verify Deployment

After deployment, check the workflow output for:

- API endpoint URL
- Lambda function ARN
- CloudFormation stack status

## Deployment Stages

### Development (`dev` stage)

- Deployed from `develop` branch
- Uses `dev` stage in serverless.yml
- Environment: `NODE_ENV=dev`

### Production (`prod` stage)

- Deployed from `main` branch
- Uses `prod` stage in serverless.yml
- Environment: `NODE_ENV=prod`

## Local Deployment

You can also deploy manually from your local machine:

```bash
# Navigate to API directory
cd apps/api

# Install dependencies
npm ci

# Build TypeScript
npm run build

# Deploy to dev
npm run deploy:dev

# Deploy to prod
npm run deploy:prod
```

## Troubleshooting

### Deployment Fails

1. **Check AWS credentials**: Verify secrets are correctly configured
2. **Check IAM permissions**: Ensure IAM user has required permissions
3. **Check workflow logs**: Review GitHub Actions logs for specific errors
4. **Check serverless.yml**: Verify configuration is correct

### Common Issues

**Issue**: "Access Denied" errors

- **Solution**: Check IAM user permissions

**Issue**: "Stack already exists" errors

- **Solution**: Delete the CloudFormation stack in AWS Console or use `serverless remove`

**Issue**: Environment variables not set

- **Solution**: Verify GitHub Secrets are configured correctly

## Serverless Framework Configuration

The API is configured in `apps/api/serverless.yml`:

- Runtime: Node.js 20.x
- Memory: 512 MB
- Timeout: 30 seconds
- Region: us-east-2 (configurable via AWS_REGION secret)

## Next Steps

After deployment:

1. Note the API endpoint URL from the deployment output
2. Update frontend configuration with the API endpoint
3. Test the API endpoints to ensure deployment was successful
