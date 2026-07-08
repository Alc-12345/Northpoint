import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { employeeApi, projectApi } from "../services/api";

const projectNeedLabels = {
  website: "Website Development",
  "web-app": "Web Application",
  "mobile-app": "Mobile App",
  saas: "SaaS Product",
  ai: "AI Integration / AI Solution",
  game: "Game Development",
  uiux: "UI/UX Design",
  ecommerce: "E-commerce Solution",
  "erp-crm": "ERP / CRM System",
  automation: "Business Automation",
  custom: "Custom Software",
  other: "Other",
};

const budgetToNumber = {
  "under-1000": 1000,
  "1000-5000": 5000,
  "5000-10000": 10000,
  "10000-25000": 25000,
  "25000-plus": 25000,
};

export default function AddProject() {
  const navigate = useNavigate();
  const location = useLocation();
  const lead = location.state?.lead;

  const inputClass =
    "w-full border border-gray-200 dark:border-[#243244] " +
    "bg-white dark:bg-[#0b1220] text-gray-800 dark:text-white " +
    "px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500";

  const labelClass =
    "block text-sm font-medium mb-1 text-gray-600 dark:text-gray-300";

  const sectionTitle =
    "text-lg font-semibold text-gray-800 dark:text-white border-b border-gray-200 dark:border-[#243244] pb-2 mb-4";

  const [formData, setFormData] = useState({
    name: lead
      ? `${projectNeedLabels[lead.projectNeed] || lead.projectNeed || lead.service || "New"} - ${lead.name}`
      : "",
    manager: "",
    team: "",
    methodology: "Agile",
    status: "Pending",
    storyPoints: "",
    estimatedHours: "",
    startDate: "",
    endDate: "",
    budget: lead ? budgetToNumber[lead.projectBudget || lead.budget] || "" : "",
    version: "",
    milestone: lead?.projectTimeline || "",
    assignedTeam: [],
    description: lead
      ? [
          lead.businessDetails,
          lead.message,
          lead.industry ? `Industry: ${lead.industry}` : "",
          lead.website ? `Website: ${lead.website}` : "",
          lead.email ? `Lead email: ${lead.email}` : "",
        ].filter(Boolean).join("\n")
      : "",
  });
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState("");
  const [employeeError, setEmployeeError] = useState("");
  const [isLoadingEmployees, setIsLoadingEmployees] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        setEmployeeError("");
        setIsLoadingEmployees(true);
        const data = await employeeApi.getAll();
        setEmployees(data);
      } catch (err) {
        setEmployeeError(err.message);
      } finally {
        setIsLoadingEmployees(false);
      }
    };

    loadEmployees();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleTeamChange = (e) => {
    const assignedTeam = Array.from(e.target.selectedOptions, (option) => option.value);
    const team = employees
      .filter((employee) => assignedTeam.includes(employee._id))
      .map((employee) => employee.name)
      .join(", ");

    setFormData({
      ...formData,
      assignedTeam,
      team,
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
    if (!payload.assignedTeam.length) delete payload.assignedTeam;

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
          {lead && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Prefilled from lead: {lead.name}
            </p>
          )}

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
          {employeeError && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-700">
              Team list could not load: {employeeError}
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
                  value={formData.name}
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
                  value={formData.manager}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Methodology</label>
                <select
                  name="methodology"
                  value={formData.methodology}
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
                  value={formData.version}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="v1.0.0"
                />
              </div>

              <div>
                <label className={labelClass}>Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="Pending">Pending</option>
                  <option value="Ongoing">Ongoing</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>
          </div>

          {/* ================= TEAM & DESCRIPTION ================= */}
          <div>
            <h2 className={sectionTitle}>Team & Description</h2>

            <div className="space-y-6">
              <div>
                <label className={labelClass}>Team Members</label>
                <select
                  name="assignedTeam"
                  value={formData.assignedTeam}
                  onChange={handleTeamChange}
                  multiple
                  disabled={isLoadingEmployees}
                  className={inputClass}
                >
                  {isLoadingEmployees && <option>Loading employees...</option>}
                  {!isLoadingEmployees && employees.length === 0 && (
                    <option disabled>No employees found</option>
                  )}
                  {employees.map((employee) => (
                    <option key={employee._id} value={employee._id}>
                      {employee.name} {employee.role ? `- ${employee.role}` : ""}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Hold Ctrl to select multiple team members.
                </p>
                {formData.team && (
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                    Selected: {formData.team}
                  </p>
                )}
              </div>

              <div>
                <label className={labelClass}>Project Description</label>
                <textarea
                  name="description"
                  rows="4"
                  value={formData.description}
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
                  value={formData.storyPoints}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Estimated Hours</label>
                <input
                  type="number"
                  name="estimatedHours"
                  value={formData.estimatedHours}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Budget (₹)</label>
                <input
                  type="number"
                  name="budget"
                  value={formData.budget}
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
                  value={formData.startDate}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>End Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Milestone</label>
                <input
                  type="text"
                  name="milestone"
                  value={formData.milestone}
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
