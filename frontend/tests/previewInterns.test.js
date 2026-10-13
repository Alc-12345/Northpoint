import test from "node:test";
import assert from "node:assert/strict";
import { getPreviewInterns, addPreviewIntern, getPreviewOfferEmployees, addPreviewOfferEmployee } from "../src/utils/previewInterns.js";

const storage = () => {
  const entries = new Map();
  return { getItem: key => entries.get(key) ?? null, setItem: (key, value) => entries.set(key, value) };
};

test("preview interns persist within the session without requiring an API token", () => {
  globalThis.sessionStorage = storage(); globalThis.localStorage = storage();
  localStorage.setItem("authUser", JSON.stringify({ role: "admin" }));
  assert.deepEqual(getPreviewInterns(), []);
  const intern = addPreviewIntern({ candidateName: "Test Intern", duration: "3" });
  assert.ok(intern._id);
  assert.deepEqual(getPreviewInterns(), [intern]);
});

test("non-admin preview users cannot add interns", () => {
  globalThis.sessionStorage = storage(); globalThis.localStorage = storage();
  for (const role of ["hr", "employee", "client"]) {
    localStorage.setItem("authUser", JSON.stringify({ role }));
    assert.throws(() => addPreviewIntern({ candidateName: "Intern" }), /Only administrators/);
  }
  assert.deepEqual(getPreviewInterns(), []);
});


test("offer employee preview storage is separate from interns", () => {
  globalThis.sessionStorage = storage(); globalThis.localStorage = storage();
  localStorage.setItem("authUser", JSON.stringify({ role: "admin" }));
  const employee = addPreviewOfferEmployee({ candidateName: "Employee", employmentType: "Full-time" });
  assert.deepEqual(getPreviewOfferEmployees(), [employee]);
  assert.deepEqual(getPreviewInterns(), []);
  addPreviewIntern({ candidateName: "Intern", duration: "3" });
  assert.equal(getPreviewOfferEmployees().length, 1);
});
