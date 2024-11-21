import dotenv from "dotenv";
import { StatusCodes } from "http-status-codes";
import request from "supertest";
import app from "../src/app";
import { loginAsPlanner } from "./utils";
dotenv.config();

let plannerCookie: string;

beforeAll(async () => {
  plannerCookie = await loginAsPlanner();
});

describe("POST /users", () => {
  it("should create a new user when valid data is provided", async () => {
    const newUser = {
      email: process.env.TEST_EMAIL,
      name: process.env.TEST_NAME,
      surname: process.env.TEST_SURNAME,
      role: process.env.TEST_ROLE,
      password: process.env.TEST_PASSWORD,
    };

    const response = await request(app)
      .post("/users")
      .set("Cookie", plannerCookie)
      .send(newUser);

    expect(response.status).toBe(StatusCodes.CREATED);
    expect(response.body.message).toBe("User created successfully");
  });

  it("should return 401 Unauthorized if no valid cookie is provided", async () => {
    const newUser = {
      email: process.env.TEST_EMAIL,
      name: process.env.TEST_NAME,
      surname: process.env.TEST_SURNAME,
      role: process.env.TEST_ROLE,
      password: process.env.TEST_PASSWORD,
    };

    const response = await request(app)
      .post("/users")
      .set("Cookie", "")
      .send(newUser);

    expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
    expect(response.body.message).toBe("Unauthorized access");
  });

  it("should return conflict error if the user already exists", async () => {
    const newUser = {
      email: process.env.TEST_EMAIL,
      name: process.env.TEST_NAME,
      surname: process.env.TEST_SURNAME,
      role: process.env.TEST_ROLE,
      password: process.env.TEST_PASSWORD,
    };

    const response = await request(app)
      .post("/users")
      .set("Cookie", plannerCookie)
      .send(newUser);

    expect(response.status).toBe(StatusCodes.CONFLICT);
    expect(response.body.message).toBe("User already exists");
  });

  it("should return validation error if the request body is invalid", async () => {
    const invalidUser = {
      email: process.env.TEST_INVALID_EMAIL,
      name: process.env.TEST_NAME,
    };

    const response = await request(app)
      .post("/users")
      .set("Cookie", plannerCookie)
      .send(invalidUser);

    expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    expect(response.body.message).toBe("Validation failed");
  });

  it("should return an error if there is an unexpected server issue", async () => {
    const newUser = {
      email: process.env.TEST_EMAIL,
      name: process.env.TEST_NAME,
      surname: process.env.TEST_SURNAME,
      role: process.env.TEST_ROLE,
      password: process.env.TEST_PASSWORD,
    };

    const response = await request(app)
      .post("/users")
      .set("Cookie", plannerCookie)
      .send(newUser);

    expect(response.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(response.body.message).toBe("Internal Server Error");
  });
});
