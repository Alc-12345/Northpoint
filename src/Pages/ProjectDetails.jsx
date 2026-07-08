import React from "react";

const projects = [
  {
    id: 1,
    name: "School ERP System",
    manager: "John Doe",
    status: "In Progress",
    progress: 75,
    team: 12,
    budget: "₹12,50,000",
    deadline: "30 Dec 2026",
  },
  {
    id: 2,
    name: "HR Management",
    manager: "Sarah Smith",
    status: "Completed",
    progress: 100,
    team: 8,
    budget: "₹8,00,000",
    deadline: "10 Jun 2026",
  },
  {
    id: 3,
    name: "CRM Dashboard",
    manager: "Alex",
    status: "Pending",
    progress: 30,
    team: 6,
    budget: "₹5,50,000",
    deadline: "15 Jan 2027",
  },
  {
    id: 4,
    name: "Finance Portal",
    manager: "Emma",
    status: "Testing",
    progress: 90,
    team: 10,
    budget: "₹10,00,000",
    deadline: "20 Aug 2026",
  },
];

export default function ProjectDetails() {
  return (
    <div className="min-h-screen bg-[#0b1220] p-6 text-white">
      <h1 className="text-3xl font-bold mb-8">Project Details</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-[#0b1220] border border-[#24365d] rounded-2xl p-6 shadow-lg hover:scale-105 transition"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">{project.name}</h2>

              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  project.status === "Completed"
                    ? "bg-green-500"
                    : project.status === "In Progress"
                    ? "bg-blue-500"
                    : project.status === "Testing"
                    ? "bg-yellow-500 text-black"
                    : "bg-red-500"
                }`}
              >
                {project.status}
              </span>
            </div>

            <div className="space-y-2 text-sm text-gray-300">
              <p>
                <span className="text-gray-400">Manager:</span>{" "}
                {project.manager}
              </p>

              <p>
                <span className="text-gray-400">Team:</span>{" "}
                {project.team} Members
              </p>

              <p>
                <span className="text-gray-400">Budget:</span>{" "}
                {project.budget}
              </p>

              <p>
                <span className="text-gray-400">Deadline:</span>{" "}
                {project.deadline}
              </p>
            </div>

            <div className="mt-5">
              <div className="flex justify-between mb-2 text-sm">
                <span>Progress</span>
                <span>{project.progress}%</span>
              </div>

              <div className="w-full h-3 rounded-full bg-gray-700">
                <div
                  className="h-3 rounded-full bg-cyan-400"
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>
            </div>

            <button className="mt-6 w-full py-2 rounded-xl bg-cyan-500 hover:bg-cyan-600 font-semibold transition">
              View Project
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}