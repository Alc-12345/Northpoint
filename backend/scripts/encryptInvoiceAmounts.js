import "dotenv/config";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import Invoice from "../models/Invoice.js";
import { encryptInvoice, plaintextFinancialFields } from "../utils/invoiceEncryption.js";

try {
  await connectDB();
  let count = 0;
  for await (const invoice of Invoice.collection.find({ financialData: { $exists: false } })) {
    const encrypted = encryptInvoice(invoice);
    const result = await Invoice.collection.updateOne(
      { _id: invoice._id, financialData: { $exists: false }, updatedAt: invoice.updatedAt },
      { $set: { financialData: encrypted.financialData }, $unset: plaintextFinancialFields },
    );
    count += result.modifiedCount;
  }
  console.log(`Encrypted ${count} invoices. Run during a maintenance window; rerun if records changed concurrently.`);
} finally {
  await mongoose.disconnect();
}
