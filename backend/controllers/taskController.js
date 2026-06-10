import Task from "../models/Task.js";

export const getTasks = async (req, res) => {
  const tasks = await Task.find().sort({ createdAt: -1 });
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
  const task = await Task.create(req.body);
  res.status(201).json(task);
};

export const updateTask = async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
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
  const task = await Task.findByIdAndDelete(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  res.json({ message: "Task deleted successfully" });
};
