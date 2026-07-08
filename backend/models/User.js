import crypto from "node:crypto";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
    passwordSalt: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: ["superadmin", "employee", "client"],
      required: [true, "Role is required"],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

userSchema.methods.setPassword = function setPassword(password) {
  this.passwordSalt = crypto.randomBytes(16).toString("hex");
  this.passwordHash = crypto
    .pbkdf2Sync(password, this.passwordSalt, 120000, 64, "sha512")
    .toString("hex");
};

userSchema.methods.matchPassword = function matchPassword(password) {
  const hash = crypto
    .pbkdf2Sync(password, this.passwordSalt, 120000, 64, "sha512")
    .toString("hex");

  return crypto.timingSafeEqual(
    Buffer.from(this.passwordHash, "hex"),
    Buffer.from(hash, "hex")
  );
};

userSchema.methods.toJSON = function toJSON() {
  const user = this.toObject();
  delete user.passwordHash;
  delete user.passwordSalt;
  return user;
};

export default mongoose.model("User", userSchema);
