import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { StatusCodes } from "http-status-codes";

export function validateBodySchema(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  schema: z.ZodObject<any, any> | z.ZodArray<any>,
) {
  return (request: Request, response: Response, nextFunction: NextFunction) => {
    const { success } = schema.safeParse(request.body);
    if (success) {
      nextFunction();
    } else {
      response.status(StatusCodes.BAD_REQUEST).send();
    }
  };
}
