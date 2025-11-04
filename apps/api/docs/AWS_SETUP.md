# AWS Setup Guide

This guide explains how to set up AWS credentials for Serverless Framework deployment.

## Understanding Serverless Framework

**Serverless Framework** is an open-source tool that deploys to AWS Lambda. You do NOT need to register or login to Serverless Framework to use it.

The login prompt you see is for the **optional Serverless Dashboard** (monitoring/analytics), which is not required. You can skip it and use Serverless Framework directly with AWS credentials.

## Required: AWS Credentials

You only need AWS credentials to deploy. Serverless Framework will use your AWS credentials to create Lambda functions and API Gateway.

## Setup Steps

### Option 1: Using AWS CLI (Recommended)

1. **Install AWS CLI** (if not already installed):

   ```bash
   # Windows (using Chocolatey)
   choco install awscli

   # Or download from: https://aws.amazon.com/cli/
   ```

2. **Configure AWS credentials**:

   ```bash
   aws configure
   ```

   You'll be prompted for:
   - **AWS Access Key ID**: Your AWS access key
   - **AWS Secret Access Key**: Your AWS secret key
   - **Default region**: `us-east-1` (or your preferred region)
   - **Default output format**: `json`

3. **Get AWS Credentials**:
   - If you don't have AWS credentials, create them in AWS Console:
     1. Go to AWS Console → IAM → Users
     2. Select your user (or create one)
     3. Go to "Security credentials" tab
     4. Click "Create access key"
     5. Choose "Command Line Interface (CLI)"
     6. Copy the Access Key ID and Secret Access Key

### Option 2: Environment Variables

Set AWS credentials as environment variables:

```bash
export AWS_ACCESS_KEY_ID=your-access-key
export AWS_SECRET_ACCESS_KEY=your-secret-key
export AWS_REGION=us-east-1
```

Or on Windows (PowerShell):

```powershell
$env:AWS_ACCESS_KEY_ID="your-access-key"
$env:AWS_SECRET_ACCESS_KEY="your-secret-key"
$env:AWS_REGION="us-east-1"
```

### Option 3: AWS Credentials File

Create `~/.aws/credentials` file (Windows: `C:\Users\YourUsername\.aws\credentials`):

```ini
[default]
aws_access_key_id = your-access-key
aws_secret_access_key = your-secret-key
region = us-east-1
```

## Verify AWS Configuration

Test that AWS credentials are working:

```bash
aws sts get-caller-identity
```

This should return your AWS account ID and user ARN.

## Skip Serverless Dashboard Login

When running serverless commands, if prompted to login:

1. **Skip/Dismiss the login prompt** - You don't need it
2. Use the `--no-org` flag to disable organization features:
   ```bash
   serverless deploy --no-org
   ```

Or add to your `serverless.yml`:

```yaml
org: null
app: null
```

## Required AWS Permissions

Your AWS user/role needs these permissions:

- **Lambda**: Create, update, delete functions
- **API Gateway**: Create, update, delete APIs
- **IAM**: Create roles and policies (for Lambda execution role)
- **CloudFormation**: Create/update stacks (Serverless uses CloudFormation)
- **CloudWatch Logs**: Create log groups

**Minimum IAM Policy**:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "lambda:*",
        "apigateway:*",
        "iam:*",
        "cloudformation:*",
        "logs:*",
        "s3:*"
      ],
      "Resource": "*"
    }
  ]
}
```

## Testing Deployment

Once AWS is configured:

1. **Build the project**:

   ```bash
   cd apps/api
   npm run build
   ```

2. **Deploy to AWS**:

   ```bash
   npm run deploy:dev
   ```

3. **Check deployment**:
   ```bash
   serverless info
   ```

## Troubleshooting

### "Access Denied" Errors

- Verify AWS credentials are correct
- Check IAM permissions for your user
- Ensure you have Lambda/API Gateway permissions

### "Serverless Dashboard Login" Prompt

- Skip the login prompt
- Use `--no-org` flag
- Or set `org: null` in serverless.yml

### "Region not specified"

- Set `AWS_REGION` environment variable
- Or configure in `aws configure`
