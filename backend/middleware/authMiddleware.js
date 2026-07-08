import jwt from "jsonwebtoken";

import User from "../models/User.js";

const getJwtSecret = () => process.env.JWT_SECRET || "dev_jwt_secret_change_me";

export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    res.status(401);
    return next(new Error("Not authorized, token missing"));
  }

  try {
    const decoded = jwt.verify(token, getJwtSecret());
    const user = await User.findById(decoded.id);

    if (!user) {
      res.status(401);
      return next(new Error("Not authorized, user not found"));
    }

    req.user = user;
    return next();
  } catch {
    res.status(401);
    return next(new Error("Not authorized, token invalid"));
  }
};

export const optionalAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, getJwtSecret());
    req.user = await User.findById(decoded.id);
  } catch {
    req.user = null;
  }

  return next();
};

export const requireSuperadmin = (req, res, next) => {
  if (req.user?.role !== "superadmin") {
    res.status(403);
    return next(new Error("Only superadmin can perform this action"));
  }

  return next();
};
