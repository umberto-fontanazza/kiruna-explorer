import { StatusCodes } from "http-status-codes";

export class UserError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }

  static NotFound(message = "User not found") {
    return new UserError(message, StatusCodes.NOT_FOUND);
  }

  static Conflict(message = "User already existing") {
    return new UserError(message, StatusCodes.CONFLICT);
  }

  static WrongCredentials(message = "Email and/or wrong password") {
    return new UserError(message, StatusCodes.UNAUTHORIZED);
  }
}
