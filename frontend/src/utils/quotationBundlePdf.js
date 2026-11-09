import { formatDocumentDate, formatDocumentValues, commercialIssuer } from "./documentDate.js";
import { PDFDocument, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import { amountInWords } from "./amountInWords.js";
import { documentTypes, fillTemplate, quotationTotals } from "../../../backend/shared/hrDocuments.js";
import { phaseTotal } from "./commercialDocument.js";

const money = value => `₹${Number(value || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
const W = 595.28, H = 841.89, M = 28, WIDTH = W - M * 2;

export async function quotationBundlePdf(quotation, commercial, suppliedFonts) {
  const pdf = await PDFDocument.create();
  pdf.registerFontkit(fontkit);
  const fonts = await Promise.all(["latin-400", "latin-ext-400", "latin-700", "latin-ext-700"].map(async (name, i) => {
    const bytes = suppliedFonts?.[i] || await fetch(`${import.meta.env?.BASE_URL || "/"}fonts/noto-sans-${name}-normal.woff`).then(response => {
      if (!response.ok) throw new Error("Unable to load PDF fonts. Please retry.");
      return response.arrayBuffer();
    });
    const font = await pdf.embedFont(bytes, { subset: true });
    return { font, characters: new Set(font.getCharacterSet()) };
  }));
  const fontFor = (char, bold) => {
    const entry = fonts.slice(bold ? 2 : 0, bold ? 4 : 2).find(item => item.characters.has(char.codePointAt(0)));
    if (!entry) throw new Error(`The PDF font does not support “${char}”. Please use Latin characters.`);
    return entry.font;
  };
  const measure = (text, size, bold = false) => [...String(text)].reduce((sum, char) => sum + fontFor(char, bold).widthOfTextAtSize(char, size), 0);
  const wrap = (text, width, size, bold = false) => String(text ?? "").split("\n").flatMap(paragraph => {
    const lines = [];
    let line = "";
    for (const word of paragraph.split(/\s+/)) {
      if (line && measure(`${line} ${word}`, size, bold) > width) { lines.push(line); line = ""; }
      for (const char of (line ? " " : "") + word) {
        if (line && measure(line + char, size, bold) > width) { lines.push(line); line = ""; }
        line += char;
      }
    }
    return [...lines, line];
  });
  let page, y;
  const text = (value, x, top, size = 9, bold = false) => {
    for (const char of String(value)) {
      const font = fontFor(char, bold);
      page.drawText(char, { x, y: top - size, size, font, color: rgb(.12, .14, .17) });
      x += font.widthOfTextAtSize(char, size);
    }
  };
  let quoteMode = true;
  const nextPage = () => { page = pdf.addPage([W, quoteMode ? 20000 : H]); y = page.getHeight() - M; };
  const ensure = height => { if (!quoteMode && y - height < M) nextPage(); };
  const paragraph = (value, size = 9, bold = false, width = WIDTH, x = M) => {
    for (const line of wrap(value, width, size, bold)) { ensure(size * 1.45); text(line, x, y, size, bold); y -= size * 1.45; }
    y -= 5;
  };
  const heading = label => {
    ensure(38);
    page.drawRectangle({ x: M, y: y - 18, width: WIDTH, height: 18, color: rgb(.93, .94, .96) });
    text(label, M + 5, y - 3, 10, true); y -= 25;
  };
  const section = (label, value) => { if (value) { heading(label); paragraph(value, 9, false, WIDTH - 10, M + 5); y -= 5; } };
  const logo = async source => {
    if (!source) return;
    const response = await fetch(source);
    if (!response.ok) throw new Error("Unable to load the company logo.");
    const bytes = await response.arrayBuffer();
    const image = bytes.byteLength && new Uint8Array(bytes)[0] === 137 ? await pdf.embedPng(bytes) : await pdf.embedJpg(bytes);
    const scale = Math.min(260 / image.width, 95 / image.height);
    page.drawImage(image, { x: M, y: y - image.height * scale, width: image.width * scale, height: image.height * scale });
    y -= image.height * scale + 12;
  };
  const row = (cells, widths, bold = false, size = 9) => {
    const lines = cells.map((cell, i) => wrap(cell, widths[i] - 12, size, bold));
    let offset = 0;
    const count = Math.max(...lines.map(cell => cell.length));
    while (offset < count) {
      ensure(size * 1.4 + 12);
      const available = quoteMode ? count : Math.max(1, Math.floor((y - M - 12) / (size * 1.4)));
      const take = Math.min(count - offset, available);
      const height = take * size * 1.4 + 12;
      let x = M;
      cells.forEach((_, i) => {
        page.drawRectangle({ x, y: y - height, width: widths[i], height, borderWidth: .5, borderColor: rgb(.4, .4, .4) });
        lines[i].slice(offset, offset + take).forEach((line, index) => text(line, x + 6, y - 5 - index * size * 1.4, size, bold));
        x += widths[i];
      });
      y -= height; offset += take;
      if (offset < count) nextPage();
    }
  };
  nextPage();
  const q = formatDocumentValues(quotation.values);
  await logo(quotation.company?.logo);
  paragraph("QUOTATION", 21, true);
  const top = y;
  const columns = [
    ["FROM", [q.companyName, q.companyAddress, q.companyGstin && `GSTIN: ${q.companyGstin}`, q.companyEmail, q.companyPhone].filter(Boolean).join("\n")],
    ["BILL TO", [q.recipientName, q.recipientAddress, q.recipientEmail].filter(Boolean).join("\n")],
    ["QUOTATION DETAILS", `${q.documentNumber}\nIssued: ${q.issueDate}\nValid until: ${q.validUntil}`],
  ];
  let lowest = top;
  columns.forEach(([title, body], i) => {
    y = top; const x = M + i * WIDTH / 3;
    paragraph(title, 9, true, WIDTH / 3 - 12, x);
    paragraph(body, 9, false, WIDTH / 3 - 12, x);
    lowest = Math.min(lowest, y);
  });
  y = lowest - 10;
  const widths = [WIDTH * .52, WIDTH * .1, WIDTH * .18, WIDTH * .2];
  row(["Description", "Qty", "Rate", "Amount"], widths, true);
  quotation.items.forEach(item => row([item.description, item.quantity, money(item.rate), money(Number(item.quantity) * Number(item.rate))], widths));
  y -= 12;
  const totals = quotationTotals(quotation.items, q.taxRate);
  section("AMOUNT IN WORDS", amountInWords(Math.round(totals.total)));
  paragraph(`Subtotal: ${money(totals.subtotal)}     GST (${q.taxRate}%): ${money(totals.tax)}     Total: ${money(totals.total)}`, 10, true);
  const termsTop = y;
  const gap = 16, paymentWidth = WIDTH * .36, termsWidth = WIDTH - paymentWidth - gap;
  const columnHeading = (title, x, width) => {
    page.drawRectangle({ x, y: y - 18, width, height: 18, color: rgb(.93, .94, .96) });
    text(title, x + 5, y - 3, 9, true); y -= 28;
  };
  columnHeading("PAYMENT DETAILS", M, paymentWidth);
  const payment = quotation.paymentDetails || quotation.company?.paymentDetails || {};
  for (const [label, value] of [["PAYMENT METHOD", payment.method], ["BANK NAME", payment.bankName], ["ACCOUNT NAME", payment.accountName], ["ACCOUNT NUMBER", payment.accountNumber], ["IFSC CODE", payment.ifscCode]]) {
    if (!value) continue;
    paragraph(label, 8, true, paymentWidth - 10, M + 5);
    paragraph(value, 9, false, paymentWidth - 10, M + 5);
  }
  const paymentBottom = y;
  y = termsTop;
  const termsX = M + paymentWidth + gap;
  columnHeading("TERMS & CONDITIONS", termsX, termsWidth);
  paragraph(String(q.invoiceTerms || "").replace(/\n\s*\n/g, "\n").trim(), 8, false, termsWidth - 10, termsX + 5);
  y = Math.min(paymentBottom, y) - 12;
  paragraph(`Authorized signatory: ${q.signatory}\nFor ${q.companyName}`, 9, true);
  const quotePage = page;
  const used = quotePage.getHeight() - M - y;
  const scale = Math.min(1, (H - 2 * M) / used);
  if (scale < .7) throw new Error("This quotation has too much content for one readable page. Shorten item descriptions or terms before downloading.");
  const embedded = await pdf.embedPage(quotePage, { left: M, bottom: y, right: W - M, top: quotePage.getHeight() - M });
  pdf.removePage(0);
  page = pdf.addPage([W, H]);
  page.drawPage(embedded, { x: M, y: H - M - used * scale, width: WIDTH * scale, height: used * scale });
  quoteMode = false; nextPage();
  const c = formatDocumentValues(commercial.values);
  await logo(commercial.company?.logo);
  paragraph("COMMERCIAL JUSTIFICATION REPORT", 18, true);
  paragraph(`${c.companyName}\n${c.companyAddress}\n${[c.companyGstin && `GSTIN: ${c.companyGstin}`, c.companyEmail, c.companyPhone].filter(Boolean).join(" | ")}`);
  paragraph(`Prepared for ${c.recipientName}\n${c.documentNumber} | ${c.issueDate}\n${c.projectName}${c.projectPeriod ? ` | ${c.projectPeriod}` : ""}`, 10, true);
  section("Scope & Deliverables", c.scope);
  section("Project Overview & Commercial Justification", c.overview);
  if (c.originalTimeline?.length) {
    heading(`Original Development Phase${c.originalPhase ? `: ${c.originalPhase}` : ""}`);
    const widths = [WIDTH / 3, WIDTH / 3, WIDTH / 3];
    row(["Timeline", "Scope Expansion / Work Description", "Estimated Commercial Value (₹)"], widths, true);
    c.originalTimeline.forEach(item => row([formatDocumentDate(item.timeline), item.description, money(item.amount)], widths));
    const total = phaseTotal(c.originalTimeline);
    row(["Net Total Initial Commercial Value (₹)", `${money(total)} (${amountInWords(total)})`], [WIDTH * 2 / 3, WIDTH / 3], true);
    y -= 15;
  }
  section("Final Commercial Value", `${money(c.commercialValue)} (${amountInWords(Number(c.commercialValue))})`);
  for (const [label, key] of [["Hosting, Server Infrastructure & Data Management Note", "hostingNote"], ["Taxes & Applicable Charges", "taxTerms"], ["Payment Schedule & Terms", "paymentTerms"], ["Delivery Timeline", "deliveryTimeline"]]) section(label, c[key]);
  section("Closing Note", fillTemplate(commercial.template || documentTypes.commercials.template, c));
  const signatureWidth = WIDTH * .34;
  const signatures = [[c.recipientName, c.clientSignatory, c.clientSignatoryTitle], [commercialIssuer.name, commercialIssuer.signatory, commercialIssuer.title]];
  const signatureHeight = Math.max(...signatures.map(([name, person, title]) => wrap(`For ${name}`, signatureWidth, 10, true).length * 14.5 + wrap(person || "", signatureWidth, 10, true).length * 14.5 + wrap(title || "", signatureWidth, 10).length * 14.5)) + 150;
  ensure(signatureHeight);
  y -= 20;
  paragraph("ACCEPTANCE & SIGNATURE", 12, true);
  y -= 85;
  const signatureTop = y;
  signatures.forEach(([name, person, title], index) => {
    const x = index ? W - M - signatureWidth : M;
    y = signatureTop;
    page.drawLine({ start: { x, y }, end: { x: x + signatureWidth, y }, thickness: 1 });
    y -= 18;
    paragraph(`For ${name}`, 10, true, signatureWidth, x);
    y -= 8;
    if (person) paragraph(person, 10, true, signatureWidth, x);
    if (title) paragraph(title, 10, false, signatureWidth, x);
  });
  pdf.getPages().forEach((page, index) => page.drawText(`${q.documentNumber} | ${index + 1} / ${pdf.getPageCount()}`, { x: M, y: 12, size: 7, font: fonts[0].font }));
  pdf.setTitle(`Quotation ${q.documentNumber} and Commercials`);
  return new Blob([await pdf.save()], { type: "application/pdf" });
}

export async function downloadQuotationBundle(quotation, commercial) {
  const blob = await quotationBundlePdf(quotation, commercial);
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${quotation.values.documentNumber.replace(/[^a-zA-Z0-9_-]/g, "_")}-quotation-commercials.pdf`;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 60000);
}
