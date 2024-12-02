import { Database } from "../database";
import { AreaBody } from "../validation/areaSchema";
import { PolygonBody } from "../validation/polygonSchema";
import { Polygon } from "./polygon";

export class Area {
  id: number;
  include: Polygon;
  exclude: Polygon[];

  constructor(id: number, include: Polygon, exclude: Polygon[] = []) {
    this.id = id;
    this.include = include;
    this.exclude = exclude;
  }

  static async get(id: number): Promise<Area> {
    const sql = `SELECT id, include_polygon_id as include, exclude_polygon_ids as exclude FROM area WHERE id = $1`;
    const result = await Database.query(sql, [id]);
    const { include, exclude } = result.rows[0];
    const polygons = (await Polygon.getMany([include, ...exclude])).sort(
      (p1, p2) => p1.id - p2.id,
    );
    return new Area(
      id,
      polygons.filter((p) => p.id === include)[0],
      polygons.filter((p) => p.id !== include),
    );
  }

  static async insert(body: AreaBody): Promise<Area> {
    const {
      include,
      exclude,
    }: { include: PolygonBody; exclude: PolygonBody[] } = body;
    return await Database.withTransaction(async (client) => {
      const includeP: Polygon = await Polygon.insert(include, client);
      const excludeP: Polygon[] = await Promise.all(
        exclude.map(async (poly) => await Polygon.insert(poly, client)),
      );
      const excludeSql = excludeP.map((_, i) => `$${i + 2}`).join(", ");
      const result = await client.query(
        `INSERT INTO area(include_polygon_id, exclude_polygon_ids) VALUES($1, ARRAY[${excludeSql}]::int[]) RETURNING id;`,
        [includeP.id, ...excludeP.map((p) => p.id)],
      );
      const areaId = result.rows[0].id;
      return new Area(areaId, includeP, excludeP);
    });
  }

  async delete(): Promise<void> {
    await Database.withTransaction(async (client) => {
      await Polygon.delete(this.include.id);
      await Promise.all(
        this.exclude
          .map((p) => p.id)
          .map(async (id) => await Polygon.delete(id)),
      );
      client.query("DELETE FROM area WHERE id = $1", [this.id]);
    });
  }

  toResponseBody = () => ({
    include: this.include.toResponseBody(),
    exclude: this.exclude.map((poly) => poly.toResponseBody()),
  });
}
