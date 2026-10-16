import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { PDFDocument } from "pdf-lib";
import { invoicePdf } from "./invoicePdf.js";
import {
  calculate,
  defaultSettings,
} from "../../../backend/shared/invoices.js";
const drawnText = [];
const originalAddPage = PDFDocument.prototype.addPage;
PDFDocument.prototype.addPage = function (...args) {
  const page = originalAddPage.apply(this, args),
    draw = page.drawText.bind(page);
  const drawImage = page.drawImage.bind(page);
  page.drawImage = (image, options) => {
    assert.ok(options.x >= 22 && options.x + options.width <= 574);
    assert.ok(options.y >= 34 && options.y + options.height <= 816);
    return drawImage(image, options);
  };
  page.drawText = (text, options) => {
    drawnText.push({ text, ...options });
    assert.ok(
      options.x >= 21 &&
        options.x + options.font.widthOfTextAtSize(text, options.size) <= 574,
      `Text exceeds horizontal margins: ${text}`,
    );
    assert.ok(
      options.y >= 15 && options.y <= 816,
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
  assert.equal(doc.getPageCount(), 1);
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

test("standard invoice with company contacts, logo, three items and all default terms fits one page", async () => {
  const data = invoice(
    Array.from({ length: 3 }, (_, i) => ({
      description: `Project service ${i + 1}`,
      quantity: 1,
      rate: 3100,
    })),
  );
  data.company = {
    ...data.company,
    name: "Austin Legacy Corp",
    address:
      "C16, Third Floor, Sukh Sampatti Building, Makarwali Rd, Near Stephen Chauraha, C Block, Panchsheel Nagar, Ajmer, Rajasthan 305001",
    email: "accounts@example.com",
    phone: "+91 9876543210",
    taxId: "27ABCDE1234F1Z5",
    logo: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=",
  };
  data.client.email = "client@example.com";
  data.client.taxId = "27FGHIJ5678K1Z5";
  const start = drawnText.length;
  data.company.paymentQr = data.company.logo;
  const blob = await invoicePdf(data, fonts);
  const doc = await PDFDocument.load(await blob.arrayBuffer());
  assert.equal(doc.getPageCount(), 1);
  const events = drawnText.slice(start);
  const find = (text) => events.find((event) => event.text === text);
  assert.equal(find("FROM").y, find("BILL TO").y);
  assert.equal(find("FROM").y, find("INVOICE DETAILS").y);
  assert.equal(
    events.filter((event) => event.text === "Austin Legacy Corp").length,
    1,
  );
  assert.ok(find("Project service 1").size > find("DESCRIPTION").size);
  assert.ok(find("1").size > find("QTY").size);
  assert.ok(find("APPROVED BY"));
  assert.ok(find("SIGNATURE"));
  assert.equal(find("INVOICE NO.").x, 420);
  assert.equal(find("ISSUED").x, 420);
  assert.equal(find("DUE").x, 420);
  assert.equal(find("Oct 16, 2026").x, 420);
  assert.ok(find("ISSUED"));
  assert.ok(find("Oct 16, 2026"));
  assert.ok(find("DUE"));
  assert.ok(find("Oct 23, 2026"));
  assert.ok(find("AMOUNT IN WORDS"));
  assert.ok(find("PAYMENT QR"));
  assert.ok(
    !events.some((event) => event.text.includes("Balance payable within")),
  );
});

test("Indian amount in words handles zero, paise, lakh, crore and rounding", async () => {
  const { amountInWords } = await import("./amountInWords.js");
  assert.equal(
    amountInWords(23600),
    "Twenty Three Thousand Six Hundred Rupees Only",
  );
  assert.equal(amountInWords(0), "Zero Rupees Only");
  assert.equal(amountInWords(1.01), "One Rupee and One Paisa Only");
  assert.equal(
    amountInWords(12345678.25),
    "One Crore Twenty Three Lakh Forty Five Thousand Six Hundred Seventy Eight Rupees and Twenty Five Paise Only",
  );
  assert.throws(() => amountInWords(-1), /Invalid/);
});
