import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { projectApi } from "../services/api";

export default function ProjectDashboard() {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

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

  return (
    <div className="p-6 bg-gray-100 dark:bg-[#0b1220] min-h-screen text-gray-800 dark:text-gray-200">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Project Management</h2>

        <Link
          to="/add-project"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + Create Project
        </Link>
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
          <ProjectCard
            key={project._id}
            id={project._id}
            name={project.name}
            manager={project.manager || "Not assigned"}
            progress={project.storyPoints ? `${project.storyPoints} pts` : "0%"}
            health={project.endDate ? "Scheduled" : "Good"}
          />
        ))}
      </div>
    </div>
  );
}

function ProjectCard({ id, name, manager, progress, health }) {
  return (
    <Link to={`/projects/${id}`}>
      <div className="bg-white dark:bg-[#0b1220] p-5 rounded-xl shadow border border-gray-200 dark:border-[#243244] hover:shadow-lg transition cursor-pointer">
        <h3 className="font-semibold text-lg">{name}</h3>
        <p className="text-sm mt-1">Manager: {manager}</p>
        <p className="text-sm mt-2">Progress: {progress}</p>
        <p
          className={`mt-2 text-sm font-medium ${
            health === "Good" ? "text-green-500" : "text-red-500"
          }`}
        >
          Health: {health}
        </p>
      </div>
    </Link>
  );

}
