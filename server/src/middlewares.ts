import { NextFunction, Request, Response } from "express";
import { UserError } from "./error/userError";
import { StatusCodes } from "http-status-codes";

// Error handling
export function errorHandling(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (err instanceof UserError) {
    res.status(err.statusCode).send({ message: err.message });
  } else {
    console.error(err);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send({ message: "An unexpected error occurred on the server" });
  }
  next();
}
