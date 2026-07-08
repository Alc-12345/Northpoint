import Client from "../models/Client.js";
import Employee from "../models/Employee.js";
import Project from "../models/Project.js";

export const getHrSummary = async (req, res) => {
  const [employees, clients, projects] = await Promise.all([
    Employee.countDocuments(),
    Client.countDocuments(),
    Project.countDocuments(),
  ]);

  const completedProjects = await Project.countDocuments({
    status: { $in: ["Completed", "Complete"] },
  });

  res.json({
    summary: {
      employees,
      clients,
      projects,
      completedProjects,
    },
    statuses: {
      projectStatuses: ["Pending", "Ongoing", "Completed"],
      clientStatuses: ["Pending", "Ongoing", "Completed"],
      employeeStatuses: ["Pending", "Active", "On Leave", "Resigned"],
    },
  });
};
