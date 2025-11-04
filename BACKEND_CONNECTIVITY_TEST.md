# Backend Connectivity Test

## ✅ Test Setup Complete

I've set up a comprehensive backend connectivity test for your Firebase Functions API.

### What Was Created

1. **API Client** (`apps/web/src/services/api.ts`)
   - Centralized API client for all backend requests
   - Handles GET, POST, PUT, DELETE requests
   - Error handling with typed responses
   - Health check method

2. **API Connection Test Component** (`apps/web/src/components/ApiConnectionTest.tsx`)
   - Visual component that tests API connectivity
   - Auto-tests on mount
   - Manual "Test Again" button
   - Shows connection status, health data, and errors
   - Color-coded status (green=success, red=error, blue=testing)

3. **Integration** (`apps/web/src/App.tsx`)
   - Added ApiConnectionTest component to the app
   - Displays at the top of the page

### How to Test

#### 1. Start Firebase Emulators

```bash
# From project root
npm run dev:emulators
```

This starts:
- Functions emulator: `http://localhost:5001`
- Hosting emulator: `http://localhost:5000`
- Emulator UI: `http://localhost:4000`

#### 2. Start Frontend Development Server

```bash
# From project root
npm run dev:web
```

Or from `apps/web`:
```bash
npm run dev
```

Frontend will be available at: `http://localhost:3000`

#### 3. View Connection Test

Open `http://localhost:3000` in your browser. You'll see:
- **API Connection Test** component at the top
- Status indicator (✅ green = success, ❌ red = error)
- Health check data (status, environment, timestamp)
- Error messages if connection fails

#### 4. Manual Testing

You can also test the API directly:

```bash
# Health check via hosting emulator (recommended)
curl http://localhost:5000/api/health

# Health check via functions emulator
curl http://localhost:5001/learn-math-2/us-central1/api/api/health

# Root endpoint
curl http://localhost:5000/
```

### Expected Results

**Success:**
```json
{
  "status": "ok",
  "timestamp": "2025-11-04T20:08:03.136Z",
  "environment": "development"
}
```

**Failure:**
- Check that emulators are running
- Check that backend API is accessible
- Check CORS configuration

### API Client Usage

The API client is now available throughout your app:

```typescript
import { apiClient } from '@/services/api';

// Health check
const health = await apiClient.healthCheck();

// Other endpoints (when implemented)
await apiClient.post('/chat', { message: 'Hello' });
await apiClient.get('/problem/validate');
```

### Configuration

The API client uses:
- **Development (emulators)**: `http://localhost:5000/api`
- **Production**: Set `VITE_API_URL` environment variable

To set custom API URL:
```bash
# Create .env file in apps/web/
VITE_API_URL=http://your-api-url/api
```

### Troubleshooting

**Connection Failed:**
1. Ensure Firebase emulators are running
2. Check that backend is accessible at `http://localhost:5000/api/health`
3. Verify CORS configuration in `functions/src/middleware/cors.ts`
4. Check browser console for CORS errors

**CORS Errors:**
- Verify `FRONTEND_URL` in `functions/.env` matches frontend URL
- Check that CORS middleware is configured correctly
- Ensure origin is in allowed origins list

**Type Errors:**
- Run `npm run build` in `apps/web` to verify TypeScript compilation
- Check that `vite-env.d.ts` is included in TypeScript config

### Next Steps

1. ✅ Backend connectivity test is working
2. ✅ API client is ready for use
3. ⏳ Implement actual API endpoints (chat, problem, etc.)
4. ⏳ Use API client in components for real API calls

## Files Created/Modified

- ✅ `apps/web/src/services/api.ts` - API client
- ✅ `apps/web/src/components/ApiConnectionTest.tsx` - Connection test component
- ✅ `apps/web/src/vite-env.d.ts` - Vite environment types
- ✅ `apps/web/src/App.tsx` - Added connection test component

