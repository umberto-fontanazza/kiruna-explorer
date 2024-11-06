import { Request, Response, Router } from "express";
import { Link } from "../model/link";
import { StatusCodes } from "http-status-codes";
import {
  validateBody,
  validateQueryParameters,
  validateRequestParameters,
} from "../middleware/validation";
import { targetIdQueryParam, PutBody, putBody } from "../validation/linkSchema";
import { idRequestParam } from "../validation/documentSchema";

export const linkRouter: Router = Router({ mergeParams: true }); // merge params allows using doc id

linkRouter.get(
  "/",
  //TODO: authentication authorization
  validateRequestParameters(idRequestParam),
  async (request: Request, response: Response) => {
    //TODO: implement search filters, query params
    const sourceDocumentId: number = Number(request.params.id);
    const links: Link[] = await Link.fromDocumentAll(sourceDocumentId);
    response.status(StatusCodes.OK).send(links);
  },
);

linkRouter.put(
  "/",
  //TODO: authentication authorization
  validateRequestParameters(idRequestParam),
  validateBody(putBody),
  async (request: Request, response: Response) => {
    const sourceDocumentId = Number(request.params.id);
    const body = request.body as PutBody;
    const { targetDocumentId, linkTypes } = body;
    const link = new Link(sourceDocumentId, targetDocumentId, linkTypes);
    await link.update();
    response.status(StatusCodes.CREATED).send();
    return;
  },
);

linkRouter.delete(
  "/",
  //TODO: authentication authorization
  validateRequestParameters(idRequestParam),
  validateQueryParameters(targetIdQueryParam),
  async (request: Request, response: Response) => {
    const sourceId = Number(request.params.id);
    const targetId = Number(request.query.targetId);
    await Link.delete(sourceId, targetId);
    response.status(StatusCodes.NO_CONTENT).send();
  },
);
