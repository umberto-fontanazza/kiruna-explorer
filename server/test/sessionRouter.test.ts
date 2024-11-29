import * as dotenv from "dotenv";
import { StatusCodes } from "http-status-codes";
import passport from "passport";
import request from "supertest";
import app from "../src/app";
import { User } from "../src/model/user";

dotenv.config();

jest.mock("../src/model/user", () => {
  const UserRole = {
    Developer: "Developer",
    Resident: "Resident",
    UrbanPlanner: "UrbanPlanner",
  };
  return {
    User: {
      login: jest.fn(),
      getByEmail: jest.fn(),
      Role: UserRole,
    },
    UserRole,
  };
});

let plannerCookie: string;

describe("sessionRouter", () => {
  const mockUser = {
    email: process.env.SESSION_EMAIL,
    role: process.env.TEST_ROLE,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /sessions", () => {
    it("should successfully authenticate and log in a user", async () => {
      (User.login as jest.Mock).mockResolvedValue(mockUser);

      const body = {
        email: process.env.SESSION_EMAIL,
        password: process.env.SESSION_PASSWORD,
      };

      const response = await request(app).post("/sessions").send(body);

      plannerCookie = response.headers["set-cookie"];

      expect(response.status).toBe(StatusCodes.CREATED);
      expect(response.body).toEqual(mockUser);
    });

    it("should return UNAUTHORIZED if authentication fails", async () => {
      (User.login as jest.Mock).mockResolvedValue(null);

      const body = {
        email: process.env.SESSION_EMAIL,
        password: process.env.SESSION_PASSWORD + "wrong",
      };

      const response = await request(app).post("/sessions").send(body);

      expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
      expect(response.body.message).toBe("Username and/or wrong password");
    });
  });

  describe("GET /sessions/current", () => {
    it("should return the current logged-in user", async () => {
      (User.getByEmail as jest.Mock).mockResolvedValue(mockUser);

      const response = await request(app)
        .get("/sessions/current")
        .set("Cookie", plannerCookie);

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body).toEqual(mockUser);
    });

    it("should return UNAUTHORIZED if user is not logged in", async () => {
      const response = await request(app).get("/sessions/current");

      expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
      expect(response.body.error).toBe("User is not logged in.");
    });

    it("should handle server errors during session retrieval", async () => {
      (User.getByEmail as jest.Mock).mockRejectedValue(
        new Error("Database error"),
      );

      const response = await request(app)
        .get("/sessions/current")
        .set("Cookie", plannerCookie);

      expect(response.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(response.body.message).toBe(
        "An unexpected error occurred on the server",
      );
    });
  });

  describe("DELETE /sessions/current", () => {
    it("should return UNAUTHORIZED if user is not logged in", async () => {
      const response = await request(app).delete("/sessions/current");

      expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
      expect(response.body.error).toBe("User is not logged in.");
    });

    it("should handle server errors during logout", async () => {
      const logoutMock = jest
        .spyOn(passport, "authenticate")
        .mockImplementation(() => {
          throw new Error("Logout failed");
        });

      const response = await request(app)
        .delete("/sessions/current")
        .set("Cookie", plannerCookie);

      expect(response.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(response.body.message).toBe(
        "An unexpected error occurred on the server",
      );

      logoutMock.mockRestore();
    });
  });
});
