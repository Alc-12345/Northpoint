import { PDFDocument, rgb } from "pdf-lib";
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
  const line = (top) =>
    page.drawLine({
      start: { x: 40, y: top },
      end: { x: 555, y: top },
      thickness: 0.5,
      color: rgb(0.82, 0.84, 0.86),
    });
  const newPage = () => {
    page = doc.addPage([595.28, 841.89]);
    y = 795;
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
  const block = (value, x, top, width, size = 10) => {
    const lines = wrap(value, width, size);
    lines.forEach((s, i) => text(s, x, top - i * (size + 4), size));
    return top - lines.length * (size + 4);
  };
  const ensure = (height) => {
    if (y - height < 48) newPage();
  };
  newPage();
  let logoHeight = 0;
  if (invoice.company.logo) {
    const logo = invoice.company.logo.startsWith("data:image/png")
      ? await doc.embedPng(invoice.company.logo)
      : await doc.embedJpg(invoice.company.logo);
    const scale = Math.min(105 / logo.width, 48 / logo.height);
    logoHeight = logo.height * scale + 10;
    page.drawImage(logo, {
      x: 40,
      y: y - logo.height * scale,
      width: logo.width * scale,
      height: logo.height * scale,
    });
  }
  const leftBottom = block(
    invoice.company.name.replace(/\s+/g, " "),
    40,
    y - logoHeight,
    295,
    18,
  );
  const taglineBottom = block(
    invoice.company.tagline.replace(/\s+/g, " "),
    40,
    leftBottom - 5,
    280,
    8,
  );
  text("INVOICE", 390, y, 26, true);
  let rightBottom = block(
    `Invoice No: ${invoice.invoiceNumber}\nIssued: ${invoice.invoiceDate}\nDue: ${invoice.dueDate}`,
    390,
    y - 40,
    165,
    9,
  );
  y = Math.min(taglineBottom - 12, rightBottom - 12);
  line(y);
  y -= 16;
  text("FROM", 40, y, 9, true);
  text("BILL TO", 310, y, 9, true);
  y -= 16;
  const from = wrap(
    [
      invoice.company.name,
      invoice.company.address,
      invoice.company.email,
      invoice.company.phone,
      invoice.company.taxId && `Tax ID: ${invoice.company.taxId}`,
    ]
      .filter(Boolean)
      .join("\n"),
    230,
    9,
  );
  const to = wrap(
    [
      invoice.client.name,
      invoice.client.company,
      invoice.client.address,
      invoice.client.email,
      invoice.client.taxId && `Tax ID: ${invoice.client.taxId}`,
    ]
      .filter(Boolean)
      .join("\n"),
    245,
    9,
  );
  for (let i = 0; i < Math.max(from.length, to.length); i++) {
    if (y < 48) {
      newPage();
      text("FROM (CONTINUED)", 40, y, 9, true);
      text("BILL TO (CONTINUED)", 310, y, 9, true);
      y -= 20;
    }
    if (i < from.length) text(from[i], 40, y, 9);
    if (i < to.length) text(to[i], 310, y, 9);
    y -= 12;
  }
  y -= 12;
  if (invoice.referenceNumber || invoice.paymentTerms) {
    const referenceLines = wrap(
      [
        invoice.referenceNumber &&
          `Reference: ${invoice.referenceNumber.replace(/\s+/g, " ")}`,
        invoice.paymentTerms?.replace(/\s+/g, " "),
      ]
        .filter(Boolean)
        .join("\n"),
      515,
      9,
    );
    ensure(referenceLines.length * 13 + 8);
    y =
      block(
        [
          invoice.referenceNumber &&
            `Reference: ${invoice.referenceNumber.replace(/\s+/g, " ")}`,
          invoice.paymentTerms?.replace(/\s+/g, " "),
        ]
          .filter(Boolean)
          .join("\n"),
        40,
        y,
        515,
        9,
      ) - 8;
  }
  const tableHeader = () => {
    ensure(40);
    line(y);
    y -= 12;
    [
      ["DESCRIPTION", 40],
      ["QTY", 350],
      ["RATE", 400],
      ["AMOUNT", 480],
    ].forEach(([s, x]) => text(s, x, y, 9, true));
    y -= 24;
    line(y + 6);
  };
  tableHeader();
  for (const item of invoice.items) {
    const lines = wrap(item.description, 285);
    const numbers = [
      String(item.quantity),
      money(item.rate),
      money(item.amount),
    ].map((s, i) => wrap(s, [42, 70, 75][i], 8));
    let offset = 0;
    while (offset < lines.length) {
      if (y < 85) {
        newPage();
        tableHeader();
      }
      const count = Math.min(
        lines.length - offset,
        Math.max(1, Math.floor((y - 60) / 14)),
      );
      lines
        .slice(offset, offset + count)
        .forEach((s, i) => text(s, 40, y - i * 14));
      if (!offset)
        numbers.forEach((parts, i) =>
          parts.forEach((s, j) => text(s, [350, 400, 480][i], y - j * 12, 8)),
        );
      y -=
        Math.max(
          count * 14,
          offset === 0 ? Math.max(...numbers.map((n) => n.length)) * 12 : 0,
        ) + 12;
      offset += count;
    }
    line(y + 5);
  }
  ensure(100);
  y -= 15;
  for (const [label, value] of [
    ["Subtotal", invoice.subtotal],
    [`Tax (${invoice.taxPercentage}%)`, invoice.taxAmount],
    ["Total", invoice.total],
  ]) {
    if (label === "Total")
      page.drawLine({
        start: { x: 330, y: y + 7 },
        end: { x: 555, y: y + 7 },
        thickness: 0.5,
        color: rgb(0.82, 0.84, 0.86),
      });
    text(label, 330, y, 11, label === "Total");
    const s = money(value);
    text(s, 555 - measure(s, 11, label === "Total"), y, 11, label === "Total");
    y -= 23;
  }
  y -= 12;
  ensure(150);
  text("PAYMENT DETAILS", 40, y, 10, true);
  text("TERMS & CONDITIONS", 245, y, 10, true);
  y -= 18;
  const bank = invoice.paymentDetails;
  const leftLines = wrap(
    [
      `Payment Method: ${bank.method}`,
      `Bank Name: ${bank.bankName}`,
      `Account Name: ${bank.accountName}`,
      `Account Number: ${bank.accountNumber}`,
      `IFSC Code: ${bank.ifscCode}`,
    ].join("\n"),
    185,
    9,
  );
  // Prefer a single A4 page without scaling or rasterizing the invoice.
  // Compact paragraph spacing and use the largest readable terms font that fits.
  const terms = String(invoice.termsAndConditions || "").replace(
    /\n\s*\n/g,
    "\n",
  );
  let termsSize = 8.5;
  for (const candidate of [9, 8.75, 8.5]) {
    if (
      wrap(terms, 310, candidate).length * Math.max(11, candidate + 2) <=
      y - 48
    ) {
      termsSize = candidate;
      break;
    }
  }
  const rightLines = wrap(terms, 310, termsSize);
  const detailLeading = Math.max(11, termsSize + 2);
  for (let i = 0; i < Math.max(leftLines.length, rightLines.length); i++) {
    if (y < 48) {
      newPage();
      text("INVOICE DETAILS (CONTINUED)", 40, y, 9, true);
      y -= 24;
    }
    if (i < leftLines.length) text(leftLines[i], 40, y, 9);
    if (i < rightLines.length) text(rightLines[i], 245, y, termsSize);
    y -= detailLeading;
  }
  const pages = doc.getPages();
  pages.forEach((p, i) =>
    p.drawText(`${invoice.invoiceNumber}  |  ${i + 1} / ${pages.length}`, {
      x: 40,
      y: 25,
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
