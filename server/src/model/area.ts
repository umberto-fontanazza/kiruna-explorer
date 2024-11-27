import { AreaBody } from "../validation/areaSchema";
import { Polygon } from "./polygon";

export class Area {
  include: Polygon;
  exclude: Polygon[];

  constructor(include: Polygon, exclude: Polygon[] = []) {
    this.include = include;
    this.exclude = exclude;
  }

  static fromRequestBody = (body: AreaBody): Area =>
    new Area(
      Polygon.fromRequestBody(body.include),
      body.exclude?.map((polyBody) => Polygon.fromRequestBody(polyBody)),
    );

  toResponseBody = () => ({
    include: this.include.toResponseBody(),
    exclude: this.exclude.map((poly) => poly.toResponseBody()),
  });
}
