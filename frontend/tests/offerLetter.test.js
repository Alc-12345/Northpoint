import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import JSZip from "jszip";
import { fillOfferLetter, offerLetterFields, remunerationWords, offerLetterParagraphs, salaryBreakdown } from "../src/utils/offerLetterDownload.js";
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

test('admin paragraph edits reach terms and annexure while retaining document assets', async () => {
  const bytes = await readFile(new URL('../public/templates/offer-letter.docx', import.meta.url));
  const paragraphs = await offerLetterParagraphs(bytes);
  const notice = paragraphs.find(row => row.text.startsWith('Either party may terminate'));
  const annexure = paragraphs.find(row => row.text.startsWith('The above remuneration'));
  const heading = paragraphs.find(row => row.text === 'Annexure I');
  assert.ok(notice && annexure && heading);
  const filled = await JSZip.loadAsync(await fillOfferLetter(bytes, { ...values, paragraphEdits: {
    [notice.index]: 'Notice: 60 days & approval.\nApplies to {{candidateName}}.',
    [annexure.index]: 'Revised annexure conditions <approved>.',
    [heading.index]: 'Annexure I — Updated',
  } }));
  const xml = await filled.file('word/document.xml').async('string');
  assert.ok(xml.includes('Notice: 60 days &amp; approval.'));
  assert.ok(xml.includes('<w:br/>'));
  assert.ok(xml.includes('Applies to Aditi &amp; &lt;Sharma&gt;.'));
  assert.ok(xml.includes('Revised annexure conditions &lt;approved&gt;.'));
  assert.ok(xml.includes('Annexure I — Updated'));
  assert.ok(!xml.includes('Either party may terminate'));
  assert.ok(!xml.includes('{{'));
});


test('optional ESI, PF and bonus rows update the PDF salary table with correct annual totals', async () => {
  const salaryComponents = [
    { label: 'ESI', type: 'deduction', frequency: 'monthly', amount: '150' },
    { label: 'PF', type: 'deduction', frequency: 'monthly', amount: '1800' },
    { label: 'Additional bonus', type: 'earning', frequency: 'annual', amount: '10000' },
    { label: 'Allowance & <benefit>', type: 'earning', frequency: 'monthly', amount: '500' },
  ];
  const result = salaryBreakdown({ ...values, salaryComponents });
  assert.equal(result.annualEarnings, 256000);
  assert.equal(result.annualDeductions, 23400);
  assert.equal(result.annualNet, 232600);
  assert.equal(result.components[2].monthly, null);
  const bytes = await readFile(new URL('../public/templates/offer-letter.docx', import.meta.url));
  const filled = await JSZip.loadAsync(await fillOfferLetter(bytes, { ...values, salaryComponents }));
  const xml = await filled.file('word/document.xml').async('string');
  for (const text of ['ESI', 'PF', 'Additional bonus', 'Allowance &amp; &lt;benefit&gt;', '₹2,56,000', '₹23,400', '₹2,32,600', 'Deduction (monthly)', 'Additional earning (annual)']) assert.ok(xml.includes(text), text);
  assert.ok(!xml.includes('{{'));
  assert.ok(!xml.includes('Annualized Compensation'));
  assert.equal(salaryBreakdown(values).annualNet, 240000);
  const plain = await JSZip.loadAsync(await fillOfferLetter(bytes, { ...values, salaryComponents: [] }));
  assert.ok(!(await plain.file('word/document.xml').async('string')).includes('Employee deductions'));
});

test('invalid salary component amounts and excessive deductions are rejected', () => {
  const row = { label: 'PF', type: 'deduction', frequency: 'monthly', amount: '1800' };
  for (const update of [{ amount: '' }, { amount: '-1' }, { amount: 'NaN' }, { amount: '30000' }, { label: '' }, { frequency: 'weekly' }, { type: 'unknown' }]) {
    assert.throws(() => salaryBreakdown({ ...values, salaryComponents: [{ ...row, ...update }] }));
  }
  assert.throws(() => salaryBreakdown({ ...values, salaryComponents: Array(31).fill(row) }));
  const result = salaryBreakdown({ ...values, salaryComponents: [{ ...row, amount: '0' }] });
  assert.equal(result.annualDeductions, 0);
});
