import assert from "node:assert/strict";
import { after, before, beforeEach, describe, test } from "node:test";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";

import app from "../app.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import Lead from "../models/Lead.js";

let mongoServer;
let adminToken;
let employeeToken;
let superadminToken;

before(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
  for (const role of ["admin", "employee", "superadmin"]) {
    const user = new User({ name: role, email: `${role}@test.example`, username: `test${role}`, role });
    user.setPassword("TestPassword!2026");
    await user.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "dev_jwt_secret_change_me");
    if (role === "admin") adminToken = token;
    else if (role === "employee") employeeToken = token;
    else superadminToken = token;
  }
});

after(async () => {
  await mongoose.disconnect();
  await mongoServer?.stop();
});

beforeEach(async () => {
  await Lead.deleteMany({});
});

describe("Lead API", () => {
  test("allows admin to create a lead", async () => {
    const response = await request(app)
      .post("/api/leads")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Website Visitor",
        email: "visitor@example.com",
        phone: "1234567890",
        company: "Example Co",
        service: "CRM Development",
        budget: "5000-10000",
        message: "Please contact me about a project.",
      })
      .expect(201)
      .expect("Content-Type", /json/);

    assert.equal(response.body.message, "Lead submitted successfully");
    assert.equal(response.body.lead.email, "visitor@example.com");
    assert.equal(response.body.lead.source, "company-website");
    assert.equal(response.body.lead.status, "New");
  });
});

test("admin and superadmin can list leads; employee and missing sessions are rejected", async () => {
  for (const token of [adminToken, superadminToken]) await request(app).get("/api/leads").set("Authorization", `Bearer ${token}`).expect(200);
  await request(app).get("/api/leads").set("Authorization", `Bearer ${employeeToken}`).expect(403);
  await request(app).get("/api/leads").expect(401);
});
test("test-style usernames log in with surrounding spaces and return the expected role", async () => {
  for (const role of ["admin", "employee"]) {
    const response = await request(app).post("/api/auth/login").send({ identifier: ` TEST${role.toUpperCase()} `, password: "TestPassword!2026" }).expect(200);
    assert.equal(response.body.user.role, role);
    assert.ok(response.body.token);
  }
  await request(app).post("/api/auth/login").send({ identifier: "testadmin", password: "wrong-password" }).expect(401);
});
