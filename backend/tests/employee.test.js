import assert from "node:assert/strict";
import { describe, test, before, after, beforeEach } from "node:test";
import mongoose from "mongoose";
import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../app.js";
import Employee from "../models/Employee.js";

let mongoServer;

before(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  await mongoose.connect(uri);
});

after(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await Employee.deleteMany({});
});

describe("Employee API", () => {
  test("should create a new employee", async () => {
    const payload = {
      name: "Test Employee",
      email: "test.employee@example.com",
      phone: "1234567890",
      department: "Engineering",
      role: "Developer",
      project: "CRM Revamp",
      salary: 75000,
      joiningDate: "2026-06-20",
      skills: "React,Node.js,MongoDB",
      status: "Active",
      photo: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA",
    };

    const response = await request(app)
      .post("/api/employees")
      .send(payload)
      .expect(201)
      .expect("Content-Type", /json/);

    assert.equal(response.body.name, payload.name);
    assert.equal(response.body.email, payload.email);
    assert.equal(response.body.department, payload.department);
    assert.ok(response.body._id);
    assert.ok(response.body.photo.includes("data:image/png;base64,"));
  });

  test("should return validation error for missing required fields", async () => {
    const response = await request(app)
      .post("/api/employees")
      .send({ email: "no.name@example.com" })
      .expect(400)
      .expect("Content-Type", /json/);

    assert.equal(response.body.message, "Validation failed");
    assert.ok(response.body.errors.includes("Employee name is required"));
  });
});
