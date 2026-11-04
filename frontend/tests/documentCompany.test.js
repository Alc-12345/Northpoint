import test from "node:test";
import assert from "node:assert/strict";
import { withDocumentCompany } from "../../backend/shared/documentCompany.js";
import { documentTypes } from "../../backend/shared/hrDocuments.js";
const company = { name: "Current Company", address: "Current billing address", email: "office@example.com", phone: "1234567890", taxId: "GST123", tagline: "Company tagline", termsAndConditions: "1. Deposit payable.\n\n2. Balance on delivery.", logo: "data:image/png;base64,logo" };
for (const type of ["quotation", "commercials"]) {
  test(`${type} uses current Invoice company settings over saved document values`, () => {
    const saved = { type, values: { companyName: "Old Company", companyAddress: "Old address", companyEmail: "old@example.com", companyWebsite: "old-site", recipientName: "Client", projectName: "Project", signatory: "Signer" }, items: [{ description: "Work" }], template: "{{companyName}}" };
    const output = withDocumentCompany(saved, company);
    assert.equal(output.values.companyName, company.name);
    assert.equal(output.values.companyAddress, company.address);
    assert.equal(output.values.companyEmail, company.email);
    assert.equal(output.values.companyPhone, company.phone);
    assert.equal(output.values.companyGstin, company.taxId);
    assert.equal(output.values.companyTagline, company.tagline);
    assert.equal(output.company.logo, company.logo);
    assert.equal(output.values.invoiceTerms, company.termsAndConditions);
    assert.equal(output.values.recipientName, "Client");
    assert.equal(output.values.signatory, "Signer");
    assert.equal(output.values.companyWebsite, "");
    assert.equal(saved.values.companyName, "Old Company");
    assert.equal(withDocumentCompany(saved, { ...company, phone: "" }).values.companyPhone, "");
  });
}
test("other HR letters retain their own company values and commercials have no revised scope inputs", () => {
  const letter = { type: "experience-letter", values: { companyName: "Employer" } };
  assert.equal(withDocumentCompany(letter, company), letter);
  assert.ok(!documentTypes.commercials.fields.some(field => ["revisedPhase", "revisedTimeline"].includes(field.key)));
});
