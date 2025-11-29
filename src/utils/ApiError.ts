import { HTTPException } from 'hono/http-exception';
import type { StatusCode } from 'hono/utils/http-status';

export class ApiError extends HTTPException {
  public readonly isOperational: boolean;

  constructor(statusCode: StatusCode, message: string, isOperational = true) {
    // Use 'as any' to bypass overly strict type checking from the parent constructor.
    // This is safe because we know we'll use the appropriate status code.
    super(statusCode as any, { message }); 
    this.isOperational = isOperational;
  }
}