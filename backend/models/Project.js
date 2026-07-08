import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Project name is required"],
      trim: true,
    },
    manager: {
      type: String,
      trim: true,
    },
    team: {
      type: String,
      trim: true,
    },
    methodology: {
      type: String,
      enum: ["Agile", "Scrum", "Kanban"],
      default: "Agile",
    },
    storyPoints: {
      type: Number,
      min: [0, "Story points cannot be negative"],
    },
    estimatedHours: {
      type: Number,
      min: [0, "Estimated hours cannot be negative"],
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    budget: {
      type: Number,
      min: [0, "Budget cannot be negative"],
    },
    version: {
      type: String,
      trim: true,
    },
    milestone: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Ongoing", "Completed", "Complete", "Active", "Inactive"],
      default: "Pending",
    },
    description: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Project", projectSchema);
