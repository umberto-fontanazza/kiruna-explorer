import { StatusCodes } from "http-status-codes";
import request from "supertest";
import app from "../src/app";

import dotenv from "dotenv";
dotenv.config();

jest.mock("../src/model/user");
// jest.mock("../src/middleware/validation", () => ({
//   validateBody: jest.fn((req, res, next) => next()),
// }));

describe("POST /users", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a new user when valid data is provided", async () => {
    // const mockInsert = jest.fn().mockResolvedValue(true);
    // const mockGetByEmail = jest.fn().mockResolvedValue(null);

    // User.getByEmail = mockGetByEmail;
    // User.prototype.insert = mockInsert;

    const newUser = {
      email: process.env.TEST_EMAIL,
      name: process.env.TEST_NAME,
      surname: process.env.TEST_SURNAME,
      role: process.env.TEST_ROLE,
      password: process.env.TEST_PASSWORD,
    };

    const response = await request(app)
      .post("http://localhost:3000/user/")
      .send(newUser);

    expect(response.status).toBe(StatusCodes.CREATED);
    expect(response.body.message).toBe("User created successfully");
    // expect(mockInsert).toHaveBeenCalledTimes(1);
    // expect(mockGetByEmail).toHaveBeenCalledTimes(1);
    // expect(mockGetByEmail).toHaveBeenCalledWith(newUser.email);
  });

  it("should return conflict error if the user already exists", async () => {
    // const mockGetByEmail = jest.fn().mockResolvedValue({
    //   email: "test@example.com",
    // });

    // User.getByEmail = mockGetByEmail;

    const newUser = {
      email: process.env.TEST_EMAIL,
      name: process.env.TEST_NAME,
      surname: process.env.TEST_SURNAME,
      role: process.env.TEST_ROLE,
      password: process.env.TEST_PASSWORD,
    };

    const response = await request(app)
      .post("http://localhost:3000/user/")
      .send(newUser);

    expect(response.status).toBe(StatusCodes.CONFLICT);
    expect(response.body.message).toBe("User already exists");
    // expect(mockGetByEmail).toHaveBeenCalledTimes(1);
    // expect(mockGetByEmail).toHaveBeenCalledWith(newUser.email);
  });

  it("should return validation error if the request body is invalid", async () => {
    const invalidUser = {
      email: process.env.TEST_INVALID_EMAIL,
      name: process.env.TEST_NAME,
    };

    const response = await request(app)
      .post("http://localhost:3000/user/")
      .send(invalidUser);

    expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    expect(response.body.message).toBe("Validation failed");
  });

  it("should return an error if there is an unexpected server issue", async () => {
    // const mockGetByEmail = jest
    //   .fn()
    //   .mockRejectedValue(new Error("Unexpected error"));
    // User.getByEmail = mockGetByEmail;

    const newUser = {
      email: process.env.TEST_EMAIL,
      name: process.env.TEST_NAME,
      surname: process.env.TEST_SURNAME,
      role: process.env.TEST_ROLE,
      password: process.env.TEST_PASSWORD,
    };

    const response = await request(app)
      .post("http://localhost:3000/user/")
      .send(newUser);

    expect(response.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(response.body.message).toBe("Internal Server Error");
  });
});
