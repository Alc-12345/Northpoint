import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { projectApi } from "../services/api";

export default function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProject = async () => {
      try {
        const data = await projectApi.getById(id);
        setProject(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      loadProject();
    }
  }, [id]);

  return (
    <div className="p-6 bg-gray-100 dark:bg-[#121212] min-h-screen text-gray-800 dark:text-gray-200">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          Project Details{project ? `: ${project.name}` : ""}
        </h2>

        <button
          onClick={() => navigate(-1)}
          className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
        >
          ← Back
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="text-sm text-gray-600 dark:text-gray-300">Loading project details...</div>
      ) : !project ? (
        <div className="text-sm text-gray-600 dark:text-gray-300">Project not found.</div>
      ) : (
        <div className="max-w-4xl mx-auto bg-white dark:bg-[#0b1220] p-6 rounded-xl shadow border border-gray-200 dark:border-[#243244] space-y-4">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Project Name</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">{project.name}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoRow label="Project Manager" value={project.manager || "Not assigned"} />
            <InfoRow label="Methodology" value={project.methodology || "Not set"} />
            <InfoRow label="Status" value={project.status || "Pending"} />
            <InfoRow label="Budget" value={project.budget ? `₹${project.budget}` : "Not set"} />
            <InfoRow label="Story Points" value={project.storyPoints ?? "Not set"} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoRow label="Estimated Hours" value={project.estimatedHours ?? "Not set"} />
            <InfoRow label="Version" value={project.version || "Not set"} />
            <InfoRow label="Milestone" value={project.milestone || "Not set"} />
            <InfoRow label="Team" value={project.team || "Not assigned"} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoRow label="Start Date" value={project.startDate ? new Date(project.startDate).toLocaleDateString() : "Not set"} />
            <InfoRow label="End Date" value={project.endDate ? new Date(project.endDate).toLocaleDateString() : "Not set"} />
          </div>

          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Description</p>
            <p className="text-gray-900 dark:text-gray-200 mt-2">{project.description || "No description provided."}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="rounded-xl bg-gray-50 dark:bg-[#131a26] p-4 border border-gray-200 dark:border-[#243244]">
      <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">{label}</p>
      <p className="mt-2 text-sm text-gray-900 dark:text-white">{value}</p>
    </div>
  );
}
