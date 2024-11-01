import { Request, Response, Router } from "express";
import { Link, LinkType } from "../model/link";
import { StatusCodes } from "http-status-codes";

export const linkRouter: Router = Router({ mergeParams: true }); // merge params allows using doc id

linkRouter.put(
  "",
  //TODO: authentication authorization
  //TODO: validation
  async (request: Request, response: Response) => {
    const sourceDocumentId = Number(request.params.id);
    const { targetDocumentId } = request.body;
    const linkTypes = request.body.linkTypes;
    const newLink = new Link(sourceDocumentId, targetDocumentId, linkTypes); //TODO:
    await newLink.update();
    response.status(StatusCodes.CREATED).send();
  },
);
