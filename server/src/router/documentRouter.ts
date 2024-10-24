import { NextFunction, Request, Response, Router } from "express";
import { StatusCodes } from "http-status-codes";

export const documentRouter: Router = Router();

documentRouter.get(
  "",
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (request: Request, response: Response, _: NextFunction) => {
    response.status(StatusCodes.OK).send("Hello, world!");
  },
);
