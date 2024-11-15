import dotenv from "dotenv";
dotenv.config();
import app from "../src/app";
import request from "supertest";
import { Database } from "../src/database";
import { StatusCodes } from "http-status-codes";
import { DocumentType, Stakeholder } from "../src/model/document";
import { ScaleType } from "../src/model/scale";
import { loginAsPlanner, loginAsResident } from "./utils";

// End to end testing, User story 1 and User story 3.
let plannerCookie: string;
let residentCookie: string;

beforeAll(async () => {
  plannerCookie = await loginAsPlanner();
});

afterAll(async () => {
  await Database.disconnect();
});

describe("Testing story 1", () => {
  const testDocMandatoryFields = {
    title: "Mandatory Fields test",
    description: "This one will be tested for mandatory fields",
    type: DocumentType.Prescriptive,
    scale: { type: ScaleType.Text },
  };
  const testDocAllFields = {
    title: "Coordinates test",
    description: "This one will be tested for all fields",
    type: DocumentType.Informative,
    scale: { type: ScaleType.BlueprintsOrEffect },
    stakeholders: [Stakeholder.KirunaKommun],
    issuanceDate: "2021-12-12",
    coordinates: { latitude: 45, longitude: 30 },
  };
  let testDocId: number;
  let testDocIdAll: number;

  test("US1.1 POST a document without being Urban Planner", async () => {
    const response = await request(app)
      .post("/documents/")
      .send({ ...testDocMandatoryFields });
    expect(response.status).toStrictEqual(StatusCodes.UNAUTHORIZED);
  });

  test("US1.2 POST with All fields filled", async () => {
    const response = await request(app)
      .post("/documents/")
      .set("Cookie", plannerCookie)
      .send({ ...testDocAllFields });
    expect(response.status).toBe(StatusCodes.CREATED);
    expect(response.body.id).toBeDefined();
    expect(typeof response.body.id).toBe("number");
    testDocIdAll = response.body.id;
  });

  test("US1.3 POST with only mandatory fields filled", async () => {
    const response = await request(app)
      .post("/documents/")
      .set("Cookie", plannerCookie)
      .send({ ...testDocMandatoryFields });
    expect(response.status).toBe(StatusCodes.CREATED);
    expect(response.body.id).toBeDefined();
    expect(typeof response.body.id).toBe("number");
    testDocId = response.body.id;
  });

  test("US1.4 POST without a title", async () => {
    const response = await request(app)
      .post("/documents/")
      .set("Cookie", plannerCookie)
      .send({
        description: "Nice description but the title is missing",
        type: DocumentType.Prescriptive,
        scale: { type: ScaleType.Text },
      });
    expect(response.status).toStrictEqual(StatusCodes.BAD_REQUEST);
  });

  test("US1.5 POST missing several mandatory fields", async () => {
    const response = await request(app)
      .post("/documents/")
      .set("Cookie", plannerCookie)
      .send({
        coordinates: { latitude: 45, longitude: 30 },
        stakeholders: [Stakeholder.KirunaKommun],
        issuanceDate: "2021-12-12",
      });
    expect(response.status).toStrictEqual(StatusCodes.BAD_REQUEST);
  });

  test("US1.6 POST missing all fields", async () => {
    const response = await request(app)
      .post("/documents/")
      .set("Cookie", plannerCookie)
      .send({});
    expect(response.status).toStrictEqual(StatusCodes.BAD_REQUEST);
  });

  test("US1.7 POST with wrong type", async () => {
    const response = await request(app)
      .post("/documents/")
      .set("Cookie", plannerCookie)
      .send({
        title: "Title",
        description: "Description",
        type: "Wrong type",
        scale: { type: ScaleType.Text },
      });
    expect(response.status).toStrictEqual(StatusCodes.BAD_REQUEST);
  });

  test("US1.7 POST with wrong description", async () => {
    const response = await request(app)
      .post("/documents/")
      .set("Cookie", plannerCookie)
      .send({
        title: "Title",
        description: 123,
        type: "Wrong type",
        scale: { type: ScaleType.Text },
      });
    expect(response.status).toStrictEqual(StatusCodes.BAD_REQUEST);
  });

  test("US1.7 POST with wrong Title", async () => {
    const response = await request(app)
      .post("/documents/")
      .set("Cookie", plannerCookie)
      .send({
        title: 123,
        description: "description",
        type: "Wrong type",
        scale: { type: ScaleType.Text },
      });
    expect(response.status).toStrictEqual(StatusCodes.BAD_REQUEST);
  });

  test("US1.7 POST with wrong Scale", async () => {
    const response = await request(app)
      .post("/documents/")
      .set("Cookie", plannerCookie)
      .send({
        title: "Title",
        description: "description",
        type: "Wrong type",
        scale: { type: "Wrong scale" },
      });
    expect(response.status).toStrictEqual(StatusCodes.BAD_REQUEST);
  });

  test("US1.8 POST with fillin wrong all fields", async () => {
    const response = await request(app)
      .post("/documents/")
      .set("Cookie", plannerCookie)
      .send({
        title: 123,
        description: 123,
        type: "Wrong type",
        scale: { type: "Wrong scale" },
      });
    expect(response.status).toStrictEqual(StatusCodes.BAD_REQUEST);
  });

  test("US1.9 PATCH without being an Urban Planner", async () => {
    const response = await request(app)
      .patch("/documents/1")
      .send({ description: "New shiny description" });
    expect(response.status).toStrictEqual(StatusCodes.UNAUTHORIZED);
  });

  test("US1.10 PATCH all editable fields", async () => {
    const response = await request(app)
      .patch(`/documents/${testDocId}`)
      .set("Cookie", plannerCookie)
      .send({
        title: "New title",
        description: "This one will be tested for all fields",
        type: DocumentType.Design,
        scale: { type: ScaleType.BlueprintsOrEffect },
        stakeholders: [Stakeholder.Lkab],
        issuanceDate: "2021-12-30",
        coordinates: { latitude: 20, longitude: 40 },
      });
    expect(response.status).toStrictEqual(StatusCodes.NO_CONTENT);
  });

  test("US1.11 PATCH only the mandatory fields", async () => {
    const response = await request(app)
      .patch(`/documents/${testDocId}`)
      .set("Cookie", plannerCookie)
      .send({
        title: "New title",
        description: "This one will be tested for all fields",
        type: DocumentType.Design,
        scale: { type: ScaleType.Ratio, ratio: 1 },
      });
    expect(response.status).toStrictEqual(StatusCodes.NO_CONTENT);
  });

  test("US1.12 PATCH  all optional fields", async () => {
    const response = await request(app)
      .patch(`/documents/${testDocId}`)
      .set("Cookie", plannerCookie)
      .send({
        stakeholders: [Stakeholder.Residents],
        issuanceDate: "2023-12-30",
        coordinates: { latitude: 20, longitude: 40 },
      });
    expect(response.status).toStrictEqual(StatusCodes.NO_CONTENT);
  });

  test("US1.13 PATCH just one mandatory field", async () => {
    const response = await request(app)
      .patch(`/documents/${testDocId}`)
      .set("Cookie", plannerCookie)
      .send({
        description: "New shiny description",
      });
    expect(response.status).toStrictEqual(StatusCodes.NO_CONTENT);
  });

  test("US1.14 PATCH just one optional field", async () => {
    const response = await request(app)
      .patch(`/documents/${testDocId}`)
      .set("Cookie", plannerCookie)
      .send({
        stakeholders: [Stakeholder.WhiteArkitekter],
      });
    expect(response.status).toStrictEqual(StatusCodes.NO_CONTENT);
  });

  test("US1.15 PATCH without modify anything", async () => {
    const response = await request(app)
      .patch(`/documents/${testDocId}`)
      .set("Cookie", plannerCookie)
      .send({});
    expect(response.status).toStrictEqual(StatusCodes.NO_CONTENT);
  });

  test("US1.16 PATCH with negative id", async () => {
    const response = await request(app)
      .patch("/documents/-1")
      .set("Cookie", plannerCookie)
      .send({
        description: "New shiny description",
      });
    expect(response.status).toStrictEqual(StatusCodes.BAD_REQUEST);
  });

  test("US1.16 PATCH with wrong id", async () => {
    const response = await request(app)
      .patch("/documents/0")
      .set("Cookie", plannerCookie)
      .send({
        description: "New shiny description",
      });
    expect(response.status).toStrictEqual(StatusCodes.BAD_REQUEST);
  });

  test("US1.16 PATCH with wrong id", async () => {
    const response = await request(app)
      .patch("/documents/5")
      .set("Cookie", plannerCookie)
      .send({
        description: "New shiny description",
      });
    expect(response.status).toStrictEqual(StatusCodes.NOT_FOUND);
  });

  test("US1.17 PATCH with wrong type", async () => {
    const response = await request(app)
      .patch(`/documents/${testDocId}`)
      .set("Cookie", plannerCookie)
      .send({
        type: "Wrong type",
      });
    expect(response.status).toStrictEqual(StatusCodes.BAD_REQUEST);
  });

  test("US1.17 PATCH with wrong description", async () => {
    const response = await request(app)
      .patch(`/documents/${testDocId}`)
      .set("Cookie", plannerCookie)
      .send({
        description: 123,
      });
    expect(response.status).toStrictEqual(StatusCodes.BAD_REQUEST);
  });

  test("US1.17 PATCH with wrong title", async () => {
    const response = await request(app)
      .patch(`/documents/${testDocId}`)
      .set("Cookie", plannerCookie)
      .send({
        title: 123,
      });
    expect(response.status).toStrictEqual(StatusCodes.BAD_REQUEST);
  });

  test("US1.17 PATCH with wrong scale", async () => {
    const response = await request(app)
      .patch(`/documents/${testDocId}`)
      .set("Cookie", plannerCookie)
      .send({
        scale: { type: "Wrong scale" },
      });
    expect(response.status).toStrictEqual(StatusCodes.BAD_REQUEST);
  });

  test("US1.17 PATCH with wrong stakeholders", async () => {
    const response = await request(app)
      .patch(`/documents/${testDocId}`)
      .set("Cookie", plannerCookie)
      .send({
        stakeholders: ["Wrong stakeholder"],
      });
    expect(response.status).toStrictEqual(StatusCodes.BAD_REQUEST);
  });

  test("US1.17 PATCH with wrong issuanceDate", async () => {
    const response = await request(app)
      .patch(`/documents/${testDocId}`)
      .set("Cookie", plannerCookie)
      .send({
        issuanceDate: "Wrong date",
      });
    expect(response.status).toStrictEqual(StatusCodes.BAD_REQUEST);
  });

  test("US1.17 PATCH with wrong coordinates", async () => {
    const response = await request(app)
      .patch(`/documents/${testDocId}`)
      .set("Cookie", plannerCookie)
      .send({
        coordinates: { latitude: 120, longitude: 40 },
      });
    expect(response.status).toStrictEqual(StatusCodes.BAD_REQUEST);
  });

  test("US1.17 PATCH with wrong coordinates", async () => {
    const response = await request(app)
      .patch(`/documents/${testDocId}`)
      .set("Cookie", plannerCookie)
      .send({
        coordinates: { latitude: 45 },
      });
    expect(response.status).toStrictEqual(StatusCodes.BAD_REQUEST);
  });

  test("US1.17 PATCH with wrong coordinates", async () => {
    const response = await request(app)
      .patch(`/documents/${testDocId}`)
      .set("Cookie", plannerCookie)
      .send({
        coordinates: { longitude: 60 },
      });
    expect(response.status).toStrictEqual(StatusCodes.BAD_REQUEST);
  });

  test("US1.17 PATCH with wrong coordinates", async () => {
    const response = await request(app)
      .patch(`/documents/${testDocId}`)
      .set("Cookie", plannerCookie)
      .send({
        coordinates: { latitude: "Wrong", longitude: 60 },
      });
    expect(response.status).toStrictEqual(StatusCodes.BAD_REQUEST);
  });

  test("US1.17 PATCH with wrong coordinates", async () => {
    const response = await request(app)
      .patch(`/documents/${testDocId}`)
      .set("Cookie", plannerCookie)
      .send({
        coordinates: { latitude: 45, longitude: "Wrong" },
      });
    expect(response.status).toStrictEqual(StatusCodes.BAD_REQUEST);
  });

  test("US1.17 PATCH with wrong coordinates", async () => {
    const response = await request(app)
      .patch(`/documents/${testDocId}`)
      .set("Cookie", plannerCookie)
      .send({
        coordinates: { latitude: "Wrong", longitude: "Wrong" },
      });
    expect(response.status).toStrictEqual(StatusCodes.BAD_REQUEST);
  });

  test("US1.18 DELETE without being an Urban Planner", async () => {
    const response = await request(app).delete(`/documents/${testDocId}`);
    expect(response.status).toStrictEqual(StatusCodes.UNAUTHORIZED);
  });

  test("US1.19 DELETE an existing document", async () => {
    const response = await request(app)
      .del(`/documents/${testDocId}`)
      .set("Cookie", plannerCookie);
    expect(response.status).toStrictEqual(StatusCodes.NO_CONTENT);

    await request(app)
      .del(`/documents/${testDocIdAll}`)
      .set("Cookie", plannerCookie);
  });
});

