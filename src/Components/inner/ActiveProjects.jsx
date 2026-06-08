import React, { useState } from "react";

/* Page 1 Data */
const page1 = [
  {
    name: "Batman",
    lead: "Liam Risher",
    leadImg: "https://i.pravatar.cc/40?img=1",
    progress: 53,
    assignees: [2, 3, 4],
    status: "Inprogress",
    due: "06 Sep 2021",
  },
  {
    name: "Bender Project",
    lead: "Oliver Noah",
    leadImg: "https://i.pravatar.cc/40?img=5",
    progress: 30,
    assignees: [6, 7, 8],
    status: "Pending",
    due: "06 Sep 2021",
  },
  {
    name: "Bigfish",
    lead: "Donald Benjamin",
    leadImg: "https://i.pravatar.cc/40?img=9",
    progress: 30,
    assignees: [10, 11, 12],
    status: "Inprogress",
    due: "06 Sep 2021",
  },
];

/* Page 2 Data */
const page2 = [
  {
    name: "Superman",
    lead: "Clark Kent",
    leadImg: "https://i.pravatar.cc/40?img=15",
    progress: 80,
    assignees: [16, 17, 18],
    status: "Completed",
    due: "12 Sep 2021",
  },
  {
    name: "Spiderman",
    lead: "Peter Parker",
    leadImg: "https://i.pravatar.cc/40?img=20",
    progress: 45,
    assignees: [21, 22, 23],
    status: "Inprogress",
    due: "15 Sep 2021",
  },
  {
    name: "Ironman",
    lead: "Tony Stark",
    leadImg: "https://i.pravatar.cc/40?img=25",
    progress: 25,
    assignees: [26, 27, 28],
    status: "Pending",
    due: "18 Sep 2021",
  },
];

/* Status Styles */
const statusStyle = {
  Completed:
    "bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-400",

  Pending:
    "bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400",

  Inprogress:
    "bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400",
};

/* Progress Color */
const progressColor = (value) => {
  if (value >= 50) return "bg-blue-500";
  if (value >= 40) return "bg-green-500";
  return "bg-red-500";
};

export default function ActiveProjects() {

  const [currentPage, setCurrentPage] = useState(1);

  const data = currentPage === 1 ? page1 : page2;

  return (
    <div
      className="
        h-full
        flex flex-col
        bg-white 
        dark:bg-[#0b1220]
        border border-gray-200 
        dark:border-[#243244]
        rounded-xl 
        shadow-sm
        p-6 
        w-full
        transition-colors duration-300
      "
    >

      {/* Header */}
      <div className="flex justify-between items-center mb-4">

        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
          Active Projects
        </h2>

        <button className="text-blue-600 dark:text-blue-400 text-sm hover:opacity-80">
          Export Report
        </button>

      </div>

      {/* Table */}
      <div className="overflow-x-auto flex-grow">

        <table className="min-w-full">

          {/* Table Head */}
          <thead className="text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-[#243244]">
            <tr>
              <th className="text-left py-3">Project Name</th>
              <th className="text-left py-3">Project Lead</th>
              <th className="text-left py-3">Progress</th>
              <th className="text-left py-3">Assignee</th>
              <th className="text-left py-3">Status</th>
              <th className="text-left py-3">Due Date</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>

            {data.map((project, index) => (

              <tr
                key={index}
                className="
                  border-b border-gray-200 dark:border-[#243244]
                  hover:bg-gray-50 dark:hover:bg-[#172235]/40
                  transition
                "
              >

                {/* Project Name */}
                <td className="py-4 text-gray-700 dark:text-gray-200">
                  {project.name}
                </td>

                {/* Project Lead */}
                <td className="py-4 flex items-center gap-3 text-gray-700 dark:text-gray-200">

                  <img
                    src={project.leadImg}
                    className="w-8 h-8 rounded-full"
                  />

                  {project.lead}

                </td>

                {/* Progress */}
                <td className="py-4 w-40">

                  <div className="flex items-center gap-3">

                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">

                      <div
                        className={`h-2 rounded-full ${progressColor(project.progress)}`}
                        style={{ width: `${project.progress}%` }}
                      />

                    </div>

                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {project.progress}%
                    </span>

                  </div>

                </td>

                {/* Assignees */}
                <td className="py-4">

                  <div className="flex -space-x-2">

                    {project.assignees.map((id) => (

                      <img
                        key={id}
                        src={`https://i.pravatar.cc/40?img=${id}`}
                        className="
                          w-8 h-8 rounded-full
                          border-2 border-white
                          dark:border-gray-900
                        "
                      />

                    ))}

                  </div>

                </td>

                {/* Status */}
                <td className="py-4">

                  <span className={`px-3 py-1 rounded text-xs ${statusStyle[project.status]}`}>
                    {project.status}
                  </span>

                </td>

                {/* Due Date */}
                <td className="py-4 text-gray-500 dark:text-gray-400">
                  {project.due}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4 text-sm text-gray-500 dark:text-gray-400">

        <span>
          Showing page {currentPage} of 2
        </span>

        <div className="flex gap-2">

          <button
            onClick={() => setCurrentPage(1)}
            className={`
              px-3 py-1 rounded
              ${currentPage === 1
                ? "bg-blue-500 text-white"
                : "bg-gray-100 dark:bg-gray-800"}
            `}
          >
            1
          </button>

          <button
            onClick={() => setCurrentPage(2)}
            className={`
              px-3 py-1 rounded
              ${currentPage === 2
                ? "bg-blue-500 text-white"
                : "bg-gray-100 dark:bg-gray-800"}
            `}
          >
            2
          </button>

        </div>

      </div>

    </div>
  );
}
