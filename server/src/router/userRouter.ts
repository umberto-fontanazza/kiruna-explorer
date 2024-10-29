import { Router, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { User } from "../model/user";

export const userRouter: Router = Router();

// TODO: missing validation:
//  - all fields required
//  - invalidid user role
userRouter.post("/", async (req: Request, res: Response) => {
  const { email, name, surname, role, password } = req.body;

  const user = new User(email, name, surname, role);

  await User.insert(user, password);

  res
    .status(StatusCodes.CREATED)
    .json({ message: "User created successfully" });
});