// describe("Testing story 2", () => {

// });

describe("Testing story 3", () => {
  const testDoc = {
    title: "Coordinates test",
    description: "This one will be tested with coordinates",
    scale: { type: ScaleType.Text },
    type: DocumentType.Informative,
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
  let testDocId: number;

  test("US3.1 POST with georeference without being an Urban Planner", async () => {
    const response = await request(app)
      .post("/documents/")
      .send({ ...testDoc, coordinates });
    expect(response.status).toStrictEqual(StatusCodes.UNAUTHORIZED);
  });

  test("US3.2 POST with coordinates success", async () => {
    const response = await request(app)
      .post("/documents/")
      .set("Cookie", plannerCookie)
      .send({ ...testDoc, coordinates });
    expect(response.status).toBe(StatusCodes.CREATED);
    expect(response.body.id).toBeDefined();
    expect(typeof response.body.id).toBe("number");
    testDocId = response.body.id;
  });

  test("US3.3 POST with coordinates wrong", async () => {
    const response = await request(app)
      .post("/documents/")
      .set("Cookie", plannerCookie)
      .send({ ...testDoc, wrongCoordinates });
    expect(response.status).toBe(StatusCodes.BAD_REQUEST);
  });

  test("US3.3 POST with coordinates wrong", async () => {
    const response = await request(app)
      .post("/documents/")
      .set("Cookie", plannerCookie)
      .send({ ...testDoc, wrongCoordinates });
    expect(response.status).toBe(StatusCodes.BAD_REQUEST);
  });

  test("US3.3 POST with coordinates wrong", async () => {
    const response = await request(app)
      .post("/documents/")
      .set("Cookie", plannerCookie)
      .send({ ...testDoc, wrongCoordinates2 });
    expect(response.status).toBe(StatusCodes.BAD_REQUEST);
  });

  test("US3.3 POST with coordinates wrong", async () => {
    const response = await request(app)
      .post("/documents/")
      .set("Cookie", plannerCookie)
      .send({ ...testDoc, wrongCoordinates3 });
    expect(response.status).toBe(StatusCodes.BAD_REQUEST);
  });

  test("US3.3 POST with coordinates wrong", async () => {
    const response = await request(app)
      .post("/documents/")
      .set("Cookie", plannerCookie)
      .send({ ...testDoc, wrongCoordinates4 });
    expect(response.status).toBe(StatusCodes.BAD_REQUEST);
  });

  test("US3.4 POST with incomplete coordinates", async () => {
    const response = await request(app)
      .post("/documents/")
      .set("Cookie", plannerCookie)
      .send({ ...testDoc, missingLon });
    expect(response.status).toBe(StatusCodes.BAD_REQUEST);
  });

  test("US3.4 POST with incomplete coordinates", async () => {
    const response = await request(app)
      .post("/documents/")
      .set("Cookie", plannerCookie)
      .send({ ...testDoc, missingLat });
    expect(response.status).toBe(StatusCodes.BAD_REQUEST);
  });

  test("DELETE with coordinates success", async () => {
    const response = await request(app)
      .del(`/documents/${testDocId}`)
      .set("Cookie", plannerCookie);
    expect(response.status).toStrictEqual(StatusCodes.NO_CONTENT);
  });
});

describe("Testing story 4", () => {
  const testDocAllFields = {
    title: "Coordinates test",
    description: "This one will be tested for all fields",
    type: DocumentType.Informative,
    scale: { type: ScaleType.BlueprintsOrEffect },
    stakeholders: [Stakeholder.KirunaKommun],
    issuanceDate: "2021-12-12",
    coordinates: { latitude: 45, longitude: 30 },
  };
  let testDocId: number;

  test("POST with All fields filled", async () => {
    const response = await request(app)
      .post("/documents/")
      .set("Cookie", plannerCookie)
      .send({ ...testDocAllFields });
    expect(response.status).toBe(StatusCodes.CREATED);
    expect(response.body.id).toBeDefined();
    expect(typeof response.body.id).toBe("number");
    testDocId = response.body.id;
  });

  describe("Urban Planner", () => {
    afterAll(async () => {
      await request(app).delete("/current/");
    });

    test("US 4.1 GET all documents as Urban Planner", async () => {
      const response = await request(app)
        .get("/documents/")
        .set("Cookie", plannerCookie);
      expect(response.status).toStrictEqual(StatusCodes.OK);
      expect(response.body).toBeInstanceOf(Array);
    });

    test("US 4.4 GET with ID as a Urban Planner", async () => {
      const response = await request(app)
        .get(`/documents/${testDocId}`)
        .set("Cookie", plannerCookie);
      expect(response.status).toStrictEqual(StatusCodes.OK);
    });

    test("US 4.7 GET with non existing ID as Urban Planner", async () => {
      const response = await request(app)
        .get("/documents/5")
        .set("Cookie", plannerCookie);
      expect(response.status).toStrictEqual(StatusCodes.BAD_REQUEST);
    });

    test("US 4.8 GET with wrong ID as Urban Planner", async () => {
      const response = await request(app)
        .get("/documents/-1")
        .set("Cookie", plannerCookie);
      expect(response.status).toStrictEqual(StatusCodes.BAD_REQUEST);
    });
  });

  describe("Visitor", () => {
    test("US 4.2 GET all documents as Visitor", async () => {
      const response = await request(app).get("/documents/");
      expect(response.status).toStrictEqual(StatusCodes.OK);
      expect(response.body).toBeInstanceOf(Array);
    });

    test("US 4.5 GET with ID as a Visitor", async () => {
      const response = await request(app).get(`/documents/${testDocId}`);
      expect(response.status).toStrictEqual(StatusCodes.OK);
    });

    test("US 4.7 GET with non existing ID as Urban Planner", async () => {
      const response = await request(app).get("/documents/5");
      expect(response.status).toStrictEqual(StatusCodes.BAD_REQUEST);
    });

    test("US 4.8 GET with wrong ID as Visitor", async () => {
      const response = await request(app).get("/documents/0");
      expect(response.status).toStrictEqual(StatusCodes.BAD_REQUEST);
    });
  });

  describe("Resident", () => {
    beforeAll(async () => {
      residentCookie = await loginAsResident();
    });

    test("US 4.3 GET all documents as Resident", async () => {
      const response = await request(app)
        .get("/documents/")
        .set("Cookie", residentCookie);
      expect(response.status).toStrictEqual(StatusCodes.OK);
      expect(response.body).toBeInstanceOf(Array);
    });

    test("US 4.6 GET with ID as a Resident", async () => {
      const response = await request(app)
        .get(`/documents/${testDocId}`)
        .set("Cookie", residentCookie);
      expect(response.status).toStrictEqual(StatusCodes.OK);
    });
    // Verificar si este error esta mal escrito en el documento de document.router
    test("US 4.7 GET with non existing ID as Urban Planner", async () => {
      const response = await request(app)
        .get("/documents/5")
        .set("Cookie", residentCookie);
      expect(response.status).toStrictEqual(StatusCodes.BAD_REQUEST);
    });

    test("US 4.8 GET with wrong ID as Resident", async () => {
      const response = await request(app).get("/documents/-20");
      expect(response.status).toStrictEqual(StatusCodes.BAD_REQUEST);
    });
  });
});

// describe("Testing story 5", () => {

// });
