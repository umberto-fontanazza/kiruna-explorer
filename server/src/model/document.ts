import { strict as assert } from "assert";
import { Database } from "../database";
import { DocumentNotFound } from "../error/documentError";
import { Coordinates } from "../validation/documentSchema";

type DocumentDbRow = {
  id: number;
  title: string;
  description: string;
  coordinates: Coordinates;
  type: DocumentType;
};

export enum DocumentType {
  Informative = "INFORMATIVE",
  Prescriptive = "PRESCRIPTIVE",
  Design = "DESIGN",
  Technical = "TECHNICAL",
  Material = "MATERIAL",
  Others = "OTHERS",
}

export class Document {
  id: number;
  title: string;
  description: string;
  coordinates: Coordinates;
  type: DocumentType;

  constructor(
    id: number,
    title: string,
    description: string,
    coordinates: Coordinates,
    type: DocumentType,
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.coordinates = coordinates;
    this.type = type;
  }

  private static fromDatabaseRow(dbRow: DocumentDbRow): Document {
    const { id, title, description, coordinates, type } = dbRow;
    assert(typeof id === "number");
    assert(typeof title === "string");
    assert(typeof description === "string");
    assert(typeof type === "string");
    return new Document(id, title, description, coordinates, type);
  }

  async update(): Promise<void> {
    const sql =
      "UPDATE document SET title = $1, description = $2, coordinates = ST_Point($3, $4)::geography, type = $5 WHERE id = $56";
    const result = await Database.query(sql, [
      this.title,
      this.description,
      this.coordinates.longitude, // BEWARE ORDERING: https://stackoverflow.com/questions/7309121/preferred-order-of-writing-latitude-longitude-tuples-in-gis-services#:~:text=PostGIS%20expects%20lng/lat.
      this.coordinates.latitude,
      this.type,
      this.id,
    ]);
    if (result.rowCount != 1) throw new Error("Failed db update");
  }

  static async insert(
    title: string,
    description: string,
    coordinates: Coordinates,
    type: DocumentType,
  ): Promise<Document> {
    const result = await Database.query(
      "INSERT INTO document(title, description, coordinates, type) VALUES($1, $2, ST_Point($3, $4)::geography, $5) RETURNING id;",
      [title, description, coordinates.longitude, coordinates.latitude, type],
    );
    const documentId: number = result.rows[0].id;
    return new Document(documentId, title, description, coordinates, type);
  }

  static async delete(id: number): Promise<void> {
    const result = await Database.query("DELETE FROM document WHERE id = $1", [
      id,
    ]);
    const affectedRows: number = result.rowCount || 0;
    if (affectedRows < 1)
      throw new DocumentNotFound("DELETE query affected rows were less than 1");
  }

  static async all(): Promise<Document[]> {
    const result = await Database.query("SELECT * FROM document");
    return result.rows.map((row) => Document.fromDatabaseRow(row));
  }

  static async get(id: number): Promise<Document> {
    const result = await Database.query(
      `SELECT id, title, description, 
      json_build_object(
        'latitude', ST_Y(coordinates::geometry), 
        'longitude', ST_X(coordinates::geometry)) 
        AS coordinates ,
      type
      FROM document WHERE id = $1`,
      [id],
    );
    const documentRow = result.rows[0];
    return Document.fromDatabaseRow(documentRow);
  }
}
