# Deployment Guide

This document describes how to deploy the AI Math Tutor API to AWS Lambda using the Serverless Framework.

## Prerequisites

1. **AWS Account**: You need an AWS account with appropriate permissions
2. **AWS CLI**: Install and configure AWS CLI
   ```bash
   aws configure
   ```
3. **Serverless Framework**: Install globally (optional, can use local version)
   ```bash
   npm install -g serverless
   ```

## Environment Setup

1. Copy `.env.example` to `.env` and fill in your values:
   ```bash
   cp .env.example .env
   ```

2. Required environment variables:
   - `FRONTEND_URL` - Your frontend URL for CORS
   - `OPENAI_API_KEY` - OpenAI API key (for future stories)
   - `ANTHROPIC_API_KEY` - Anthropic API key (alternative)
   - `AWS_REGION` - AWS region (default: us-east-1)

## Local Testing

### Test with Serverless Offline

Test the Lambda function locally before deploying:

```bash
npm run build
npm run dev:offline
```

This starts a local server simulating AWS Lambda and API Gateway at `http://localhost:3001`.

## Deployment Steps

### 1. Build the Application

```bash
npm run build
```

This compiles TypeScript to JavaScript in the `dist/` directory.

### 2. Deploy to Development

```bash
npm run deploy:dev
```

This deploys to the `dev` stage in AWS.

### 3. Deploy to Production

```bash
npm run deploy:prod
```

This deploys to the `prod` stage in AWS.

### 4. Deploy to Custom Stage

```bash
npm run build
serverless deploy --stage staging
```

## Deployment Configuration

The `serverless.yml` file configures:

- **Runtime**: Node.js 20.x
- **Region**: us-east-1 (configurable)
- **Memory**: 512 MB
- **Timeout**: 30 seconds
- **API Gateway**: HTTP API with CORS enabled
- **Environment Variables**: Loaded from `.env` or AWS environment

## Post-Deployment

After deployment, you'll receive:

- **API Endpoint**: The HTTP API Gateway URL
- **Lambda Function**: ARN of the deployed function
- **CloudWatch Logs**: Log group for monitoring

Example output:
```
Service Information
service: ai-math-tutor-api
stage: dev
region: us-east-1
stack: ai-math-tutor-api-dev
resources: 15
api keys:
  None
endpoints:
  ANY - https://xxxxx.execute-api.us-east-1.amazonaws.com/{proxy+}
  ANY - https://xxxxx.execute-api.us-east-1.amazonaws.com/
functions:
  api: ai-math-tutor-api-dev-api
```

## Removing Deployment

To remove the deployed stack:

```bash
npm run remove
```

Or for a specific stage:

```bash
serverless remove --stage dev
```

## Monitoring

### View Logs

```bash
serverless logs -f api --tail
```

### View Function Info

```bash
serverless info
```

## Troubleshooting

### Common Issues

1. **Build Errors**: Ensure TypeScript compiles successfully
   ```bash
   npm run build
   ```

2. **Deployment Timeout**: Increase timeout in `serverless.yml`
   ```yaml
   timeout: 60
   ```

3. **CORS Issues**: Verify `FRONTEND_URL` is set correctly in environment variables

4. **Permission Errors**: Ensure AWS credentials have Lambda, API Gateway, and IAM permissions

## Environment Variables in AWS

For production, set environment variables in AWS Lambda console or via Serverless Framework:

```bash
serverless deploy --stage prod --env OPENAI_API_KEY=your-key
```

Or set in `serverless.yml` under `provider.environment` (for non-sensitive values).

## CI/CD Integration

For automated deployment, add to your CI/CD pipeline:

```yaml
- name: Deploy to AWS
  run: |
    cd apps/api
    npm ci
    npm run build
    npm run deploy:prod
  env:
    AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
    AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
```

