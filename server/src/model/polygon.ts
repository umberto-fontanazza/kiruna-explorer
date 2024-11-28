import { PoolClient } from "pg";
import { Database } from "../database";
import { Coordinates } from "../validation/coordinatesSchema";
import { PolygonBody } from "../validation/polygonSchema";

export class Polygon {
  id: number;
  private _vertices!: Coordinates[];

  constructor(id: number, vertices: Coordinates[]) {
    this.id = id;
    this.vertices = vertices;
  }

  public get vertices(): Coordinates[] {
    return [...this._vertices];
  }

  private set vertices(vertices: Coordinates[]) {
    if (vertices.length < 3)
      throw new Error("A polygon must have at least 3 vertices!");
    this._vertices = vertices;
  }

  static async get(id: number): Promise<Polygon> {
    const result = await Database.query(
      "SELECT ST_X(v::geometry) as latitude, ST_Y(v::geometry) as longitude FROM polygon, UNNEST(vertices) as v WHERE id = $1",
      [id],
    );
    return new Polygon(id, result.rows);
  }

  static async insert(
    body: PolygonBody,
    client?: PoolClient,
  ): Promise<Polygon> {
    const sqlValues = body
      .map(
        (_, i) => `ST_Point($${(i + 1) * 2 - 1}, $${(i + 1) * 2})::geography`,
      )
      .join(", ");
    const sql = `INSERT INTO polygon(vertices) VALUES(ARRAY[${sqlValues}]) RETURNING id;`;
    const args = body.flatMap((c) => [c.longitude, c.latitude]);
    const result = await (client ?? Database).query(sql, args);
    const id: number = result.rows[0].id;
    return new Polygon(id, body);
  }

  static async delete(id: number): Promise<void> {
    await Database.query("DELETE FROM polygon WHERE id = $1", [id]);
  }

  toResponseBody = (): Coordinates[] => this.vertices;
}
