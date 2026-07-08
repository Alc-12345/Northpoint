import ActivityLog from "../models/ActivityLog.js";
import Client from "../models/Client.js";
import Project from "../models/Project.js";
import User from "../models/User.js";

const generateUsername = (value = "client") =>
  `${value.replace(/[^a-z0-9]/gi, "").toLowerCase().slice(0, 12) || "client"}${String(
    Date.now()
  ).slice(-2)}`;

const generatePassword = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789#$@!";
  return Array.from({ length: 10 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
};

export const getClients = async (req, res) => {
  const clients = await Client.find().populate("projects", "name projectCode status progress").sort({ createdAt: -1 });
  res.json(clients);
};

export const getClientById = async (req, res) => {
  const client = await Client.findById(req.params.id).populate("projects", "name projectCode status progress");

  if (!client) {
    res.status(404);
    throw new Error("Client not found");
  }

  res.json(client);
};

export const createClient = async (req, res) => {
  const password = req.body.password || generatePassword();
  const username = req.body.username || generateUsername(req.body.name || req.body.company);

  if (!password || password.length < 6) {
    res.status(400);
    throw new Error("Password must be at least 6 characters");
  }

  const existingUser = await User.findOne({
    $or: [{ email: req.body.email }, { username }],
  });

  if (existingUser) {
    res.status(400);
    throw new Error("Client login email or ID already exists");
  }

  const user = new User({
    name: req.body.contact || req.body.name,
    email: req.body.email,
    username,
    role: "client",
    createdBy: req.user?._id || null,
  });
  user.setPassword(password);
  await user.save();

  const projectIds = [req.body.projectId, ...(req.body.projects || [])].filter(Boolean);
  const client = await Client.create({
    ...req.body,
    user: user._id,
    username: user.username || username,
    generatedPassword: password,
    projects: projectIds,
    status: req.body.status || "Active",
    credentialsSentAt: new Date(),
  });

  if (projectIds.length > 0) {
    await Project.updateMany(
      { _id: { $in: projectIds } },
      { $set: { client: client._id, clientName: client.contact || client.name } }
    );
  }

  await ActivityLog.create({
    user: req.user?._id || null,
    action: "Client Created",
    entityType: "Client",
    entityId: client._id,
    metadata: { projectIds, username: client.username },
    ipAddress: req.ip,
  });

  res.status(201).json({
    message: "Client account created successfully",
    client,
    credentials: {
      username: client.username,
      email: client.email,
      password,
    },
  });
};

export const updateClient = async (req, res) => {
  const client = await Client.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!client) {
    res.status(404);
    throw new Error("Client not found");
  }

  res.json(client);
};

export const deleteClient = async (req, res) => {
  const client = await Client.findByIdAndDelete(req.params.id);

  if (!client) {
    res.status(404);
    throw new Error("Client not found");
  }

  res.json({ message: "Client deleted successfully" });
};
