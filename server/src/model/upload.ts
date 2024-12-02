import { strict as assert } from "assert";
import { QueryResult } from "pg";
import { Database } from "../database";

export enum UploadType {
  originalResource = "original_resource",
  attachment = "attachment",
}

export type UploadDbRow = {
  id: number;
  title: string;
  type: UploadType;
  file: Buffer;
};

export class Upload {
  id: number;
  title: string;
  type: UploadType;
  file?: Buffer;
  bindedDocumentIds?: number[];

  constructor(
    id: number,
    title: string,
    type: UploadType,
    file?: Buffer,
    bindedDocumentIds?: number[],
  ) {
    this.id = id;
    this.title = title;
    this.type = type;
    this.file = file;
    this.bindedDocumentIds = bindedDocumentIds;
  }

  static async insert(
    title: string,
    type: UploadType,
    file: Buffer,
    bindedDocumentIds: number[] = [],
  ): Promise<Upload> {
    const uploadId = await Database.withTransaction(async (client) => {
      const result = await client.query(
        "INSERT INTO upload(title, type, file) VALUES($1, $2, $3) RETURNING id;",
        [title, type, file],
      );
      const uploadId: number = result.rows[0].id;
      client.query(
        `UPDATE document SET upload_ids = array_append(upload_ids, $1) WHERE id = ANY($2::int[]);`,
        [uploadId, bindedDocumentIds],
      );
      return uploadId;
    });
    return new Upload(uploadId, title, type, file);
  }

  static async fromDocumentAll(
    documentId?: number,
    includeFile: boolean = false,
  ): Promise<Upload[]> {
    const joinSql = `JOIN document d ON u.id = ANY(d.upload_ids) 
      ${documentId ? "WHERE d.id = $1" : ""}`;
    const sql = `SELECT u.id, u.title, 
      u.type${includeFile ? ", file" : ""} 
      FROM upload u ${documentId ? joinSql : ""}`;
    const args = documentId ? [documentId] : [];
    const result = await Database.query(sql, args);
    return result.rows.map(
      ({ id, title, type, file }) => new Upload(id, title, type, file),
    );
  }

  async update(
    bindDocumentIds: number[] = [],
    decoupleDocumentIds: number[] = [],
  ): Promise<void> {
    const updateTitle = `UPDATE upload SET title = $1 WHERE id = $2`;
    const bind = `UPDATE document SET upload_ids = array_append(upload_ids, $1) WHERE id = ANY($2::int[])`;
    const decouple = `UPDATE document SET upload_ids = array_remove(upload_ids, $1) WHERE id = ANY($2::int[])`;
    await Promise.all([
      Database.query(updateTitle, [this.title, this.id]),
      Database.query(bind, [this.id, bindDocumentIds]),
      Database.query(decouple, [this.id, decoupleDocumentIds]),
    ]);
  }

  /**
   * @param bindDocuments when true checks for all documents binded to the upload
   * @param withFile when false only the upload metadata is retrieved
   */
  static async get(
    id: number,
    bindDocuments: boolean = false,
    withFile: boolean = true,
  ): Promise<Upload> {
    const sqlBindings = "SELECT id FROM document WHERE $1 = ANY(upload_ids)";
    const sqlUpload = `SELECT title, type${withFile ? ", file" : ""} FROM upload WHERE id = $1`;
    const [resultUpload, resultBindings] = await Promise.all([
      Database.query(sqlUpload, [id]),
      bindDocuments ? Database.query(sqlBindings, [id]) : Promise.resolve(),
    ]);

    // handle upload query
    assert(resultUpload.rowCount === 1);
    const { title, type } = resultUpload.rows[0];
    const file = withFile ? (resultUpload.rows[0].file as Buffer) : undefined;

    // handle optional document ids binding query
    assert(!bindDocuments || (resultBindings as QueryResult).rowCount === 1);
    const bindedDocumentIds: number[] | undefined = (
      resultBindings?.rows as { id: number }[]
    )?.map((obj) => obj.id);

    return new Upload(id, title, type, file, bindedDocumentIds);
  }

  static async delete(id: number): Promise<void> {
    const sqlUpdate = "DELETE FROM upload WHERE id = $1;";
    const sqlBindings = `UPDATE document SET upload_ids = array_remove(upload_ids, $1) 
      WHERE array_position(upload_ids, $1) IS NOT NULL;`;
    await Database.withTransaction(async (client) => {
      const result = await client.query(sqlUpdate, [id]);
      assert(result.rowCount === 1);
      await client.query(sqlBindings, [id]);
    });
  }

  toResponseBody = (omitId = false) => ({
    ...this,
    id: omitId ? undefined : this.id,
    file: this.file?.toString("base64"),
  });
}
