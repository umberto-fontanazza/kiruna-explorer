import { strict as assert } from "assert";
import { Database } from "../database";

export enum UploadType {
  originalResource = "original_resource",
  attachment = "attachment",
}

type UploadDbRow = {
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

  constructor(id: number, title: string, type: UploadType, file?: Buffer) {
    this.id = id;
    this.title = title;
    this.type = type;
    this.file = file;
  }

  static async insert(
    title: string,
    type: UploadType,
    file: Buffer,
    bindedDocumentIds: number[],
  ): Promise<Upload> {
    assert(bindedDocumentIds.length >= 1);
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
}
