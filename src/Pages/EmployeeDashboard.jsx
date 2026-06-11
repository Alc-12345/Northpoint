import React from "react";
import {
  FiUser,
  FiFolder,
  FiCheckSquare,
  FiClock,
  FiActivity,
  FiCalendar,
} from "react-icons/fi";

const EmployeeDashboard = () => {
  const projects = [
    { id: 1, name: "ERP System", status: "In Progress", progress: 70 },
    { id: 2, name: "Company Website", status: "Completed", progress: 100 },
    { id: 3, name: "Mobile App", status: "Pending", progress: 40 },
  ];

  const tasks = [
    { id: 1, title: "Design login page", priority: "High", deadline: "10 Mar 2026" },
    { id: 2, title: "API integration", priority: "Medium", deadline: "12 Mar 2026" },
    { id: 3, title: "Fix dashboard bugs", priority: "Low", deadline: "15 Mar 2026" },
  ];

  const activities = [
    "Completed task: Fix navbar bug",
    "Joined project: ERP System",
    "Submitted leave request",
    "Updated profile information",
  ];

  return (
    <div className="min-h-screen">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Employee Dashboard
        </h1>
        <p className="text-gray-500 text-sm">
          Welcome back, here is your work overview
        </p>
      </div>

      <div className="grid grid-cols-12 gap-6">

        {/* ===== STATS CARDS ===== */}

        <div className="col-span-12 grid md:grid-cols-4 gap-6">

          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-5 rounded-xl shadow flex items-center gap-4">
            <FiFolder size={26} />
            <div>
              <p className="text-sm opacity-80">Projects</p>
              <h2 className="text-2xl font-bold">3</h2>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-5 rounded-xl shadow flex items-center gap-4">
            <FiCheckSquare size={26} />
            <div>
              <p className="text-sm opacity-80">Tasks</p>
              <h2 className="text-2xl font-bold">8</h2>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-5 rounded-xl shadow flex items-center gap-4">
            <FiClock size={26} />
            <div>
              <p className="text-sm opacity-80">Working Hours</p>
              <h2 className="text-2xl font-bold">32h</h2>
            </div>
          </div>

          <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white p-5 rounded-xl shadow flex items-center gap-4">
            <FiCalendar size={26} />
            <div>
              <p className="text-sm opacity-80">Pending Tasks</p>
              <h2 className="text-2xl font-bold">5</h2>
            </div>
          </div>

        </div>

        {/* ===== PROFILE ===== */}

        <div className="col-span-12 lg:col-span-4 bg-white dark:bg-[#0b1220] border border-[#243244] p-6 rounded-xl shadow text-center">

          <div className="w-20 h-20 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
            <FiUser />
          </div>

          <h2 className="text-lg font-bold text-gray-800 dark:text-white">
            John Doe
          </h2>

          <p className="text-gray-500 text-sm">
            Frontend Developer
          </p>

          <div className="mt-4 text-sm text-gray-600 dark:text-gray-300 space-y-1">
            <p>Email: john@company.com</p>
            <p>Experience: 3 Years</p>
            <p>Tech: React, Node, MongoDB</p>
          </div>

          <button className="mt-5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
            View Profile
          </button>

        </div>

        {/* ===== PROJECTS ===== */}

        <div className="col-span-12 lg:col-span-8 bg-white  dark:bg-[#0b1220] border border-[#243244] p-6 rounded-xl shadow">

          <div className="flex justify-between mb-4">
            <h2 className="font-semibold text-gray-800 dark:text-white">
              My Projects
            </h2>
            <button className="text-blue-600 text-sm">
              View All
            </button>
          </div>

          <div className="space-y-4">
            {projects.map((project) => (
              <div key={project.id} className="border dark:border-[#243244] rounded-lg p-4">

                <div className="flex justify-between mb-2">
                  <h3 className="font-semibold dark:text-white">
                    {project.name}
                  </h3>

                  <span className="text-sm text-gray-500">
                    {project.status}
                  </span>
                </div>

                <div className="w-full bg-gray-200  dark:bg-[#0b1220] border border-[#243244] h-2 rounded">
                  <div
                    className="bg-blue-600 h-2 rounded"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>

                <p className="text-xs text-gray-500 mt-1">
                  {project.progress}% Completed
                </p>

              </div>
            ))}
          </div>

        </div>

        {/* ===== TASKS ===== */}

        <div className="col-span-12 lg:col-span-6 bg-white  dark:bg-[#0b1220] border border-[#243244] p-6 rounded-xl shadow">

          <div className="flex justify-between mb-4">
            <h2 className="font-semibold text-gray-800 dark:text-white">
              My Tasks
            </h2>

            <button className="text-blue-600 text-sm">
              View All
            </button>
          </div>

          <div className="space-y-4">

            {tasks.map((task) => (
              <div
                key={task.id}
                className="border dark:border-[#243244] rounded-lg p-4 flex justify-between items-center"
              >

                <div>
                  <h3 className="font-semibold dark:text-white">
                    {task.title}
                  </h3>

                  <p className="text-xs text-gray-500">
                    Deadline: {task.deadline}
                  </p>
                </div>

                <span className="text-xs px-3 py-1 bg-blue-100 text-blue-600 rounded">
                  {task.priority}
                </span>

              </div>
            ))}

          </div>

        </div>

        {/* ===== ACTIVITY ===== */}

        <div className="col-span-12 lg:col-span-6 bg-white  dark:bg-[#0b1220] border border-[#243244] p-6 rounded-xl shadow">

          <div className="flex items-center gap-2 mb-4">
            <FiActivity className="text-blue-600" />
            <h2 className="font-semibold text-gray-800 dark:text-white">
              Recent Activity
            </h2>
          </div>

          <ul className="space-y-3">

            {activities.map((activity, index) => (
              <li
                key={index}
                className="border-l-4 border-blue-500 pl-3 text-gray-600 dark:text-gray-300"
              >
                {activity}
              </li>
            ))}

          </ul>

        </div>

      </div>
    </div>
  );
};

export default EmployeeDashboard;
