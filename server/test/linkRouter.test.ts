import request from "supertest";
import app from "../src/app";
import { Link } from "../src/model/link";
import { StatusCodes } from "http-status-codes";

jest.mock("../model/link", () => ({
  Link: {
    fromDocumentAll: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

describe("linkRouter", () => {
  const sourceDocumentId = 1;
  const targetDocumentId = 2;

  describe("GET /", () => {
    it("should return links for the given document", async () => {
      const mockLinks = [
        { sourceDocumentId, targetDocumentId, linkTypes: ["type1"] },
        { sourceDocumentId, targetDocumentId: 3, linkTypes: ["type2"] },
      ];
      (Link.fromDocumentAll as jest.Mock).mockResolvedValue(mockLinks);

      const response = await request(app).get(
        `http://localhost:3000/links/${sourceDocumentId}`,
      );

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body).toEqual(mockLinks);
      expect(Link.fromDocumentAll).toHaveBeenCalledWith(sourceDocumentId);
    });

    it("should return an empty array if no links found", async () => {
      (Link.fromDocumentAll as jest.Mock).mockResolvedValue([]);

      const response = await request(app).get(
        `http://localhost:3000/links/${sourceDocumentId}`,
      );

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body).toEqual([]);
    });

    it("should handle errors when retrieving links", async () => {
      (Link.fromDocumentAll as jest.Mock).mockRejectedValue(
        new Error("Database error"),
      );

      const response = await request(app).get(
        `http://localhost:3000/links/${sourceDocumentId}`,
      );

      expect(response.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(response.body.message).toBe(
        "An unexpected error occurred on the server",
      );
    });
  });

  describe("PUT /", () => {
    it("should update a link successfully", async () => {
      const body = {
        targetDocumentId: targetDocumentId,
        linkTypes: ["type1"],
      };
      const linkInstance = {
        update: jest.fn(),
      };
      (Link.prototype.update as jest.Mock).mockResolvedValue(linkInstance);

      const response = await request(app)
        .put(`http://localhost:3000/links/${sourceDocumentId}`)
        .send(body);

      expect(response.status).toBe(StatusCodes.CREATED);
      expect(Link.prototype.update).toHaveBeenCalled();
    });

    it("should handle errors during link update", async () => {
      const body = {
        targetDocumentId: targetDocumentId,
        linkTypes: ["type1"],
      };
      (Link.prototype.update as jest.Mock).mockRejectedValue(
        new Error("Update error"),
      );

      const response = await request(app)
        .put(`http://localhost:3000/links/${sourceDocumentId}`)
        .send(body);

      expect(response.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(response.body.message).toBe(
        "An unexpected error occurred on the server",
      );
    });
  });

  describe("DELETE /", () => {
    it("should delete a link successfully", async () => {
      const linkDeleteMock = jest.fn().mockResolvedValue(undefined);
      (Link.delete as jest.Mock).mockResolvedValue(linkDeleteMock);

      const response = await request(app)
        .delete(`http://localhost:3000/links/${sourceDocumentId}`)
        .query({ targetId: targetDocumentId });

      expect(response.status).toBe(StatusCodes.NO_CONTENT);
      expect(Link.delete).toHaveBeenCalledWith(
        sourceDocumentId,
        targetDocumentId,
      );
    });

    it("should handle errors during link deletion", async () => {
      (Link.delete as jest.Mock).mockRejectedValue(new Error("Deletion error"));

      const response = await request(app)
        .delete(`http://localhost:3000/links/${sourceDocumentId}`)
        .query({ targetId: targetDocumentId });

      expect(response.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(response.body.message).toBe(
        "An unexpected error occurred on the server",
      );
    });
  });
});
