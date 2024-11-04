import { Router, Request, Response, NextFunction } from "express";
import passport from "passport";
import { StatusCodes } from "http-status-codes";
import { User } from "../model/user";

export const sessionRouter: Router = Router();

sessionRouter.post("/", (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate(
    "local",
    (err: Error | null, user: User | false, info: { message: string }) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ message: info.message });
      }

      req.login(user, (err) => {
        if (err) {
          return next(err);
        }

        return res.status(StatusCodes.CREATED).json(user);
      });
    },
  )(req, res, next);
});

sessionRouter.get("/current", (req: Request, res: Response) => {
  try {
    if (req.isAuthenticated()) {
      res.json(req.user);
    } else {
      res.status(StatusCodes.UNAUTHORIZED).json({ error: "Not authenticated" });
    }
  } catch (err) {
    console.error(err);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "An unexpected error occurred on the server" });
  }
});

sessionRouter.delete("/current", (req: Request, res: Response) => {
  req.logout((err) => {
    if (err) {
      console.error(err);
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "An unexpected error occurred on the server" });
    }
    res.status(StatusCodes.NO_CONTENT).end();
  });
});
