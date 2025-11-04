# Deployment Fix - AWS_REGION Reserved Key

## Issue

The deployment failed with this error:
```
Lambda was unable to configure your environment variables because the environment 
variables you have provided contains reserved keys that are currently not supported 
for modification. Reserved keys used in this request: AWS_REGION
```

## Cause

`AWS_REGION` is a **reserved environment variable** that AWS Lambda automatically provides. You cannot set it manually in your `serverless.yml` environment variables.

## Fix Applied

✅ **Removed `AWS_REGION` from `serverless.yml`**

The `AWS_REGION` line has been removed from the environment variables section:
```yaml
# Before (WRONG):
environment:
  AWS_REGION: ${self:provider.region}
  # ... other vars

# After (CORRECT):
environment:
  # AWS_REGION is automatically provided by Lambda
  # ... other vars
```

## How It Works

- **AWS Lambda automatically provides `AWS_REGION`** as an environment variable
- Your code can access it via `process.env.AWS_REGION`
- The `env.ts` config already handles this correctly:
  ```typescript
  awsRegion: process.env.AWS_REGION,  // Lambda provides this automatically
  ```

## Next Steps

1. **Clean up failed stack** (if needed):
   ```bash
   cd apps/api
   serverless remove --stage dev
   ```

2. **Deploy again**:
   ```bash
   npm run deploy:dev
   ```

## Reserved Lambda Environment Variables

AWS Lambda automatically provides these environment variables (you cannot set them):
- `AWS_REGION` - The AWS region where the function is running
- `AWS_EXECUTION_ENV` - The execution environment
- `AWS_LAMBDA_FUNCTION_NAME` - The function name
- `AWS_LAMBDA_FUNCTION_VERSION` - The function version
- `AWS_LAMBDA_FUNCTION_MEMORY_SIZE` - Memory size in MB
- `AWS_LAMBDA_LOG_GROUP_NAME` - CloudWatch log group name
- `AWS_LAMBDA_LOG_STREAM_NAME` - CloudWatch log stream name
- `LAMBDA_TASK_ROOT` - The directory where function code is located
- `LAMBDA_RUNTIME_DIR` - The directory containing runtime files

## Additional Notes

- Your `env.ts` config already handles `AWS_REGION` correctly as optional
- Lambda will provide it automatically when deployed
- For local development, you can set it manually if needed (but it won't be used in Lambda)

## Verification

After deployment, verify the environment variables:
```bash
python -m awscli lambda get-function-configuration \
  --function-name ai-math-tutor-api-dev-api \
  --region us-east-2 \
  --query 'Environment.Variables'
```

You should see your custom variables, but **not** `AWS_REGION` (it's automatically provided).

