import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "../models/User.js";
import Employee from "../models/Employee.js";

dotenv.config({ quiet: true });

const accounts = [
  { name: "Temporary Admin", email: "temp.admin@northpoint.test", username: "tempadmin", role: "admin", password: "NorthpointAdmin!2026" },
  { name: "Temporary Employee", email: "temp.employee@northpoint.test", username: "tempemployee", role: "employee", password: "NorthpointEmployee!2026" },
];

try {
  await mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/northpoint-crm", { serverSelectionTimeoutMS: 15000 });
  for (const account of accounts) {
    let user = await User.findOne({ $or: [{ email: account.email }, { username: account.username }] }).select("+passwordHash +passwordSalt");
    if (user) {
      if (user.email !== account.email || user.username !== account.username || user.role !== account.role || !user.matchPassword(account.password)) {
        throw new Error(`Temporary account ${account.username} conflicts with an existing account; no existing credentials were changed.`);
      }
    } else {
      user = new User({ name: account.name, email: account.email, username: account.username, role: account.role });
      user.setPassword(account.password);
      await user.save();
    }
    if (account.role === "employee") {
      const existing = await Employee.findOne({ email: account.email });
      if (existing && String(existing.user) !== String(user._id)) throw new Error("Temporary employee profile belongs to a different account.");
      if (!existing) await Employee.create({ user: user._id, name: account.name, email: account.email, username: account.username, department: "Development", role: "Developer", status: "Active" });
    }
    console.log(`Ready: ${account.role} (${account.username})`);
  }
} catch {
  console.error("Temporary login setup failed. Check database connectivity and whether the temporary usernames or emails already exist.");
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
