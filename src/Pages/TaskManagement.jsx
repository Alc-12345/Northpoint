import { useEffect, useMemo, useState } from "react";
import { FiGrid, FiUsers, FiCheckCircle, FiClock } from "react-icons/fi";
import { Link } from "react-router-dom";
import { taskApi } from "../services/api";

export default function TaskManagement() {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const data = await taskApi.getAll();
        setTasks(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadTasks();
  }, []);

  const stats = useMemo(() => {
    const completed = tasks.filter((task) => task.status === "Completed").length;
    const active = tasks.filter((task) => task.status === "In Progress").length;
    const pending = tasks.filter((task) => task.status === "Pending").length;

    return [
      { title: "Total Tasks", value: tasks.length, change: "+0%", icon: <FiGrid /> },
      { title: "Active Tasks", value: active, change: "+0%", icon: <FiClock /> },
      { title: "Pending", value: pending, change: "+0%", icon: <FiUsers /> },
      { title: "Completed", value: completed, change: "+0%", icon: <FiCheckCircle /> },
    ];
  }, [tasks]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#0b1220] p-8 transition-colors duration-300">
      
      {/* Main Container */}
      <div
        className="
        bg-white dark:bg-[#0b1220]
        border border-gray-200 dark:border-[#243244]
        rounded-xl shadow-sm
        p-6
        transition-colors duration-300
        "
      >
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Task & Sprint Management
          </h1>

          <Link
            to="/add-task"
            className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-orange-600 transition"
          >
            + Add New Task
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="
              bg-white dark:bg-[#262626]
              border border-gray-200 dark:border-[#243244]
              rounded-xl shadow-sm
              p-5
              transition-colors duration-300
              "
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {stat.title}
                  </p>
                  <h2 className="text-xl font-bold text-gray-800 dark:text-white mt-1">
                    {stat.value}
                  </h2>
                </div>
                <div className="text-orange-500 text-xl">
                  {stat.icon}
                </div>
              </div>
              <p className="text-xs text-green-500 mt-3">
                {stat.change}
              </p>
            </div>
          ))}
        </div>

        {/* Filter Section */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            Task Grid
          </h2>

          <div className="flex gap-3">
            <select
              className="
              bg-white dark:bg-[#262626]
              border border-gray-200 dark:border-[#243244]
              text-gray-700 dark:text-white
              text-sm px-3 py-2 rounded-lg
              "
            >
              <option>Select Status</option>
              <option>Pending</option>
              <option>In Progress</option>
              <option>Completed</option>
            </select>

            <select
              className="
              bg-white dark:bg-[#262626]
              border border-gray-200 dark:border-[#243244]
              text-gray-700 dark:text-white
              text-sm px-3 py-2 rounded-lg
              "
            >
              <option>Sort By: Latest</option>
              <option>Oldest</option>
            </select>
          </div>
        </div>

        {/* Task Grid */}
        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600">
            {error}
          </div>
        )}
        {isLoading && (
          <div className="text-sm text-gray-500">Loading tasks...</div>
        )}
        {!isLoading && tasks.length === 0 && !error && (
          <div className="text-sm text-gray-500">No tasks found.</div>
        )}
        <div className="grid grid-cols-4 gap-6">
          {tasks.map((task) => (
            <div
              key={task._id}
              className="
              bg-white dark:bg-[#262626]
              border border-gray-200 dark:border-[#243244]
              rounded-xl shadow-sm
              p-5
              hover:shadow-md
              transition
              "
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-800 dark:text-white">
                  {task.title}
                </h3>

                <span className="text-xs bg-orange-500 text-white px-2 py-1 rounded">
                  {task.priority}
                </span>
              </div>

              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                Project: {task.project || "Not assigned"}
              </p>

              {/* Progress */}
              <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full mb-2">
                <div
                  className="bg-orange-500 h-2 rounded-full"
                  style={{ width: task.status === "Completed" ? "100%" : "35%" }}
                ></div>
              </div>

              <p className="text-xs text-gray-500 dark:text-gray-400">
                {task.status}
              </p>

              <p className="text-xs text-gray-400 dark:text-gray-500 mt-4">
                Assigned To: {task.assignedTo || "Unassigned"}
              </p>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="flex justify-center mt-8">
          <button className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition">
            Load More
          </button>
        </div>

      </div>
    </div>
  );
}
