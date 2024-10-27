import { Request, Response, Router } from "express";
import { StatusCodes } from "http-status-codes";
import { strict as assert } from "assert";
import { Document } from "../model/document";
import { DocumentNotFound } from "../error/documentError";

export const documentRouter: Router = Router();

documentRouter.get(
  "", //TODO: authentication authorization
  async (request: Request, response: Response) => {
    const all: Document[] = await Document.all();
    response.status(StatusCodes.OK).send([...all]);
    return;
  },
);

documentRouter.get(
  "/:id",
  //TODO: authentication authorization
  async (request: Request, response: Response) => {
    const rawId: string = request.params.id;
    assert(typeof rawId === "string");
    assert(rawId !== "");
    const id: number = parseInt(rawId);
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
  "",
  //TODO: authentication authorization
  async (request: Request, response: Response) => {
    const { title, description } = request.body;
    try {
      assert(typeof title === "string");
      assert(typeof description === "string");
      assert(title != "");
      assert(description != "");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (assertionError) {
      response
        .status(StatusCodes.BAD_REQUEST)
        .send({ error: "Wrong fields in request body" });
      return;
    }
    // Validation done
    const insertedDocument = await Document.insert(title, description);
    response.status(StatusCodes.CREATED).send({ id: insertedDocument.id });
    return;
  },
);

documentRouter.delete(
  "/:id",
  //TODO: authentication authorization
  async (request: Request, response: Response) => {
    const rawId: string = request.params.id;
    assert(rawId !== "");
    const id: number = parseInt(rawId);
    // Validation done
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
