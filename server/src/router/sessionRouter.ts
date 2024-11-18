import { Router, Request, Response, NextFunction } from "express";
import passport from "passport";
import { StatusCodes } from "http-status-codes";
import { User } from "../model/user";
import { validateBody } from "../middleware/validation";
import { postBody } from "../validation/sessionSchema";
import { isLoggedIn, isLoggedOut } from "../middleware/auth";

export const sessionRouter: Router = Router();

sessionRouter.post(
  "/",
  isLoggedOut,
  validateBody(postBody),
  (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate(
      "local",
      (err: Error | null, user: User | false, info: { message: string }) => {
        if (err) {
          next(err);
          return;
        }
        if (!user) {
          res.status(StatusCodes.UNAUTHORIZED).json({ message: info.message });
          return;
        }

        req.login(user, (err) => {
          if (err) {
            next(err);
            return;
          }
          res.status(StatusCodes.CREATED).json(user);
          return;
        });
      },
    )(req, res, next);
  },
);

sessionRouter.get("/current", isLoggedIn, (req: Request, res: Response) => {
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

sessionRouter.delete("/current", isLoggedIn, (req: Request, res: Response) => {
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
