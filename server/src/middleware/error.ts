import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { UserError } from "../error/userError";

/**
 * This should be the last middleware for all routes,
 * it handles unhandled errors
 */
export function sinkErrorHandler(
  error: Error,
  request: Request,
  response: Response,
  next: NextFunction,
) {
  if (response.headersSent) {
    next(error);
    return;
  }

  if (error instanceof UserError) {
    response.status(error.statusCode).json({ message: error.message });
  } else {
    const message =
      error instanceof Error
        ? error.message
        : "An unexpected error occurred on the server";
    console.error(error);
    response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message });
  }
  next(error);
}
