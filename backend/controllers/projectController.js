import ActivityLog from "../models/ActivityLog.js";
import Employee from "../models/Employee.js";
import Project from "../models/Project.js";

const nextProjectCode = async () =>
  `PRJ-${new Date().getFullYear()}-${String((await Project.countDocuments()) + 1).padStart(3, "0")}`;

const projectQuery = () =>
  Project.find()
    .populate("client", "name email contact")
    .populate("assignedTeam", "name email role department skills status photo")
    .sort({ createdAt: -1 });

export const getProjects = async (req, res) => {
  const projects = await projectQuery();
  res.json(projects);
};

export const getProjectById = async (req, res) => {
  const project = await Project.findById(req.params.id)
    .populate("client", "name email contact")
    .populate("assignedTeam", "name email role department skills status photo");

  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }

  res.json(project);
};

export const createProject = async (req, res) => {
  const project = await Project.create({
    ...req.body,
    projectCode: req.body.projectCode || (await nextProjectCode()),
  });
  res.status(201).json(project);
};

export const updateProject = async (req, res) => {
  const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
    .populate("client", "name email contact")
    .populate("assignedTeam", "name email role department skills status photo");

  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }

  res.json(project);
};

export const deleteProject = async (req, res) => {
  const project = await Project.findByIdAndDelete(req.params.id);

  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }

  res.json({ message: "Project deleted successfully" });
};

export const assignTeam = async (req, res) => {
  const { employeeIds = [] } = req.body;
  const project = await Project.findById(req.params.id);

  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }

  const employees = await Employee.find({ _id: { $in: employeeIds } });
  project.assignedTeam = employees.map((employee) => employee._id);
  project.team = employees.map((employee) => employee.name).join(", ");
  project.activityLogs.push({
    action: "Team Assigned",
    details: `${employees.length} employee(s) assigned`,
  });
  await project.save();

  await Employee.updateMany(
    { _id: { $in: employeeIds } },
    { $set: { project: project.name, status: "Active" } }
  );

  await ActivityLog.create({
    user: req.user?._id || null,
    action: "Team Assigned",
    entityType: "Project",
    entityId: project._id,
    metadata: { employeeIds },
    ipAddress: req.ip,
  });

  const updatedProject = await Project.findById(project._id).populate(
    "assignedTeam",
    "name email role department skills status photo"
  );

  res.json({
    message: "Team assigned successfully",
    project: updatedProject,
  });
};
