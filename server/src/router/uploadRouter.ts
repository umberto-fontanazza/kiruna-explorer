import { NextFunction, Request, Response, Router } from "express";
import { StatusCodes } from "http-status-codes";
import { isPlanner } from "../middleware/auth";
import { validateBody } from "../middleware/validation";
import { Upload } from "../model/upload";
import { postBody, PostBody } from "../validation/uploadSchema";

export const uploadRouter: Router = Router();

uploadRouter.post(
  "/",
  isPlanner,
  validateBody(postBody),
  async (request: Request, response: Response, next: NextFunction) => {
    const body = request.body as PostBody;
    const { title, type, documentIds, file: base64file } = body;
    const file = Buffer.from(base64file, "base64");
    const { id } = await Upload.insert(title, type, file, documentIds);
    response.status(StatusCodes.CREATED).send({ id });
  },
);
