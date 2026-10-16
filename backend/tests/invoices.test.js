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
let mongo, admin, employee;
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
    .set("Authorization", `Bearer ${token}`);
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
