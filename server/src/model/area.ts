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
      const excludeSql = excludeP.map((_, i) => `$${i + 2}::int`).join(", ");
      const result = await client.query(
        `INSERT INTO area(include_polygon_id, exclude_polygon_ids) VALUES($1, ARRAY[${excludeSql}]) RETURNING id;`,
        [includeP.id, ...excludeP.map((p) => p.id)],
      );
      const areaId = result.rows[0].id;
      return new Area(areaId, includeP, excludeP);
    });
  }

  toResponseBody = () => ({
    include: this.include.toResponseBody(),
    exclude: this.exclude.map((poly) => poly.toResponseBody()),
  });
}
