import Employee from "../models/Employee.js";
import User from "../models/User.js";

const generateUsername = (value = "employee") =>
  `${value.replace(/[^a-z0-9]/gi, "").toLowerCase().slice(0, 12) || "employee"}${String(
    Date.now()
  ).slice(-2)}`;

const generatePassword = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789#$@!";
  return Array.from({ length: 10 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
};

export const getEmployees = async (req, res) => {
  const employees = await Employee.find().sort({ createdAt: -1 });
  res.json(employees);
};

export const getEmployeeById = async (req, res) => {
  const employee = await Employee.findById(req.params.id);

  if (!employee) {
    res.status(404);
    throw new Error("Employee not found");
  }

  res.json(employee);
};

export const createEmployee = async (req, res) => {
  const password = req.body.password || generatePassword();
  const username = req.body.username || generateUsername(req.body.name);

  const employeeDraft = new Employee({
    ...req.body,
    username,
    generatedPassword: password,
    credentialsSentAt: new Date(),
  });
  const validationError = employeeDraft.validateSync();

  if (validationError) {
    throw validationError;
  }

  if (!password || password.length < 6) {
    res.status(400);
    throw new Error("Password must be at least 6 characters");
  }

  const existingUser = await User.findOne({
    $or: [{ email: req.body.email }, { username }],
  });
  const existingEmployee = await Employee.exists({
    $or: [{ email: req.body.email }, { username }],
  });

  if (existingUser || existingEmployee) {
    res.status(400);
    throw new Error("Employee login email or ID already exists");
  }

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    username,
    role: "employee",
    createdBy: req.user?._id || null,
  });
  user.setPassword(password);
  await user.save();

  employeeDraft.user = user._id;
  employeeDraft.username = user.username || username;
  const employee = await employeeDraft.save();
  const employeeJson = employee.toJSON();

  res.status(201).json({
    ...employeeJson,
    message: "Employee account created successfully",
    employee: employeeJson,
    credentials: {
      username: employee.username,
      email: employee.email,
      password,
    },
  });
};

export const updateEmployee = async (req, res) => {
  const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!employee) {
    res.status(404);
    throw new Error("Employee not found");
  }

  res.json(employee);
};

export const deleteEmployee = async (req, res) => {
  const employee = await Employee.findByIdAndDelete(req.params.id);

  if (!employee) {
    res.status(404);
    throw new Error("Employee not found");
  }

  res.json({ message: "Employee deleted successfully" });
};
