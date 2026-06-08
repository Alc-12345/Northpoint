import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddTask() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    project: "",
    description: "",
    priority: "Medium",
    status: "Pending",
    assignedTo: "",
    dueDate: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);

    // After submit redirect to dashboard
    navigate("/task-management");
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#0b1220] p-8 transition-colors duration-300">

      {/* Header */}
      

      {/* Form Card */}
      <div
        className="
        bg-white dark:bg-[#0b1220]
        border border-gray-200 dark:border-[#243244]
        rounded-xl shadow-sm
        p-5 h-full flex flex-col
        transition-colors duration-300
        max-w-4xl mx-auto
        "
      >
        <form onSubmit={handleSubmit} className="space-y-5">
        <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Add New Task
        </h1>

        <button
          onClick={() => navigate("/tasks")}
          className="bg-gray-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-600"
        >
          Cancel
        </button>
      </div>

          {/* Title */}
          <div>
            <label className="block text-sm mb-2 text-gray-600 dark:text-gray-300">
              Task Title
            </label>
            <input
              type="text"
              name="title"
              onChange={handleChange}
              required
              className="w-full border border-gray-300 dark:border-gray-600
              bg-gray-50 dark:bg-[#2a2a2a]
              text-gray-800 dark:text-white
              px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Enter task title"
            />
          </div>

          {/* Project & Priority */}
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-sm mb-2 text-gray-600 dark:text-gray-300">
                Project
              </label>
              <input
                type="text"
                name="project"
                onChange={handleChange}
                className="w-full border border-gray-300 dark:border-gray-600
                bg-gray-50 dark:bg-[#2a2a2a]
                text-gray-800 dark:text-white
                px-4 py-2 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm mb-2 text-gray-600 dark:text-gray-300">
                Priority
              </label>
              <select
                name="priority"
                onChange={handleChange}
                className="w-full border border-gray-300 dark:border-gray-600
                bg-gray-50 dark:bg-[#2a2a2a]
                text-gray-800 dark:text-white
                px-4 py-2 rounded-lg"
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
                <option>Critical</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm mb-2 text-gray-600 dark:text-gray-300">
              Description
            </label>
            <textarea
              name="description"
              rows="4"
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-gray-600
              bg-gray-50 dark:bg-[#2a2a2a]
              text-gray-800 dark:text-white
              px-4 py-2 rounded-lg"
            ></textarea>
          </div>

          {/* Assign & Due Date */}
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-sm mb-2 text-gray-600 dark:text-gray-300">
                Assign To
              </label>
              <input
                type="text"
                name="assignedTo"
                onChange={handleChange}
                className="w-full border border-gray-300 dark:border-gray-600
                bg-gray-50 dark:bg-[#2a2a2a]
                text-gray-800 dark:text-white
                px-4 py-2 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm mb-2 text-gray-600 dark:text-gray-300">
                Due Date
              </label>
              <input
                type="date"
                name="dueDate"
                onChange={handleChange}
                className="w-full border border-gray-300 dark:border-gray-600
                bg-gray-50 dark:bg-[#2a2a2a]
                text-gray-800 dark:text-white
                px-4 py-2 rounded-lg"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition"
            >
              Create Task
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
