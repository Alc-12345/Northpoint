import EtlWorkflow from "../models/EtlWorkflow.js";

const taskFields = ["title", "project", "description", "priority", "status", "assignedTo", "dueDate", "workCategory", "progress", "etlNodeId"];
const taskPayload = (body) => Object.fromEntries(taskFields.filter(key => Object.hasOwn(body, key)).map(key => [key, body[key]]));
const assignedToUser = (user) => [user.email, user.name, user.username, String(user._id)].filter(Boolean);

const validateNodeLink = async (nodeId, taskId, res) => {
  if (!nodeId) return;
  const workflow = await EtlWorkflow.findOne({ key: "default" }).lean();
  const node = workflow?.nodes.find(item => item.id === nodeId);
  const otherTask = await Task.exists({ etlNodeId: nodeId, ...(taskId ? { _id: { $ne: taskId } } : {}) });
  if (!node || otherTask || (node.data?.taskId && node.data.taskId !== String(taskId))) {
    res.status(400);
    throw new Error("Choose an available ETL node");
  }
};

import Task from "../models/Task.js";

export const getTasks = async (req, res) => {
  const tasks = await Task.find(req.user?.role === "employee" ? { assignedTo: { $in: assignedToUser(req.user) } } : {}).sort({ createdAt: -1 });
  res.json(tasks);
};

export const getTaskById = async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  res.json(task);
};

export const createTask = async (req, res) => {
  const payload = taskPayload(req.body);
  await validateNodeLink(payload.etlNodeId, null, res);
  const task = await Task.create(payload);
  res.status(201).json(task);
};

export const updateTask = async (req, res) => {
  if (req.user?.role === "employee") {
    res.status(400);
    throw new Error("Use a work update with hours to update your task");
  }
  if (Object.hasOwn(req.body, "totalWorkingHours") || Object.hasOwn(req.body, "workLogs")) {
    res.status(400);
    throw new Error("Submitted hours cannot be edited; add a work update instead");
  }
  const payload = taskPayload(req.body);
  await validateNodeLink(payload.etlNodeId, req.params.id, res);
  const task = await Task.findByIdAndUpdate(req.params.id, payload, {
    new: true,
    runValidators: true,
  });

  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  res.json(task);
};

export const deleteTask = async (req, res) => {
  if (req.user?.role === "employee") {
    res.status(403);
    throw new Error("Employees cannot delete tasks or submitted hours");
  }
  const existing = await Task.findById(req.params.id);
  if (existing?.workLogs?.length) {
    res.status(400);
    throw new Error("Tasks with submitted work hours cannot be deleted");
  }
  const task = await Task.findOneAndDelete({ _id: req.params.id, "workLogs.0": { $exists: false } });

  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  res.json({ message: "Task deleted successfully" });
};

export const addWorkUpdate = async (req, res) => {
  const { hours, note, status, progress, description, etlNodeId, workDate } = req.body;
  if (typeof hours !== "number" || !Number.isFinite(hours) || hours <= 0 || typeof note !== "string" || !note.trim()) {
    res.status(400);
    throw new Error("Enter positive working hours and describe the work done");
  }
  const today = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
  const logDate = workDate || today;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(logDate) || !Number.isFinite(Date.parse(logDate)) || new Date(logDate).toISOString().slice(0, 10) !== logDate || logDate > today || hours > 24) {
    res.status(400);
    throw new Error("Choose a valid work date up to today and at most 24 hours");
  }
  const task = await Task.findById(req.params.id);
  if (!task) { res.status(404); throw new Error("Task not found"); }
  if (!assignedToUser(req.user).includes(task.assignedTo) && !["admin", "superadmin", "hr"].includes(req.user.role)) {
    res.status(403);
    throw new Error("You can only update your assigned tasks");
  }
  await validateNodeLink(etlNodeId, task._id, res);
  const changes = {};
  if (status !== undefined) changes.status = status;
  if (progress !== undefined) changes.progress = progress;
  if (description !== undefined) changes.description = description;
  if (etlNodeId !== undefined) changes.etlNodeId = etlNodeId;
  if (status === "Completed") changes.progress = 100;
  const updated = await Task.findOneAndUpdate(
    { _id: task._id, assignedTo: task.assignedTo },
    {
      $set: changes,
      $inc: { totalWorkingHours: hours },
      $push: { workLogs: { hours, note: note.trim(), employee: req.user.email, workDate: logDate, status: changes.status || task.status, progress: changes.progress ?? task.progress, createdAt: new Date() } },
    },
    { new: true, runValidators: true }
  );
  if (!updated) { res.status(409); throw new Error("Task assignment changed; refresh and try again"); }
  res.json(updated);
};
