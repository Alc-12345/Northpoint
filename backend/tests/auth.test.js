import assert from "node:assert/strict";
import { after, before, beforeEach, describe, test } from "node:test";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";

import app from "../app.js";
import User from "../models/User.js";

let mongoServer;

before(async () => {
  process.env.JWT_SECRET = "test_jwt_secret";
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

after(async () => {
  await mongoose.disconnect();
  await mongoServer?.stop();
});

beforeEach(async () => {
  await User.deleteMany({});
});

describe("Auth API", () => {
  test("creates the first superadmin account", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Admin User",
        email: "admin@example.com",
        password: "secret123",
        role: "superadmin",
      })
      .expect(201)
      .expect("Content-Type", /json/);

    assert.equal(response.body.user.role, "superadmin");
    assert.ok(response.body.token);
    assert.equal(response.body.user.passwordHash, undefined);
  });

  test("lets superadmin create employee account", async () => {
    const adminResponse = await request(app).post("/api/auth/register").send({
      name: "Admin User",
      email: "admin@example.com",
      password: "secret123",
      role: "superadmin",
    });

    const response = await request(app)
      .post("/api/auth/register")
      .set("Authorization", `Bearer ${adminResponse.body.token}`)
      .send({
        name: "Employee User",
        email: "employee@example.com",
        password: "secret123",
        role: "employee",
      })
      .expect(201)
      .expect("Content-Type", /json/);

    assert.equal(response.body.user.role, "employee");
    assert.equal(response.body.user.email, "employee@example.com");
    assert.ok(response.body.user.createdBy);
  });

  test("blocks public employee account creation", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Employee User",
        email: "employee@example.com",
        password: "secret123",
        role: "employee",
      })
      .expect(403)
      .expect("Content-Type", /json/);

    assert.equal(
      response.body.message,
      "Only superadmin can create employee or client accounts"
    );
  });

  test("logs in with valid credentials", async () => {
    await request(app).post("/api/auth/register").send({
      name: "Admin User",
      email: "admin@example.com",
      password: "secret123",
      role: "superadmin",
    });

    const response = await request(app)
      .post("/api/auth/login")
      .send({ email: "admin@example.com", password: "secret123" })
      .expect(200)
      .expect("Content-Type", /json/);

    assert.equal(response.body.user.email, "admin@example.com");
    assert.equal(response.body.user.role, "superadmin");
    assert.ok(response.body.token);
  });
});
