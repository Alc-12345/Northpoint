import test from "node:test";
import assert from "node:assert/strict";
import { completionDate, certificateDate } from "../src/utils/internshipCertificate.js";

test("three- and six-month durations preserve calendar dates and clamp month ends", () => {
  assert.equal(completionDate("2026-05-22", "3"), "2026-08-22");
  assert.equal(completionDate("2026-05-22", "6"), "2026-11-22");
  assert.equal(completionDate("2026-01-31", "3"), "2026-04-30");
  assert.equal(completionDate("2026-08-31", "6"), "2027-02-28");
  assert.equal(completionDate("2023-08-31", "6"), "2024-02-29");
});

test("invalid dates and unsupported durations cannot produce a completion date", () => {
  assert.equal(completionDate("", "3"), "");
  assert.equal(completionDate("2026-02-30", "3"), "");
  assert.equal(completionDate("2026-01-01", "4"), "");
  assert.equal(certificateDate("2026-10-13"), "13 October 2026");
});
