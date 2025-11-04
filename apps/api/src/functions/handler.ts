import serverless from 'serverless-http';
import app from '../server';

/**
 * Lambda handler function for serverless deployment
 * Wraps the Express app using serverless-http
 */
export const handler = serverless(app);

