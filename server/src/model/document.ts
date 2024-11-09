import { strict as assert } from "assert";
import { Database } from "../database";
import { DocumentNotFound } from "../error/documentError";
import { Coordinates } from "../validation/documentSchema";

type DocumentDbRow = {
  id: number;
  title: string;
  description: string;
  coordinates: Coordinates;
  scale: Scale;
  type: DocumentType;
  language: string;
};

export enum Stakeholder {
  LKAB = "LKAB",
  Municipality = "MUNICIPALITY",
  RegionalAuthority = "REGIONAL AUTHORITY",
  ArchitectureFirms = "ARCHITECTURE FIRMS",
  Citizens = "CITIZENS",
  Others = "OTHERS",
}

// TODO: temp scale. RATEO is now a string
export enum Scale {
  BlueprintsOrEffect = "BLUEPRINTS/EFFECT",
  Text = "TEXT",
  Rateo = "RATEO",
}

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
  scale: Scale;
  type: DocumentType;
  language: string;

  constructor(
    id: number,
    title: string,
    description: string,
    coordinates: Coordinates,
    scale: Scale,
    type: DocumentType,
    language: string,
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.coordinates = coordinates;
    this.scale = scale;
    this.type = type;
    this.language = language;
  }

  private static fromDatabaseRow(dbRow: DocumentDbRow): Document {
    const { id, title, description, coordinates, scale, type, language } =
      dbRow;
    assert(typeof id === "number");
    assert(typeof title === "string");
    assert(typeof description === "string");
    assert(typeof scale === "string");
    assert(typeof type === "string");
    assert(typeof language === "string");
    // TODO: array asserts are missing

    return new Document(
      id,
      title,
      description,
      coordinates,
      scale,
      type,
      language,
    );
  }

  async update(): Promise<void> {
    const sql =
      "UPDATE document SET title = $1, description = $2, coordinates = ST_Point($3, $4)::geography, type = $5 WHERE id = $6";
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
    scale: Scale,
    type: DocumentType,
    language: string,
  ): Promise<Document> {
    const result = await Database.query(
      "INSERT INTO document(title, description, coordinates, scale, type, language) VALUES($1, $2, ST_Point($3, $4)::geography, $5, $6, $7) RETURNING id;",
      [
        title,
        description,
        coordinates.longitude,
        coordinates.latitude,
        scale,
        type,
        language,
      ],
    );
    const documentId: number = result.rows[0].id;
    return new Document(
      documentId,
      title,
      description,
      coordinates,
      scale,
      type,
      language,
    );
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
    const result = await Database.query(
      `SELECT *,
      json_build_object(
        'latitude', ST_Y(coordinates::geometry), 
        'longitude', ST_X(coordinates::geometry))
        AS coordinates
      FROM document;`,
    );
    return result.rows.map((row) => Document.fromDatabaseRow(row));
  }

  static async get(id: number): Promise<Document> {
    const result = await Database.query(
      `SELECT *, 
      json_build_object(
        'latitude', ST_Y(coordinates::geometry), 
        'longitude', ST_X(coordinates::geometry)) 
        AS coordinates
      FROM document WHERE id = $1`,
      [id],
    );
    const documentRow = result.rows[0];

    return Document.fromDatabaseRow(documentRow);
  }
}
