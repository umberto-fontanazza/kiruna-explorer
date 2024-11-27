import { Coordinates } from "../validation/documentSchema";
import { PolygonBody } from "../validation/polygonSchema";

export class Polygon {
  private _vertices!: Coordinates[];

  constructor(vertices: Coordinates[]) {
    this.vertices = vertices;
  }

  public get vertices() {
    return [...this._vertices];
  }

  private set vertices(vertices: Coordinates[]) {
    if (vertices.length < 3)
      throw new Error("A polygon must have at least 3 vertices!");
    this._vertices = vertices;
  }

  static fromRequestBody = (body: PolygonBody): Polygon => new Polygon(body);

  toResponseBody = (): Coordinates[] => this.vertices;
}
