import express from "express";
import { StatusCodes } from "http-status-codes";
import request from "supertest";
import { Database } from "../src/database";
import { UserRole } from "../src/model/user";
import { linkRouter } from "../src/router/linkRouter";

jest.mock("../src/database");

const mockQuery = Database.query as jest.Mock;
const mockWithTransaction = Database.withTransaction as jest.Mock;

function mockIsAuthenticated(isAuthenticated: boolean, role?: UserRole) {
  return (req: any, _res: any, next: any) => {
    req.isAuthenticated = () => isAuthenticated;
    if (isAuthenticated && role) {
      req.user = { role };
    }
    next();
  };
}

function createApp(
  isAuthenticated: boolean = false,
  role?: UserRole,
): express.Express {
  const app = express();
  app.use(express.json());

  app.use((req, _res, next) => {
    req.locals = {};
    next();
  });

  app.use(mockIsAuthenticated(isAuthenticated, role));
  app.use("/documents/:id/links", linkRouter);
  return app;
}

describe("linkRouter", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /documents/:id/links", () => {
    it("should return 200 and the links array", async () => {
      const app = createApp();

      const linksFromDb = {
        links: {
          "2": ["direct", "update"],
          "3": ["collateral"],
        },
      };
      mockQuery.mockResolvedValueOnce({ rows: [linksFromDb] });

      const response = await request(app).get("/documents/1/links");

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body).toEqual([
        { targetDocumentId: 2, linkTypes: ["direct", "update"] },
        { targetDocumentId: 3, linkTypes: ["collateral"] },
      ]);
      expect(mockQuery).toHaveBeenCalledWith(
        "SELECT links FROM document WHERE id = $1",
        [1],
      );
    });

    it("should return 400 if id is not a positive number", async () => {
      const app = createApp();
      const response = await request(app).get("/documents/foo/links");
      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    });
  });

  describe("PUT /documents/:id/links", () => {
    it("should return 401 if user is not authenticated", async () => {
      const app = createApp(false);
      const response = await request(app)
        .put("/documents/1/links")
        .send({ targetDocumentId: 2, linkTypes: ["direct"] });
      expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
    });

    it("should return 403 if user is logged in but not a planner", async () => {
      const app = createApp(true, UserRole.Resident);
      const response = await request(app)
        .put("/documents/1/links")
        .send({ targetDocumentId: 2, linkTypes: ["direct"] });
      expect(response.status).toBe(StatusCodes.FORBIDDEN);
    });

    it("should return 400 if request body is invalid (missing fields)", async () => {
      const app = createApp(true, UserRole.UrbanPlanner);
      const response = await request(app)
        .put("/documents/1/links")
        .send({ linkTypes: ["direct"] });
      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    });

    it("should return 400 if trying to link a document to itself", async () => {
      const app = createApp(true, UserRole.UrbanPlanner);
      const response = await request(app)
        .put("/documents/1/links")
        .send({ targetDocumentId: 1, linkTypes: ["direct"] });
      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    });

    it("should return 201 and update the link if valid and user is planner", async () => {
      const app = createApp(true, UserRole.UrbanPlanner);

      mockWithTransaction.mockImplementation(async (fn: any) => {
        await fn({
          query: jest.fn().mockResolvedValue({ rowCount: 1 }),
        });
      });

      const response = await request(app)
        .put("/documents/1/links")
        .send({ targetDocumentId: 2, linkTypes: ["direct", "collateral"] });

      expect(response.status).toBe(StatusCodes.CREATED);
      expect(mockWithTransaction).toHaveBeenCalledTimes(1);
    });
  });

  describe("DELETE /documents/:id/links?targetDocumentId=", () => {
    it("should return 401 if user is not authenticated", async () => {
      const app = createApp(false);
      const response = await request(app).delete(
        "/documents/1/links?targetDocumentId=2",
      );
      expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
    });

    it("should return 403 if user is logged in but not a planner", async () => {
      const app = createApp(true, UserRole.Resident);
      const response = await request(app).delete(
        "/documents/1/links?targetDocumentId=2",
      );
      expect(response.status).toBe(StatusCodes.FORBIDDEN);
    });

    it("should return 400 if targetDocumentId query param is missing", async () => {
      const app = createApp(true, UserRole.UrbanPlanner);
      const response = await request(app).delete("/documents/1/links");
      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    });

    it("should return 204 and delete the link if valid and user is planner", async () => {
      const app = createApp(true, UserRole.UrbanPlanner);

      mockWithTransaction.mockImplementation(async (fn: any) => {
        await fn({
          query: jest.fn().mockResolvedValue({ rowCount: 1 }),
        });
      });

      const response = await request(app).delete(
        "/documents/1/links?targetDocumentId=2",
      );
      expect(response.status).toBe(StatusCodes.NO_CONTENT);
      expect(mockWithTransaction).toHaveBeenCalledTimes(1);
    });
  });
});
