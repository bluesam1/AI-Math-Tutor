import express, {
  json,
  type Express,
  type Request,
  type Response,
} from 'express';
import { config } from 'dotenv';
import { env } from './config/env';
import { configureCors } from './middleware/cors';
import { errorHandler } from './middleware/errorHandler';
import healthRoutes from './routes/health';
import problemRoutes from './routes/problem';
import chatRoutes from './routes/chat';

// Load environment variables from .env file (only in local development/emulator)
// Firebase Functions in production use environment variables set via Firebase CLI or console
// The FUNCTIONS_EMULATOR env var is set when running Firebase emulators
if (process.env.FUNCTIONS_EMULATOR || process.env.NODE_ENV !== 'production') {
  config();
}

const app: Express = express();

// Configure middleware
app.use(json({ limit: '10mb' }));
configureCors(app);

// Health check endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'AI Math Tutor API' });
});

// API routes
app.use('/api', healthRoutes);
app.use('/api/problem', problemRoutes);
app.use('/api/chat', chatRoutes);

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server (only in standalone mode, not in Firebase Functions)
// Firebase Functions handles the server lifecycle automatically
// FUNCTION_TARGET is set by Firebase Functions runtime
// FUNCTIONS_EMULATOR is set by Firebase emulators
if (
  !process.env.FUNCTIONS_EMULATOR &&
  !process.env.FUNCTION_TARGET &&
  process.env.NODE_ENV !== 'production'
) {
  const PORT = env.port;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📝 Environment: ${env.nodeEnv}`);
    console.log(`🌐 Frontend URL: ${env.frontendUrl}`);
  });
}

export default app;
