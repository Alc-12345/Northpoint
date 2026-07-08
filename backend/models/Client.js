import mongoose from "mongoose";

const clientSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    projects: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
      },
    ],
    name: {
      type: String,
      required: [true, "Client name is required"],
      trim: true,
    },
    industry: {
      type: String,
      required: [true, "Industry is required"],
      trim: true,
    },
    contact: {
      type: String,
      required: [true, "Contact person is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Client email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Client phone is required"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Ongoing", "Completed", "Active", "Inactive"],
      default: "Pending",
    },
    username: {
      type: String,
      trim: true,
    },
    generatedPassword: {
      type: String,
      trim: true,
    },
    credentialsSentAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Client", clientSchema);
