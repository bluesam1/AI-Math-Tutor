/**
 * Development Mode Configuration
 * 
 * Provides utilities to check if the application is running in development mode.
 * The testing interface should only be accessible in development mode.
 */

/**
 * Check if the application is running in development mode
 * 
 * In Vite, `import.meta.env.MODE` is 'development' in development mode
 * and 'production' in production builds.
 * 
 * @returns true if running in development mode, false otherwise
 */
export const isDevelopmentMode = (): boolean => {
  // Check Vite's MODE environment variable
  // In Vite, MODE is 'development' during dev server, 'production' in production builds
  if (import.meta.env.MODE === 'development') {
    return true;
  }

  // Additional check: NODE_ENV (for build-time checks)
  // Note: In Vite, NODE_ENV is set at build time, not runtime
  // But we can check if we're not in production
  if (import.meta.env.MODE !== 'production') {
    return true;
  }

  // If REACT_APP_ENABLE_TESTING_INTERFACE is explicitly set (for flexibility)
  // This allows enabling testing interface even in production if needed (for testing)
  // But default is false for security
  if (import.meta.env.VITE_ENABLE_TESTING_INTERFACE === 'true') {
    return true;
  }

  return false;
};

/**
 * Check if the testing interface should be enabled
 * 
 * This is a more explicit check that can be used to conditionally render
 * the testing interface components.
 * 
 * @returns true if testing interface should be enabled, false otherwise
 */
export const isTestingInterfaceEnabled = (): boolean => {
  return isDevelopmentMode();
};

/**
 * Development mode configuration object
 */
export const devConfig = {
  isDevelopment: isDevelopmentMode(),
  isTestingEnabled: isTestingInterfaceEnabled(),
  mode: import.meta.env.MODE || 'production',
  nodeEnv: import.meta.env.MODE === 'development' ? 'development' : 'production',
};

export default devConfig;

