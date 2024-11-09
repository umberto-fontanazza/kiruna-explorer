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
import { isLoggedIn, isPlanner } from "../middleware/auth";

export const documentRouter: Router = Router();

documentRouter.use("/:id/links", linkRouter);

documentRouter.get("/", async (request: Request, response: Response) => {
  const all: Document[] = await Document.all();
  response.status(StatusCodes.OK).send([...all]);
  return;
});

documentRouter.get(
  "/:id",
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
  isLoggedIn,
  isPlanner,
  validateBody(postBody),
  async (request: Request, response: Response) => {
    const body: PostBody = request.body;
    const { title, description, coordinates, scale, type, language } = body;
    const insertedDocument = await Document.insert(
      title,
      description,
      coordinates,
      scale,
      type,
      language,
    );
    response.status(StatusCodes.CREATED).send({ id: insertedDocument.id });
    return;
  },
);

documentRouter.patch(
  "/:id",
  isLoggedIn,
  isPlanner,
  validateRequestParameters(idRequestParam),
  validateBody(patchBody),
  async (request: Request, response: Response) => {
    const id = Number(request.params.id);
    const { title, description, coordinates, type } = request.body as PatchBody;
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
    document.type = type || document.type;
    await document.update();
    response.status(StatusCodes.NO_CONTENT).send();
    return;
  },
);

documentRouter.delete(
  "/:id",
  isLoggedIn,
  isPlanner,
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
