import { Request, Response, Router } from "express";
import { StatusCodes } from "http-status-codes";
import { Document } from "../model/document";
import { DocumentNotFound } from "../error/documentError";
import { linkRouter } from "./linkRouter";
import {
  validateRequestParameters,
  validateBody,
} from "../middleware/validation";
import {
  idRequestParam,
  PatchBody,
  patchBody,
  postBody,
  PostBody,
} from "../validation/documentSchema";

export const documentRouter: Router = Router();

documentRouter.use("/:id/links", linkRouter);

documentRouter.get(
  "/",
  //TODO: authentication authorization
  async (request: Request, response: Response) => {
    const all: Document[] = await Document.all();
    response.status(StatusCodes.OK).send([...all]);
    return;
  },
);

documentRouter.get(
  "/:id",
  //TODO: authentication authorization
  validateRequestParameters(idRequestParam),
  async (request: Request, response: Response) => {
    const id = Number(request.params.id);
    let doc: Document;
    try {
      doc = await Document.get(id);
    } catch (error) {
      if (!(error instanceof DocumentNotFound)) throw error;
      response.status(StatusCodes.BAD_REQUEST).send();
      return;
    }
    response.status(StatusCodes.OK).send(doc);
    return;
  },
);

documentRouter.post(
  "/",
  //TODO: authentication authorization
  validateBody(postBody),
  async (request: Request, response: Response) => {
    const body: PostBody = request.body;
    const { title, description } = body;
    const insertedDocument = await Document.insert(title, description);
    response.status(StatusCodes.CREATED).send({ id: insertedDocument.id });
    return;
  },
);

documentRouter.patch(
  "/:id",
  //TODO: authentication authorization
  validateRequestParameters(idRequestParam),
  validateBody(patchBody),
  async (request: Request, response: Response) => {
    const id = Number(request.params.id);
    const { title, description, coordinates } = request.body as PatchBody;
    let document: Document;
    try {
      document = await Document.get(id);
    } catch (error) {
      if (!(error instanceof DocumentNotFound)) throw error;
      response.status(StatusCodes.NOT_FOUND).send();
      return;
    }
    document.title = title || document.title;
    document.description = description || document.description;
    document.coordinates = coordinates || document.coordinates;
    await document.update();
    response.status(StatusCodes.NO_CONTENT).send();
    return;
  },
);

documentRouter.delete(
  "/:id",
  //TODO: authentication authorization
  validateRequestParameters(idRequestParam),
  async (request: Request, response: Response) => {
    const id: number = Number(request.params.id);
    try {
      await Document.delete(id);
    } catch (error: unknown) {
      if (!(error instanceof DocumentNotFound)) throw error;
      response.status(StatusCodes.NOT_FOUND).send();
      return;
    }
    response.status(StatusCodes.NO_CONTENT).send();
    return;
  },
);
