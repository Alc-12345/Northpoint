import React from "react";
import { FiFolder, FiUsers, FiCalendar, FiEye } from "react-icons/fi";

const EmployeeProjects = () => {
  const projects = [
    {
      id: 1,
      name: "ERP Management System",
      description: "Complete company ERP system with HR, CRM and Project modules.",
      status: "In Progress",
      progress: 70,
      deadline: "30 May 2026",
      team: ["https://i.pravatar.cc/40?img=1","https://i.pravatar.cc/40?img=2","https://i.pravatar.cc/40?img=3"]
    },
    {
      id: 2,
      name: "E-Commerce Website",
      description: "Full stack ecommerce platform with payment gateway.",
      status: "Completed",
      progress: 100,
      deadline: "12 April 2026",
      team: ["https://i.pravatar.cc/40?img=4","https://i.pravatar.cc/40?img=5"]
    },
    {
      id: 3,
      name: "School Management System",
      description: "Manage students, teachers, exams and attendance.",
      status: "Pending",
      progress: 25,
      deadline: "15 June 2026",
      team: ["https://i.pravatar.cc/40?img=6","https://i.pravatar.cc/40?img=7","https://i.pravatar.cc/40?img=8"]
    },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen dark:bg-[#2A2A2A] ">

      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold dark:text-white">My Projects</h1>
      </div>

      {/* Projects Grid */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

        {projects.map((project) => (
          <div
            key={project.id}
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
              {project.description}
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
                {project.status}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${project.progress}%` }}
              ></div>
            </div>

            {/* Deadline */}
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
              <FiCalendar />
              Deadline: {project.deadline}
            </div>

            {/* Team Members */}
            <div className="flex items-center justify-between">

              <div className="flex items-center gap-2">
                <FiUsers className="text-gray-500" />

                <div className="flex -space-x-2">
                  {project.team.map((member, index) => (
                    <img
                      key={index}
                      src={member}
                      alt="team"
                      className="w-8 h-8 rounded-full border"
                    />
                  ))}
                </div>
              </div>

              {/* View Button */}
              <button className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium">
                <FiEye />
                View
              </button>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployeeProjects;
