import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { StatusCodes } from "http-status-codes";

export function validateBody(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  schema: z.ZodObject<any, any> | z.ZodArray<any>,
) {
  return (request: Request, response: Response, nextFunction: NextFunction) => {
    const { success } = schema.safeParse(request.body);
    console.log(schema.safeParse(request.body).error);
    if (success) {
      nextFunction();
    } else {
      response.status(StatusCodes.BAD_REQUEST).send();
    }
  };
}

export function validateQueryParameters(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  schema: z.ZodObject<any, any>,
) {
  return (request: Request, response: Response, nextFunction: NextFunction) => {
    const { success } = schema.safeParse(request.query);
    if (success) {
      nextFunction();
    } else {
      response.status(StatusCodes.BAD_REQUEST).send();
    }
  };
}

export function validateRequestParameters(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  schema: z.ZodObject<any, any>,
) {
  return (request: Request, response: Response, nextFunction: NextFunction) => {
    const { success } = schema.safeParse(request.params);
    if (success) {
      nextFunction();
    } else {
      response.status(StatusCodes.BAD_REQUEST).send();
    }
  };
}
