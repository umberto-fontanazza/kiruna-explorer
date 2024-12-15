import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";
import { PutBody as LinkPutBody } from "../validation/linkSchema";

// Alternative: https://dev.to/osalumense/validating-request-data-in-expressjs-using-zod-a-comprehensive-guide-3a0j#:~:text=import%20%7B%20RequestHandler%20%7D%20from%20%27express%27%3B

const createValidator =
  (targetName: "body" | "params" | "query") =>
  (schema: z.Schema) =>
  (request: Request, response: Response, nextFunction: NextFunction) => {
    const parseResult = schema.safeParse(request[targetName]);
    if (!parseResult.success) {
      response.status(StatusCodes.BAD_REQUEST).send(parseResult.error);
      nextFunction(parseResult.error);
    }
    if (!request.locals) {
      const errorMesage =
        "Validator requires request.locals but it was not initialized";
      response
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send({ error: errorMesage });
      nextFunction(new Error(errorMesage));
    }
    request.locals![`${targetName}ParsedData`] = parseResult.data;
    nextFunction();
  };

export const validateBody = createValidator("body");
export const validateRequestParameters = createValidator("params");
export const validateQueryParameters = createValidator("query");

/**
 * This middleware checks that the document id in the request parameter
 * is different from the targetDocumentId in the request body
 * to prevent linking a document with itself
 */
export const checkSelfLink = (
  request: Request,
  response: Response,
  nextFunction: NextFunction,
) => {
  const { targetDocumentId } = request.body as LinkPutBody;
  const sourceDocumentId = Number(request.params.id);
  if (sourceDocumentId == targetDocumentId) {
    response.status(StatusCodes.BAD_REQUEST).send();
    return;
  }
  nextFunction();
};
