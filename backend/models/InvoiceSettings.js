import mongoose from "mongoose";
const schema = new mongoose.Schema(
  {
    key: { type: String, unique: true, default: "company" },
    values: mongoose.Schema.Types.Mixed,
  },
  { timestamps: true },
);
export default mongoose.model("InvoiceSettings", schema);
