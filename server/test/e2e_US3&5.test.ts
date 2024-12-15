import dotenv from "dotenv";
import { StatusCodes } from "http-status-codes";
import request from "supertest";
import app from "../src/app";
import { Database } from "../src/database";
import { DocumentType } from "../src/model/document";
import { ScaleType } from "../src/model/scale";
import { loginAsPlanner } from "./utils";
dotenv.config();

// End to end testing
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
});

