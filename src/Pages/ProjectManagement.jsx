import { useEffect, useState } from "react";
import { FiEdit, FiEye, FiPlus, FiTrash2, FiUsers } from "react-icons/fi";
import { Link } from "react-router-dom";
import { projectApi } from "../services/api";

export default function ProjectDashboard() {
  const [projects, setProjects] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [draftStatus, setDraftStatus] = useState("Pending");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setError("");
        setIsLoading(true);
        const data = await projectApi.getAll();
        setProjects(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadProjects();
  }, []);

  const handleDelete = async (id) => {
    try {
      setError("");
      setUpdatingId(id);
      await projectApi.remove(id);
      setProjects(projects.filter((project) => project._id !== id));
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleEditStart = (project) => {
    setEditingId(project._id);
    setDraftStatus(project.status || "Pending");
  };

  const handleEditSave = async (id) => {
    try {
      setError("");
      setUpdatingId(id);
      const updated = await projectApi.update(id, { status: draftStatus });
      setProjects(projects.map((project) => (project._id === id ? updated : project)));
      setEditingId(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 text-gray-800 dark:bg-[#0b1220] dark:text-gray-200">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Project Management</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Converted leads, client links, and assigned teams in one place.
          </p>
        </div>

        <Link
          to="/add-project"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          <FiPlus />
          Create Project
        </Link>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm dark:border-[#243244] dark:bg-[#0b1220]">
        {isLoading && <div className="p-6 text-sm text-gray-500">Loading projects...</div>}
        {!isLoading && projects.length === 0 && !error && (
          <div className="p-6 text-sm text-gray-500">No projects found.</div>
        )}
        {!isLoading && projects.length > 0 && (
        <table className="w-full text-sm">
          <thead className="bg-gray-100 dark:bg-[#2a2a2a]">
            <tr>
              <th className="p-3 text-left">Project ID</th>
              <th className="p-3 text-left">Project Name</th>
              <th className="p-3 text-left">Client</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Progress</th>
              <th className="p-3 text-left">Start Date</th>
              <th className="p-3 text-left">Due Date</th>
              <th className="p-3 text-left">Assigned Team</th>
              <th className="p-3 text-left">Project Manager</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr
                key={project._id}
                className="border-t border-gray-200 dark:border-[#243244]"
              >
                <td className="p-3">{project.projectCode || project._id}</td>
                <td className="p-3 font-medium">{project.name}</td>
                <td className="p-3">
                  {project.clientName || project.client?.contact || project.email || "-"}
                </td>
                <td className="p-3">
                  {editingId === project._id ? (
                    <select
                      value={draftStatus}
                      onChange={(e) => setDraftStatus(e.target.value)}
                      className="rounded-lg border border-gray-300 bg-white p-2 dark:border-gray-600 dark:bg-[#0b1220]"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Ongoing">Ongoing</option>
                      <option value="Completed">Completed</option>
                    </select>
                  ) : (
                    <StatusBadge status={project.status} />
                  )}
                </td>
                <td className="p-3">
                  <div className="min-w-28">
                    <div className="mb-1 flex justify-between text-xs">
                      <span>{project.progress ?? 0}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-700">
                      <div
                        className="h-2 rounded-full bg-blue-600"
                        style={{ width: `${project.progress ?? 0}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td className="p-3">{formatDate(project.startDate)}</td>
                <td className="p-3">{formatDate(project.endDate)}</td>
                <td className="p-3">{teamLabel(project)}</td>
                <td className="p-3">{project.manager || "Not assigned"}</td>
                <td className="p-3">
                  <div className="flex justify-center gap-3">
                    <Link
                      to="/add-teams"
                      state={{ project, projects, setProjects }}
                      className="text-green-600 hover:text-green-800"
                      title="Add team"
                    >
                      <FiUsers />
                    </Link>
                    <Link
                      to={`/projects/${project._id}`}
                      className="text-slate-600 hover:text-slate-800 dark:text-slate-300"
                      title="View project"
                    >
                      <FiEye />
                    </Link>
                    {editingId === project._id ? (
                      <button
                        onClick={() => handleEditSave(project._id)}
                        disabled={updatingId === project._id}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        {updatingId === project._id ? "Saving..." : "Save"}
                      </button>
                    ) : (
                      <button
                        onClick={() => handleEditStart(project)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Edit status"
                      >
                        <FiEdit />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(project._id)}
                      disabled={updatingId === project._id}
                      className="text-red-600 hover:text-red-800"
                      title="Delete project"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status = "Pending" }) {
  const colors = {
    Pending: "bg-amber-100 text-amber-700",
    Ongoing: "bg-blue-100 text-blue-700",
    Completed: "bg-green-100 text-green-700",
    Complete: "bg-green-100 text-green-700",
    Active: "bg-green-100 text-green-700",
  };

  return (
    <span className={`rounded-full px-2 py-1 text-xs font-medium ${colors[status] || colors.Pending}`}>
      {status}
    </span>
  );
}

function formatDate(value) {
  return value ? new Date(value).toLocaleDateString() : "-";
}

function teamLabel(project) {
  if (project.assignedTeam?.length) {
    return project.assignedTeam.map((employee) => employee.name || employee).join(", ");
  }

  return project.team || "Not assigned";
}
