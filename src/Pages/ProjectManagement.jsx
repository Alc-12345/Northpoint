import { useEffect, useState } from "react";
import { FiEdit, FiTrash2, FiUsers } from "react-icons/fi";
import { Link } from "react-router-dom";
import { projectApi } from "../services/api";

export default function ProjectDashboard() {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [draftStatus, setDraftStatus] = useState("Pending");

  useEffect(() => {
    const loadProjects = async () => {
      try {
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
      await projectApi.remove(id);
      setProjects(projects.filter((project) => project._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditStart = (project) => {
    setEditingId(project._id);
    setDraftStatus(project.status || "Pending");
  };

  const handleEditSave = async (id) => {
    try {
      const updated = await projectApi.update(id, { status: draftStatus });
      setProjects(projects.map((project) => (project._id === id ? updated : project)));
      setEditingId(null);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="p-6 bg-gray-100 dark:bg-[#0b1220] min-h-screen text-gray-800 dark:text-gray-200">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Project Management</h2>

        <div className="flex gap-3">
          <Link
            to="/teams"
            className="inline-flex items-center gap-2 rounded-lg bg-slate-700 px-4 py-2 text-white hover:bg-slate-800"
          >
            <FiUsers />
            Add Team
          </Link>
          <Link
            to="/add-project"
            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            + Create Project
          </Link>
        </div>
      </div>

      {/* Project Cards */}
      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600">
          {error}
        </div>
      )}
      {isLoading && (
        <div className="text-sm text-gray-500">Loading projects...</div>
      )}
      {!isLoading && projects.length === 0 && !error && (
        <div className="text-sm text-gray-500">No projects found.</div>
      )}
      <div className="grid md:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project._id} className="bg-white dark:bg-[#0b1220] p-5 rounded-xl shadow border border-gray-200 dark:border-[#243244] hover:shadow-lg transition">
            <div className="flex items-start justify-between gap-3">
              <Link to={`/projects/${project._id}`} className="flex-1">
                <h3 className="font-semibold text-lg">{project.name}</h3>
                <p className="text-sm mt-1">Manager: {project.manager || "Not assigned"}</p>
                <p className="text-sm mt-2">Progress: {project.storyPoints ? `${project.storyPoints} pts` : "0%"}</p>
                <p className={`mt-2 text-sm font-medium ${project.status === "Completed" || project.status === "Complete" ? "text-green-500" : project.status === "Ongoing" ? "text-blue-500" : "text-amber-500"}`}>
                  Status: {project.status || "Pending"}
                </p>
              </Link>
              <div className="flex gap-2">
                <Link to="/teams" state={{ project }} className="text-green-600 hover:text-green-800" title="Add team">
                  <FiUsers />
                </Link>
                <button onClick={() => handleEditStart(project)} className="text-blue-600 hover:text-blue-800" title="Edit status">
                  <FiEdit />
                </button>
                <button onClick={() => handleDelete(project._id)} className="text-red-600 hover:text-red-800" title="Delete project">
                  <FiTrash2 />
                </button>
              </div>
            </div>
            {editingId === project._id && (
              <div className="mt-4 border-t border-gray-200 dark:border-[#243244] pt-3">
                <label className="block text-sm mb-1">Status</label>
                <select value={draftStatus} onChange={(e) => setDraftStatus(e.target.value)} className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-[#2a2a2a] border-gray-300 dark:border-gray-600">
                  <option value="Pending">Pending</option>
                  <option value="Ongoing">Ongoing</option>
                  <option value="Completed">Completed</option>
                </select>
                <div className="mt-3 flex gap-2">
                  <button onClick={() => handleEditSave(project._id)} className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm">Save</button>
                  <button onClick={() => setEditingId(null)} className="px-3 py-2 border rounded-lg text-sm">Cancel</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

