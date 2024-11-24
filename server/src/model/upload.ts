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
  ): Promise<Upload> {
    const result = await Database.query(
      "INSERT INTO uploads(title, type, file) VALUES($1, $2, $3) RETURNING id;",
      [title, type, file],
    );
    const uploadId: number = result.rows[0].id;
    return new Upload(uploadId, title, type, file);
  }
}
