import serverless from 'serverless-http';
import app from '../server';

/**
 * Lambda handler function for serverless deployment
 * Wraps the Express app using serverless-http
 */
const serverlessHandler = serverless(app);

/**
 * Lambda handler with error handling
 */
export const handler = async (
  event: {
    path?: string;
    httpMethod?: string;
    requestContext?: {
      http?: { method?: string };
      stage?: string;
    };
  },
  context: {
    awsRequestId?: string;
    functionName?: string;
  }
) => {
  try {
    console.log('Lambda handler invoked:', {
      path: event.path,
      method: event.requestContext?.http?.method || event.httpMethod,
      stage: event.requestContext?.stage,
    });

    const result = await serverlessHandler(event, context);

    // Log completion (result type varies based on serverless-http)
    console.log('Lambda handler completed successfully');

    return result;
  } catch (error) {
    console.error('Lambda handler error:', error);

    // Return a proper error response
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
};

