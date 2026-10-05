import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { employeeApi, projectApi, taskApi } from "../services/api";

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
    workCategory: "frontend",
  });
  const [error, setError] = useState("");
  const [employees, setEmployees] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    Promise.all([employeeApi.getAll(), projectApi.getAll()])
      .then(([people, items]) => { setEmployees(people); setProjects(items); })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);
  const selectedProject = projects.find(project => project.name === formData.project);
  const eligibleEmployees = selectedProject ? employees.filter(employee => selectedProject.assignedTeam?.some(member => (member._id || member) === employee._id)) : employees;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const project = projects.find(item => item.name === e.target.value);
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
      ...(e.target.name === "project" ? { assignedTo: "", dueDate: project?.endDate?.slice(0, 10) || "" } : {}),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    const payload = { ...formData };
    if (!payload.dueDate) delete payload.dueDate;

    try {
      await taskApi.create(payload);
      navigate("/tasks");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
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
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600">
            {error}
          </div>
        )}
        <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Add New Task
        </h1>

        <button
          type="button"
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
              <select name="project" value={formData.project} onChange={handleChange} required disabled={loading} className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 dark:bg-[#2a2a2a] dark:text-white">
                <option value="">Select project</option>
                {projects.map(project => <option key={project._id} value={project.name}>{project.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm mb-2 text-gray-600 dark:text-gray-300">
                Priority
              </label>
              <select
                name="priority"
                value={formData.priority}
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

          <div>
            <label htmlFor="work-category" className="block text-sm mb-2 text-gray-600 dark:text-gray-300">Work area</label>
            <select id="work-category" name="workCategory" value={formData.workCategory} onChange={handleChange} className="w-full rounded-lg border bg-gray-50 p-2 dark:bg-[#2a2a2a] dark:text-white">
              <option value="frontend">Frontend / UI</option>
              <option value="backend">Backend</option>
              <option value="server">Server</option>
            </select>
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
              <select name="assignedTo" value={formData.assignedTo} onChange={handleChange} required disabled={loading} className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 dark:bg-[#2a2a2a] dark:text-white">
                <option value="">Select employee</option>
                {eligibleEmployees.map(employee => <option key={employee._id} value={employee.email}>{employee.name} — {employee.email}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm mb-2 text-gray-600 dark:text-gray-300">
                Due Date
              </label>
              <input
                type="date"
                name="dueDate"
                required
                value={formData.dueDate}
                max={selectedProject?.endDate?.slice(0, 10)}
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
              disabled={isSubmitting || loading}
              className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition"
            >
              {isSubmitting ? "Creating..." : "Create Task"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
