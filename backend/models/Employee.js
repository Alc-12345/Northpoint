import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Employee name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Employee email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    department: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      trim: true,
    },
    project: {
      type: String,
      trim: true,
    },
    salary: {
      type: Number,
      min: [0, "Salary cannot be negative"],
    },
    joiningDate: {
      type: Date,
    },
    skills: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Ongoing", "Completed", "Active", "On Leave", "Resigned"],
      default: "Pending",
    },
    photo: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Employee", employeeSchema);
