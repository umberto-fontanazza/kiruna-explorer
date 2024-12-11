import { strict as assert } from "assert";
import dayjs, { Dayjs } from "dayjs";
import { Database } from "../database";
import { DocumentNotFound } from "../error/documentError";
import { Coordinates } from "../validation/coordinatesSchema";
import { timeFormatter } from "../validation/timeParser";
import { Area } from "./area";
import { Link, LinkResponseBody, LinkType } from "./link";
import { Scale, ScaleRow, ScaleType } from "./scale";
import { Stakeholder } from "./stakeholder";

type DocumentDbRow = {
  id: number;
  title: string;
  description: string;
  type: DocumentType;
  scale_type: ScaleType;
  scale_ratio: number;
  stakeholders: Stakeholder[];
  coordinates: Coordinates;
  area_id: number | null;
  issuance_time: [Date, Date];
  links: Record<string, LinkType[]>;
};

export enum DocumentType {
  Design = "design",
  Informative = "informative",
  MaterialEffect = "material_effect",
  Prescriptive = "prescriptive",
  Technical = "technical",
}

const buildSqlWhere = (
  type?: DocumentType,
  scaleType?: ScaleType,
  maxIssuanceDate?: Date,
  minIssuanceDate?: Date,
  wildcardStart: number = 1,
): [string, unknown[]] => {
  const sqlFilters = [
    "type =",
    "scale_type =",
    "issuance_date <=",
    "issuance_date >=",
  ];
  const [sqlWithWildcards, args] = [
    type,
    scaleType,
    maxIssuanceDate,
    minIssuanceDate,
  ]
    .map((e, i) => [e, sqlFilters[i]])
    .filter((e) => e[0])
    .map((argPairSql, i) => [
      `${argPairSql[1]} $${i + wildcardStart}`,
      argPairSql[0],
    ])
    .reduce(
      (collector: unknown[][], sqlPairArg) => {
        collector[0].push(sqlPairArg[0]);
        collector[1].push(sqlPairArg[1]);
        return collector;
      },
      [[], []],
    );
  return [`WHERE ${sqlWithWildcards.join(" AND ")}`, args];
};

export class Document {
  id: number;
  title: string;
  description: string;
  type: DocumentType;
  scale: Scale;
  stakeholders?: Stakeholder[];
  coordinates?: Coordinates;
  private _area?: Area;
  issuanceTime?: [Dayjs, Dayjs];
  links?: LinkResponseBody[];

  constructor(
    id: number,
    title: string,
    description: string,
    type: DocumentType,
    scale: Scale,
    stakeholders?: Stakeholder[],
    coordinates?: Coordinates,
    area?: Area,
    issuanceTime?: [Dayjs, Dayjs],
    links?: LinkResponseBody[],
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.type = type;
    this.scale = scale;
    this.stakeholders = stakeholders;
    this.coordinates = coordinates;
    if (area) this.setArea(area);
    this.issuanceTime = issuanceTime;
    this.links = links;
  }

  private static async fromDatabaseRow(
    dbRow: DocumentDbRow,
  ): Promise<Document> {
    const {
      id,
      title,
      description,
      type,
      scale_type,
      scale_ratio,
      stakeholders,
      coordinates,
      area_id,
      issuance_time,
      links,
    } = dbRow;
    assert(typeof title === "string");
    assert(typeof description === "string");
    assert(typeof type === "string");
    assert(typeof scale_type === "string");

    const scale: Scale = Scale.fromDatabaseRow({
      scale_type,
      scale_ratio,
    } as ScaleRow);

    const checkedCoordinates =
      coordinates.latitude && coordinates.longitude && coordinates;
    const area = area_id !== null && (await Area.get(area_id));

    return new Document(
      id,
      title,
      description,
      type,
      scale,
      stakeholders || undefined,
      checkedCoordinates || undefined,
      area || undefined,
      [dayjs(issuance_time[0]), dayjs(issuance_time[1])],
      Link.fromJsonbField(links),
    );
  }

