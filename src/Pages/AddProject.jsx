import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { projectApi } from "../services/api";

export default function AddProject() {
  const navigate = useNavigate();

  const inputClass =
    "w-full border border-gray-200 dark:border-[#243244] " +
    "bg-white dark:bg-[#0b1220] text-gray-800 dark:text-white " +
    "px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500";

  const labelClass =
    "block text-sm font-medium mb-1 text-gray-600 dark:text-gray-300";

  const sectionTitle =
    "text-lg font-semibold text-gray-800 dark:text-white border-b border-gray-200 dark:border-[#243244] pb-2 mb-4";

  const [formData, setFormData] = useState({
    name: "",
    manager: "",
    team: "",
    methodology: "Agile",
    storyPoints: "",
    estimatedHours: "",
    startDate: "",
    endDate: "",
    budget: "",
    version: "",
    milestone: "",
    description: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    const payload = { ...formData };
    ["storyPoints", "estimatedHours", "budget"].forEach((field) => {
      if (!payload[field]) delete payload[field];
    });
    ["startDate", "endDate"].forEach((field) => {
      if (!payload[field]) delete payload[field];
    });

    try {
      await projectApi.create(payload);
      navigate("/projects");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#0b1220] p-8 transition-colors duration-300">
      <div className="bg-white dark:bg-[#0b1220] border border-gray-200 dark:border-[#243244] rounded-xl shadow-sm p-8 max-w-6xl mx-auto transition-colors duration-300">

        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Create New Project
          </h1>

          <button
            onClick={() => navigate("/projects")}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* ================= BASIC INFO ================= */}
          <div>
            <h2 className={sectionTitle}>Basic Information</h2>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>Project Name *</label>
                <input
                  type="text"
                  name="name"
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Project Manager *</label>
                <input
                  type="text"
                  name="manager"
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Methodology</label>
                <select
                  name="methodology"
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option>Agile</option>
                  <option>Scrum</option>
                  <option>Kanban</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Version</label>
                <input
                  type="text"
                  name="version"
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="v1.0.0"
                />
              </div>
            </div>
          </div>

          {/* ================= TEAM & DESCRIPTION ================= */}
          <div>
            <h2 className={sectionTitle}>Team & Description</h2>

            <div className="space-y-6">
              <div>
                <label className={labelClass}>Team Members</label>
                <input
                  type="text"
                  name="team"
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Comma separated names"
                />
              </div>

              <div>
                <label className={labelClass}>Project Description</label>
                <textarea
                  name="description"
                  rows="4"
                  onChange={handleChange}
                  className={inputClass}
                ></textarea>
              </div>
            </div>
          </div>

          {/* ================= ESTIMATION ================= */}
          <div>
            <h2 className={sectionTitle}>Estimation & Budget</h2>

            <div className="grid grid-cols-3 gap-6">
              <div>
                <label className={labelClass}>Story Points</label>
                <input
                  type="number"
                  name="storyPoints"
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Estimated Hours</label>
                <input
                  type="number"
                  name="estimatedHours"
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Budget (₹)</label>
                <input
                  type="number"
                  name="budget"
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* ================= TIMELINE ================= */}
          <div>
            <h2 className={sectionTitle}>Timeline & Milestone</h2>

            <div className="grid grid-cols-3 gap-6">
              <div>
                <label className={labelClass}>Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>End Date</label>
                <input
                  type="date"
                  name="endDate"
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Milestone</label>
                <input
                  type="text"
                  name="milestone"
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* ================= BUTTONS ================= */}
          <div className="flex justify-end gap-4 pt-4 border-t border-gray-200 dark:border-[#243244]">
            <button
              type="button"
              onClick={() => navigate("/projects")}
              className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600"
            >
              {isSubmitting ? "Creating..." : "Create Project"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
