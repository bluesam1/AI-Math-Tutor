# Installing AWS CLI on Windows

This guide provides multiple methods to install AWS CLI on Windows.

## Method 1: MSI Installer (Recommended - Easiest)

This is the easiest method and doesn't require administrator privileges if you install to your user directory.

### Steps:

1. **Download the MSI installer**:
   - Go to: https://awscli.amazonaws.com/AWSCLIV2.msi
   - Or download directly:
   ```bash
   # Download using curl (if available)
   curl -o AWSCLIV2.msi https://awscli.amazonaws.com/AWSCLIV2.msi
   ```

2. **Run the installer**:
   - Double-click `AWSCLIV2.msi` or run from command line:
   ```bash
   msiexec.exe /i AWSCLIV2.msi
   ```
   - Follow the installation wizard
   - Choose "Install for all users" (requires admin) or "Install for current user" (no admin needed)

3. **Verify installation**:
   ```bash
   aws --version
   ```

## Method 2: Using pip (Python)

Since you have Python 3.13.7 installed, you can use pip:

### Steps:

1. **Install AWS CLI**:
   ```bash
   pip install awscli
   ```

2. **Verify installation**:
   ```bash
   aws --version
   ```

**Note**: If `pip` is not found, try:
```bash
python -m pip install awscli
# or
python3 -m pip install awscli
```

## Method 3: Using Chocolatey (Requires Admin)

If you want to use Chocolatey, you'll need to run PowerShell or Command Prompt as Administrator:

1. **Open PowerShell as Administrator**:
   - Right-click PowerShell → "Run as Administrator"
   - Or search "PowerShell" → Right-click → "Run as administrator"

2. **Install AWS CLI**:
   ```powershell
   choco install awscli -y
   ```

3. **Verify installation**:
   ```powershell
   aws --version
   ```

## Method 4: Using winget (Windows Package Manager)

If you have Windows 10/11 with winget:

```bash
winget install Amazon.AWSCLI
```

## Recommended: Method 1 (MSI Installer)

The MSI installer is the official method and provides:
- Automatic PATH configuration
- Easy updates
- No Python dependency
- Works for all users or just current user

## After Installation

Once AWS CLI is installed, verify it works:

```bash
aws --version
```

You should see output like:
```
aws-cli/2.31.27 Python/3.13.7 Windows/10 exe/AMD64
```

## Next Steps

After installation, configure AWS credentials:

```bash
aws configure
```

You'll be prompted for:
- **AWS Access Key ID**: Your AWS access key
- **AWS Secret Access Key**: Your AWS secret key
- **Default region**: `us-east-1` (or your preferred region)
- **Default output format**: `json`

## Troubleshooting

### "aws: command not found"
- **Cause**: PATH not updated
- **Fix**: Restart your terminal/command prompt, or manually add AWS CLI to PATH

### "Access denied" during installation
- **Cause**: Need administrator privileges
- **Fix**: Use Method 1 (MSI) with "Install for current user" option, or run as administrator

### pip installation fails
- **Cause**: pip not installed or not in PATH
- **Fix**: Install pip first, or use `python -m pip install awscli`

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

## Additional Resources

- AWS CLI Documentation: https://docs.aws.amazon.com/cli/
- AWS CLI User Guide: https://docs.aws.amazon.com/cli/latest/userguide/
- AWS Setup Guide: See `AWS_SETUP.md` in this directory

