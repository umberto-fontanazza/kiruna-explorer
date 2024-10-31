import { strict as assert } from "assert";
import { Document } from "../src/model/document";
import { Database } from "../src/database";
import { DocumentNotFound } from "../src/error/documentError";

describe("Document", () => {
  const mockDb = {
    query: async (sql: string, params: any) => {
      if (sql.startsWith("INSERT")) {
        return { rows: [{ id: 1 }] };
      } else if (sql.startsWith("SELECT")) {
        if (params[0] === 1) {
          return {
            rows: [
              { id: 1, title: "Test Title", description: "Test Description" },
            ],
          };
        } else {
          return { rows: [] };
        }
      } else if (sql.startsWith("UPDATE")) {
        return { rowCount: 1 };
      } else if (sql.startsWith("DELETE")) {
        if (params[0] === 1) {
          return { rowCount: 1 };
        } else {
          return { rowCount: 0 };
        }
      }
      return { rows: [] };
    },
  };

  beforeEach(() => {
    (Database as any).query = mockDb.query;
  });

  afterEach(() => {
    (Database as any).query = jest.fn();
  });

  describe("insert", () => {
    it("should insert a new document and return it", async () => {
      const doc = await Document.insert("New Title", "New Description");
      assert.equal(doc.id, 1);
      assert.equal(doc.title, "New Title");
      assert.equal(doc.description, "New Description");
    });
  });

  describe("get", () => {
    it("should retrieve a document by id", async () => {
      const doc = await Document.get(1);
      assert.equal(doc.id, 1);
      assert.equal(doc.title, "Test Title");
      assert.equal(doc.description, "Test Description");
    });

    it("should throw an error if document is not found", async () => {
      await assert.rejects(() => Document.get(2), {
        name: "AssertionError",
      });
    });
  });

  describe("update", () => {
    it("should update the document successfully", async () => {
      const doc = new Document(1, "Updated Title", "Updated Description");
      await doc.update();
      assert.equal(doc.title, "Updated Title");
    });

    it("should throw an error if the update fails", async () => {
      const doc = new Document(999, "Updated Title", "Updated Description");
      await assert.rejects(() => doc.update(), {
        message: "Failed db update",
      });
    });
  });

  describe("delete", () => {
    it("should delete the document successfully", async () => {
      await Document.delete(1);
    });

    it("should throw an error if the document to delete does not exist", async () => {
      await assert.rejects(() => Document.delete(999), {
        instanceOf: DocumentNotFound,
        message: "DELETE query affected rows were less than 1",
      });
    });
  });

  describe("all", () => {
    it("should retrieve all documents", async () => {
      const docs = await Document.all();
      assert.equal(docs.length, 1);
      assert.equal(docs[0].id, 1);
    });
  });
});
