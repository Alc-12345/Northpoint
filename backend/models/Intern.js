import mongoose from "mongoose";

const schema = new mongoose.Schema({
  candidateName: { type: String, required: true, trim: true, maxlength: 120 },
  role: { type: String, required: true, trim: true, maxlength: 120 },
  companyName: { type: String, required: true, trim: true, maxlength: 120 },
  startDate: { type: String, required: true },
  duration: { type: String, enum: ["3", "6"], required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });
export default mongoose.model("Intern", schema);
