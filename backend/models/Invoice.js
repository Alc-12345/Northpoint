import mongoose from "mongoose";
const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: { type: String, required: true, unique: true, trim: true },
    invoiceDate: { type: String, required: true },
    dueDate: { type: String, required: true },
    company: {
      name: String,
      tagline: String,
      address: String,
      email: String,
      phone: String,
      taxId: String,
      logo: String,
    },
    client: {
      name: { type: String, required: true },
      company: String,
      address: String,
      email: String,
      taxId: String,
    },
    referenceNumber: String,
    paymentTerms: String,
    dueDays: Number,
    items: [
      {
        description: { type: String, required: true },
        quantity: Number,
        rate: Number,
        amount: Number,
      },
    ],
    subtotal: Number,
    taxPercentage: Number,
    taxAmount: Number,
    total: Number,
    paymentDetails: {
      method: String,
      bankName: String,
      accountName: String,
      accountNumber: String,
      ifscCode: String,
    },
    termsAndConditions: String,
    status: {
      type: String,
      enum: ["Draft", "Sent", "Paid", "Overdue", "Cancelled"],
      default: "Draft",
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);
export default mongoose.model("Invoice", invoiceSchema);
