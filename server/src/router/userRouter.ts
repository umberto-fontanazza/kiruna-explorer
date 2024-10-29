import { Router, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { User } from "../model/user";
import { UserError } from "../error/userError";

export const userRouter: Router = Router();

// TODO: missing validation:
//  - all fields required
//  - invalidid user role
userRouter.post("/", async (req: Request, res: Response) => {
  try {
    const { email, name, surname, role, password } = req.body;

    const existingUser = await User.getByEmail(email);
    if (existingUser) {
      throw UserError.Conflict(); // Lancia errore 409
    }

    const user = new User(email, name, surname, role);
    await User.insert(user, password);

    res
      .status(StatusCodes.CREATED)
      .json({ message: "User created successfully" });
  } catch (error) {
    if (error instanceof UserError) {
      res.status(error.statusCode).json({ message: error.message });
    } else {
      console.error(error);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "An unexpected error occurred on the server" });
    }
  }
});
