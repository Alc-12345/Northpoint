import { amountInWords } from "./amountInWords.js";
import { documentTypes, fillTemplate, quotationTotals } from "../../../backend/shared/hrDocuments.js";

const escape = value => String(value ?? "").replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
const money = value => Number(value).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function quotationHtml({ values: v, items = [], template }) {
  const totals = quotationTotals(items, v.taxRate);
  const field = (label, value) => `<p><b>${label}</b><span>${escape(value)}</span></p>`;
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escape(v.documentNumber)} - Quotation</title><style>
  *{box-sizing:border-box}body{font:14px/1.5 Arial,sans-serif;color:#1f242b;background:#eee;margin:0}main{max-width:850px;margin:24px auto;background:white;padding:30px}header{display:flex;justify-content:space-between;align-items:center;gap:20px;border-bottom:1px solid #ccd1d9;margin-bottom:18px;padding-bottom:18px}header strong{font-size:22px}h1{font-size:30px;margin:0}h2{font-size:11px;background:#edf0f5;padding:6px;text-transform:uppercase;margin:0 0 12px}.columns{display:grid;grid-template-columns:1.3fr 1fr 1fr;gap:18px}.columns section+section{border-left:1px solid #ccd1d9;padding-left:14px}p{margin:0 0 12px;white-space:pre-wrap;overflow-wrap:anywhere}p b{display:block;font-size:10px;text-transform:uppercase}p span{display:block}table{border-collapse:collapse;width:100%;table-layout:fixed;margin:20px 0}th{background:#edf0f5;font-size:11px;text-transform:uppercase}th,td{text-align:right;padding:10px 6px;border-bottom:1px solid #ccd1d9;vertical-align:top;overflow-wrap:anywhere}th:first-child,td:first-child{text-align:left;width:49%;white-space:pre-wrap}.summary,.terms{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin:24px 0}.totals div{display:flex;justify-content:space-between;gap:12px;padding:6px}.total{background:#edf0f5;font-weight:bold}.letter{white-space:pre-wrap;overflow-wrap:anywhere}.signature{text-align:right;border-top:1px solid #ccd1d9;padding-top:15px;margin-top:30px}.project{margin-top:20px}@page{size:A4;margin:12mm}@media screen and (max-width:600px){.columns,.summary,.terms{grid-template-columns:1fr}main{padding:16px}header{flex-wrap:wrap}}@media print{body{background:white}main{padding:0;margin:0;max-width:none}tr,.summary,.signature{break-inside:avoid}thead{display:table-header-group}h2{break-after:avoid}}
  </style></head><body><main><header><strong>${escape(v.companyName)}</strong><h1>QUOTATION</h1></header>
  <div class="columns"><section><h2>From</h2>${field("Company name", v.companyName)}${field("Company address", v.companyAddress)}</section><section><h2>Bill to</h2>${field("Client name", v.recipientName)}${field("Client address", v.recipientAddress)}${field("Client email", v.recipientEmail)}</section><section><h2>Quotation details</h2>${field("Quotation no.", v.documentNumber)}${field("Issued", v.issueDate)}${field("Valid until", v.validUntil)}</section></div>
  <div class="project">${field("Project / service", v.projectName)}${field("Scope of work", v.scope)}</div>
  <table aria-label="Quotation items"><thead><tr><th>Description</th><th>Qty</th><th>Rate (INR)</th><th>Amount (INR)</th></tr></thead><tbody>${items.map(item => `<tr><td>${escape(item.description)}</td><td>${escape(item.quantity)}</td><td>${money(item.rate)}</td><td>${money(Number(item.quantity) * Number(item.rate))}</td></tr>`).join("")}</tbody></table>
  <div class="summary"><section><h2>Amount in words</h2>${escape(amountInWords(totals.total))}</section><section class="totals"><div><span>Subtotal</span><span>INR ${money(totals.subtotal)}</span></div><div><span>Tax (${escape(v.taxRate)}%)</span><span>INR ${money(totals.tax)}</span></div><div class="total"><span>Total</span><span>INR ${money(totals.total)}</span></div></section></div>
  <div class="terms"><section><h2>Payment & delivery</h2>${field("Payment terms", v.paymentTerms)}${field("Delivery timeline", v.deliveryTimeline)}</section><section><h2>Terms & conditions</h2><div class="letter">${escape(fillTemplate(template, v))}</div></section></div><div class="signature">${field("Authorized signatory", v.signatory)}For ${escape(v.companyName)}</div></main></body></html>`;
}

export function documentHtml(document) {
  if (document.type === "quotation") return quotationHtml(document);
  const { values, type, template, items } = document;
  if (documentTypes[type].allowBlank) {
    const header = type === "letterhead" ? `<header><h1>${escape(values.companyName)}</h1><div>${escape(values.companyAddress)}</div></header>` : "";
    return `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${escape(values.documentNumber)} - ${escape(documentTypes[type].title)}</title><style>
    *{box-sizing:border-box}body{font:14px/1.8 Arial,sans-serif;color:#172033;background:#eee;margin:0}main{width:210mm;min-height:297mm;padding:20mm;margin:24px auto;background:white}header{border-bottom:3px solid #18a8e6;padding-bottom:16px;margin-bottom:24px;white-space:pre-wrap;overflow-wrap:anywhere}h1{margin:0;font-size:26px}.writing-space{min-height:220mm;white-space:pre-wrap;overflow-wrap:anywhere}@page{size:A4;margin:20mm}@media print{body{background:white}main{width:auto;min-height:257mm;padding:0;margin:0}header{break-inside:avoid}.writing-space{min-height:210mm}}@media screen and (max-width:800px){main{width:100%;padding:24px}}</style></head><body><main>${header}<div class="writing-space">${escape(fillTemplate(template, values))}</div></main></body></html>`;
  }
  const totals = quotationTotals(items, values.taxRate);
  const details = documentTypes[type].fields.filter(field => values[field.key] !== "" && values[field.key] != null).map(field => `<tr><th>${escape(field.label)}</th><td>${escape(values[field.key])}</td></tr>`).join("");
  const quotation = type === "quotation" ? `<h2>Pricing (INR)</h2><table><thead><tr><th>Description</th><th>Quantity</th><th>Rate</th><th>Amount</th></tr></thead><tbody>${items.map(item => `<tr><td>${escape(item.description)}</td><td>${escape(item.quantity)}</td><td>${money(item.rate)}</td><td>${money(item.quantity * item.rate)}</td></tr>`).join("")}</tbody></table><div class="totals">Subtotal: INR ${money(totals.subtotal)}<br>Tax (${escape(values.taxRate)}%): INR ${money(totals.tax)}<br><strong>Total: INR ${money(totals.total)}</strong></div>` : "";
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escape(values.documentNumber)} - ${escape(documentTypes[type].title)}</title><style>body{font:14px/1.7 Arial,sans-serif;color:#172033;background:#eee;margin:0}main{max-width:760px;margin:30px auto;background:white;padding:48px}header{border-bottom:3px solid #18a8e6;padding-bottom:18px;margin-bottom:26px}h1{margin:0;font-size:26px}h2{font-size:18px}.address,.letter,td{white-space:pre-wrap;overflow-wrap:anywhere}.meta{color:#536170}.letter{margin:30px 0}table{border-collapse:collapse;width:100%;margin:16px 0}td,th{border:1px solid #ddd;padding:9px;text-align:left;vertical-align:top}th{background:#f5f7fa}.totals{text-align:right;margin-top:20px}@page{size:A4;margin:18mm}@media print{body{background:white}main{padding:0;margin:0;max-width:none}tr{break-inside:avoid}header{break-inside:avoid}}</style></head><body><main><header><h1>${escape(values.companyName)}</h1><div class="address">${escape(values.companyAddress)}</div></header><h2>${escape(documentTypes[type].title)}</h2><div class="meta">${escape(values.documentNumber)} · ${escape(values.issueDate)}</div><p>To: <strong>${escape(values.recipientName)}</strong><br>${escape(values.recipientEmail)}</p><div class="address">${escape(values.recipientAddress)}</div><div class="letter">${escape(fillTemplate(template, values))}</div>${quotation}<h2>Document Details</h2><table>${details}</table></main></body></html>`;
}

export function downloadDocument(document) {
  const url = URL.createObjectURL(new Blob([documentHtml(document)], { type: "text/html;charset=utf-8" }));
  const anchor = window.document.createElement("a");
  anchor.href = url;
  anchor.download = `${document.values.documentNumber.replace(/[^a-zA-Z0-9_-]/g, "_") || document.type}.html`;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function printDocument(document) {
  const preview = window.open("", "_blank");
  if (!preview) throw new Error("Allow pop-ups to open the PDF / print preview.");
  preview.document.write(documentHtml(document));
  preview.document.close();
  preview.focus();
  preview.print();
}
