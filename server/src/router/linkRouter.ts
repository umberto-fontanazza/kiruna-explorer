import { Request, Response, Router } from "express";
import { Link } from "../model/link";
import { StatusCodes } from "http-status-codes";
import {
  validateBody,
  validateRequestParameters,
} from "../middleware/validation";
import { PutBody, putBody } from "../validation/linkSchema";
import { idRequestParam } from "../validation/documentSchema";

export const linkRouter: Router = Router({ mergeParams: true }); // merge params allows using doc id

linkRouter.put(
  "",
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
