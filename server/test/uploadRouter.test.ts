import { StatusCodes } from "http-status-codes";
import request from "supertest";
import app from "../src/app";

describe("Upload bad requests", () => {
  test("File=include without a documentId is a BAD_REQUEST", async () => {
    const response = await request(app).get("/uploads/?file=include");
    expect(response.status).toStrictEqual(StatusCodes.BAD_REQUEST);
  });
});
