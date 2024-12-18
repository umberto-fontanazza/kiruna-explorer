import dotenv from "dotenv";
import { StatusCodes } from "http-status-codes";
import request from "supertest";
import app from "../src/app";
import { Database } from "../src/database";
import { DocumentType } from "../src/model/document";
import { ScaleType } from "../src/model/scale";
import { loginAsPlanner } from "./utils";

dotenv.config();

// End to end testing: US3: As an Urban Planner, I want to georeference a document (possibly at insertion time), So that I can study its relationship to the territory
// US5: As an Urban Planner, I want to adjust/define the georeferencing of a document on the map so that I can study its relationship to the territory
let plannerCookie: string;

beforeAll(async () => {
  plannerCookie = await loginAsPlanner();
});

afterAll(async () => {
  await Database.disconnect();
});

describe("Testing story 3 and 5", () => {
  const testUS3 = {
    title: "Coordinates test",
    description: "This one will be tested with coordinates",
    scale: { type: ScaleType.Text },
    type: DocumentType.Informative,
    issuanceTime: "2021-12-12",
  };

  const testUS3_1 = {
    title: "Coordinates test",
    description: "This one will be tested with coordinates",
    scale: { type: ScaleType.Text },
    type: DocumentType.Informative,
    issuanceTime: "2021-12-12",
  };

  const wrongCoordinates = {
    latitude: 120,
    longitude: 40,
  };
  const wrongCoordinates2 = {
    latitude: 45,
    longitude: 190,
  };
  const wrongCoordinates3 = {
    latitude: "Wrong",
    longitude: 40,
  };
  const wrongCoordinates4 = {
    latitude: 45,
    longitude: "Wrong",
  };
  const missingLon = {
    latitude: 45,
  };
  const missingLat = {
    longitude: 60,
  };
  const coordinates = {
    latitude: 45,
    longitude: 30,
  };
  let testUS3Id: number;
  let testUS3Id_1: number;

  test("US3.1 POST with georeference without being an Urban Planner", async () => {
    const response = await request(app)
      .post("/documents/")
      .send({ ...testUS3, coordinates });
    expect(response.status).toStrictEqual(StatusCodes.UNAUTHORIZED);
  });

  test("US3.2 POST with coordinates success", async () => {
    const response = await request(app)
      .post("/documents/")
      .set("Cookie", plannerCookie)
      .send({ ...testUS3, coordinates });
    expect(response.status).toBe(StatusCodes.CREATED);
    expect(response.body.id).toBeDefined();
    expect(typeof response.body.id).toBe("number");
    testUS3Id = response.body.id;
  });

  test("US3.3 POST with coordinates wrong", async () => {
    const response = await request(app)
      .post("/documents/")
      .set("Cookie", plannerCookie)
      .send({ ...testUS3, wrongCoordinates });
    expect(response.status).toBe(StatusCodes.BAD_REQUEST);
  });

  test("US3.3 POST with coordinates wrong", async () => {
    const response = await request(app)
      .post("/documents/")
      .set("Cookie", plannerCookie)
      .send({ ...testUS3, wrongCoordinates });
    expect(response.status).toBe(StatusCodes.BAD_REQUEST);
  });

  test("US3.3 POST with coordinates wrong", async () => {
    const response = await request(app)
      .post("/documents/")
      .set("Cookie", plannerCookie)
      .send({ ...testUS3, wrongCoordinates2 });
    expect(response.status).toBe(StatusCodes.BAD_REQUEST);
  });

  test("US3.3 POST with coordinates wrong", async () => {
    const response = await request(app)
      .post("/documents/")
      .set("Cookie", plannerCookie)
      .send({ ...testUS3, wrongCoordinates3 });
    expect(response.status).toBe(StatusCodes.BAD_REQUEST);
  });

  test("US3.3 POST with coordinates wrong", async () => {
    const response = await request(app)
      .post("/documents/")
      .set("Cookie", plannerCookie)
      .send({ ...testUS3, wrongCoordinates4 });
    expect(response.status).toBe(StatusCodes.BAD_REQUEST);
  });

  test("US3.4 POST with incomplete coordinates", async () => {
    const response = await request(app)
      .post("/documents/")
      .set("Cookie", plannerCookie)
      .send({ ...testUS3, missingLon });
    expect(response.status).toBe(StatusCodes.BAD_REQUEST);
  });

  test("US3.4 POST with incomplete coordinates", async () => {
    const response = await request(app)
      .post("/documents/")
      .set("Cookie", plannerCookie)
      .send({ ...testUS3, missingLat });
    expect(response.status).toBe(StatusCodes.BAD_REQUEST);
  });

  test("US3.5 PATCH with coordinates success", async () => {
    const response = await request(app)
      .patch(`/documents/${testUS3Id}`)
      .set("Cookie", plannerCookie)
      .send({ coordinates: { latitude: 45, longitude: 20 } });
    expect(response.status).toStrictEqual(StatusCodes.NO_CONTENT);
  });

  test("US3.6 PATCH with coordinates wrong", async () => {
    const response = await request(app)
      .patch(`/documents/${testUS3Id}`)
      .set("Cookie", plannerCookie)
      .send({ coordinates: { latitude: 200, longitude: 20 } });
    expect(response.status).toStrictEqual(StatusCodes.BAD_REQUEST);
  });

  test("US3.6 PATCH with coordinates wrong", async () => {
    const response = await request(app)
      .patch(`/documents/${testUS3Id}`)
      .set("Cookie", plannerCookie)
      .send({ coordinates: { latitude: 45, longitude: 200 } });
    expect(response.status).toStrictEqual(StatusCodes.BAD_REQUEST);
  });

  test("US3.6 PATCH with coordinates wrong", async () => {
    const response = await request(app)
      .patch(`/documents/${testUS3Id}`)
      .set("Cookie", plannerCookie)
      .send({ coordinates: { latitude: "Wrong", longitude: 20 } });
    expect(response.status).toStrictEqual(StatusCodes.BAD_REQUEST);
  });

  test("US3.6 PATCH with coordinates wrong", async () => {
    const response = await request(app)
      .patch(`/documents/${testUS3Id}`)
      .set("Cookie", plannerCookie)
      .send({ coordinates: { latitude: 45, longitude: "Wrong" } });
    expect(response.status).toStrictEqual(StatusCodes.BAD_REQUEST);
  });

  test("US3.6 PATCH with coordinates wrong", async () => {
    const response = await request(app)
      .patch(`/documents/${testUS3Id}`)
      .set("Cookie", plannerCookie)
      .send({ coordinates: { latitude: "Wrong", longitude: "Wrong" } });
    expect(response.status).toStrictEqual(StatusCodes.BAD_REQUEST);
  });

  test("US3.7 PATCH with incomplete coordinates", async () => {
    const response = await request(app)
      .patch(`/documents/${testUS3Id}`)
      .set("Cookie", plannerCookie)
      .send({ coordinates: { latitude: 45 } });
    expect(response.status).toStrictEqual(StatusCodes.BAD_REQUEST);
  });

  test("US3.7 PATCH with incomplete coordinates", async () => {
    const response = await request(app)
      .patch(`/documents/${testUS3Id}`)
      .set("Cookie", plannerCookie)
      .send({ coordinates: { longitude: 60 } });
    expect(response.status).toStrictEqual(StatusCodes.BAD_REQUEST);
  });

  test("DELETE with coordinates success", async () => {
    const response = await request(app)
      .del(`/documents/${testUS3Id}`)
      .set("Cookie", plannerCookie);
    expect(response.status).toStrictEqual(StatusCodes.NO_CONTENT);
  });

  test("US3.8 POST with georeference, PATCH with coordinates success, DELETE with coordinates success", async () => {
    const response = await request(app)
      .post("/documents/")
      .set("Cookie", plannerCookie)
      .send({ ...testUS3_1, coordinates });
    expect(response.status).toBe(StatusCodes.CREATED);
    expect(response.body.id).toBeDefined();
    expect(typeof response.body.id).toBe("number");
    testUS3Id_1 = response.body.id;

    const response2 = await request(app)
      .patch(`/documents/${testUS3Id_1}`)
      .set("Cookie", plannerCookie)
      .send({ coordinates: { latitude: 45, longitude: 20 } });
    expect(response2.status).toStrictEqual(StatusCodes.NO_CONTENT);

    const response3 = await request(app)
      .del(`/documents/${testUS3Id_1}`)
      .set("Cookie", plannerCookie);
    expect(response3.status).toStrictEqual(StatusCodes.NO_CONTENT);
  });

  test("US5.1 POST with coordinates and PATCH with polygon success", async () => {
    const response = await request(app)
      .post("/documents/")
      .set("Cookie", plannerCookie)
      .send({ ...testUS3, coordinates });
    expect(response.status).toBe(StatusCodes.CREATED);
    expect(response.body.id).toBeDefined();
    expect(typeof response.body.id).toBe("number");
    testUS3Id = response.body.id;

    const response2 = await request(app)
      .patch(`/documents/${testUS3Id}`)
      .set("Cookie", plannerCookie)
      .send({
        area: {
          include: [
            { latitude: 67.8551234322, longitude: 20.225341123 },
            { latitude: 67.8597123454, longitude: 20.213445762 },
            { latitude: 67.8421786231, longitude: 20.245287347 },
            { latitude: 67.8399745213, longitude: 20.230000837 },
          ],
          exclude: [
            [
              { latitude: 67.85, longitude: 20.23500000034 },
              { latitude: 67.84503451, longitude: 20.24000000082 },
              { latitude: 67.8475, longitude: 20.22800000036 },
            ],
            [
              { latitude: 67.85800079, longitude: 20.22000000075 },
              { latitude: 67.86000509, longitude: 20.22600000036 },
              { latitude: 67.85750003, longitude: 20.23000000058 },
            ],
          ],
        },
      });
    expect(response2.status).toStrictEqual(StatusCodes.NO_CONTENT);
  });

  test("US5.2 POST with area and Patch with coordinates, then GET with coordinates success", async () => {
    const response = await request(app)
      .post("/documents/")
      .set("Cookie", plannerCookie)
      .send({
        ...testUS3,
        area: {
          include: [
            { latitude: 67.8558, longitude: 20.2253 },
            { latitude: 67.8, longitude: 20.2134 },
            { latitude: 67.84, longitude: 20.245 },
            { latitude: 67.8399, longitude: 20.23 },
          ],
          exclude: [
            [
              { latitude: 67.85, longitude: 20.235 },
              { latitude: 67.845, longitude: 20.24 },
              { latitude: 67.8475, longitude: 20.22800000000036 },
            ],
            [
              { latitude: 67.858079, longitude: 20.2200075 },
              { latitude: 67.860009, longitude: 20.2260036 },
              { latitude: 67.857500003, longitude: 20.23058 },
            ],
          ],
        },
      });
    expect(response.status).toBe(StatusCodes.CREATED);
    expect(response.body.id).toBeDefined();
    expect(typeof response.body.id).toBe("number");
    testUS3Id = response.body.id;

    const response2 = await request(app)
      .patch(`/documents/${testUS3Id}`)
      .set("Cookie", plannerCookie)
      .send({ coordinates: { latitude: 45, longitude: 20 } });
    expect(response2.status).toStrictEqual(StatusCodes.NO_CONTENT);

    const response3 = await request(app)
      .get(`/documents/${testUS3Id}`)
      .set("Cookie", plannerCookie);
    expect(response3.status).toStrictEqual(StatusCodes.OK);
    expect(response3.body.coordinates).toStrictEqual({
      latitude: 45,
      longitude: 20,
    });
  });
});
