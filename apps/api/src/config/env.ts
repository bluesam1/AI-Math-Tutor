/**
 * Environment variable configuration
 * Access environment variables through this module, never process.env directly
 */

interface EnvConfig {
  nodeEnv: string;
  port: number;
  frontendUrl: string;
  openaiApiKey?: string;
  anthropicApiKey?: string;
  awsRegion?: string;
  redisHost?: string;
  redisPort?: number;
}

const getEnvConfig = (): EnvConfig => {
  return {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '3001', 10),
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
    openaiApiKey: process.env.OPENAI_API_KEY,
    anthropicApiKey: process.env.ANTHROPIC_API_KEY,
    awsRegion: process.env.AWS_REGION,
    redisHost: process.env.REDIS_HOST,
    redisPort: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : undefined,
  };
};

export const env = getEnvConfig();

