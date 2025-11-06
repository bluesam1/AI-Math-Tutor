import express, {
  json,
  type Express,
  type Request,
  type Response,
} from 'express';
import fileParser from 'express-multipart-file-parser';
import { config } from 'dotenv';
import { env } from './config/env';
import { configureCors } from './middleware/cors';
import { errorHandler } from './middleware/errorHandler';
import healthRoutes from './routes/health';
import problemRoutes from './routes/problem';
import chatRoutes from './routes/chat';
import answerRoutes from './routes/answer';

// Load environment variables from .env file (only in local development/emulator)
// Firebase Functions in production use environment variables set via Firebase CLI or console
// The FUNCTIONS_EMULATOR env var is set when running Firebase emulators
if (process.env.FUNCTIONS_EMULATOR || process.env.NODE_ENV !== 'production') {
  // Load .env.local first (if it exists), then .env (if it exists)
  // .env.local takes precedence over .env
  config({ path: '.env.local' });
  config(); // .env will override .env.local values if both exist
}

const app: Express = express();

// IMPORTANT: Configure CORS BEFORE any body parsing middleware
// CORS preflight requests (OPTIONS) don't have a body, so we can apply CORS early
configureCors(app);

// Explicitly handle OPTIONS requests at the root level (before routes)
// This ensures preflight requests are handled even if routes don't catch them
app.options('*', (req: Request, res: Response) => {
  const origin = req.headers.origin;
  const isDevelopment =
    process.env.NODE_ENV !== 'production' || process.env.FUNCTIONS_EMULATOR;

  // Allow localhost origins in development
  if (
    isDevelopment &&
    origin &&
    (origin.startsWith('http://localhost:') ||
      origin.startsWith('http://127.0.0.1:'))
  ) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.status(200).end();
    return;
  }

  // Allow requests with no origin in development
  if (isDevelopment && !origin) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.status(200).end();
    return;
  }

  // For other cases, let CORS middleware handle it
  res.status(200).end();
});

// Configure middleware
// IMPORTANT: Use express-multipart-file-parser for Firebase Functions compatibility
// This middleware is specifically designed to work with Firebase Functions
// which pre-parses the request body as req.rawBody
// See: https://stackoverflow.com/questions/76036987
app.use(fileParser);

// JSON parser for non-multipart requests
app.use(json({ limit: '10mb' }));

// Debug: Log all incoming requests (before routes)
app.use((req, res, next) => {
  console.log('[Server] *** INCOMING REQUEST ***', {
    method: req.method,
    path: req.path,
    url: req.url,
    originalUrl: req.originalUrl,
    baseUrl: req.baseUrl,
    headers: {
      origin: req.headers.origin,
      'content-type': req.headers['content-type'],
    },
  });
  next();
});

// Health check endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'AI Math Tutor API' });
});

// API routes
console.log('[Server] Registering API routes');
app.use('/api', healthRoutes);
app.use('/api/problem', problemRoutes);
app.use('/api/chat', chatRoutes);
console.log('[Server] Registering answer routes at /api/answer');
app.use('/api/answer', answerRoutes);
console.log('[Server] All API routes registered');

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server (only in standalone mode, not in Firebase Functions)
// Firebase Functions handles the server lifecycle automatically
// FUNCTION_TARGET is set by Firebase Functions runtime
// FUNCTIONS_EMULATOR is set by Firebase emulators
// K_SERVICE is set by Google Cloud Run (which Firebase Functions uses)
// Only start server if explicitly running in standalone development mode
// Use STANDALONE_MODE env var to explicitly enable standalone mode
const isStandaloneMode =
  process.env.STANDALONE_MODE === 'true' &&
  !process.env.FUNCTIONS_EMULATOR &&
  !process.env.FUNCTION_TARGET &&
  !process.env.K_SERVICE &&
  process.env.NODE_ENV !== 'production';

if (isStandaloneMode) {
  const PORT = env.port;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📝 Environment: ${env.nodeEnv}`);
    console.log(`🌐 Frontend URL: ${env.frontendUrl}`);
  });
}

export default app;
