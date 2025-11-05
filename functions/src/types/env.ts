/**
 * TypeScript types for environment variables
 *
 * Firebase Functions v2 uses process.env directly
 * Environment variables are set via Firebase CLI or console
 */

export interface EnvConfig {
  nodeEnv: string;
  port: number;
  frontendUrl: string;
  openaiApiKey?: string;
}
