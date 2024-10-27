import { Database } from "../database";

export class Document {
  id: number;
  title: string;
  description: string;

  constructor(id: number, title: string, description: string) {
    this.id = id;
    this.title = title;
    this.description = description;
  }

  static async insert(title: string, description: string): Promise<Document> {
    const result = await Database.query(
      "INSERT INTO document(title, description) VALUES($1, $2) RETURNING id;",
      [title, description],
    );
    const documentId: number = result.rows[0].id;
    return new Document(documentId, title, description);
  }
}
