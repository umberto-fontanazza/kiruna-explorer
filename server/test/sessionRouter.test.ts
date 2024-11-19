import request from "supertest";
import app from "../src/app";
import passport from "passport";
import { StatusCodes } from "http-status-codes";
import dotenv from 'dotenv'; 
dotenv.config(); 

jest.mock("passport", () => ({
  authenticate: jest.fn(),
}));

describe("sessionRouter", () => {
  describe("POST /", () => {
    it("should login a user successfully", async () => {
      const mockUser = {
        id: 1,
        username: process.env.TEST_NAME,
        email: process.env.TEST_EMAIL,
      };
      passport.authenticate.mockImplementationOnce((strategy, callback) =>
        callback(null, mockUser),
      );

      const response = await request(app)
        .post("http://localhost:3000/sessions/")
        .send({
          username: process.env.TEST_NAME,
          password: process.env.TEST_PASSWORD,
        });

      expect(response.status).toBe(StatusCodes.CREATED);
      expect(response.body).toEqual(mockUser);
    });

    it("should return unauthorized if authentication fails", async () => {
      passport.authenticate.mockImplementationOnce((strategy, callback) =>
        callback(null, false, { message: "Invalid credentials" }),
      );

      const response = await request(app)
        .post("http://localhost:3000/sessions/")
        .send({
          username: process.env.TEST_NAME,
          password: process.env.TEST_WRONG_PASSWORD,
        });

      expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
      expect(response.body.message).toBe("Invalid credentials");
    });

    it("should handle server errors", async () => {
      passport.authenticate.mockImplementationOnce((strategy, callback) =>
        callback(new Error("Server error"), false),
      );

      const response = await request(app)
        .post("http://localhost:3000/sessions/")
        .send({
          username: process.env.TEST_NAME,
          password: process.env.TEST_PASSWORD,
        });

      expect(response.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(response.body.message).toBe(
        "An unexpected error occurred on the server",
      );
    });
  });

  describe("GET /current", () => {
    it("should return the current user if authenticated", async () => {
      const mockUser = {
        id: 1,
        username: process.env.TEST_NAME,
        email: process.env.TEST_EMAIL,
      };
      const response = await request(app)
        .get("http://localhost:3000/sessions/current")
        .set("Cookie", "connect.sid=s%3A_SESSION_ID")
        .send();

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body).toEqual(mockUser);
    });

    it("should return unauthorized if not authenticated", async () => {
      const response = await request(app)
        .get("http://localhost:3000/sessions/current")
        .send();

      expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
      expect(response.body.error).toBe("Not authenticated");
    });
  });

  describe("DELETE /current", () => {
    it("should log out the current user", async () => {
      const mockUser = {
        id: 1,
        username: process.env.TEST_NAME,
        email: process.env.TEST_EMAIL,
      };
      passport.logout = jest
        .fn()
        .mockImplementationOnce((callback) => callback());

      const response = await request(app)
        .delete("http://localhost:3000/sessions/current")
        .set("Cookie", "connect.sid=s%3A_SESSION_ID")
        .send();

      expect(response.status).toBe(StatusCodes.NO_CONTENT);
    });

    it("should handle server errors during logout", async () => {
      passport.logout = jest
        .fn()
        .mockImplementationOnce((callback) =>
          callback(new Error("Logout error")),
        );

      const response = await request(app)
        .delete("http://localhost:3000/sessions/current")
        .set("Cookie", "connect.sid=s%3A_SESSION_ID")
        .send();

      expect(response.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(response.body.message).toBe(
        "An unexpected error occurred on the server",
      );
    });
  });
});
