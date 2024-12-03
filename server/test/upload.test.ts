import { PoolClient } from "pg";
import { Database } from "../src/database";
import { Upload, UploadType } from "../src/model/upload";

jest.mock("../src/database");

describe("Upload class", () => {
  const mockQuery = jest.fn();
  const mockClient: Partial<PoolClient> = {
    query: mockQuery,
    release: jest.fn(),
    connect: jest.fn(),
  };

  const mockWithTransaction: <T>(
    action: (client: PoolClient) => Promise<T>,
  ) => Promise<T> = jest.fn(
    async <T>(action: (client: PoolClient) => Promise<T>): Promise<T> => {
      return await action(mockClient as PoolClient);
    },
  );

  beforeEach(() => {
    jest.clearAllMocks();
    Database.query = mockQuery;
    Database.withTransaction = mockWithTransaction;
  });

  it("should insert a new upload and bind to documents", async () => {
    const title = "New Upload";
    const type = UploadType.attachment;
    const file = Buffer.from("Test File");
    const bindedDocumentIds = [1, 2];

    mockQuery.mockResolvedValueOnce({
      rows: [{ id: 1 }],
      rowCount: 1,
      command: "INSERT",
      oid: 0,
      fields: [],
    });

    mockQuery.mockResolvedValueOnce({
      rows: [],
      rowCount: 0,
      command: "UPDATE",
      oid: 0,
      fields: [],
    });

    const result = await Upload.insert(title, type, file, bindedDocumentIds);

    expect(mockWithTransaction).toHaveBeenCalledTimes(1);
    expect(mockQuery).toHaveBeenCalledWith(
      "INSERT INTO upload(title, type, file) VALUES($1, $2, $3) RETURNING id;",
      [title, type, file],
    );
    expect(mockQuery).toHaveBeenCalledWith(
      "UPDATE document SET upload_ids = array_append(upload_ids, $1) WHERE id = ANY($2::int[]);",
      [1, bindedDocumentIds],
    );

    expect(result).toBeInstanceOf(Upload);
    expect(result.id).toBe(1);
    expect(result.title).toBe(title);
    expect(result.type).toBe(type);
    expect(result.file).toBe(file);
  });

  it("should retrieve all uploads for a document", async () => {
    const documentId = 1;
    const includeFile = true;

    const mockRows = [
      {
        id: 1,
        title: "Upload 1",
        type: UploadType.originalResource,
        file: Buffer.from("File 1"),
      },
      {
        id: 2,
        title: "Upload 2",
        type: UploadType.attachment,
        file: Buffer.from("File 2"),
      },
    ];

    mockQuery.mockResolvedValueOnce({
      rows: mockRows,
      rowCount: mockRows.length,
      command: "SELECT",
      oid: 0,
      fields: [],
    });

    const uploads = await Upload.fromDocumentAll(documentId, includeFile);

    expect(uploads).toHaveLength(2);
    expect(uploads[0]).toBeInstanceOf(Upload);
    expect(uploads[0].id).toBe(1);
    expect(uploads[0].file).toEqual(Buffer.from("File 1"));
  });

  it("should update upload and document bindings", async () => {
    const upload = new Upload(
      1,
      "Updated Title",
      UploadType.attachment,
      Buffer.from("File 1"),
    );
    const bindDocumentIds = [2, 3];
    const decoupleDocumentIds = [4];

    mockQuery.mockResolvedValue({
      rows: [],
      rowCount: 0,
      command: "UPDATE",
      oid: 0,
      fields: [],
    });

    await upload.update(bindDocumentIds, decoupleDocumentIds);

    expect(mockQuery).toHaveBeenCalledWith(
      "UPDATE upload SET title = $1 WHERE id = $2",
      [upload.title, upload.id],
    );
    expect(mockQuery).toHaveBeenCalledWith(
      "UPDATE document SET upload_ids = array_append(upload_ids, $1) WHERE id = ANY($2::int[])",
      [upload.id, bindDocumentIds],
    );
    expect(mockQuery).toHaveBeenCalledWith(
      "UPDATE document SET upload_ids = array_remove(upload_ids, $1) WHERE id = ANY($2::int[])",
      [upload.id, decoupleDocumentIds],
    );
  });

  it("should delete an upload and remove document bindings", async () => {
    const uploadId = 1;

    mockQuery.mockResolvedValueOnce({
      rows: [],
      rowCount: 1,
      command: "DELETE",
      oid: 0,
      fields: [],
    });

    mockQuery.mockResolvedValueOnce({
      rows: [],
      rowCount: 0,
      command: "UPDATE",
      oid: 0,
      fields: [],
    });

    await Upload.delete(uploadId);

    expect(mockWithTransaction).toHaveBeenCalledTimes(1);
    expect(mockQuery).toHaveBeenCalledWith(
      "DELETE FROM upload WHERE id = $1;",
      [uploadId],
    );
    expect(mockQuery).toHaveBeenCalledWith(
      `
      UPDATE document SET upload_ids = array_remove(upload_ids, $1) 
      WHERE array_position(upload_ids, $1) IS NOT NULL;
      `.trim(),
      [uploadId],
    );
  });

  it("should retrieve a single upload by ID", async () => {
    const uploadId = 1;
    const bindDocuments = true;
    const withFile = true;

    mockQuery.mockResolvedValueOnce({
      rows: [
        {
          title: "Upload 1",
          type: UploadType.originalResource,
          file: Buffer.from("File 1"),
        },
      ],
      rowCount: 1,
      command: "SELECT",
      oid: 0,
      fields: [],
    });

    mockQuery.mockResolvedValueOnce({
      rows: [{ id: 2 }, { id: 3 }],
      rowCount: 2,
      command: "SELECT",
      oid: 0,
      fields: [],
    });

    const upload = await Upload.get(uploadId, bindDocuments, withFile);

    expect(mockQuery).toHaveBeenCalledWith(
      "SELECT title, type, file FROM upload WHERE id = $1",
      [uploadId],
    );
    expect(mockQuery).toHaveBeenCalledWith(
      "SELECT id FROM document WHERE $1 = ANY(upload_ids)",
      [uploadId],
    );

    expect(upload).toBeInstanceOf(Upload);
    expect(upload.id).toBe(uploadId);
    expect(upload.title).toBe("Upload 1");
    expect(upload.bindedDocumentIds).toEqual([2, 3]);
  });
});
