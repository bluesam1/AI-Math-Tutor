# How to Get AWS Access Key ID and Secret Access Key

This guide walks you through creating AWS credentials for programmatic access.

## Prerequisites

1. **AWS Account**: You need an AWS account. If you don't have one:
   - Go to https://aws.amazon.com/
   - Click "Create an AWS Account" or "Sign In"
   - Follow the signup process (credit card required, but free tier available)

2. **AWS Console Access**: You need to be able to sign in to the AWS Console

## Step-by-Step Instructions

### Step 1: Sign In to AWS Console

1. Go to https://console.aws.amazon.com/
2. Sign in with your AWS account credentials

### Step 2: Navigate to IAM (Identity and Access Management)

1. In the AWS Console, search for "IAM" in the search bar at the top
2. Click on "IAM" from the search results
3. Or go directly to: https://console.aws.amazon.com/iam/

### Step 3: Create an IAM User

1. **In the IAM dashboard**, click on "Users" in the left sidebar
2. Click the **"Create user"** button (top right)
3. **User name**: Enter a name (e.g., `ai-math-tutor-deploy` or `serverless-deploy`)
4. **Select credential type**: Check **"Provide user access to the AWS Management Console"** is **NOT** checked
   - Instead, check **"Access key - Programmatic access"** (this is what we need)
5. Click **"Next"** button

### Step 4: Set Permissions

1. **Choose permission type**: Select **"Attach policies directly"**
2. **Search for policies**: In the search box, type `AWSLambda`
3. **Select policies**: Check these policies (click the checkbox next to each):
   - ✅ **AWSLambda_FullAccess** - Full access to Lambda functions
   - ✅ **IAMFullAccess** - Full access to IAM (for creating Lambda execution roles)
   - ✅ **CloudFormationFullAccess** - Full access to CloudFormation (Serverless Framework uses this)
   - ✅ **APIGatewayAdministrator** - Full access to API Gateway
   - ✅ **CloudWatchLogsFullAccess** - Full access to CloudWatch Logs (for Lambda logs)

**Alternative (Simpler but Less Secure)**: For development/testing, you can use:
- ✅ **AdministratorAccess** - Full access (not recommended for production)

4. Click **"Next"** button

### Step 5: Review and Create User

1. Review the user details and permissions
2. Click **"Create user"** button

### Step 6: Save Your Access Key

**⚠️ IMPORTANT: This is the only time you can see the Secret Access Key!**

1. After clicking "Create user", you'll see a success page
2. **Download the credentials**:
   - Click **"Download .csv"** button to save credentials to a CSV file
   - **OR** manually copy the values:
     - **Access key ID**: Copy this value (starts with `AKIA...`)
     - **Secret access key**: Copy this value (long random string)
     - Click **"Show"** if the secret key is hidden

3. **Save the credentials securely**:
   - ✅ Save the CSV file in a secure location
   - ✅ Or copy both values to a password manager
   - ❌ **DO NOT** commit these to Git or share publicly
   - ❌ **DO NOT** lose the Secret Access Key (you can't retrieve it later)

4. Click **"Done"** button

## What You Should Have

You now have:
- **Access Key ID**: Looks like `AKIAIOSFODNN7EXAMPLE`
- **Secret Access Key**: Looks like `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY`

## Alternative: Create Access Key for Existing User

If you already have an IAM user and want to add an access key:

1. Go to **IAM** → **Users**
2. Click on your user name
3. Go to **"Security credentials"** tab
4. Scroll down to **"Access keys"** section
5. Click **"Create access key"** button
6. Select **"Command Line Interface (CLI)"** as the use case
7. Click **"Next"** button
8. Optionally add a description tag
9. Click **"Create access key"** button
10. **Copy and save** both values (this is the only time you'll see the secret key)
11. Click **"Done"** button

## Configure AWS CLI with Your Credentials

Once you have your credentials:

```bash
# Using Python module (if PATH not configured)
python -m awscli configure

# Or if AWS CLI is in PATH
aws configure
```

You'll be prompted for:
1. **AWS Access Key ID**: Paste your Access Key ID
2. **AWS Secret Access Key**: Paste your Secret Access Key
3. **Default region name**: Enter `us-east-1` (or your preferred region)
4. **Default output format**: Enter `json`

## Verify Your Credentials

Test that your credentials work:

```bash
# Using Python module
python -m awscli sts get-caller-identity

# Or if AWS CLI is in PATH
aws sts get-caller-identity
```

You should see output like:
```json
{
    "UserId": "AIDAXXXXXXXXXXXXXXXXX",
    "Account": "123456789012",
    "Arn": "arn:aws:iam::123456789012:user/your-username"
}
```

## Security Best Practices

### ✅ DO:
- Use IAM users with minimal required permissions
- Rotate access keys regularly (every 90 days)
- Use different access keys for different projects
- Store credentials securely (password manager, encrypted file)
- Use IAM roles when possible (for EC2, Lambda, etc.)

### ❌ DON'T:
- Commit credentials to Git repositories
- Share credentials publicly or in chat/Slack
- Use root account credentials for programmatic access
- Use overly permissive policies (like AdministratorAccess) unless necessary
- Store credentials in plain text in code

## Troubleshooting

### "Access Denied" Error

**Cause**: Your IAM user doesn't have the required permissions

**Fix**:
1. Go to IAM → Users → Your User → Permissions
2. Attach the required policies (see Step 4 above)
3. Wait a few minutes for permissions to propagate

### "InvalidAccessKeyId" Error

**Cause**: Access Key ID is incorrect or doesn't exist

**Fix**:
1. Verify the Access Key ID is correct (starts with `AKIA...`)
2. Check if the access key was deleted
3. Create a new access key if needed

### "SignatureDoesNotMatch" Error

**Cause**: Secret Access Key is incorrect

**Fix**:
1. Verify the Secret Access Key is correct (no extra spaces)
2. If you lost the secret key, you must create a new access key pair
3. You cannot retrieve an existing secret key

### "The security token included in the request is invalid"

**Cause**: Access key expired or was disabled

**Fix**:
1. Check if the access key is active in IAM → Users → Security credentials
2. Create a new access key if needed

## Next Steps

After configuring AWS credentials:

1. **Test the configuration**:
   ```bash
   python -m awscli sts get-caller-identity
   ```

2. **Deploy your serverless API**:
   ```bash
   cd apps/api
   npm run deploy:dev
   ```

## Additional Resources

- **AWS IAM Documentation**: https://docs.aws.amazon.com/iam/
- **AWS CLI User Guide**: https://docs.aws.amazon.com/cli/latest/userguide/
- **IAM Best Practices**: https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html
- **AWS Free Tier**: https://aws.amazon.com/free/

## Need Help?

If you encounter issues:
1. Check the AWS Console → IAM → Users → Your User → Security credentials
2. Verify the access key is active
3. Check IAM permissions are correctly attached
4. Review CloudWatch Logs for deployment errors

