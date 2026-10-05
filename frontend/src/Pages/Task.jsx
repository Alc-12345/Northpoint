import React, { useState } from "react";
import {
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiClipboard,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";

export default function AssignTask() {
  const [search, setSearch] = useState("");
  const [firstTask, setFirstTask] = useState(null);
  const [taskPriority, setTaskPriority] = useState({
  1: "Normal",
  2: "Normal",
  3: "Normal",
});

  const tasks = [
    {
      id: 1,
      task: "Dashboard UI Design",
      project: "School CRM",
      assigned: "Rahul Sharma",
      priority: "High",
      due: "15 Jun 2026",
      status: "In Progress",
    },
    {
      id: 2,
      task: "API Integration",
      project: "ERP System",
      assigned: "Amit Kumar",
      priority: "Medium",
      due: "20 Jun 2026",
      status: "Pending",
    },
    {
      id: 3,
      task: "Login Module",
      project: "School CRM",
      assigned: "Priya Singh",
      priority: "Low",
      due: "10 Jun 2026",
      status: "Completed",
    },
  ];

  const filtered = tasks.filter(
    (item) =>
      item.task.toLowerCase().includes(search.toLowerCase()) ||
      item.assigned.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0B1220] p-6">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white">
          Assign Tasks
        </h1>

        <p className="text-gray-400 mt-1">
          Manage all assigned project tasks
        </p>
      </div>

      {/* Cards */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">

        <Card
          title="Total Tasks"
          value="35"
          icon={<FiClipboard />}
        />

        <Card
          title="Pending"
          value="10"
          icon={<FiAlertCircle />}
        />

        <Card
          title="In Progress"
          value="15"
          icon={<FiClock />}
        />

        <Card
          title="Completed"
          value="10"
          icon={<FiCheckCircle />}
        />

      </div>
    

      {/* Search */}

      <div className="bg-[#111C2D] border border-[#243244] rounded-xl p-4 mb-6">

        <div className="relative max-w-md">

          <FiSearch className="absolute left-3 top-3 text-gray-400" />

          <input
            type="text"
            placeholder="Search Task..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#0B1220] border border-[#243244] rounded-lg pl-10 pr-4 py-2 text-white"
          />

        </div>

      </div>

      {/* Table */}

      <div className="bg-[#111C2D] border border-[#243244] rounded-xl overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-[#172235] text-gray-300">

              <tr>
                <th className="text-left p-4">Task</th>
                <th className="text-left p-4">Project</th>
                <th className="text-left p-4">Assigned To</th>
                <th className="text-left p-4">Priority</th>
                <th className="text-left p-4">Due Date</th>
                <th className="text-left p-4">Status</th>
                <th className="text-left p-4">Client Priority</th>
                {/* <th className="text-center p-4">
  Complete First
</th> */}
                <th className="text-center p-4">Action</th>
              </tr>

            </thead>

            <tbody>

              {filtered.map((task) => (

                <tr
                  key={task.id}
                  className="border-t border-[#243244] hover:bg-[#172235]"
                >

                  <td className="p-4 text-white">
                    {task.task}
                  </td>

                  <td className="p-4 text-gray-300">
                    {task.project}
                  </td>

                  <td className="p-4 text-gray-300">
                    {task.assigned}
                  </td>

                  <td className="p-4">

                    <span
                      className={`px-3 py-1 rounded-full text-xs ${
                        task.priority === "High"
                          ? "bg-red-500/20 text-red-400"
                          : task.priority === "Medium"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-green-500/20 text-green-400"
                      }`}
                    >
                      {task.priority}
                    </span>

                  </td>

                  <td className="p-4 text-gray-300">
                    {task.due}
                  </td>

                  <td className="p-4">

                    <span
                      className={`px-3 py-1 rounded-full text-xs ${
                        task.status === "Completed"
                          ? "bg-green-500/20 text-green-400"
                          : task.status === "Pending"
                          ? "bg-red-500/20 text-red-400"
                          : "bg-blue-500/20 text-blue-400"
                      }`}
                    >
                      {task.status}
                    </span>

                  </td>
                  <td className="p-4">

  <select
    value={taskPriority[task.id]}
    onChange={(e) =>
      setTaskPriority({
        ...taskPriority,
        [task.id]: e.target.value,
      })
    }
    className="bg-[#0B1220] border border-[#243244] rounded-lg px-3 py-2 text-white outline-none"
  >
    <option value="Highest">Highest</option>
    <option value="High">High</option>
    <option value="Normal">Normal</option>
    <option value="Low">Low</option>
  </select>

</td>
{/* <td className="p-4">

  <input
    type="radio"
    checked={firstTask === task.id}
    onChange={() => setFirstTask(task.id)}
    className="w-5 h-5 accent-cyan-500"
  />

</td> */}

                  <td className="p-4">

                    <div className="flex justify-center gap-3">

                      <button className="text-yellow-400 hover:text-yellow-300">
                        <FiEdit2 size={18} />
                      </button>

                      <button className="text-red-400 hover:text-red-300">
                        <FiTrash2 size={18} />
                      </button>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>
          

        </div>
        

      </div>
      {/* Save Button */}

<div className="flex justify-end mt-6">

  <button
    onClick={() => {
      console.log("Selected Priorities Saved");
      console.log(taskPriority);

      // Yaha API call kar sakte ho
      // axios.post("/api/save-priority", taskPriority);
    }}
    className="bg-[#18A8E6] hover:bg-[#1494cb] text-white font-semibold px-6 py-2 rounded-lg transition-all duration-200"
  >
    Save Priority
  </button>

</div>

    </div>
  );
}

function Card({ title, value, icon }) {
  return (
    <div className="bg-[#111C2D] border border-[#243244] rounded-xl p-5">
      <div className="flex justify-between items-center">

        <div>
          <p className="text-gray-400 text-sm">{title}</p>

          <h2 className="text-3xl font-bold text-white mt-2">
            {value}
          </h2>
        </div>

        <div className="w-12 h-12 rounded-xl bg-[#18A8E6]/20 text-[#18A8E6] flex items-center justify-center text-xl">
          {icon}
        </div>

      </div>
    </div>
  );
}