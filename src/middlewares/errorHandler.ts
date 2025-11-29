import { ErrorHandler } from 'hono';
import { HTTPException } from 'hono/http-exception';

export const errorHandler: ErrorHandler = (err, c) => {
  // First, check if this is an HTTP error known to Hono
  if (err instanceof HTTPException) {
    const statusCode = err.status;
    const message = err.message;
    
    // Log server errors (5xx) in production environment for debugging
    if (c.env.NODE_ENV === 'production' && statusCode >= 500) {
      console.error('HTTP Exception:', err);
    }

    c.status(statusCode);
    return c.json({
      code: statusCode,
      message,
      // Show stack trace only if not in production environment
      ...(c.env.NODE_ENV !== 'production' && { stack: err.stack }),
    });
  }

  // If it's not an HTTPException, it's an unexpected error
  // This should always be treated as an Internal Server Error (500)
  // Always log unexpected errors, as this is crucial for debugging!
  console.error('Unexpected Error:', err);
  
  const statusCode = 500;
  const message = 'Internal Server Error';

  c.status(statusCode);
  return c.json({
    code: statusCode,
    message,
    // Show stack trace of original error if not production
    ...(c.env.NODE_ENV !== 'production' && err instanceof Error && { stack: err.stack }),
  });
};