  get area(): Area | undefined {
    return this._area;
  }
  async setArea(area: Area): Promise<void> {
    if (this._area) {
      await this._area.delete();
    }
    this._area = area;
  }

  async update(): Promise<void> {
    const sql = `UPDATE document SET 
    title = $1, description = $2, type = $3, scale_type = $4, 
    scale_ratio = $5, stakeholders = $6, coordinates = ST_Point($7, $8)::geography, 
    area_id = $9,
    issuance_time = $10 WHERE id = $11`;
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
      this.area?.id || null,
      this.issuanceTime?.map((dJs) => dJs.toDate()) || null,
      this.id,
    ]);
    if (result.rowCount != 1) throw new Error("Failed db update");
  }

  static async insert(
    title: string,
    description: string,
    type: DocumentType,
    scale: Scale,
    stakeholders?: Stakeholder[],
    coordinates?: Coordinates,
    area?: Area,
    issuanceTime?: [Dayjs, Dayjs],
  ): Promise<Document> {
    const scaleRow: ScaleRow = scale.intoDatabaseRow();
    const result = await Database.query(
      "INSERT INTO document(title, description, type, scale_type, scale_ratio, stakeholders, coordinates, area_id, issuance_time) VALUES($1, $2, $3, $4, $5, $6, ST_Point($7, $8)::geography, $9, $10) RETURNING id;",
      [
        title,
        description,
        type,
        scaleRow.scale_type,
        scaleRow.scale_ratio || null,
        stakeholders || null,
        coordinates?.longitude || null,
        coordinates?.latitude || null,
        area?.id || null,
        issuanceTime?.map((dJs) => dJs.toDate()) || null,
      ],
    );
    const documentId: number = result.rows[0].id;
    return new Document(documentId, title, description, type, scale);
  }

  static async delete(id: number): Promise<void> {
    const result = await Database.query(
      "DELETE FROM document WHERE id = $1 RETURNING area_id",
      [id],
    );
    const affectedRows: number = result.rowCount || 0;
    if (affectedRows < 1)
      throw new DocumentNotFound("DELETE query affected rows were less than 1");
    const { area_id: areaId } = result.rows[0];
    if (areaId) {
      const a = await Area.get(areaId);
      await a.delete();
    }
  }

  static async all(
    filters: {
      type?: DocumentType;
      scaleType?: ScaleType;
      maxIssuanceDate?: Dayjs;
      minIssuanceDate?: Dayjs;
    } = {},
  ): Promise<Document[]> {
    const someFilters = Object.values(filters).some((d) => d);
    const { type, scaleType, maxIssuanceDate, minIssuanceDate } = filters;
    const [sqlWhere, sqlWhereArgs] = filters
      ? buildSqlWhere(
          type,
          scaleType,
          maxIssuanceDate?.toDate(),
          minIssuanceDate?.toDate(),
        )
      : ["", []];
    const sql = `SELECT *,
      json_build_object(
        'latitude', ST_Y(coordinates::geometry), 
        'longitude', ST_X(coordinates::geometry))
        AS coordinates
        FROM document ${someFilters ? sqlWhere : ""};`;
    const result = await Database.query(sql, sqlWhereArgs);
    return await Promise.all(
      result.rows.map(async (row) => await Document.fromDatabaseRow(row)),
    );
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
    return await Document.fromDatabaseRow(documentRow);
  }

  toResponseBody() {
    return {
      ...this,
      area: this.area?.toResponseBody(),
      _area: undefined, //TODO: ho bisogno di un po' di refactoring
      issuanceTime: this.issuanceTime
        ? timeFormatter(this.issuanceTime!)
        : undefined,
      stakeholders:
        this.stakeholders?.length === 0 ? undefined : this.stakeholders,
    };
  }
}
