import mongoose from "mongoose";

const etlWorkflowSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      default: "default",
      unique: true,
    },
    nodes: {
      type: Array,
      default: [],
    },
    edges: {
      type: Array,
      default: [],
    },
    lastRunAt: {
      type: Date,
    },
    lastRunStatus: {
      type: String,
      enum: ["Ready", "Running", "Completed", "Failed"],
      default: "Ready",
    },
  },
  { timestamps: true }
);

export default mongoose.model("EtlWorkflow", etlWorkflowSchema);
