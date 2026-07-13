import mongoose from "mongoose";

// A counter gives human-readable codes a single, atomic source of truth.
// Counting documents is unsafe when two requests create records at once.
const counterSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    sequence: { type: Number, required: true, default: 0 },
  },
  { versionKey: false }
);

export default mongoose.model("Counter", counterSchema);
