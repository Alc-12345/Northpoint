import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    projectCode: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    lead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead",
      default: null,
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      default: null,
    },
    name: {
      type: String,
      required: [true, "Project name is required"],
      trim: true,
    },
    clientName: {
      type: String,
      trim: true,
    },
    company: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    service: {
      type: String,
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
    progress: {
      type: Number,
      min: [0, "Progress cannot be negative"],
      max: [100, "Progress cannot exceed 100"],
      default: 0,
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Critical"],
      default: "Medium",
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
    assignedTeam: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
      },
    ],
    activityLogs: [
      {
        action: String,
        date: {
          type: Date,
          default: Date.now,
        },
        details: String,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Project", projectSchema);
