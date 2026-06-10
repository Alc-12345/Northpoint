import mongoose from "mongoose";

const clientSchema = new mongoose.Schema(
  {
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
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Client", clientSchema);
