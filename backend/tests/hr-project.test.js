import { describe, test, before, after, beforeEach } from "node:test";
import assert from "node:assert/strict";
import mongoose from "mongoose";
import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../app.js";
import Employee from "../models/Employee.js";
import Client from "../models/Client.js";
import Project from "../models/Project.js";

let mongoServer;

before(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

after(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await Promise.all([
    Employee.deleteMany({}),
    Client.deleteMany({}),
    Project.deleteMany({}),
  ]);
});

describe("HR and project API", () => {
  test("should create a project with a status value", async () => {
    const response = await request(app)
      .post("/api/projects")
      .send({ name: "Northpoint CRM", status: "Ongoing" })
      .expect(201)
      .expect("Content-Type", /json/);

    assert.equal(response.body.status, "Ongoing");
  });

  test("should return hr dashboard summary data", async () => {
    await Employee.create({
      name: "Jane Doe",
      email: "jane@example.com",
      status: "Pending",
    });
    await Client.create({
      name: "Contoso",
      industry: "Software",
      contact: "Ava",
      email: "ava@contoso.com",
      phone: "1234567890",
      status: "Ongoing",
    });
    await Project.create({
      name: "Portal Redesign",
      status: "Completed",
    });

    const response = await request(app).get("/api/hr").expect(200);

    assert.equal(response.body.summary.employees, 1);
    assert.equal(response.body.summary.clients, 1);
    assert.equal(response.body.summary.projects, 1);
    assert.equal(response.body.summary.completedProjects, 1);
  });
});
