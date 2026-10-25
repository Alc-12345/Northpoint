import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

const fields = ["items", "subtotal", "taxPercentage", "taxAmount", "total"];
export const plaintextFinancialFields = Object.fromEntries(fields.map((key) => [key, ""]));
function key() {
  const value = process.env.INVOICE_ENCRYPTION_KEY;
  if (!/^[a-fA-F0-9]{64}$/.test(value || ""))
    throw new Error("INVOICE_ENCRYPTION_KEY must contain 64 hexadecimal characters");
  return Buffer.from(value, "hex");
}
export function encryptInvoice(invoice) {
  const data = { ...invoice };
  const financial = Object.fromEntries(fields.filter((field) => data[field] !== undefined).map((field) => [field, data[field]]));
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key(), iv);
  cipher.setAAD(Buffer.from(`invoice:${data.invoiceNumber}`));
  const ciphertext = Buffer.concat([cipher.update(JSON.stringify(financial), "utf8"), cipher.final()]);
  data.financialData = ["v1", iv.toString("base64"), cipher.getAuthTag().toString("base64"), ciphertext.toString("base64")].join(":");
  for (const field of fields) delete data[field];
  return data;
}
export function decryptInvoice(invoice) {
  if (!invoice) return invoice;
  const data = invoice.toObject ? invoice.toObject() : { ...invoice };
  if (data.financialData) {
    const [version, iv, tag, ciphertext] = data.financialData.split(":");
    if (version !== "v1") throw new Error("Unsupported invoice encryption version");
    const decipher = createDecipheriv("aes-256-gcm", key(), Buffer.from(iv, "base64"));
    decipher.setAAD(Buffer.from(`invoice:${data.invoiceNumber}`));
    decipher.setAuthTag(Buffer.from(tag, "base64"));
    Object.assign(data, JSON.parse(Buffer.concat([decipher.update(Buffer.from(ciphertext, "base64")), decipher.final()]).toString("utf8")));
  }
  delete data.financialData;
  return data;
}
