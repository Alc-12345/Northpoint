import React from "react";
import {
  FiCheckCircle,
  FiClock,
  FiCode,
  FiLayers,
} from "react-icons/fi";

export default function ProjectProgress() {
  const milestones = [
    {
      title: "Requirement Gathering",
      date: "05 Jun 2026",
      status: "Completed",
    },
    {
      title: "UI/UX Design",
      date: "12 Jun 2026",
      status: "Completed",
    },
    {
      title: "Frontend Development",
      date: "20 Jun 2026",
      status: "In Progress",
    },
    {
      title: "Backend Integration",
      date: "28 Jun 2026",
      status: "Pending",
    },
    {
      title: "Testing & QA",
      date: "05 Jul 2026",
      status: "Pending",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0B1220] p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white">
          Project Progress
        </h1>

        <p className="text-gray-400 mt-1">
          Track project status, milestones and completion.
        </p>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
        <Card
          title="Project Completion"
          value="68%"
          icon={<FiLayers />}
        />

        <Card
          title="Current Stage"
          value="Development"
          icon={<FiCode />}
        />

        <Card
          title="Days Remaining"
          value="12 Days"
          icon={<FiClock />}
        />
      </div>

      {/* Progress Circle + Details */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Progress Circle */}
        <div className="bg-[#111C2D] border border-[#243244] rounded-xl p-6">
          <h2 className="text-white text-lg font-semibold mb-6">
            Overall Progress
          </h2>

          <div className="flex justify-center">
            <div className="relative w-48 h-48">
              <svg
                className="w-48 h-48 rotate-[-90deg]"
                viewBox="0 0 160 160"
              >
                <circle
                  cx="80"
                  cy="80"
                  r="65"
                  fill="none"
                  stroke="#243244"
                  strokeWidth="12"
                />

                <circle
                  cx="80"
                  cy="80"
                  r="65"
                  fill="none"
                  stroke="#18A8E6"
                  strokeWidth="12"
                  strokeDasharray="408"
                  strokeDashoffset="130"
                  strokeLinecap="round"
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <h2 className="text-4xl font-bold text-white">
                  68%
                </h2>

                <p className="text-gray-400 text-sm">
                  Completed
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Current Status */}
        <div className="bg-[#111C2D] border border-[#243244] rounded-xl p-6">
          <h2 className="text-white text-lg font-semibold mb-5">
            Current Status
          </h2>

          <div className="space-y-5">
            <div>
              <p className="text-gray-400 text-sm mb-2">
                Current Stage
              </p>

              <span className="px-4 py-2 rounded-lg bg-[#18A8E6]/20 text-[#18A8E6]">
                Frontend Development
              </span>
            </div>

            <div>
              <p className="text-gray-400 text-sm mb-2">
                Completion Tracking
              </p>

              <div className="w-full h-3 bg-[#243244] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#18A8E6]"
                  style={{ width: "68%" }}
                />
              </div>

              <p className="text-sm text-gray-400 mt-2">
                68% of project completed
              </p>
            </div>

            <div>
              <p className="text-gray-400 text-sm">
                Estimated Delivery
              </p>

              <p className="text-white mt-1">
                30 June 2026
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Milestones */}
      <div className="bg-[#111C2D] border border-[#243244] rounded-xl p-6 mb-6">
        <h2 className="text-white text-lg font-semibold mb-5">
          Project Milestones
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#243244]">
                <th className="text-left text-gray-400 p-3">
                  Milestone
                </th>

                <th className="text-left text-gray-400 p-3">
                  Deadline
                </th>

                <th className="text-left text-gray-400 p-3">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {milestones.map((item, index) => (
                <tr
                  key={index}
                  className="border-b border-[#243244]"
                >
                  <td className="p-4 text-white">
                    {item.title}
                  </td>

                  <td className="p-4 text-gray-300">
                    {item.date}
                  </td>

                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${
                        item.status === "Completed"
                          ? "bg-green-500/20 text-green-400"
                          : item.status === "In Progress"
                          ? "bg-blue-500/20 text-blue-400"
                          : "bg-orange-500/20 text-orange-400"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-[#111C2D] border border-[#243244] rounded-xl p-6">
        <h2 className="text-white text-lg font-semibold mb-6">
          Project Timeline
        </h2>

        <div className="space-y-5">
          <Timeline
            title="Requirement Gathering"
            status="done"
          />

          <Timeline
            title="UI/UX Design"
            status="done"
          />

          <Timeline
            title="Frontend Development"
            status="active"
          />

          <Timeline
            title="Backend Integration"
            status="pending"
          />

          <Timeline
            title="Testing & Deployment"
            status="pending"
          />
        </div>
      </div>
    </div>
  );
}

function Card({ title, value, icon }) {
  return (
    <div className="bg-[#111C2D] border border-[#243244] rounded-xl p-5">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-gray-400 text-sm">
            {title}
          </p>

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

function Timeline({ title, status }) {
  return (
    <div className="flex items-center gap-4">
      <div
        className={`w-5 h-5 rounded-full ${
          status === "done"
            ? "bg-green-500"
            : status === "active"
            ? "bg-[#18A8E6]"
            : "bg-gray-600"
        }`}
      />

      <div>
        <h3 className="text-white font-medium">
          {title}
        </h3>

        <p className="text-gray-400 text-sm">
          {status === "done"
            ? "Completed"
            : status === "active"
            ? "In Progress"
            : "Pending"}
        </p>
      </div>
    </div>
  );
}