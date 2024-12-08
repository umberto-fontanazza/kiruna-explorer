import { NextFunction, Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";
import { PutBody as LinkPutBody } from "../validation/linkSchema";

// Alternative: https://dev.to/osalumense/validating-request-data-in-expressjs-using-zod-a-comprehensive-guide-3a0j#:~:text=import%20%7B%20RequestHandler%20%7D%20from%20%27express%27%3B

const createValidator =
  (targetExtractor = (request: Request) => request.body) =>
  (schema: z.Schema) =>
  (request: Request, response: Response, nextFunction: NextFunction) => {
    const parseResult = schema.safeParse(targetExtractor(request));
    if (parseResult.success) {
      nextFunction();
    } else {
      response.status(StatusCodes.BAD_REQUEST).send(parseResult.error);
      nextFunction(parseResult.error);
    }
  };

export const validateBody = createValidator((request: Request) => request.body);
export const validateRequestParameters = createValidator(
  (request: Request) => request.params,
);
export const validateQueryParameters = createValidator(
  (request: Request) => request.query as ParamsDictionary,
);

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
