# AWS CLI Installation Complete

AWS CLI has been successfully installed via pip!

## Installation Status

✅ **AWS CLI installed**: Version 1.42.65
✅ **Location**: `C:\Users\SamExel\AppData\Roaming\Python\Python313\Scripts`

## Adding AWS CLI to PATH

The AWS CLI was installed but the Scripts directory is not in your PATH. Here are two ways to fix this:

### Option 1: Add to PATH for Current Session (Temporary)

Add this to your current terminal session:
```bash
export PATH="$PATH:/c/Users/SamExel/AppData/Roaming/Python/Python313/Scripts"
```

### Option 2: Add to PATH Permanently (Recommended)

1. **Open System Environment Variables**:
   - Press `Win + R`
   - Type `sysdm.cpl` and press Enter
   - Click "Environment Variables"

2. **Edit PATH**:
   - Under "User variables", select `Path` and click "Edit"
   - Click "New" and add:
     ```
     C:\Users\SamExel\AppData\Roaming\Python\Python313\Scripts
     ```
   - Click "OK" on all dialogs

3. **Restart your terminal** (close and reopen)

### Option 3: Use Python Module Syntax

You can also use AWS CLI without adding to PATH:
```bash
python -m awscli --version
python -m awscli configure
```

## Verify Installation

After adding to PATH, verify AWS CLI works:
```bash
aws --version
```

You should see:
```
aws-cli/1.42.65 Python/3.13.7 Windows/10 botocore/1.40.65
```

## Configure AWS Credentials

Once AWS CLI is working, configure your credentials:

```bash
aws configure
```

You'll be prompted for:
- **AWS Access Key ID**: Your AWS access key
- **AWS Secret Access Key**: Your AWS secret key  
- **Default region name**: `us-east-1` (or your preferred region)
- **Default output format**: `json`

## Test AWS Configuration

After configuring, test your AWS connection:
```bash
aws sts get-caller-identity
```

This should return your AWS account ID and user ARN.

## Getting AWS Credentials

If you don't have AWS credentials yet:

1. **Sign up for AWS**: https://aws.amazon.com/
2. **Create IAM User**:
   - Go to AWS Console → IAM → Users
   - Click "Create user"
   - Select "Programmatic access"
   - Attach policies (e.g., `AWSLambda_FullAccess`, `IAMFullAccess`)
   - Save the Access Key ID and Secret Access Key

3. **Create Access Key**:
   - Go to IAM → Users → Your User → Security credentials
   - Click "Create access key"
   - Choose "Command Line Interface (CLI)"
   - Download or copy the credentials

## Next Steps

Once AWS CLI is configured:

1. **Test the configuration**:
   ```bash
   aws sts get-caller-identity
   ```

2. **Deploy the serverless API**:
   ```bash
   cd apps/api
   npm run deploy:dev
   ```

## Troubleshooting

### "aws: command not found"
- **Cause**: Scripts directory not in PATH
- **Fix**: Add `C:\Users\SamExel\AppData\Roaming\Python\Python313\Scripts` to PATH (see above)

### "aws: command not found" after adding to PATH
- **Cause**: Terminal session not refreshed
- **Fix**: Close and reopen your terminal/command prompt

### "Access Denied" during deployment
- **Cause**: AWS credentials incorrect or missing permissions
- **Fix**: Verify credentials with `aws sts get-caller-identity` and check IAM permissions

## Alternative: Use Python Module Syntax

If you don't want to add to PATH, you can always use:
```bash
python -m awscli configure
python -m awscli sts get-caller-identity
python -m awscli deploy  # (if using AWS SAM)
```

## Additional Resources

- AWS CLI Documentation: https://docs.aws.amazon.com/cli/
- AWS CLI User Guide: https://docs.aws.amazon.com/cli/latest/userguide/
- AWS Setup Guide: See `AWS_SETUP.md` in this directory

