import test from "node:test";
import assert from "node:assert/strict";
import { readFile, writeFile } from "node:fs/promises";
import { PDFDocument, PDFDict, PDFName } from "pdf-lib";
import { quotationBundlePdf } from "../src/utils/quotationBundlePdf.js";
import { defaultSettings } from "../../backend/shared/invoices.js";
import { documentTypes, validateDocument } from "../../backend/shared/hrDocuments.js";
import { withDocumentCompany } from "../../backend/shared/documentCompany.js";
const fonts = await Promise.all(["latin-400", "latin-ext-400", "latin-700", "latin-ext-700"].map(name => readFile(new URL(`../public/fonts/noto-sans-${name}-normal.woff`, import.meta.url))));
const company = { ...defaultSettings.company, address: "Company address, City", paymentDetails: defaultSettings.paymentDetails, termsAndConditions: defaultSettings.termsAndConditions, logo: `data:image/png;base64,${(await readFile(new URL('../src/assets/austin-legacy-corp.png', import.meta.url))).toString('base64')}` };
const common = { documentNumber: "Q-001", issueDate: "2026-11-04", validUntil: "2026-12-04", recipientName: "Example Client", recipientEmail: "client@example.com", recipientAddress: "Client address", signatory: "Authorized Signatory", paymentTerms: "50% advance and balance on delivery", deliveryTimeline: "4 weeks", taxRate: 18 };
const quotation = withDocumentCompany({ type: "quotation", values: common, items: [{ description: "Design and implementation", quantity: 1, rate: 150000 }], template: documentTypes.quotation.template }, company);
const commercial = withDocumentCompany({ type: "commercials", values: { ...common, documentNumber: "Q-001-COM", projectName: "Automation", scope: "Development, testing and operational handover.", commercialValue: 177000, taxTerms: "GST included", overview: "Project overview", hostingItems: [{ service: "Basic Software AMC Charges", description: "Support", billingFrequency: "Monthly", cost: "1000" }], originalTimeline: [{ timeline: "November 2026", description: "Planning and implementation of workflows.", amount: 150000 }] }, template: documentTypes.commercials.template }, company);
test("quotation requires no project, scope or tagline and bundle has one A4 quotation page before commercials", async () => {
  assert.deepEqual(validateDocument("quotation", quotation.values, quotation.items, quotation.template), []);
  assert.ok(!documentTypes.quotation.fields.some(field => ["projectName", "scope", "companyTagline"].includes(field.key)));
  const blob = await quotationBundlePdf(quotation, commercial, fonts);
  const bytes = new Uint8Array(await blob.arrayBuffer());
  const pdf = await PDFDocument.load(bytes);
  assert.ok(pdf.getPageCount() >= 2);
  assert.ok(pdf.getPage(0).node.Resources().lookup(PDFName.of("XObject"), PDFDict).keys().length > 0, "Quotation page contains the fitted quotation content");
  for (const page of pdf.getPages()) assert.deepEqual(page.getSize(), { width: 595.28, height: 841.89 });
  assert.equal(pdf.getTitle(), "Quotation Q-001 and Commercials");
  await writeFile('/tmp/northpoint-quotation-bundle.pdf', bytes);
});
test("long commercial tables paginate after quotation without overflowing A4", async () => {
  const long = { ...commercial, values: { ...commercial.values, originalTimeline: Array.from({ length: 30 }, (_, i) => ({ timeline: `Phase ${i + 1}`, description: 'Work description. '.repeat(25), amount: 1000 })) } };
  const blob = await quotationBundlePdf(quotation, long, fonts);
  const pdf = await PDFDocument.load(await blob.arrayBuffer());
  assert.ok(pdf.getPageCount() > 4);
});
test("oversized quotations produce a clear one-page fit error", async () => {
  await assert.rejects(() => quotationBundlePdf({ ...quotation, items: Array.from({ length: 50 }, () => ({ description: "Long description ".repeat(20), quantity: 1, rate: 1 })) }, commercial, fonts), /too much content for one readable page/);
});
