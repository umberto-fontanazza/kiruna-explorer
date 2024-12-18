import { Database } from "../src/database";
import { Polygon } from "../src/model/polygon";
import { Coordinates } from "../src/validation/coordinatesSchema";

jest.mock("../src/database", () => ({
  Database: {
    query: jest.fn(),
  },
}));

const mockDatabaseQuery = Database.query as jest.Mock;

describe("Polygon", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("constructor", () => {
    it("should create a polygon with valid vertices", () => {
      const vertices: Coordinates[] = [
        { latitude: 10, longitude: 20 },
        { latitude: 15, longitude: 25 },
        { latitude: 30, longitude: 35 },
      ];
      const polygon = new Polygon(1, vertices);

      expect(polygon.id).toBe(1);
      expect(polygon.vertices).toEqual(vertices);
    });

    it("should throw an error for less than 3 vertices", () => {
      const vertices: Coordinates[] = [
        { latitude: 10, longitude: 20 },
        { latitude: 15, longitude: 25 },
      ];

      expect(() => new Polygon(1, vertices)).toThrow(
        "A polygon must have at least 3 vertices!",
      );
    });
  });

  describe("getMany", () => {
    it("should return polygons for valid IDs", async () => {
      const mockData = [
        {
          id: 1,
          coordinates: [
            [10, 20],
            [15, 25],
            [30, 35],
          ],
        },
        {
          id: 2,
          coordinates: [
            [5, 10],
            [10, 15],
            [20, 25],
          ],
        },
      ];

      mockDatabaseQuery.mockResolvedValueOnce({ rows: mockData });

      const polygons = await Polygon.getMany([1, 2]);

      expect(polygons).toHaveLength(2);
      expect(polygons[0].id).toBe(1);
      expect(polygons[0].vertices).toEqual([
        { latitude: 10, longitude: 20 },
        { latitude: 15, longitude: 25 },
        { latitude: 30, longitude: 35 },
      ]);
    });

    it("should throw PolygonNotFound for missing IDs", async () => {
      mockDatabaseQuery.mockResolvedValueOnce({ rows: [] });

      await expect(Polygon.getMany([1])).rejects.toThrow(
        "Couldn't find polygons with id: 1",
      );
    });
  });

  describe("get", () => {
    it("should return a single polygon", async () => {
      const mockData = [
        {
          id: 1,
          coordinates: [
            [10, 20],
            [15, 25],
            [30, 35],
          ],
        },
      ];

      mockDatabaseQuery.mockResolvedValueOnce({ rows: mockData });

      const polygon = await Polygon.get(1);

      expect(polygon.id).toBe(1);
      expect(polygon.vertices).toEqual([
        { latitude: 10, longitude: 20 },
        { latitude: 15, longitude: 25 },
        { latitude: 30, longitude: 35 },
      ]);
    });
  });

  describe("insert", () => {
    it("should insert a polygon and return the instance", async () => {
      const body: Coordinates[] = [
        { latitude: 10, longitude: 20 },
        { latitude: 15, longitude: 25 },
        { latitude: 30, longitude: 35 },
      ];

      mockDatabaseQuery.mockResolvedValueOnce({ rows: [{ id: 1 }] });

      const polygon = await Polygon.insert(body);

      expect(polygon.id).toBe(1);
      expect(polygon.vertices).toEqual(body);
    });
  });

  describe("delete", () => {
    it("should delete a polygon without errors", async () => {
      mockDatabaseQuery.mockResolvedValueOnce({});

      await expect(Polygon.delete(1)).resolves.not.toThrow();
      expect(mockDatabaseQuery).toHaveBeenCalledWith(
        "DELETE FROM polygon WHERE id = $1",
        [1],
      );
    });
  });

  describe("toResponseBody", () => {
    it("should return the vertices of the polygon", () => {
      const vertices: Coordinates[] = [
        { latitude: 10, longitude: 20 },
        { latitude: 15, longitude: 25 },
        { latitude: 30, longitude: 35 },
      ];
      const polygon = new Polygon(1, vertices);

      expect(polygon.toResponseBody()).toEqual(vertices);
    });
  });
});
