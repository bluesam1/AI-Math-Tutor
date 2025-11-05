# Troubleshooting: LLM API Configuration Error

## Problem

You're seeing the error: **"LLM API configuration error. Please contact support."**

This error occurs when the `OPENAI_API_KEY` environment variable is not set in your Firebase Functions environment.

## Solution

### For Local Development (Firebase Emulators)

1. **Create a `.env` file** in the `functions/` directory:

```bash
cd functions
touch .env
```

2. **Add your OpenAI API key** to the `.env` file:

```env
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
OPENAI_API_KEY=sk-your-actual-openai-api-key-here
```

3. **Get your OpenAI API key** from:
   - https://platform.openai.com/api-keys
   - Create a new key if you don't have one

4. **Restart the Firebase emulators**:

```bash
# Stop the emulators (Ctrl+C)
# Then restart them
npm run dev:emulators
```

### For Production (Firebase Functions)

Set the secret using Firebase CLI:

```bash
firebase functions:secrets:set OPENAI_API_KEY
```

This will prompt you to enter the API key securely.

### Verify the Fix

1. Check that the `.env` file exists in `functions/` directory
2. Verify the API key is set (don't share your actual key!)
3. Restart the emulators
4. Try submitting a problem again in the browser

The error should be resolved once the API key is properly configured.

## Additional Notes

- The `.env` file should **never** be committed to git (it's in `.gitignore`)
- For production, use Firebase Secret Manager, not environment variables
- The API key is loaded automatically when running emulators if it's in `.env`

