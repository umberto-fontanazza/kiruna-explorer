import { NextFunction, Request, Response, Router } from "express";
import { StatusCodes } from "http-status-codes";
import { isPlanner } from "../middleware/auth";
import {
  validateBody,
  validateQueryParameters,
  validateRequestParameters,
} from "../middleware/validation";
import { Upload } from "../model/upload";
import {
  getManyQueryParameters,
  getQueryParameters,
  GetQueryParameters,
  idRequestParam,
  PatchBody,
  patchBody,
  postBody,
  PostBody,
} from "../validation/uploadSchema";

export const uploadRouter: Router = Router();

uploadRouter.get(
  "/",
  validateQueryParameters(getManyQueryParameters),
  async (request: Request, response: Response, next: NextFunction) => {
    const documentId = Number(request.query.documentId);
    const includeFile = request.query.file === "include";
    const uploads = await Upload.fromDocumentAll(documentId, includeFile);
    response
      .status(StatusCodes.OK)
      .send(uploads.map((u) => u.toResponseBody()));
    next();
  },
);

uploadRouter.get(
  "/:id",
  validateRequestParameters(idRequestParam),
  validateRequestParameters(getQueryParameters),
  async (request: Request, response: Response, next: NextFunction) => {
    const query = request.query as GetQueryParameters;
    const bindDocuments = query?.bindedDocumentIds === "include";
    const uploadId = Number(request.params.id);
    const upload = await Upload.get(uploadId, bindDocuments, true);
    response.status(StatusCodes.OK).send(upload.toResponseBody(true));
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

uploadRouter.patch(
  "/:id",
  isPlanner,
  validateRequestParameters(idRequestParam),
  validateBody(patchBody),
  async (request: Request, response: Response, next: NextFunction) => {
    const uploadId = Number(request.params.id);
    const body = request.body as PatchBody;
    const { title, bindDocumentIds, decoupleDocumentIds } = body;
    const upload = await Upload.get(uploadId, true, false);
    upload.title = title ?? upload.title;
    await upload.update(bindDocumentIds, decoupleDocumentIds);
    response.status(StatusCodes.CREATED).send();
    next();
  },
);

uploadRouter.delete(
  "/:id",
  isPlanner,
  validateRequestParameters(idRequestParam),
  async (request: Request, response: Response, next: NextFunction) => {
    const uploadId = Number(request.params.id);
    await Upload.delete(uploadId);
    response.status(StatusCodes.NO_CONTENT).send();
    next();
  },
);
