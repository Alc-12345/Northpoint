import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { projectApi } from "../services/api";

export default function ProjectDetails() {
  const { id } = useParams();
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setError("");
        setIsLoading(true);
        const data = id ? await projectApi.getById(id) : await projectApi.getAll();
        setProjects(Array.isArray(data) ? data : [data]);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadProjects();
  }, [id]);

  return (
    <div className="min-h-screen bg-[#0b1220] p-6 text-white">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Project Details</h1>
          <p className="mt-1 text-sm text-gray-400">
            {id ? "Live project record from the API." : "All project records from the API."}
          </p>
        </div>
        <Link to="/projects" className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-600">
          Back to Projects
        </Link>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      )}
      {isLoading && <div className="text-sm text-gray-400">Loading project details...</div>}
      {!isLoading && projects.length === 0 && !error && (
        <div className="text-sm text-gray-400">No projects found.</div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project._id} project={project} />
        ))}
      </div>
    </div>
  );
}

function ProjectCard({ project }) {
  const team = project.assignedTeam?.length
    ? project.assignedTeam.map((employee) => employee.name || employee).join(", ")
    : project.team || "Not assigned";

  return (
    <div className="rounded-2xl border border-[#24365d] bg-[#0b1220] p-6 shadow-lg transition hover:scale-[1.02]">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-widest text-gray-500">
            {project.projectCode || project._id}
          </p>
          <h2 className="mt-1 text-xl font-semibold">{project.name}</h2>
        </div>
        <StatusBadge status={project.status} />
      </div>

      <div className="space-y-2 text-sm text-gray-300">
        <p><span className="text-gray-400">Client:</span> {project.clientName || project.client?.contact || project.email || "-"}</p>
        <p><span className="text-gray-400">Manager:</span> {project.manager || "Not assigned"}</p>
        <p><span className="text-gray-400">Team:</span> {team}</p>
        <p><span className="text-gray-400">Budget:</span> {formatCurrency(project.budget)}</p>
        <p><span className="text-gray-400">Start:</span> {formatDate(project.startDate)}</p>
        <p><span className="text-gray-400">Deadline:</span> {formatDate(project.endDate)}</p>
      </div>

      {project.description && (
        <p className="mt-4 whitespace-pre-line text-sm text-gray-400">{project.description}</p>
      )}

      <div className="mt-5">
        <div className="mb-2 flex justify-between text-sm">
          <span>Progress</span>
          <span>{project.progress ?? 0}%</span>
        </div>
        <div className="h-3 w-full rounded-full bg-gray-700">
          <div
            className="h-3 rounded-full bg-cyan-400"
            style={{ width: `${project.progress ?? 0}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status = "Pending" }) {
  const colors = {
    Pending: "bg-red-500",
    Ongoing: "bg-blue-500",
    Completed: "bg-green-500",
    Complete: "bg-green-500",
    Active: "bg-green-500",
    Inactive: "bg-gray-500",
  };

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${colors[status] || colors.Pending}`}>
      {status}
    </span>
  );
}

function formatDate(value) {
  return value ? new Date(value).toLocaleDateString() : "-";
}

function formatCurrency(value) {
  if (value === undefined || value === null || value === "") {
    return "-";
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}
