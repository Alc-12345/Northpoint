import { before, after, test } from "node:test";
import assert from "node:assert/strict";
import mongoose from "mongoose";
import request from "supertest";
import jwt from "jsonwebtoken";
import { MongoMemoryServer } from "mongodb-memory-server";
import { documentHtml } from "../../src/utils/hrDocumentDownload.js";
import app from "../app.js";
import User from "../models/User.js";
import { documentTypes, validateDocument, quotationTotals, fillTemplate } from "../../shared/hrDocuments.js";

let mongo;
let adminToken;
let employeeToken;
before(async () => {
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());
  for (const role of ["admin", "employee"]) {
    const user = new User({ name: role, email: `${role}@example.com`, role });
    user.setPassword("test-password");
    await user.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "dev_jwt_secret_change_me");
    if (role === "admin") adminToken = token; else employeeToken = token;
  }
});
after(async () => { await mongoose.disconnect(); if (mongo) await mongo.stop(); });
const fields = type => Object.fromEntries(documentTypes[type].fields.map(field => [field.key, field.type === "number" ? "10" : field.type === "date" ? "2026-10-05" : field.type === "email" ? "person@example.com" : "Sample value"]));

test("HR documents require an administrator or HR login", async () => {
  await request(app).get("/api/hr/documents/internship").expect(401);
  await request(app).get("/api/hr/documents/internship").set("Authorization", `Bearer ${employeeToken}`).expect(403);
});
test("all three document types persist field values and custom formats and support editing", async () => {
  for (const type of Object.keys(documentTypes)) {
    const data = { values: fields(type), template: "Dear {{recipientName}}, welcome to {{companyName}}", items: type === "quotation" ? [{ description: "Design", quantity: 2, rate: 125.5 }] : [] };
    const created = await request(app).post(`/api/hr/documents/${type}`).set("Authorization", `Bearer ${adminToken}`).send(data).expect(201);
    const listed = await request(app).get(`/api/hr/documents/${type}`).set("Authorization", `Bearer ${adminToken}`).expect(200);
    assert.equal(listed.body[0]._id, created.body._id);
    assert.equal(listed.body[0].template, data.template);
    assert.deepEqual(listed.body[0].values, data.values);
    data.values.recipientName = "Updated Recipient";
    const updated = await request(app).put(`/api/hr/documents/${type}/${created.body._id}`).set("Authorization", `Bearer ${adminToken}`).send(data).expect(200);
    assert.equal(updated.body.values.recipientName, "Updated Recipient");
  }
});
test("invalid fields, quotation items, dates and placeholders are rejected", async () => {
  const values = fields("quotation");
  values.validUntil = "2026-10-01";
  const response = await request(app).post("/api/hr/documents/quotation").set("Authorization", `Bearer ${adminToken}`).send({ values, items: [{ description: "Design", quantity: -1, rate: 10 }], template: "{{unknown}}" }).expect(400);
  assert.ok(response.body.errors.includes("Validity date must be on or after issue date"));
  assert.ok(response.body.errors.includes("Unknown template field: unknown"));
  assert.ok(validateDocument("internship", null).length);
});
test("quotation totals round to currency precision and substitution preserves literal field values", () => {
  assert.deepEqual(quotationTotals([{ quantity: 3, rate: 100.01 }], 18), { subtotal: 300.03, tax: 54.01, total: 354.04 });
  assert.equal(fillTemplate("Dear {{recipientName}}", { recipientName: "$& <Person>" }), "Dear $& <Person>");
});

test("downloaded layouts fill saved values, escape markup and include quotation totals", () => {
  const values = { ...fields("quotation"), recipientName: "<script>alert(1)</script>", taxRate: 18 };
  const html = documentHtml({ type: "quotation", values, template: "Dear {{recipientName}}", items: [{ description: "<Design>", quantity: 3, rate: 100.01 }] });
  assert.ok(html.includes("Dear &lt;script&gt;alert(1)&lt;/script&gt;"));
  assert.ok(!html.includes("<script>"));
  assert.ok(html.includes("Total: INR 354.04"));
  assert.ok(html.includes("&lt;Design&gt;"));
  assert.ok(validateDocument("toString", {}).includes("Unknown document type"));
});
