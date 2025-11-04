/**
 * Environment variable configuration
 * Access environment variables through this module, never process.env directly
 * 
 * Firebase Functions v2 uses process.env directly, so we just wrap it for type safety
 */

interface EnvConfig {
  nodeEnv: string;
  port: number;
  frontendUrl: string;
  openaiApiKey?: string;
  // Firebase Functions environment variables are set via Firebase CLI or console
  // For local development, use .env file (loaded by dotenv in server.ts)
}

const getEnvConfig = (): EnvConfig => {
  // In Firebase Functions, environment variables are available via process.env
  // In local development, dotenv loads them from .env file
  return {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '3001', 10),
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
    openaiApiKey: process.env.OPENAI_API_KEY,
  };
};

export const env = getEnvConfig();
