import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
    },
    project: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Critical"],
      default: "Medium",
    },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed"],
      default: "Pending",
    },
    assignedTo: {
      type: String,
      trim: true,
    },
    workCategory: {
      type: String,
      enum: ["frontend", "backend", "server"],
      default: "frontend",
    },
    etlNodeId: { type: String, trim: true },
    progress: { type: Number, min: 0, max: 100, default: 0 },
    totalWorkingHours: { type: Number, min: 0, default: 0 },
    workLogs: [{
      hours: { type: Number, required: true, min: 0 },
      note: { type: String, required: true, trim: true },
      employee: { type: String, required: true },
      createdAt: { type: Date, default: Date.now },
    }],
    dueDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Task", taskSchema);
