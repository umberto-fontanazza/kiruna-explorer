import dotenv from "dotenv";
import { StatusCodes } from "http-status-codes";
import request from "supertest";
import app from "../src/app";
import { Database } from "../src/database";

dotenv.config();

describe("Authentication E2E Tests", () => {
  let sessionCookie: string;

  beforeAll(async () => {
    // Ensure the database is in a clean state
    await Database.setup();
  });

  afterAll(async () => {
    // Restore the TEST DB to its original state
    await Database.reset();
    await Database.disconnect();
  });

  const newUser = {
    email: "testuser@example.com",
    password: "testpassword123",
    name: "Test",
    surname: "User",
    role: "Resident",
  };

  it("should register a new user or confirm existence", async () => {
    const response = await request(app).post("/users").send(newUser);

    if (response.status === StatusCodes.CREATED) {
      expect(response.body.message).toBe("User created successfully");
    } else {
      expect(response.status).toBe(StatusCodes.CONFLICT);
      expect(response.body.error).toBe("Conflict");
    }
  });

  it("should login with correct credentials", async () => {
    const loginData = {
      email: "testuser@example.com",
      password: "testpassword123",
    };

    const response = await request(app).post("/sessions").send(loginData);

    expect(response.status).toBe(StatusCodes.OK);
    expect(response.body.message).toBe("Logged in successfully");
    sessionCookie = response.headers["set-cookie"];
  });

  it("should fail to login with incorrect credentials", async () => {
    const wrongLoginData = {
      email: "testuser@example.com",
      password: "wrongpassword123",
    };

    const response = await request(app).post("/sessions").send(wrongLoginData);

    expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
    expect(response.body.error).toBe("Username and/or wrong password");
  });

  it("should logout the logged-in user", async () => {
    const response = await request(app)
      .post("/sessions/logout")
      .set("Cookie", sessionCookie);

    expect(response.status).toBe(StatusCodes.OK);
    expect(response.body.message).toBe("Logged out successfully");
  });

  it("should fail logout if no session exists", async () => {
    const response = await request(app).post("/sessions/logout");
    expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
    expect(response.body.error).toBe("No session found");
  });
});
