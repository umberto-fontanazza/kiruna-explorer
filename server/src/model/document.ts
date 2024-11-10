import { strict as assert } from "assert";
import { Database } from "../database";
import { DocumentNotFound } from "../error/documentError";
import { Coordinates } from "../validation/documentSchema";
import { Scale, ScaleType, ScaleRow } from "./scale";
import dayjs, { Dayjs } from "dayjs";

type DocumentDbRow = {
  id: number;
  title: string;
  description: string;
  type: DocumentType;
  scale_type: ScaleType;
  scale_ratio: number;
  stakeholders: Stakeholder[];
  coordinates: Coordinates;
  issuanceDate: Date;
};

export enum Stakeholder {
  KirunaKommun = "kiruna_kommun",
  Lkab = "lkab",
  Residents = "residents",
  WhiteArkitekter = "white_arkitekter",
}

export enum DocumentType {
  Design = "design",
  Informative = "informative",
  MaterialEffect = "material_effect",
  Prescriptive = "prescriptive",
  Technical = "technical",
}

export class Document {
  id: number;
  title: string;
  description: string;
  type: DocumentType;
  scale: Scale;
  stakeholders?: Stakeholder[];
  coordinates?: Coordinates;
  issuanceDate?: Dayjs;

  constructor(
    id: number,
    title: string,
    description: string,
    type: DocumentType,
    scale: Scale,
    stakeholders: Stakeholder[] | undefined = undefined,
    coordinates: Coordinates | undefined = undefined,
    issuanceDate: Dayjs | undefined = undefined,
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.type = type;
    this.scale = scale;
    this.stakeholders = stakeholders;
    this.coordinates = coordinates;
    this.issuanceDate = issuanceDate;
  }

  private static fromDatabaseRow(dbRow: DocumentDbRow): Document {
    const {
      id,
      title,
      description,
      type,
      scale_type,
      scale_ratio,
      stakeholders,
      coordinates,
      issuanceDate,
    } = dbRow;
    assert(typeof title === "string");
    assert(typeof description === "string");
    assert(typeof type === "string");
    assert(typeof scale_type === "string");
    assert(!issuanceDate || issuanceDate instanceof Date);

    const scale: Scale = Scale.fromDatabaseRow({
      scale_type,
      scale_ratio,
    } as ScaleRow);

    return new Document(
      id,
      title,
      description,
      type,
      scale,
      stakeholders || undefined,
      coordinates || undefined,
      dayjs(issuanceDate) || undefined,
    );
  }

  async update(): Promise<void> {
    const sql = `UPDATE document SET 
    title = $1, description = $2, type = $3, scale_type = $4, 
    scale_ratio = $5, stakeholders = $6, coordinates = ST_Point($7, $8)::geography, 
    issuance_date = $9 WHERE id = $10`;
    const scaleRow: ScaleRow = this.scale.intoDatabaseRow();
    const result = await Database.query(sql, [
      this.title,
      this.description,
      this.type,
      scaleRow.scale_type,
      scaleRow.scale_ratio,
      this.stakeholders || null,
      this.coordinates?.longitude || null, // BEWARE ORDERING: https://stackoverflow.com/questions/7309121/preferred-order-of-writing-latitude-longitude-tuples-in-gis-services#:~:text=PostGIS%20expects%20lng/lat.
      this.coordinates?.latitude || null,
      this.issuanceDate?.toDate() || null,
      this.id,
    ]);
    if (result.rowCount != 1) throw new Error("Failed db update");
  }

  static async insert(
    title: string,
    description: string,
    type: DocumentType,
    scale: Scale,
    stakeholders: Stakeholder[] | undefined = undefined,
    coordinates: Coordinates | undefined = undefined,
    issuance_date: Dayjs | undefined = undefined,
  ): Promise<Document> {
    const scaleRow: ScaleRow = scale.intoDatabaseRow();
    const result = await Database.query(
      "INSERT INTO document(title, description, type, scale_type, scale_ratio, stakeholders, coordinates, issuance_date) VALUES($1, $2, $3, $4, $5, $6, ST_Point($7, $8)::geography, $9) RETURNING id;",
      [
        title,
        description,
        type,
        scaleRow.scale_type,
        scaleRow.scale_ratio || null,
        stakeholders || null,
        coordinates?.longitude || null,
        coordinates?.latitude || null,
        issuance_date?.toDate() || null,
      ],
    );
    const documentId: number = result.rows[0].id;
    return new Document(documentId, title, description, type, scale);
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
    if (result.rowCount != 1) {
      throw new DocumentNotFound();
    }
    const documentRow = result.rows[0];
    return Document.fromDatabaseRow(documentRow);
  }
}
