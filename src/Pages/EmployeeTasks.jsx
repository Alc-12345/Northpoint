import React from "react";
import { FiCheckSquare, FiClock, FiFlag, FiCheckCircle } from "react-icons/fi";
import {useNavigate} from "react-router-dom";

const EmployeeTasks = () => {
  const navigate = useNavigate();
  const tasks = [
    {
      id: 1,
      title: "Design Login Page",
      project: "ERP System",
      priority: "High",
      status: "In Progress",
      deadline: "10 Mar 2026",
      progress: 60,
    },
    {
      id: 2,
      title: "API Integration",
      project: "Company Website",
      priority: "Medium",
      status: "Pending",
      deadline: "12 Mar 2026",
      progress: 30,
    },
    {
      id: 3,
      title: "Fix Dashboard Bugs",
      project: "CRM System",
      priority: "Low",
      status: "Completed",
      deadline: "05 Mar 2026",
      progress: 100,
    },
    {
      id: 4,
      title: "Create Mobile UI",
      project: "Mobile App",
      priority: "High",
      status: "In Progress",
      deadline: "18 Mar 2026",
      progress: 45,
    },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen dark:bg-gray-900">

      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold dark:text-white">My Tasks</h1>
      </div>

      {/* Tasks Grid */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

        {tasks.map((task) => (
          <div
            key={task.id}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow hover:shadow-lg transition"
          >

            {/* Task Title */}
            <div className="flex items-center gap-3 mb-3">
              <FiCheckSquare className="text-blue-600 text-xl" />
              <h2 className="text-lg font-semibold dark:text-white">
                {task.title}
              </h2>
            </div>

            {/* Project */}
            <p className="text-gray-500 text-sm mb-4">
              Project: <span className="font-medium">{task.project}</span>
            </p>

            {/* Priority */}
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-500 flex items-center gap-1">
                <FiFlag />
                Priority
              </span>

              <span
                className={`font-semibold ${
                  task.priority === "High"
                    ? "text-red-600"
                    : task.priority === "Medium"
                    ? "text-yellow-500"
                    : "text-green-600"
                }`}
              >
                {task.priority}
              </span>
            </div>

            {/* Status */}
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-500">Status</span>
              <span
                className={`font-semibold ${
                  task.status === "Completed"
                    ? "text-green-600"
                    : task.status === "In Progress"
                    ? "text-blue-600"
                    : "text-orange-500"
                }`}
              >
                {task.status}
              </span>
            </div>

            {/* Deadline */}
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
              <FiClock />
              Deadline: {task.deadline}
            </div>

            {/* Progress */}
            <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${task.progress}%` }}
              ></div>
            </div>

            <p className="text-xs text-gray-500 mb-4">
              {task.progress}% Completed
            </p>

            {/* Action Button */}
            {task.status !== "Completed" && (
              <button onClick={() => navigate(`/tasks/${task.id}`)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm">
                <FiCheckCircle />
                Mark Complete
              </button>
            )}
          </div>
        ))}

      </div>
    </div>
  );
};

export default EmployeeTasks;
