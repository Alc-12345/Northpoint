import React, { useEffect, useState } from "react";
import { FiFolder, FiUsers, FiCalendar, FiEye } from "react-icons/fi";
import { Link } from "react-router-dom";
import { projectApi } from "../services/api";

const EmployeeProjects = () => {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const authUser = JSON.parse(localStorage.getItem("authUser") || "{}");
        const data = await projectApi.getAll();
        const assignedProjects = data.filter((project) =>
          project.assignedTeam?.some(
            (employee) => employee.email === authUser.email || employee.name === authUser.name
          )
        );
        setProjects(assignedProjects.length ? assignedProjects : data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadProjects();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen dark:bg-[#2A2A2A] ">

      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold dark:text-white">My Projects</h1>
      </div>
      {error && <div className="mb-4 text-sm text-red-600">{error}</div>}
      {isLoading && <div className="text-sm text-gray-500">Loading projects...</div>}

      {/* Projects Grid */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

        {projects.map((project) => (
          <div
            key={project._id}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow hover:shadow-lg transition"
          >

            {/* Project Title */}
            <div className="flex items-center gap-3 mb-3">
              <FiFolder className="text-blue-600 text-xl" />
              <h2 className="text-lg font-semibold dark:text-white">
                {project.name}
              </h2>
            </div>

            {/* Description */}
            <p className="text-gray-500 text-sm mb-4">
              {project.description || "No description provided."}
            </p>

            {/* Status */}
            <div className="flex justify-between mb-2 text-sm">
              <span className="text-gray-500">Status</span>
              <span
                className={`font-semibold ${
                  project.status === "Completed"
                    ? "text-green-600"
                    : project.status === "In Progress"
                    ? "text-blue-600"
                    : "text-orange-500"
                }`}
              >
                {project.status || "Pending"}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${project.progress || 0}%` }}
              ></div>
            </div>

            {/* Deadline */}
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
              <FiCalendar />
              Deadline: {project.endDate ? new Date(project.endDate).toLocaleDateString() : "Not set"}
            </div>

            {/* Team Members */}
            <div className="flex items-center justify-between">

              <div className="flex items-center gap-2">
                <FiUsers className="text-gray-500" />

                <div className="flex -space-x-2">
                  {(project.assignedTeam || []).slice(0, 4).map((member, index) => (
                    <img
                      key={index}
                      src={member.photo || "https://i.pravatar.cc/40"}
                      alt="team"
                      className="w-8 h-8 rounded-full border"
                    />
                  ))}
                </div>
              </div>

              {/* View Button */}
              <Link to={`/projects/${project._id}`} className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium">
                <FiEye />
                View
              </Link>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployeeProjects;
