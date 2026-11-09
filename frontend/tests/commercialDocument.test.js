import test from "node:test";
import assert from "node:assert/strict";
import { commercialHtml, phaseTotal } from "../src/utils/commercialDocument.js";
import { documentTypes, validateDocument } from "../../backend/shared/hrDocuments.js";
const values = Object.fromEntries(documentTypes.commercials.fields.filter(field => field.required).map(field => [field.key, field.type === "number" ? "150000" : field.type === "date" ? "2026-11-04" : field.type === "email" ? "client@example.com" : "Example"]));
const rows = [{ timeline: "April 2026", description: "Scope <review> & delivery", amount: "240000" }];
test("commercial report includes reference sections, escaped content, phase totals and negotiated final value", () => {
  const html = commercialHtml({ values: { ...values, originalTimeline: rows, revisedTimeline: [{ ...rows[0], amount: "160000" }], implementationStatus: "Awaiting approval", hostingNote: "AMC separately agreed", overview: "Project journey", invoiceTerms: "1. Invoice terms & conditions" }, template: documentTypes.commercials.template }, "data:image/png;base64,example");
  for (const text of ["COMMERCIAL JUSTIFICATION REPORT", "Original Development Phase", "Hosting, Server Infrastructure", "Closing Note", "ACCEPTANCE &amp; SIGNATURE", "Austin Legacy Corp LLP", "Ashish Patrick Austin", "Founder & Chief Executive Officer", "For Example", "4th Nov 2026", "₹2,40,000", "₹1,50,000.00", "Scope &lt;review&gt; &amp; delivery", 'src="data:image/png;base64,example"']) assert.ok(html.includes(text), text);
  for (const removed of ["Implementation Status Note", "Awaiting approval", "Terms & Conditions", "Invoice terms &amp; conditions", "Additional Commercial Terms"]) assert.ok(!html.includes(removed), removed);
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

test("dates use ordinal days and preserve periods and invalid dates", async () => {
  const { formatDocumentDate } = await import("../src/utils/documentDate.js");
  for (const [input, expected] of [["2026-12-09", "9th Dec 2026"], ["2026-01-01", "1st Jan 2026"], ["2026-01-02", "2nd Jan 2026"], ["2026-01-03", "3rd Jan 2026"], ["2026-01-11", "11th Jan 2026"], ["2026-01-12", "12th Jan 2026"], ["2026-01-13", "13th Jan 2026"], ["2026-01-21", "21st Jan 2026"], ["2026-02-30", "2026-02-30"], ["April – June 2026", "April – June 2026"]]) assert.equal(formatDocumentDate(input), expected);
});
test("acceptance uses escaped client details and fixed issuer", () => {
  const html = commercialHtml({ values: { ...values, recipientName: "Client <Ltd>", clientSignatory: "Jane & John", clientSignatoryTitle: "Director", companyName: "Different issuer", signatory: "Someone else" }, template: "" }, "logo");
  const acceptance = html.slice(html.indexOf('<section class="acceptance">'));
  for (const text of ["For Client &lt;Ltd&gt;", "Jane &amp; John", "Director", "For Austin Legacy Corp LLP", "Ashish Patrick Austin"]) assert.ok(acceptance.includes(text));
  assert.ok(!acceptance.includes("Different issuer"));
});

test("older commercial drafts adopt current fields and closing note without losing client details", async () => {
  const { normalizeCommercialDraft } = await import("../../backend/shared/hrDocuments.js");
  const draft = { type: "commercials", values: { ...values, implementationStatus: "Pending", terms: "Old terms", invoiceTerms: "Invoice terms" }, template: "Review scope, implementation status, and commercial terms above. {{implementationStatus}}{{terms}}{{invoiceTerms}} {{recipientName}}" };
  const updated = normalizeCommercialDraft(draft);
  assert.equal(updated.values.recipientName, values.recipientName);
  for (const key of ["implementationStatus", "terms", "invoiceTerms"]) assert.ok(!(key in updated.values));
  assert.equal(updated.template, "Review scope and commercial details above.  {{recipientName}}");
  assert.deepEqual(validateDocument("commercials", updated.values, [], updated.template), []);
  assert.equal(draft.values.implementationStatus, "Pending");
  const html = commercialHtml(draft, "logo");
  assert.ok(html.includes("ACCEPTANCE &amp; SIGNATURE"));
  assert.ok(!html.includes("Old terms"));
  assert.ok(!html.includes("implementation status"));
  assert.equal(normalizeCommercialDraft({ type: "quotation", values }).values, values);
});
