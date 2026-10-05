import { documentTypes, fillTemplate, quotationTotals } from "../../shared/hrDocuments.js";

const escape = value => String(value ?? "").replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
const money = value => Number(value).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export function documentHtml(document) {
  const { values, type, template, items } = document;
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
