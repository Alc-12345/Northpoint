import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Lead name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Lead email is required"],
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    company: {
      type: String,
      trim: true,
    },
    service: {
      type: String,
      trim: true,
    },
    budget: {
      type: String,
      trim: true,
    },
    projectNeed: {
      type: String,
      trim: true,
    },
    projectStage: {
      type: String,
      trim: true,
    },
    projectBudget: {
      type: String,
      trim: true,
    },
    projectTimeline: {
      type: String,
      trim: true,
    },
    industry: {
      type: String,
      trim: true,
    },
    website: {
      type: String,
      trim: true,
    },
    businessDetails: {
      type: String,
      trim: true,
    },
    message: {
      type: String,
      trim: true,
    },
    source: {
      type: String,
      trim: true,
      default: "company-website",
    },
    status: {
      type: String,
      enum: ["New", "Contacted", "Qualified", "Converted", "Lost"],
      default: "New",
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Lead", leadSchema);
