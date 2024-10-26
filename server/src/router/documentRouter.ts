import { NextFunction, Request, Response, Router } from "express";
import { StatusCodes } from "http-status-codes";
import { strict as assert } from "assert";
import { Document } from "../model/document";

export const documentRouter: Router = Router();

documentRouter.get(
  "",
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (request: Request, response: Response, _: NextFunction) => {
    response.status(StatusCodes.OK).send("Hello, world!");
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
