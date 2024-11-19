import { StatusCodes } from "http-status-codes";
import { Database } from "../src/database";
import { loginAsPlanner } from "./utils";
import { DocumentType } from "../src/model/document";
import { ScaleType } from "../src/model/scale";
import { LinkType } from "../src/model/link";
import app from "../src/app";
import request from "supertest";

let plannerCookie: string;
const document = {
  title: "Self link",
  description: "Created to test self linking bad requests",
  type: DocumentType.Prescriptive,
  scale: { type: ScaleType.Text },
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
