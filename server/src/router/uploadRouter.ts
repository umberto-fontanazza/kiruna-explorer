import { NextFunction, Request, Response, Router } from "express";
import { isPlanner } from "../middleware/auth";

export const uploadRouter: Router = Router();

uploadRouter.post(
  "/",
  isPlanner,
  async (request: Request, response: Response, next: NextFunction) => {
    response.send({ message: "To be implemented" });
  },
);
