import { Database } from "../database";
import { DocumentNotFound } from "../error/documentError";

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

  static async delete(id: number): Promise<void> {
    const result = await Database.query("DELETE FROM document WHERE id = $1", [
      id,
    ]);
    const affectedRows: number = result.rowCount || 0;
    if (affectedRows < 1)
      throw new DocumentNotFound("DELETE query affected rows were less than 1");
  }
}
