import jwt from "jsonwebtoken";

import User from "../models/User.js";

const allowedRoles = ["superadmin", "employee", "client"];
const getJwtSecret = () => process.env.JWT_SECRET || "dev_jwt_secret_change_me";

const signToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, getJwtSecret(), {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

const authResponse = (user) => ({
  user,
  token: signToken(user),
});

const canCreateSuperadmin = async (req) => {
  const superadminExists = await User.exists({ role: "superadmin" });

  if (!superadminExists) {
    return true;
  }

  const setupKey = process.env.SUPERADMIN_REGISTER_KEY;
  return Boolean(setupKey && req.headers["x-superadmin-key"] === setupKey);
};

export const register = async (req, res) => {
  const { name, email, password, role } = req.body;
  const normalizedRole = role?.toLowerCase();

  if (!allowedRoles.includes(normalizedRole)) {
    res.status(400);
    throw new Error("Role must be superadmin, employee, or client");
  }

  if (!password || password.length < 6) {
    res.status(400);
    throw new Error("Password must be at least 6 characters");
  }

  if (normalizedRole === "superadmin") {
    const isAllowed = await canCreateSuperadmin(req);

    if (!isAllowed) {
      res.status(403);
      throw new Error("Superadmin can only be created by backend setup");
    }
  } else if (req.user?.role !== "superadmin") {
    res.status(403);
    throw new Error("Only superadmin can create employee or client accounts");
  }

  const user = new User({
    name,
    email,
    role: normalizedRole,
    createdBy: normalizedRole === "superadmin" ? null : req.user._id,
  });
  user.setPassword(password);

  await user.save();

  res.status(201).json(authResponse(user));
};

export const login = async (req, res) => {
  const { email, identifier, username, clientId, employeeId, password } = req.body;
  const loginId = email || identifier || username || clientId || employeeId;

  if (!loginId || !password) {
    res.status(400);
    throw new Error("Login ID and password are required");
  }

  const login = loginId.toLowerCase();
  const user = await User.findOne({
    $or: [{ email: login }, { username: login }],
  })
    .select("+passwordHash +passwordSalt")
    .exec();

  if (!user || !user.matchPassword(password)) {
    res.status(401);
    throw new Error("Invalid login ID or password");
  }

  res.json(authResponse(user));
};
