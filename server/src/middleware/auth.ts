import { NextFunction, Request, Response } from "express";
import { UserError } from "../error/userError";
import { StatusCodes } from "http-status-codes";
import { User, UserRole } from "../model/user";

// Error handling
export function errorHandling(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (err instanceof UserError) {
    res.status(err.statusCode).json({ message: err.message });
  } else {
    console.error(err);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "An unexpected error occurred on the server" });
  }
  next();
}

// Authentication middleware
export function isLoggedIn(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    next();
    return;
  }
  res.status(StatusCodes.UNAUTHORIZED).json({ error: "Not authenticated" });
}

export function isNotLoggedIn(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  if (!request.isAuthenticated()) {
    next();
    return;
  }
  response
    .status(StatusCodes.UNAUTHORIZED)
    .json({ error: "Already logged in" });
}

const roleCheckBuilder =
  (role: UserRole) =>
  (request: Request, response: Response, next: NextFunction) => {
    const user = request.user as User;
    if (user && user.role === role) {
      next();
      return;
    }
    response
      .status(StatusCodes.FORBIDDEN)
      .json({ error: `User is not a ${role}` });
  };

export const isDeveloper = roleCheckBuilder(UserRole.Developer);
export const isResident = roleCheckBuilder(UserRole.Resident);
export const isPlanner = roleCheckBuilder(UserRole.UrbanPlanner);
