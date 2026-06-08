import { Link } from "react-router-dom";

export default function ProjectDashboard() {
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
      <div className="grid md:grid-cols-3 gap-6">
        <ProjectCard
          name="ERP System"
          manager="Rahul Sharma"
          progress="70%"
          health="Good"
        />
        <ProjectCard
          name="E-commerce Platform"
          manager="Priya Singh"
          progress="40%"
          health="At Risk"
        />
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
