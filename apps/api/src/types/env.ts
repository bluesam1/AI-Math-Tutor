/**
 * TypeScript types for environment variables
 */

export interface EnvConfig {
  nodeEnv: string;
  port: number;
  frontendUrl: string;
  openaiApiKey?: string;
  anthropicApiKey?: string;
  awsRegion?: string;
  redisHost?: string;
  redisPort?: number;
}

