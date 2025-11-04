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

// Load environment variables (only in local development, not in Lambda)
// Lambda environment variables are set directly, no need for dotenv
if (!process.env.LAMBDA_TASK_ROOT && process.env.NODE_ENV !== 'production') {
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

// Start server (only if not running in Lambda)
if (process.env.IS_OFFLINE !== 'true' && !process.env.LAMBDA_TASK_ROOT) {
  const PORT = env.port;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📝 Environment: ${env.nodeEnv}`);
    console.log(`🌐 Frontend URL: ${env.frontendUrl}`);
  });
}

export default app;
