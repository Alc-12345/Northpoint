import { useParams, useNavigate } from "react-router-dom";

export default function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="p-6 bg-gray-100 dark:bg-[#121212] min-h-screen text-gray-800 dark:text-gray-200">

      {/* Header with Back Button */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          Project Details (ID: {id})
        </h2>

        <button
          onClick={() => navigate(-1)}
          className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
        >
          ← Back
        </button>
      </div>

    <div className="max-w-4xl mx-auto bg-white dark:bg-[#0b1220] p-6 rounded-xl shadow border border-gray-200 dark:border-[#243244]">
        <p><strong>Project Name:</strong> ERP System</p>
        <p className="mt-2"><strong>Project Manager:</strong> Rahul Sharma</p>
        <p className="mt-2"><strong>Progress:</strong> 70%</p>
        <p className="mt-2"><strong>Health:</strong> Good</p>
      </div>
    </div>
  );
}
