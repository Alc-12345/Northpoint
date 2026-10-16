import { PDFDocument, rgb } from "pdf-lib";
import { amountInWords } from "./amountInWords.js";
import fontkit from "@pdf-lib/fontkit";
const money = (value) =>
  `₹${Number(value).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
export async function invoicePdf(invoice, suppliedFonts) {
  const doc = await PDFDocument.create();
  doc.registerFontkit(fontkit);
  const names = ["latin-400", "latin-ext-400", "latin-700", "latin-ext-700"];
  const fonts = await Promise.all(
    names.map(async (name, i) => {
      const bytes =
        suppliedFonts?.[i] ||
        (await fetch(
          `${import.meta.env?.BASE_URL || "/"}fonts/noto-sans-${name}-normal.woff`,
        ).then((response) => {
          if (!response.ok) throw new Error("Unable to load invoice fonts");
          return response.arrayBuffer();
        }));
      const font = await doc.embedFont(bytes, { subset: true });
      return { font, characters: new Set(font.getCharacterSet()) };
    }),
  );
  const runs = (value, strong = false) => {
    const result = [];
    for (const char of String(value ?? "")) {
      const selected = fonts
        .slice(strong ? 2 : 0, strong ? 4 : 2)
        .find((entry) => entry.characters.has(char.codePointAt(0)));
      if (!selected)
        throw new Error(
          `The invoice font does not support the character "${char}". Please use Latin characters for this PDF.`,
        );
      const last = result[result.length - 1];
      if (last?.font === selected.font) last.text += char;
      else result.push({ font: selected.font, text: char });
    }
    return result;
  };
  const measure = (value, size, strong = false) =>
    runs(value, strong).reduce(
      (sum, run) => sum + run.font.widthOfTextAtSize(run.text, size),
      0,
    );
  const regular = fonts[0].font;
  const charWidths = new Map();
  const charWidth = (char, size) => {
    const key = `${size}:${char}`;
    if (!charWidths.has(key)) charWidths.set(key, measure(char, size));
    return charWidths.get(key);
  };
  const ink = rgb(0.12, 0.14, 0.17),
    gray = rgb(0.42, 0.45, 0.49);
  let page, y;
  const text = (value, x, top, size = 10, strong = false) => {
    for (const run of runs(value, strong)) {
      page.drawText(run.text, {
        x,
        y: top - size,
        size,
        font: run.font,
        color: ink,
      });
      x += run.font.widthOfTextAtSize(run.text, size);
    }
  };
  const wrap = (value, width, size = 10) => {
    const lines = [];
    for (const paragraph of String(value ?? "").split("\n")) {
      let current = "",
        currentWidth = 0;
      for (const word of paragraph.split(/\s+/)) {
        if (current && measure(`${current} ${word}`, size) > width) {
          lines.push(current);
          current = "";
          currentWidth = 0;
        }
        for (const char of (current ? " " : "") + word) {
          if (currentWidth + charWidth(char, size) > width) {
            lines.push(current);
            current = "";
            currentWidth = 0;
          }
          current += char;
          currentWidth += charWidth(char, size);
        }
      }
      lines.push(current);
    }
    return lines;
  };
  const left = 22,
    right = 573,
    bottom = 34;
  const stroke = (x1, y1, x2, y2) =>
    page.drawLine({
      start: { x: x1, y: y1 },
      end: { x: x2, y: y2 },
      thickness: 0.6,
      color: rgb(0.8, 0.82, 0.85),
    });
  const line = (top) => stroke(left, top, right, top);
  const newPage = () => {
    page = doc.addPage([595.28, 841.89]);
    y = 815;
  };
  const ensure = (height) => {
    if (y - height < bottom) newPage();
  };
  const heading = (label, x, top, width) => {
    page.drawRectangle({
      x,
      y: top - 17,
      width,
      height: 19,
      color: rgb(0.93, 0.94, 0.96),
    });
    text(label.toUpperCase(), x + 5, top - 2, 8.5, true);
  };
  const date = (value) =>
    new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    }).format(new Date(`${value}T12:00:00Z`));
  const embedImage = async (value) =>
    value.startsWith("data:image/png")
      ? doc.embedPng(value)
      : doc.embedJpg(value);
  newPage();
  let logoHeight = 0;
  if (invoice.company.logo) {
    const logo = await embedImage(invoice.company.logo),
      scale = Math.min(280 / logo.width, 74 / logo.height);
    logoHeight = logo.height * scale;
    page.drawImage(logo, {
      x: left,
      y: y - logoHeight,
      width: logo.width * scale,
      height: logoHeight,
    });
  }
  text("INVOICE", right - measure("INVOICE", 30, true), y, 30, true);
  y -= Math.max(logoHeight, 34) + 12;
  line(y);
  y -= 12;
  const headings = () => {
    heading("FROM", left, y, 199);
    heading("BILL TO", 245, y, 150);
    heading("INVOICE DETAILS", 420, y, 153);
    y -= 25;
  };
  headings();
  const from = wrap(
    [
      invoice.company.name,
      invoice.company.address,
      invoice.company.email,
      invoice.company.phone,
      invoice.company.taxId && `GST / TAX ID: ${invoice.company.taxId}`,
    ]
      .filter(Boolean)
      .join("\n"),
    199,
    9,
  );
  const to = wrap(
    [
      invoice.client.name,
      invoice.client.company,
      invoice.client.address,
      invoice.client.email,
      invoice.client.taxId && `GST / TAX ID: ${invoice.client.taxId}`,
    ]
      .filter(Boolean)
      .join("\n"),
    150,
    9,
  );
  const metadata = [];
  for (const [label, value] of [
    ["INVOICE NO.", invoice.invoiceNumber],
    ["ISSUED", date(invoice.invoiceDate)],
    ["DUE", date(invoice.dueDate)],
  ]) {
    metadata.push({ text: label, size: 8, strong: true });
    wrap(value, 153, 11).forEach((value) =>
      metadata.push({ text: value, size: 11, strong: false }),
    );
    metadata.push({ text: "", size: 8 });
  }
  let columnTop = y + 25;
  const separators = () => {
    stroke(232, columnTop, 232, y + 3);
    stroke(408, columnTop, 408, y + 3);
  };
  for (let i = 0; i < Math.max(from.length, to.length, metadata.length); i++) {
    if (y < bottom + 12) {
      separators();
      newPage();
      headings();
      columnTop = y + 25;
    }
    if (i < from.length) text(from[i], left, y, 9);
    if (i < to.length) text(to[i], 245, y, 9);
    if (i < metadata.length) {
      const entry = metadata[i];
      text(
        entry.text,
        right - measure(entry.text, entry.size, entry.strong),
        y,
        entry.size,
        entry.strong,
      );
    }
    y -= 13;
  }
  separators();
  y -= 10;
  // Payment terms are deliberately omitted from the invoice output.
  if (invoice.referenceNumber) {
    for (const value of wrap(
      `REFERENCE: ${invoice.referenceNumber.replace(/\s+/g, " ")}`,
      551,
      9,
    )) {
      ensure(14);
      text(value, left, y, 9);
      y -= 13;
    }
    y -= 8;
  }
  const tableHeader = () => {
    ensure(40);
    line(y);
    y -= 7;
    page.drawRectangle({
      x: left,
      y: y - 18,
      width: right - left,
      height: 20,
      color: rgb(0.93, 0.94, 0.96),
    });
    [
      ["DESCRIPTION", left],
      ["QTY", 340],
      ["RATE", 390],
      ["AMOUNT", 485],
    ].forEach(([value, x]) => text(value, x + 3, y - 2, 8, true));
    y -= 30;
  };
  tableHeader();
  for (const item of invoice.items) {
    const lines = wrap(item.description, 300, 11);
    const numbers = [
      String(item.quantity),
      money(item.rate),
      money(item.amount),
    ].map((value, i) => wrap(value, [40, 80, 88][i], 10));
    let offset = 0;
    while (offset < lines.length) {
      if (y < bottom + 45) {
        newPage();
        tableHeader();
      }
      const count = Math.min(
        lines.length - offset,
        Math.max(1, Math.floor((y - bottom - 12) / 15)),
      );
      lines
        .slice(offset, offset + count)
        .forEach((value, i) => text(value, left, y - i * 15, 11));
      if (!offset)
        numbers.forEach((parts, i) =>
          parts.forEach((value, j) =>
            text(value, [340, 390, 485][i], y - j * 14, 10),
          ),
        );
      y -=
        Math.max(
          count * 15,
          offset === 0
            ? Math.max(...numbers.map((parts) => parts.length)) * 14
            : 0,
        ) + 10;
      offset += count;
    }
    line(y + 4);
  }
  const wordLines = wrap(amountInWords(invoice.total), 285, 9);
  ensure(Math.max(94, wordLines.length * 12 + 32));
  y -= 12;
  heading("AMOUNT IN WORDS", left, y, 285);
  wordLines.forEach((value, i) => text(value, left + 4, y - 26 - i * 12, 9));
  for (const [label, value] of [
    ["SUBTOTAL", invoice.subtotal],
    [`TAX (${invoice.taxPercentage}%)`, invoice.taxAmount],
    ["TOTAL", invoice.total],
  ]) {
    if (label === "TOTAL")
      page.drawRectangle({
        x: 330,
        y: y - 17,
        width: right - 330,
        height: 23,
        color: rgb(0.93, 0.94, 0.96),
      });
    text(label, 335, y, 10, label === "TOTAL");
    const valueText = money(value);
    text(
      valueText,
      right - 5 - measure(valueText, 11, label === "TOTAL"),
      y,
      11,
      label === "TOTAL",
    );
    y -= 24;
  }
  y -= 12;
  const bank = invoice.paymentDetails;
  const paymentRows = [
    ["PAYMENT METHOD", bank.method],
    ["BANK NAME", bank.bankName],
    ["ACCOUNT NUMBER", bank.accountNumber],
    ["IFSC CODE", bank.ifscCode],
  ];
  const leftLines = paymentRows.flatMap(([label, value]) => [
    { text: label, strong: true, size: 8 },
    ...wrap(value || "", 190, 9).map((text) => ({
      text,
      strong: false,
      size: 9,
    })),
  ]);
  const qr = invoice.company.paymentQr
    ? await embedImage(invoice.company.paymentQr)
    : null;
  ensure(Math.min(300, leftLines.length * 11 + (qr ? 145 : 30)));
  heading("PAYMENT DETAILS", left, y, 199);
  heading("TERMS & CONDITIONS", 235, y, 338);
  stroke(left, y - 21, 221, y - 21);
  y -= 30;
  const terms = String(invoice.termsAndConditions || "").replace(
    /\n\s*\n/g,
    "\n",
  );
  let termsSize = 8.5;
  for (const size of [10, 9.5, 9, 8.75, 8.5])
    if (wrap(terms, 333, size).length * Math.max(11, size + 2) <= y - bottom) {
      termsSize = size;
      break;
    }
  const rightLines = wrap(terms, 333, termsSize),
    leading = Math.max(11, termsSize + 2);
  const qrRows = qr ? 14 : 0;
  for (
    let i = 0;
    i < Math.max(leftLines.length + qrRows, rightLines.length);
    i++
  ) {
    if (y < bottom + 10 || (qr && i === leftLines.length && y - bottom < 138)) {
      newPage();
      heading("PAYMENT DETAILS", left, y, 199);
      heading("TERMS & CONDITIONS", 235, y, 338);
      y -= 30;
    }
    if (i < leftLines.length) {
      const entry = leftLines[i];
      text(entry.text, left + 4, y, entry.size, entry.strong);
    }
    if (qr && i === leftLines.length) {
      stroke(left, y + 3, 221, y + 3);
      text("PAYMENT QR", left + 4, y - 6, 8, true);
      // Keep the uploaded code square, with a white quiet zone for scanning.
      page.drawRectangle({
        x: left + 3,
        y: y - 133,
        width: 106,
        height: 106,
        color: rgb(1, 1, 1),
      });
      const scale = Math.min(94 / qr.width, 94 / qr.height);
      page.drawImage(qr, {
        x: left + 9 + (94 - qr.width * scale) / 2,
        y: y - 127 + (94 - qr.height * scale) / 2,
        width: qr.width * scale,
        height: qr.height * scale,
      });
    }
    if (i < rightLines.length) text(rightLines[i], 240, y, termsSize);
    y -= leading;
  }
  const pages = doc.getPages();
  pages.forEach((p, i) =>
    p.drawText(`${invoice.invoiceNumber}  |  ${i + 1} / ${pages.length}`, {
      x: 22,
      y: 16,
      size: 8,
      font: regular,
      color: gray,
    }),
  );
  doc.setTitle(`Invoice ${invoice.invoiceNumber}`);
  return new Blob([await doc.save()], { type: "application/pdf" });
}
export async function downloadInvoice(invoice) {
  const blob = await invoicePdf(invoice);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `INV-${invoice.invoiceNumber}.pdf`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 60000);
}
