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
import { Scale } from "../model/scale";
import dayjs from "dayjs";

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
    const {
      title,
      description,
      type,
      scale,
      stakeholders,
      coordinates,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      issuanceDate,
    } = request.body as PostBody;
    const parsedScale = new Scale(scale.type, scale.ratio);
    const parsedIssuanceDate = dayjs(); //TODO: put the actual date
    const insertedDocument = await Document.insert(
      title,
      description,
      type,
      parsedScale,
      stakeholders,
      coordinates,
      parsedIssuanceDate,
    );
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
    const {
      title,
      description,
      type,
      scale,
      stakeholders,
      coordinates,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      issuanceDate,
    } = request.body as PatchBody;
    let document: Document;
    try {
      document = await Document.get(id);
    } catch (error) {
      if (!(error instanceof DocumentNotFound)) throw error;
      response.status(StatusCodes.NOT_FOUND).send();
      return;
    }
    let parsedScale: Scale;
    if (scale) {
      parsedScale = new Scale(scale.type, scale.ratio);
    }
    document.title = title || document.title;
    document.description = description || document.description;
    document.type = type || document.type;
    document.scale = (parsedScale! as Scale) || document.scale;
    document.stakeholders = stakeholders || document.stakeholders;
    document.coordinates = coordinates || document.coordinates;
    document.issuanceDate = dayjs() || document.issuanceDate; // TODO: use actual
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
