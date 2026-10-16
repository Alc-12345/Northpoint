import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { PDFDocument } from "pdf-lib";
import { invoicePdf } from "./invoicePdf.js";
import {
  calculate,
  defaultSettings,
} from "../../../backend/shared/invoices.js";
const originalAddPage = PDFDocument.prototype.addPage;
PDFDocument.prototype.addPage = function (...args) {
  const page = originalAddPage.apply(this, args),
    draw = page.drawText.bind(page);
  page.drawText = (text, options) => {
    assert.ok(
      options.x >= 39 &&
        options.x + options.font.widthOfTextAtSize(text, options.size) <= 556,
      `Text exceeds horizontal margins: ${text}`,
    );
    assert.ok(
      options.y >= 24 && options.y <= 800,
      `Text exceeds vertical margins: ${text}`,
    );
    return draw(text, options);
  };
  return page;
};
const fonts = await Promise.all(
  ["latin-400", "latin-ext-400", "latin-700", "latin-ext-700"].map((name) =>
    readFile(
      new URL(
        `../../public/fonts/noto-sans-${name}-normal.woff`,
        import.meta.url,
      ),
    ),
  ),
);
const invoice = (items) => ({
  ...structuredClone(defaultSettings),
  invoiceNumber: "ALC-2026-0001",
  invoiceDate: "2026-10-16",
  dueDate: "2026-10-23",
  client: {
    name: "Example Client",
    company: "Example Company",
    address: "123 Business Road",
  },
  ...calculate(items, 15),
  taxPercentage: 15,
});
test("PDF is a valid A4 document with embedded selectable text fonts", async () => {
  const blob = await invoicePdf(
    invoice([
      { description: "Application development", quantity: 1, rate: 9300 },
    ]),
    fonts,
  );
  const doc = await PDFDocument.load(await blob.arrayBuffer());
  assert.ok(doc.getPageCount() >= 1);
  assert.equal(doc.getPage(0).getWidth(), 595.28);
  assert.equal(doc.getPage(0).getHeight(), 841.89);
  assert.equal(doc.getTitle(), "Invoice ALC-2026-0001");
  assert.ok(doc.getPage(0).node.Resources().get);
});
test("long descriptions, 150 items, and long terms paginate", async () => {
  const data = invoice(
    Array.from({ length: 150 }, (_, i) => ({
      description:
        `Service ${i} ` + "Detailed project requirements ".repeat(30),
      quantity: 1,
      rate: 100,
    })),
  );
  data.items[0].description = "Unbroken".repeat(600);
  data.termsAndConditions = defaultSettings.termsAndConditions.repeat(5);
  const doc = await PDFDocument.load(
    await (await invoicePdf(data, fonts)).arrayBuffer(),
  );
  assert.ok(doc.getPageCount() > 10);
});
