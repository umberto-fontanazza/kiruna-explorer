import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { UserError } from "../error/userError";

/**
 * This should be the last middleware for all routes,
 * it handles unhandled errors
 */
export function sinkErrorHandler(
  err: Error,
  request: Request,
  response: Response,
  next: NextFunction,
) {
  if (err instanceof UserError) {
    response.status(err.statusCode).json({ message: err.message });
  } else {
    const message =
      err instanceof Error
        ? err.message
        : "An unexpected error occurred on the server";
    console.error(err);
    response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message });
  }
  next();
}
