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

// Autorization middlewares
export function isDeveloper(req: Request, res: Response, next: NextFunction) {
  const user = req.user as User;
  if (user && user.role === UserRole.Developer) {
    next();
    return;
  }

  res.status(StatusCodes.FORBIDDEN).json({ error: "User is not a Developer" });
}

export function isPlanner(req: Request, res: Response, next: NextFunction) {
  const user = req.user as User;
  if (user && user.role === UserRole.Planner) {
    next();
    return;
  }

  res.status(StatusCodes.FORBIDDEN).json({ error: "User is not a Planner" });
}

export function isResident(req: Request, res: Response, next: NextFunction) {
  const user = req.user as User;
  if (user && user.role === UserRole.Resident) {
    next();
    return;
  }

  res.status(StatusCodes.FORBIDDEN).json({ error: "User is not a Resident" });
}
