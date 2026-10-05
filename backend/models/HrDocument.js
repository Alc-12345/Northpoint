import mongoose from "mongoose";

const schema = new mongoose.Schema({
  type: { type: String, enum: ["internship", "offer-letter", "quotation"], required: true },
  values: { type: mongoose.Schema.Types.Mixed, required: true },
  template: { type: String, required: true },
  items: [{ description: String, quantity: Number, rate: Number }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });
export default mongoose.model("HrDocument", schema);
