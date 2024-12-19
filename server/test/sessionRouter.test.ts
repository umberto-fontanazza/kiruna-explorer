import dotenv from "dotenv";
import express from "express";
import { StatusCodes } from "http-status-codes";
import passport from "passport";
import request from "supertest";
import { User, UserRole } from "../src/model/user";
import { sessionRouter } from "../src/router/sessionRouter";

dotenv.config();

jest.mock("../src/database");

jest.mock("passport", () => {
  return {
    authenticate: jest.fn(),
    initialize: jest.fn(
      () =>
        (
          req: express.Request,
          res: express.Response,
          next: express.NextFunction,
        ) =>
          next(),
    ),
    session: jest.fn(
      () =>
        (
          req: express.Request,
          res: express.Response,
          next: express.NextFunction,
        ) =>
          next(),
    ),
  };
});
const mockPassportAuthenticate = passport.authenticate as jest.Mock;

function mockIsAuthenticatedMiddleware(isAuthenticated: boolean) {
  return (req: any, _res: any, next: any) => {
    req.isAuthenticated = () => isAuthenticated;
    req.login = (user: User, cb: (err?: any) => void) => {
      if (user.email === process.env.SESSION_ROUTER_ERROR_LOGIN) {
        cb(new Error("login error"));
      } else {
        cb();
      }
    };
    req.logout = (cb: (err?: any) => void) => {
      if (
        req.user &&
        req.user.email === process.env.SESSION_ROUTER_ERROR_LOGOUT
      ) {
        return cb(new Error("logout error"));
      }
      cb();
    };
    next();
  };
}

function createApp(isAuthenticated = false): express.Express {
  const app = express();
  app.use(express.json());

  app.use((req, _res, next) => {
    req.locals = {};
    next();
  });

  app.use(mockIsAuthenticatedMiddleware(isAuthenticated));

  if (isAuthenticated) {
    app.use((req: any, _res: any, next: any) => {
      req.user = new User(
        process.env.SESSION_ROUTER_LOGGED_IN || "default@test.com",
        "Logged",
        "In",
        UserRole.UrbanPlanner,
      );
      next();
    });
  }

  app.use("/sessions", sessionRouter);
  return app;
}

