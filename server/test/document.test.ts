import { strict as assert } from "assert";
import dayjs from "dayjs";
import { Database } from "../src/database";
import { DocumentNotFound } from "../src/error/documentError";
import { Document, DocumentType, Stakeholder } from "../src/model/document";
import { Scale, ScaleType } from "../src/model/scale";

jest.mock("../src/database");

describe("Document", () => {
  const mockDb = {
    query: jest.fn(),
  };

  beforeEach(() => {
    (Database as any).query = mockDb.query;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("insert", () => {
    it("should insert a new document and return it", async () => {
      const scale = new Scale(ScaleType.Ratio, 1);
      mockDb.query.mockResolvedValueOnce({
        rows: [{ id: 1 }],
      });

      const doc = await Document.insert(
        "Test Title",
        "Test Description",
        DocumentType.Design,
        scale,
        [Stakeholder.KirunaKommun],
        { latitude: 58.5, longitude: 15.5 },
        dayjs("2024-01-01"),
      );

      assert.equal(doc.id, 1);
      assert.equal(doc.title, "Test Title");
      assert.equal(doc.description, "Test Description");
    });
  });

  describe("get", () => {
    it("should retrieve a document by id", async () => {
      const mockRow = {
        id: 1,
        title: "Test Title",
        description: "Test Description",
        type: "design",
        scale_type: "ratio",
        scale_ratio: 1,
        stakeholders: [Stakeholder.KirunaKommun],
        coordinates: { latitude: 58.5, longitude: 15.5 },
        issuance_date: new Date(),
        links: {},
      };

      mockDb.query.mockResolvedValueOnce({
        rowCount: 1,
        rows: [mockRow],
      });

      const doc = await Document.get(1);
      assert.equal(doc.id, 1);
      assert.equal(doc.title, "Test Title");
      assert.equal(doc.description, "Test Description");
    });
  });

  describe("update", () => {
    it("should update the document successfully", async () => {
      const scale = new Scale(ScaleType.Ratio, 1);
      const doc = new Document(
        1,
        "Updated Title",
        "Updated Description",
        DocumentType.Design,
        scale,
      );

      mockDb.query.mockResolvedValueOnce({ rowCount: 1 });

      await doc.update();
      assert.equal(doc.title, "Updated Title");
      assert.equal(doc.description, "Updated Description");
    });

    it("should throw an error if the update fails", async () => {
      const scale = new Scale(ScaleType.Ratio, 1);
      const doc = new Document(
        999,
        "Updated Title",
        "Updated Description",
        DocumentType.Design,
        scale,
      );

      mockDb.query.mockResolvedValueOnce({ rowCount: 0 });

      await assert.rejects(
        async () => {
          await doc.update();
        },
        (err) => err instanceof Error && err.message === "Failed db update",
      );
    });
  });

  describe("delete", () => {
    it("should delete the document successfully", async () => {
      mockDb.query.mockResolvedValueOnce({ rowCount: 1 });

      await Document.delete(1);
      expect(mockDb.query).toHaveBeenCalledWith(
        "DELETE FROM document WHERE id = $1",
        [1],
      );
    });

    it("should throw an error if the document to delete does not exist", async () => {
      mockDb.query.mockResolvedValueOnce({ rowCount: 0 });

      await assert.rejects(
        async () => {
          await Document.delete(999);
        },
        (err) =>
          err instanceof DocumentNotFound &&
          err.message === "DELETE query affected rows were less than 1",
      );
    });
  });

  describe("all", () => {
    it("should retrieve all documents", async () => {
      const mockRows = [
        {
          id: 1,
          title: "Test Title",
          description: "Test Description",
          type: "design",
          scale_type: "ratio",
          scale_ratio: 1,
          stakeholders: [Stakeholder.KirunaKommun],
          coordinates: { latitude: 58.5, longitude: 15.5 },
          issuance_date: new Date(),
          links: {},
        },
      ];

      mockDb.query.mockResolvedValueOnce({
        rows: mockRows,
      });

      const docs = await Document.all();
      assert.equal(docs.length, 1);
      assert.equal(docs[0].id, 1);
      assert.equal(docs[0].title, "Test Title");
    });
  });

  describe("toResponseBody", () => {
    it("should convert the document to the response body format", () => {
      const scale = new Scale(ScaleType.Ratio, 1);
      const doc = new Document(
        1,
        "Test Title",
        "Test Description",
        DocumentType.Design,
        scale,
        [Stakeholder.KirunaKommun],
        { latitude: 58.5, longitude: 15.5 },
        dayjs("2024-01-01"),
      );

      const responseBody = doc.toResponseBody();
      assert.equal(responseBody.title, "Test Title");
      assert.equal(responseBody.issuanceDate, "2024-01-01");
    });
  });
});
