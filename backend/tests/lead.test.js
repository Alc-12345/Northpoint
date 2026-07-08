import assert from "node:assert/strict";
import { after, before, beforeEach, describe, test } from "node:test";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";

import app from "../app.js";
import Lead from "../models/Lead.js";

let mongoServer;

before(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

after(async () => {
  await mongoose.disconnect();
  await mongoServer?.stop();
});

beforeEach(async () => {
  await Lead.deleteMany({});
});

describe("Lead API", () => {
  test("accepts a lead from company website form", async () => {
    const response = await request(app)
      .post("/api/leads")
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