describe("sessionRouter", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /sessions", () => {
    it("should return 400 if request body is invalid", async () => {
      const app = createApp(false);
      const response = await request(app)
        .post("/sessions")
        .send({ email: process.env.SESSION_ROUTER_TEST_MAIL });
      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    });

    it("should return 401 if credentials are invalid", async () => {
      const app = createApp(false);
      mockPassportAuthenticate.mockImplementation(
        (_strategy: string, cb: Function) => {
          return (
            req: express.Request,
            res: express.Response,
            next: express.NextFunction,
          ) => {
            cb(null, false, { message: "Invalid credentials" });
          };
        },
      );

      const response = await request(app).post("/sessions").send({
        email: process.env.SESSION_ROUTER_TEST_MAIL,
        password: process.env.SESSION_ROUTER_WRONG_PASSWORD,
      });
      expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
      expect(response.body).toEqual({ message: "Invalid credentials" });
    });

    it("should return 201 if credentials are valid and user not logged in", async () => {
      const app = createApp(false);
      mockPassportAuthenticate.mockImplementation(
        (_strategy: string, cb: Function) => {
          return (
            req: express.Request,
            res: express.Response,
            next: express.NextFunction,
          ) => {
            const user = new User(
              process.env.SESSION_ROUTER_TEST_MAIL || "default@test.com",
              "Test",
              "User",
              UserRole.Resident,
            );
            cb(null, user, { message: "Logged in" });
          };
        },
      );

      const response = await request(app).post("/sessions").send({
        email: process.env.SESSION_ROUTER_TEST_MAIL,
        password: process.env.SESSION_ROUTER_CORRECT_PASSWORD,
      });
      expect(response.status).toBe(StatusCodes.CREATED);
      expect(response.body).toMatchObject({
        email: process.env.SESSION_ROUTER_TEST_MAIL,
        name: process.env.SESSION_ROUTER_NAME,
        surname: process.env.SESSION_ROUTER_SURNAME,
        role: process.env.SESSION_ROUTER_ROLE,
      });
    });

    it("should return 401 if user already logged in", async () => {
      const app = createApp(true);
      const response = await request(app).post("/sessions").send({
        email: process.env.SESSION_ROUTER_TEST_MAIL,
        password: process.env.SESSION_ROUTER_CORRECT_PASSWORD,
      });
      expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
      expect(response.body).toEqual({ error: "User is already logged in." });
    });

    it("should handle internal passport errors", async () => {
      const app = createApp(false);
      mockPassportAuthenticate.mockImplementation(
        (_strategy: string, cb: Function) => {
          return (
            _req: express.Request,
            _res: express.Response,
            _next: express.NextFunction,
          ) => {
            cb(new Error("Internal Error"), null, null);
          };
        },
      );

      const response = await request(app).post("/sessions").send({
        email: process.env.SESSION_ROUTER_TEST_MAIL,
        password: process.env.SESSION_ROUTER_PASSWORD,
      });
      expect(response.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
    });

    it("should handle errors in req.login callback", async () => {
      const app = createApp(false);
      mockPassportAuthenticate.mockImplementation(
        (_strategy: string, cb: Function) => {
          return (
            req: express.Request,
            res: express.Response,
            next: express.NextFunction,
          ) => {
            const user = new User(
              process.env.SESSION_ROUTER_ERROR_LOGIN || "defaultLogin@test.com",
              "Error",
              "User",
              UserRole.Developer,
            );
            cb(null, user, { message: "Logged in" });
          };
        },
      );

      const response = await request(app).post("/sessions").send({
        email: process.env.SESSION_ROUTER_ERROR_LOGIN,
        password: process.env.SESSION_ROUTER_PASSWORD,
      });
      expect(response.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
    });
  });

  describe("GET /sessions/current", () => {
    it("should return 401 if user is not logged in", async () => {
      const app = createApp(false);
      const response = await request(app).get("/sessions/current");
      expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
      expect(response.body).toEqual({ error: "User is not logged in." });
    });

    it("should return user info if user is logged in", async () => {
      const app = createApp(true);
      const response = await request(app).get("/sessions/current");
      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body).toMatchObject({
        email: process.env.SESSION_ROUTER_LOGGED_IN_EMAIL,
        name: process.env.SESSION_ROUTER_LOGGED_IN_NAME,
        surname: process.env.SESSION_ROUTER_LOGGED_IN_SURNAME,
        role: process.env.SESSION_ROUTER_LOGGED_IN_ROLE,
      });
    });
  });

  describe("DELETE /sessions/current", () => {
    it("should return 401 if user is not logged in", async () => {
      const app = createApp(false);
      const response = await request(app).delete("/sessions/current");
      expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
      expect(response.body).toEqual({ error: "User is not logged in." });
    });

    it("should return 204 if user is logged in and logout successful", async () => {
      const app = createApp(true);
      const response = await request(app).delete("/sessions/current");
      expect(response.status).toBe(StatusCodes.NO_CONTENT);
    });

    it("should return 500 if logout errors", async () => {
      const app = express();
      app.use(express.json());
      app.use((req, _res, next) => {
        req.locals = {};
        next();
      });
      app.use(mockIsAuthenticatedMiddleware(true));

      app.use((req: any, _res: any, next: any) => {
        req.user = new User(
          process.env.SESSION_ROUTER_ERROR_LOGOUT ||
            "defaultLoggedout@test.com",
          "Error",
          "Logout",
          UserRole.Developer,
        );
        next();
      });

      app.use("/sessions", sessionRouter);

      const response = await request(app).delete("/sessions/current");
      expect(response.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(response.body).toEqual({
        message: "An unexpected error occurred on the server",
      });
    });
  });
});
