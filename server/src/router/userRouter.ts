import { Router, Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { User } from "../model/user";
import { UserError } from "../error/userError";
import { validateBody } from "../middleware/validation";
import { postBody } from "../validation/userSchema";
import { isNotLoggedIn } from "../middleware/auth";

export const userRouter: Router = Router();

userRouter.post(
  "/",
  isNotLoggedIn,
  validateBody(postBody),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, name, surname, role, password } = req.body;

      const existingUser = await User.getByEmail(email);
      if (existingUser) {
        throw UserError.Conflict();
      }

      const user = new User(email, name, surname, role);
      await user.insert(password);

      res
        .status(StatusCodes.CREATED)
        .json({ message: "User created successfully" });
    } catch (err) {
      next(err);
    }
  },
);
