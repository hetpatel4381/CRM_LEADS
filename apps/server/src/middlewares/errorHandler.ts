import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof ZodError) {
    const messages = err.errors.map((e) => e.message).join(', ');
    res.status(400).json({ success: false, error: messages });
    return;
  }

  if (process.env.NODE_ENV !== 'production') {
    console.error(err);
  }

  const statusCode = (err as { statusCode?: number }).statusCode || 500;
  res.status(statusCode).json({
    success: false,
    error: err.message || 'Internal Server Error',
  });
}
