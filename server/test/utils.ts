import request from "supertest";
import app from "../src/app";
import { Database } from "../src/database";

/**
 * Register a planner account and login with said accound
 * email: testurban.planner@gmail.com
 */
export async function loginAsPlanner(): Promise<string> {
  let response = await request(app).post("/users").send({
    email: "testurban.planner@gmail.com",
    password: "plannerPassword",
    name: "Urbano",
    surname: "Planno",
    role: "urban_planner",
  });
  response = await request(app).post("/sessions").send({
    email: "testurban.planner@gmail.com",
    password: "plannerPassword",
  });
  const sessionCookie: string = response.header["set-cookie"][0];
  return sessionCookie;
}

export async function loginAsResident(): Promise<string> {
  let response = await request(app).post("/users").send({
    email: "testresident@gmail.com",
    password: "residentPassword",
    name: "Residente",
    surname: "resident",
    role: "resident",
  });
  response = await request(app).post("/sessions").send({
    email: "testresident@gmail.com",
    password: "residentPassword",
  });
  const sessionCookie: string = response.header["set-cookie"][0];
  return sessionCookie;
}

const tables = ["area", "polygon", "document", "user"];
export async function countEntriesInTable(table: string): Promise<number> {
  if (!tables.includes(table)) {
    throw new Error(`Invalid database table named ${table}`);
  }
  const result = await Database.query(`SELECT COUNT(*) FROM ${table};`);
  const count = Number(result.rows[0].count);
  return count;
}
