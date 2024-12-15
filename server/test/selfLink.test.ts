import { StatusCodes } from "http-status-codes";
import request from "supertest";
import app from "../src/app";
import { Database } from "../src/database";
import { DocumentType } from "../src/model/document";
import { LinkType } from "../src/model/link";
import { ScaleType } from "../src/model/scale";
import { loginAsPlanner } from "./utils";

let plannerCookie: string;
const document = {
  title: "Self link",
  description: "Created to test self linking bad requests",
  type: DocumentType.Prescriptive,
  scale: { type: ScaleType.Text },
  issuanceTime: "2024-12",
};

beforeAll(async () => {
  plannerCookie = await loginAsPlanner();
});

afterAll(async () => {
  await Database.disconnect();
});

test("Linking a document with itself should return a BAD_REQUEST", async () => {
  let response = await request(app)
    .post("/documents")
    .set("Cookie", plannerCookie)
    .send(document);
  expect(response.status).toStrictEqual(StatusCodes.CREATED);
  const { id } = response.body;
  expect(id).toBeDefined();
  expect(typeof id).toBe("number");
  response = await request(app)
    .put(`/documents/${id}/links`)
    .set("Cookie", plannerCookie)
    .send({
      targetDocumentId: id,
      linkTypes: [LinkType.Collateral, LinkType.Direct],
    });
  expect(response.status).toStrictEqual(StatusCodes.BAD_REQUEST);
  await request(app).del(`/documents/${id}`);
});
