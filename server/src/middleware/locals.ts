import { NextFunction, Request, Response } from "express";

/**
 * The locals object is created to hold
 * variables whoose life cycle matches the request / response life cycle.
 *
 * Example:
 * 1. The request is received
 * 2. The locals object is created
 * 3. Middleware A creates a variable x under request.locals.x
 * 4. Middleware B uses the variable saved in request.locals.x
 * 5. Life cycle of the request ends.
 */
export const locals = async (
  request: Request,
  _: Response,
  next: NextFunction,
) => {
  request.locals = {};
  next();
};
