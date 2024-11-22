import { randomInt } from "crypto";
import dotenv from "dotenv";
import { StatusCodes } from "http-status-codes";
import request from "supertest";
import app from "../src/app";
dotenv.config();

const counter: number = randomInt(0, 1001);

describe("POST /users", () => {
  it("should create a new user when valid data is provided", async () => {
    const email =
      (process.env.TEST_EMAIL ?? "defaultemail") + counter + "@gmail.com";
    const newUser = {
      email: email,
      name: process.env.TEST_NAME,
      surname: process.env.TEST_SURNAME,
      role: process.env.TEST_ROLE,
      password: process.env.TEST_PASSWORD,
    };

    const response = await request(app).post("/users").send(newUser);

    expect(response.status).toBe(StatusCodes.CREATED);
    expect(response.body.message).toBe("User created successfully");
  });

  it("should return conflict error if the user already exists", async () => {
    const email =
      (process.env.TEST_EMAIL ?? "defaultemail") + counter + "@gmail.com";
    const newUser = {
      email: email,
      name: process.env.TEST_NAME,
      surname: process.env.TEST_SURNAME,
      role: process.env.TEST_ROLE,
      password: process.env.TEST_PASSWORD,
    };

    const response = await request(app).post("/users").send(newUser);

    expect(response.status).toBe(StatusCodes.CONFLICT);
    expect(response.body.message).toBe("User already existing");
  });

  it("should return validation error if the request body is invalid", async () => {
    const invalidUser = {
      email: process.env.TEST_INVALID_EMAIL,
      name: process.env.TEST_NAME,
    };

    const response = await request(app).post("/users").send(invalidUser);

    expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    expect(response.body.message).toBeUndefined();
  });

  it("should return an error if there is an unexpected server issue", async () => {
    const newUser = {};

    const response = await request(app).post("/users").send(newUser);

    expect(response.status).toBe(400);
    expect(response.body.message).toBeUndefined();
  });
});
