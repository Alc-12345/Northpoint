import mongoose from "mongoose";

const schema = new mongoose.Schema({
  _id: { type: String, default: "amount-password" },
  salt: { type: String, required: true, select: false },
  hash: { type: String, required: true, select: false },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });
export default mongoose.model("InvoiceAccess", schema);
