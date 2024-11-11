import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { StatusCodes } from "http-status-codes";
import { ParamsDictionary } from "express-serve-static-core";

// Alternative: https://dev.to/osalumense/validating-request-data-in-expressjs-using-zod-a-comprehensive-guide-3a0j#:~:text=import%20%7B%20RequestHandler%20%7D%20from%20%27express%27%3B

const createValidator = (
  targetExtractor = (request: Request) => request.body,
) => {
  return (schema: z.Schema) => {
    return (
      request: Request,
      response: Response,
      nextFunction: NextFunction,
    ) => {
      const { success } = schema.safeParse(targetExtractor(request));
      if (success) {
        nextFunction();
      } else {
        response.status(StatusCodes.BAD_REQUEST).send();
      }
    };
  };
};

export const validateBody = createValidator((request: Request) => request.body);
export const validateRequestParameters = createValidator(
  (request: Request) => request.params,
);
export const validateQueryParameters = createValidator(
  (request: Request) => request.query as ParamsDictionary,
);
