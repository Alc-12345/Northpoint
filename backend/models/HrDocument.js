import mongoose from "mongoose";
import { documentTypes } from "../shared/hrDocuments.js";

const schema = new mongoose.Schema({
  type: { type: String, enum: Object.keys(documentTypes), required: true },
  values: { type: mongoose.Schema.Types.Mixed, required: true },
  template: { type: String, default: "", required() { return !documentTypes[this.type ?? this.get("type")]?.allowBlank; } },
  items: [{ description: String, quantity: Number, rate: Number }],
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null, index: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });
export default mongoose.model("HrDocument", schema);
