import dayjs, { Dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { Request, Response, Router } from "express";
import { StatusCodes } from "http-status-codes";
import { DocumentNotFound } from "../error/documentError";
import { isLoggedIn, isPlanner } from "../middleware/auth";
import {
  validateBody,
  validateQueryParameters,
  validateRequestParameters,
} from "../middleware/validation";
import { Document, DocumentType } from "../model/document";
import { Scale, ScaleType } from "../model/scale";
import {
  getQueryParameters,
  idRequestParam,
  PatchBody,
  patchBody,
  postBody,
  PostBody,
} from "../validation/documentSchema";
import { linkRouter } from "./linkRouter";
dayjs.extend(customParseFormat);

export const documentRouter: Router = Router();

documentRouter.use("/:id/links", linkRouter);

documentRouter.get("/", async (request: Request, response: Response) => {
  const all: Document[] = await Document.all();
  response.status(StatusCodes.OK).send(all.map((d) => d.toResponseBody()));
  return;
});

documentRouter.get(
  "/",
  validateQueryParameters(getQueryParameters),
  async (request: Request, response: Response) => {
    const {
      type,
      scaleType,
      maxIssuanceDate: maxDate,
      minIssuanceDate: minDate,
    } = request.query;
    const [maxIssuanceDate, minIssuanceDate] = (
      [maxDate, minDate] as (string | undefined)[]
    )
      .map((d) => dayjs(d, "YYYY-MM-DD", true))
      .map((d: Dayjs) => (d.isValid() ? d : undefined));
    const filters = {
      type: type as DocumentType,
      scaleType: scaleType as ScaleType,
      maxIssuanceDate,
      minIssuanceDate,
    };
    const someFilter = Object.values(filters).some((d) => d);
    const all: Document[] = await Document.all(
      someFilter ? filters : undefined,
    );
    response.status(StatusCodes.OK).send(all.map((d) => d.toResponseBody()));
    return;
  },
);

documentRouter.post(
  "/",
  isLoggedIn,
  isPlanner,
  validateBody(postBody),
  async (request: Request, response: Response) => {
    const {
      title,
      description,
      type,
      scale,
      stakeholders,
      coordinates,
      issuanceDate,
    } = request.body as PostBody;
    const insertedDocument = await Document.insert(
      title,
      description,
      type,
      new Scale(scale.type, scale.ratio),
      stakeholders,
      coordinates,
      issuanceDate ? dayjs(issuanceDate, "YYYY-MM-DD", true) : undefined,
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
    const {
      title,
      description,
      type,
      scale,
      stakeholders,
      coordinates,
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
    document.issuanceDate = issuanceDate
      ? dayjs(issuanceDate, "YYYY-MM-DD", true)
      : document.issuanceDate;
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
