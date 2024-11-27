import { PoolClient } from "pg";
import { Database } from "../database";
import { Coordinates } from "../validation/documentSchema";
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

  static async insert(
    body: PolygonBody,
    client?: PoolClient,
  ): Promise<Polygon> {
    const sqlValues = body
      .map((_, i) => `ST_Point($${i * 2 - 1}, $${i * 2})::geography`)
      .join(", ");
    const result = await (client ?? Database).query(
      `INSERT INTO polygon(vertices) VALUES({${sqlValues}}) RETURNING id;`,
      body.flatMap((c) => [c.longitude, c.latitude]),
    );
    const id: number = result.rows[0].id;
    return new Polygon(id, body);
  }

  toResponseBody = (): Coordinates[] => this.vertices;
}

export const _ = async () => {
  return await Polygon.insert([
    { latitude: 67.85584273627312, longitude: 20.22534124638123 },
    { latitude: 67.85971234872345, longitude: 20.21344576372931 },
    { latitude: 67.84217863458723, longitude: 20.24528734962184 },
    { latitude: 67.83997453827193, longitude: 20.23000083719327 },
  ]);
};
