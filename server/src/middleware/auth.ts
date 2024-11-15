import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { User, UserRole } from "../model/user";

const isLoggedBuilder =
  (inOrOut: "in" | "out" = "in") =>
  (request: Request, response: Response, next: NextFunction) => {
    const checkPass =
      (request.isAuthenticated() && inOrOut === "in") ||
      (!request.isAuthenticated() && inOrOut === "out");
    if (checkPass) {
      next();
      return;
    }
    response.status(StatusCodes.UNAUTHORIZED).json({
      error: `User is ${inOrOut === "in" ? "not" : "already"} logged in.`,
    });
  };

export const isLoggedIn = isLoggedBuilder();
export const isLoggedOut = isLoggedBuilder("out");

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
