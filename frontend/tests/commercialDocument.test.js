import test from "node:test";
import assert from "node:assert/strict";
import { commercialHtml, phaseTotal } from "../src/utils/commercialDocument.js";
import { documentTypes, validateDocument } from "../../backend/shared/hrDocuments.js";
const values = Object.fromEntries(documentTypes.commercials.fields.filter(field => field.required).map(field => [field.key, field.type === "number" ? "150000" : field.type === "date" ? "2026-11-04" : field.type === "email" ? "client@example.com" : "Example"]));
const rows = [{ timeline: "April 2026", description: "Scope <review> & delivery", amount: "240000" }];
test("commercial report includes reference sections, escaped content, phase totals and negotiated final value", () => {
  const html = commercialHtml({ values: { ...values, originalTimeline: rows, revisedTimeline: [{ ...rows[0], amount: "160000" }], implementationStatus: "Awaiting approval", hostingNote: "AMC separately agreed", overview: "Project journey", invoiceTerms: "1. Invoice terms & conditions" }, template: documentTypes.commercials.template }, "data:image/png;base64,example");
  for (const text of ["COMMERCIAL JUSTIFICATION REPORT", "Original Development Phase", "Implementation Status Note", "Hosting, Server Infrastructure", "Closing Note", "Terms & Conditions", "1. Invoice terms &amp; conditions", "Submitted for Review and Payment Processing", "₹2,40,000", "₹1,50,000.00", "Scope &lt;review&gt; &amp; delivery", 'src="data:image/png;base64,example"']) assert.ok(html.includes(text), text);
  assert.ok(!html.includes("{{"));
  assert.ok(!html.includes("Revised Project Scope"));
  assert.ok(!html.includes("₹1,60,000.00"));
  assert.equal(phaseTotal([{ amount: "0.10" }, { amount: "0.20" }]), 0.3);
});
test("commercial timeline validation rejects malformed rows and accepts old saved documents", () => {
  assert.deepEqual(validateDocument("commercials", values, [], documentTypes.commercials.template), []);
  assert.deepEqual(validateDocument("commercials", { ...values, originalTimeline: rows }, [], documentTypes.commercials.template), []);
  for (const bad of [{}, [{ ...rows[0], amount: -1 }], [{ ...rows[0], amount: "" }], [{ ...rows[0], description: "" }], Array(101).fill(rows[0])]) assert.ok(validateDocument("commercials", { ...values, originalTimeline: bad }, [], documentTypes.commercials.template).length);
  assert.ok(commercialHtml({ values, template: "Legacy {{projectName}}" }, "logo").includes("Legacy Example"));
});
