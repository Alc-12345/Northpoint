import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    action: {
      type: String,
      required: [true, "Action is required"],
      trim: true,
    },
    entityType: {
      type: String,
      trim: true,
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    ipAddress: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("ActivityLog", activityLogSchema);
