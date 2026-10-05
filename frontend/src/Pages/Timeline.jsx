import React from "react";
import {
  FiCalendar,
  FiClock,
  FiCheckCircle,
  FiPackage,
} from "react-icons/fi";

const deadlines = [
  {
    title: "Homepage Final Review",
    date: "15 June 2026",
    status: "Upcoming",
  },
  {
    title: "API Integration Complete",
    date: "20 June 2026",
    status: "In Progress",
  },
  {
    title: "Testing Phase",
    date: "25 June 2026",
    status: "Pending",
  },
];

const deliverables = [
  {
    name: "UI Design Files",
    due: "12 June",
    type: "Figma",
  },
  {
    name: "Frontend Source Code",
    due: "18 June",
    type: "ZIP",
  },
  {
    name: "Backend APIs",
    due: "22 June",
    type: "Postman",
  },
];

const milestones = [
  {
    title: "Requirement Gathering",
    date: "02 June",
    completed: true,
  },
  {
    title: "UI Design",
    date: "08 June",
    completed: true,
  },
  {
    title: "Development",
    date: "15 June",
    completed: false,
  },
  {
    title: "Testing",
    date: "22 June",
    completed: false,
  },
  {
    title: "Project Delivery",
    date: "30 June",
    completed: false,
  },
];

export default function Timeline() {
  return (
    <div className="min-h-screen bg-[#0B1220] p-6">

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">
          Timeline
        </h1>

        <p className="text-gray-400 mt-2">
          Track deadlines, deliverables and milestone schedule.
        </p>
      </div>

      {/* Deadlines */}

      <div className="bg-[#111C2D] border border-[#243244] rounded-xl p-6 mb-6">

        <h2 className="text-xl text-white font-semibold mb-5 flex items-center gap-2">
          <FiCalendar />
          Deadlines
        </h2>

        <div className="space-y-4">

          {deadlines.map((item, index) => (

            <div
              key={index}
              className="flex justify-between items-center bg-[#0B1220] border border-[#243244] rounded-lg p-4"
            >
              <div>

                <h3 className="text-white font-semibold">
                  {item.title}
                </h3>

                <p className="text-gray-400 text-sm">
                  {item.date}
                </p>

              </div>

              <span
                className={`px-3 py-1 rounded-full text-xs ${
                  item.status === "Upcoming"
                    ? "bg-yellow-500/20 text-yellow-400"
                    : item.status === "In Progress"
                    ? "bg-blue-500/20 text-blue-400"
                    : "bg-red-500/20 text-red-400"
                }`}
              >
                {item.status}
              </span>

            </div>

          ))}

        </div>

      </div>

      {/* Deliverables */}

      <div className="bg-[#111C2D] border border-[#243244] rounded-xl p-6 mb-6">

        <h2 className="text-xl text-white font-semibold mb-5 flex items-center gap-2">
          <FiPackage />
          Upcoming Deliverables
        </h2>

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-[#172235]">

              <tr>

                <th className="text-left p-4 text-gray-300">
                  Deliverable
                </th>

                <th className="text-left p-4 text-gray-300">
                  Type
                </th>

                <th className="text-left p-4 text-gray-300">
                  Due Date
                </th>

              </tr>

            </thead>

            <tbody>

              {deliverables.map((item, index) => (

                <tr
                  key={index}
                  className="border-t border-[#243244]"
                >
                  <td className="p-4 text-white">
                    {item.name}
                  </td>

                  <td className="p-4 text-gray-400">
                    {item.type}
                  </td>

                  <td className="p-4 text-[#18A8E6]">
                    {item.due}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

      {/* Milestones */}

      <div className="bg-[#111C2D] border border-[#243244] rounded-xl p-6">

        <h2 className="text-xl text-white font-semibold mb-6 flex items-center gap-2">
          <FiClock />
          Milestone Schedule
        </h2>

        <div className="space-y-5">

          {milestones.map((item, index) => (

            <div
              key={index}
              className="flex items-center gap-4"
            >

              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  item.completed
                    ? "bg-green-500"
                    : "bg-[#243244]"
                }`}
              >
                <FiCheckCircle className="text-white" />
              </div>

              <div className="flex-1">

                <h3 className="text-white font-semibold">
                  {item.title}
                </h3>

                <p className="text-gray-400 text-sm">
                  {item.date}
                </p>

              </div>

              <span
                className={`text-sm ${
                  item.completed
                    ? "text-green-400"
                    : "text-yellow-400"
                }`}
              >
                {item.completed ? "Completed" : "Pending"}
              </span>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}