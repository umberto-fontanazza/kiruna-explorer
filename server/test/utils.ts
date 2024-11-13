import request from "supertest";
import app from "../src/app";

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