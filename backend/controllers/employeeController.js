import Employee from "../models/Employee.js";

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
  const employee = await Employee.create(req.body);
  res.status(201).json(employee);
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
