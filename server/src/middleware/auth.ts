import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { User, UserRole } from "../model/user";

export function isLoggedIn(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  if (request.isAuthenticated()) {
    next();
    return;
  }
  response
    .status(StatusCodes.UNAUTHORIZED)
    .json({ error: "Not authenticated" });
}

export function isLoggedOut(
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
