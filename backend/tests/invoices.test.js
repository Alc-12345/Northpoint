import { before, after, test } from "node:test";
import assert from "node:assert/strict";
import mongoose from "mongoose";
import request from "supertest";
import jwt from "jsonwebtoken";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../app.js";
import User from "../models/User.js";
import Invoice from "../models/Invoice.js";
import {
  calculate,
  defaultSettings,
  validateInvoice,
} from "../shared/invoices.js";
process.env.INVOICE_ENCRYPTION_KEY = "ab".repeat(32);
let mongo, admin, employee, grant = "";
before(async () => {
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());
  await Invoice.init();
  for (const role of ["admin", "employee"]) {
    const user = new User({ name: role, email: `${role}@invoice.test`, role });
    user.setPassword("test-password");
    await user.save();
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "dev_jwt_secret_change_me",
    );
    if (role === "admin") admin = token;
    else employee = token;
  }
});
after(async () => {
  await mongoose.disconnect();
  await mongo?.stop();
});
const data = () => ({
  ...structuredClone(defaultSettings),
  invoiceNumber: "ALC-2026-0001",
  invoiceDate: "2026-10-16",
  dueDate: "2026-10-23",
  client: { name: "Example Client", email: "client@example.com" },
  items: [{ description: "Development", quantity: 3, rate: 3100 }],
  taxPercentage: 15,
  status: "Draft",
});
const api = (method, path, token = admin) =>
  request(app)
    [method](`/api/invoices${path}`)
    .set("Authorization", `Bearer ${token}`)
    .set("X-Invoice-Unlock", grant);
test("invoice endpoints require admin authentication", async () => {
  await request(app).get("/api/invoices").expect(401);
  for (const [method, path] of [
    ["get", ""],
    ["post", ""],
    ["get", "/settings"],
    ["put", "/settings"],
    ["get", "/000000000000000000000000"],
    ["put", "/000000000000000000000000"],
    ["delete", "/000000000000000000000000"],
  ])
    await api(method, path, employee).expect(403);
});
test("CRUD recalculates totals, enforces uniqueness and preserves snapshots", async () => {
  await api("post", "/amount-access/setup").send({ password: "invoice-test-password" }).expect(201);
  grant = (await api("post", "/amount-access/unlock").send({ password: "invoice-test-password" }).expect(200)).body.token;
  const body = data();
  body.company.paymentQr =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=";
  body.total = 1;
  body.items[0].amount = 1;
  const created = await api("post", "").send(body).expect(201);
  assert.equal(created.body.company.paymentQr, body.company.paymentQr);
  assert.equal(created.body.subtotal, 9300);
  assert.equal(created.body.taxAmount, 1395);
  assert.equal(created.body.total, 10695);
  assert.equal(created.body.items[0].amount, 9300);
  assert.ok(created.body.createdBy);
  const stored = await Invoice.collection.findOne({ _id: new mongoose.Types.ObjectId(created.body._id) });
  assert.ok(stored.financialData.startsWith("v1:"));
  for (const field of ["total", "subtotal", "taxAmount", "taxPercentage"])
    assert.equal(stored[field], undefined);
  assert.equal(stored.items?.length || 0, 0);
  assert.equal(created.body.financialData, undefined);
  assert.equal(created.headers["cache-control"], "no-store");
  await api("post", "").send(body).expect(409);
  assert.equal((await api("get", "").expect(200)).body.length, 1);
  const id = created.body._id;
  assert.equal(
    (await api("get", `/${id}`).expect(200)).body.paymentDetails.accountNumber,
    "2602220017926460",
  );
  body.taxPercentage = 18;
  body.status = "Paid";
  body.items.push({ description: "Support", quantity: 1, rate: 700 });
  assert.equal(
    (await api("put", `/${id}`).send(body).expect(200)).body.total,
    11800,
  );
  await api("put", "/settings")
    .send({
      ...defaultSettings,
      paymentDetails: {
        ...defaultSettings.paymentDetails,
        accountNumber: "123456789",
      },
    })
    .expect(200);
  assert.equal(
    (await api("get", "/settings").expect(200)).body.paymentDetails
      .accountNumber,
    "123456789",
  );
  assert.equal(
    (await api("get", `/${id}`).expect(200)).body.paymentDetails.accountNumber,
    "2602220017926460",
  );
  const updated = await Invoice.collection.findOne({ _id: stored._id });
  assert.equal(updated.total, undefined);
  assert.equal(updated.items, undefined);
  assert.notEqual(updated.financialData, stored.financialData);
  await api("delete", `/${id}`).expect(200);
  await api("get", `/${id}`).expect(404);
  await api("delete", `/${id}`).expect(404);
  await api("get", "/invalid").expect(400);
});
test("invalid dates, items, clients, bank details and taxes are rejected", async () => {
  for (const update of [
    { invoiceDate: "2026-02-30" },
    { dueDate: "2026-10-01" },
    { client: { name: "" } },
    { items: [] },
    { items: [{ description: "", quantity: 0, rate: -1 }] },
    { taxPercentage: -1 },
    { paymentDetails: { accountNumber: "123ABC" } },
    { paymentDetails: { ifscCode: "INVALID" } },
    { invoiceNumber: "../../bad" },
    { company: { ...defaultSettings.company, paymentQr: "invalid" } },
  ]) {
    const response = await api("post", "")
      .send({ ...data(), ...update })
      .expect(400);
    assert.ok(response.body.errors.length);
  }
  assert.equal(
    calculate([{ description: "Rounding", quantity: 3, rate: 0.1 }], 15).total,
    0.35,
  );
  assert.deepEqual(validateInvoice(data()), []);
});


test("amount password is admin-only, immutable and required for all saved financial responses", async () => {
  grant = "";
  await api("get", "/amount-access", employee).expect(403);
  await api("post", "/amount-access/setup", employee).send({ password: "another-password" }).expect(403);
  await api("post", "/amount-access/unlock", employee).send({ password: "invoice-test-password" }).expect(403);
  assert.equal((await api("get", "/amount-access").expect(200)).body.configured, true);
  await api("post", "/amount-access/setup").send({ password: "replacement-password" }).expect(409);
  await api("post", "/amount-access/unlock").send({ password: "wrong-password" }).expect(403);
  const created = (await api("post", "").send({ ...data(), invoiceNumber: "LOCKED-1" }).expect(201)).body;
  const id = created._id;
  for (const row of [created, (await api("get", `/${id}`).expect(200)).body, ...(await api("get", "").expect(200)).body]) {
    assert.equal(row.amountsLocked, true);
    for (const field of ["total", "subtotal", "taxAmount", "taxPercentage", "financialData"]) assert.equal(row[field], undefined);
    assert.deepEqual(row.items, []);
  }
  await api("put", `/${id}`).send(data()).expect(403);
  grant = "invalid-token";
  assert.equal((await api("get", `/${id}`).expect(200)).body.amountsLocked, true);
  grant = (await api("post", "/amount-access/unlock").send({ password: "invoice-test-password" }).expect(200)).body.token;
  assert.equal((await api("get", `/${id}`).expect(200)).body.total, 10695);
  await api("put", `/${id}`).send({ ...data(), invoiceNumber: "LOCKED-1" }).expect(200);
  const legacy = await Invoice.collection.insertOne({ invoiceNumber: "LEGACY", total: 123, items: [{ rate: 123 }] });
  grant = "";
  assert.equal((await api("get", `/${legacy.insertedId}`).expect(200)).body.total, undefined);
});
