import { NextFunction, Request, Response, Router } from "express";
import { StatusCodes } from "http-status-codes";
import { isPlanner } from "../middleware/auth";
import {
  validateBody,
  validateRequestParameters,
} from "../middleware/validation";
import { Upload } from "../model/upload";
import {
  getQueryParameters,
  GetQueryParameters,
  idRequestParam,
  postBody,
  PostBody,
} from "../validation/uploadSchema";

export const uploadRouter: Router = Router();

uploadRouter.get(
  "/:id",
  validateRequestParameters(idRequestParam),
  validateRequestParameters(getQueryParameters),
  async (request: Request, response: Response, next: NextFunction) => {
    const query = request.query as GetQueryParameters;
    const bindDocuments = query?.bindedDocumentIds === "include";
    const uploadId = Number(request.params.id);
    const upload = await Upload.get(uploadId, bindDocuments, true);
    response.status(StatusCodes.OK).send(upload.toResponseBody());
    next();
  },
);

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
    next();
  },
);
