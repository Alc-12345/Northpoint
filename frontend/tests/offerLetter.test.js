import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import JSZip from "jszip";
import { fillOfferLetter, offerLetterFields, remunerationWords } from "../src/utils/offerLetterDownload.js";
const values = { candidateName: 'Aditi & <Sharma>', role: 'Engineer & Developer', startDate: '2026-11-21', issueDate: '2026-10-13', monthlySalary: '20000', salaryWords: 'Rupees Two Lakh Forty Thousand Only', paymentRemarks: 'Payable monthly', reviewCycle: 'Annual Review Cycle', variableIncentive: 'Discretionary', incentiveRemarks: 'Subject to Company Performance' };
test('offer letter fills all fields and preserves template formatting and assets', async () => {
  const bytes = await readFile(new URL('../public/templates/offer-letter.docx', import.meta.url));
  const original = await JSZip.loadAsync(bytes);
  const filled = await JSZip.loadAsync(await fillOfferLetter(bytes, values));
  const xml = await filled.file('word/document.xml').async('string');
  assert.ok(!xml.includes('{{'));
  assert.ok(!xml.includes('Prerit'));
  assert.ok(xml.includes('Aditi &amp; &lt;Sharma&gt;'));
  assert.ok(xml.includes('Engineer &amp; Developer'));
  assert.ok(xml.includes('₹20,000'));
  assert.ok(xml.includes('₹2,40,000'));
  assert.ok(xml.includes('Annexure I'));
  assert.ok(xml.includes('11. Company Policies'));
  const stripText = text => text.replace(/(<w:t(?:\s[^>]*)?>).*?(<\/w:t>)/gs, '$1$2');
  assert.equal(stripText(xml), stripText(await original.file('word/document.xml').async('string')));
  for (const name of Object.keys(original.files)) {
    if (!original.files[name].dir && name !== 'word/document.xml') assert.deepEqual(await filled.file(name).async('uint8array'), await original.file(name).async('uint8array'));
  }
});
test('offer remuneration and date fields calculate correctly', () => {
  const fields = offerLetterFields(values);
  assert.equal(fields.annualSalary, '2,40,000');
  assert.equal(fields.startOrdinal, 'st');
  assert.equal(fields.issueOrdinal, 'th');
  assert.equal(remunerationWords(180000), 'Rupees One Lakh Eighty Thousand Only');
  assert.equal(remunerationWords(240000), 'Rupees Two Lakh Forty Thousand Only');
  assert.throws(() => offerLetterFields({ ...values, startDate: '2026-02-30' }));
});
