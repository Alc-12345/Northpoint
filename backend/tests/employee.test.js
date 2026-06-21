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

    expect(response.body).toMatchObject({
      name: "Test Employee",
      email: "test.employee@example.com",
      department: "Engineering",
      role: "Developer",
      project: "CRM Revamp",
      salary: 75000,
      skills: "React,Node.js,MongoDB",
      status: "Active",
    });
    expect(response.body._id).toBeDefined();
    expect(response.body.photo).toContain("data:image/png;base64,");
  });

  test("should return validation error for missing required fields", async () => {
    const response = await request(app)
      .post("/api/employees")
      .send({ email: "no.name@example.com" })
      .expect(400)
      .expect("Content-Type", /json/);

    expect(response.body.message).toBe("Validation failed");
    expect(response.body.errors).toEqual(
      expect.arrayContaining(["Employee name is required"])
    );
  });
});
