import { withDocumentCompany } from "../../../backend/shared/documentCompany.js";
import { commercialHtml } from "./commercialDocument.js";
import commercialLogo from "../assets/austin-legacy-corp.png?inline";
import { amountInWords } from "./amountInWords.js";
import { documentTypes, fillTemplate, quotationTotals } from "../../../backend/shared/hrDocuments.js";

const escape = value => String(value ?? "").replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
const money = value => Number(value).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function quotationHtml({ values: v, items = [], company, paymentDetails = {} }) {
  const totals = quotationTotals(items, v.taxRate);
  const compactTerms = String(v.invoiceTerms || "").replace(/\n\s*\n/g, "\n").trim();
  const field = (label, value) => `<p><b>${label}</b><span>${escape(value)}</span></p>`;
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escape(v.documentNumber)} - Quotation</title><style>
  *{box-sizing:border-box}body{font:14px/1.5 Arial,sans-serif;color:#1f242b;background:#eee;margin:0}main{max-width:850px;margin:24px auto;background:white;padding:30px}header{display:flex;justify-content:space-between;align-items:center;gap:20px;border-bottom:1px solid #ccd1d9;margin-bottom:18px;padding-bottom:18px}.brand{width:340px;max-width:100%;min-width:0}.brand img{display:block;width:100%;height:auto;object-fit:contain}header{break-inside:avoid}h1{font-size:30px;margin:0}h2{font-size:11px;background:#edf0f5;padding:6px;text-transform:uppercase;margin:0 0 12px}.columns{display:grid;grid-template-columns:1.3fr 1fr 1fr;gap:18px}.columns section+section{border-left:1px solid #ccd1d9;padding-left:14px}p{margin:0 0 12px;white-space:pre-wrap;overflow-wrap:anywhere}p b{display:block;font-size:10px;text-transform:uppercase}p span{display:block}table{border-collapse:collapse;width:100%;table-layout:fixed;margin:20px 0}th{background:#edf0f5;font-size:11px;text-transform:uppercase}th,td{text-align:right;padding:10px 6px;border-bottom:1px solid #ccd1d9;vertical-align:top;overflow-wrap:anywhere}th:first-child,td:first-child{text-align:left;width:49%;white-space:pre-wrap}.summary{display:grid;grid-template-columns:1fr 1fr;align-items:start;gap:24px;margin:16px 0}.terms{display:grid;grid-template-columns:minmax(0,0.37fr) minmax(0,0.63fr);align-items:start;gap:22px;margin:20px 0}.terms h2{margin-bottom:16px}.terms .letter{padding:0 6px;font-size:13px;line-height:1.3}.bank-details{padding:0 6px}.bank-details p{margin:0 0 4px}.bank-details p b{font-size:11px}.bank-details p span{line-height:1.35}.payment{margin-top:16px}.summary h2,.terms h2{margin-bottom:8px}.payment p{padding:0 6px;margin-bottom:8px}.amount-words p{padding:0 6px;margin:0;text-align:left;line-height:1.6}.totals div{display:flex;justify-content:space-between;gap:12px;padding:6px}.total{background:#edf0f5;font-weight:bold}.letter{white-space:pre-wrap;overflow-wrap:anywhere}.signature{text-align:right;border-top:1px solid #ccd1d9;padding-top:15px;margin-top:30px}@page{size:A4;margin:12mm}@media screen and (max-width:600px){.columns,.summary,.terms{grid-template-columns:1fr}main{padding:16px}header{flex-wrap:wrap}}@media print{body{background:white}main{padding:0;margin:0;max-width:none}tr,.summary,.signature{break-inside:avoid}thead{display:table-header-group}h2{break-after:avoid}}
  </style></head><body><main><header><div class="brand"><img src="${escape(company?.logo || commercialLogo)}" alt="${escape(v.companyName)} logo"></div><h1>QUOTATION</h1></header>
  <div class="columns"><section><h2>From</h2>${field("Company name", v.companyName)}${field("Company address", v.companyAddress)}${[["GSTIN", v.companyGstin], ["Email", v.companyEmail], ["Phone", v.companyPhone]].filter(([, value]) => value).map(([label, value]) => field(label, value)).join("")}</section><section><h2>Bill to</h2>${field("Client name", v.recipientName)}${field("Client address", v.recipientAddress)}${field("Client email", v.recipientEmail)}</section><section><h2>Quotation details</h2>${field("Quotation no.", v.documentNumber)}${field("Issued", v.issueDate)}${field("Valid until", v.validUntil)}</section></div>
  <table aria-label="Quotation items"><thead><tr><th>Description</th><th>Qty</th><th>Rate (INR)</th><th>Amount (INR)</th></tr></thead><tbody>${items.map(item => `<tr><td>${escape(item.description)}</td><td>${escape(item.quantity)}</td><td>${money(item.rate)}</td><td>${money(Number(item.quantity) * Number(item.rate))}</td></tr>`).join("")}</tbody></table>
  <div class="summary"><section class="amount-words"><h2>Amount in words</h2><p>${escape(amountInWords(totals.total))}</p></section><section class="totals"><div><span>Subtotal</span><span>INR ${money(totals.subtotal)}</span></div><div><span>Tax (${escape(v.taxRate)}%)</span><span>INR ${money(totals.tax)}</span></div><div class="total"><span>Total</span><span>INR ${money(totals.total)}</span></div></section></div>
  <div class="terms"><section><h2>Payment details</h2><div class="bank-details">${[["Payment method", paymentDetails.method], ["Bank name", paymentDetails.bankName], ["Account name", paymentDetails.accountName], ["Account number", paymentDetails.accountNumber], ["IFSC code", paymentDetails.ifscCode]].filter(([, value]) => value).map(([label, value]) => field(label, value)).join("")}</div></section><section><h2>Terms &amp; conditions</h2><div class="letter">${escape(compactTerms)}</div></section></div><div class="signature">${field("Authorized signatory", v.signatory)}For ${escape(v.companyName)}</div></main></body></html>`;
}

export function documentHtml(document) {
  document = withDocumentCompany(document, document.company);
  if (document.type === "commercials") return commercialHtml(document, document.company?.logo || commercialLogo);
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
  preview.addEventListener("load", () => {
    preview.focus();
    preview.print();
  }, { once: true });
  preview.document.write(documentHtml(document));
  preview.document.close();
}
