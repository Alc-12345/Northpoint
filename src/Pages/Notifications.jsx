import React from "react";
import {
  FiBell,
  FiUpload,
  FiDollarSign,
  FiClock,
  FiCheckCircle,
} from "react-icons/fi";

const notifications = [
  {
    id: 1,
    type: "Project Update",
    icon: <FiCheckCircle />,
    title: "Homepage Design Completed",
    message: "The UI design has been completed and is ready for review.",
    time: "10 min ago",
    color: "text-green-400",
    bg: "bg-green-500/10",
  },
  {
    id: 2,
    type: "Upload Alert",
    icon: <FiUpload />,
    title: "New Files Uploaded",
    message: "The latest project files have been uploaded.",
    time: "1 hour ago",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
  },
  {
    id: 3,
    type: "Payment Reminder",
    icon: <FiDollarSign />,
    title: "Invoice Due",
    message: "Invoice #INV-102 payment is due tomorrow.",
    time: "Today",
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
  },
  {
    id: 4,
    type: "Project Update",
    icon: <FiBell />,
    title: "Testing Started",
    message: "QA testing phase has started successfully.",
    time: "Yesterday",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
  },
];

export default function Notifications() {
  return (
    <div className="min-h-screen bg-[#0B1220] p-6">

      {/* Header */}

      <div className="mb-8">

        <h1 className="text-3xl font-bold text-white">
          Notifications
        </h1>

        <p className="text-gray-400 mt-2">
          Stay updated with project activity, uploads and payment reminders.
        </p>

      </div>

      {/* Summary Cards */}

      <div className="grid md:grid-cols-3 gap-5 mb-8">

        <div className="bg-[#111C2D] border border-[#243244] rounded-xl p-5">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-gray-400 text-sm">
                Project Updates
              </p>

              <h2 className="text-3xl text-white font-bold mt-2">
                12
              </h2>

            </div>

            <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center text-green-400 text-xl">

              <FiCheckCircle />

            </div>

          </div>

        </div>

        <div className="bg-[#111C2D] border border-[#243244] rounded-xl p-5">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-gray-400 text-sm">
                Upload Alerts
              </p>

              <h2 className="text-3xl text-white font-bold mt-2">
                7
              </h2>

            </div>

            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 text-xl">

              <FiUpload />

            </div>

          </div>

        </div>

        <div className="bg-[#111C2D] border border-[#243244] rounded-xl p-5">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-gray-400 text-sm">
                Payment Reminders
              </p>

              <h2 className="text-3xl text-white font-bold mt-2">
                2
              </h2>

            </div>

            <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center text-yellow-400 text-xl">

              <FiDollarSign />

            </div>

          </div>

        </div>

      </div>

      {/* Notification List */}

      <div className="bg-[#111C2D] border border-[#243244] rounded-xl p-6">

        <div className="flex items-center gap-2 mb-6">

          <FiBell className="text-[#18A8E6]" />

          <h2 className="text-xl text-white font-semibold">
            Recent Notifications
          </h2>

        </div>

        <div className="space-y-4">

          {notifications.map((item) => (

            <div
              key={item.id}
              className="flex justify-between items-start bg-[#0B1220] border border-[#243244] rounded-lg p-4 hover:bg-[#172235] transition"
            >

              <div className="flex gap-4">

                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${item.bg} ${item.color}`}
                >
                  {item.icon}
                </div>

                <div>

                  <p className="text-white font-semibold">
                    {item.title}
                  </p>

                  <p className="text-gray-400 text-sm mt-1">
                    {item.message}
                  </p>

                  <span className="text-xs text-[#18A8E6] mt-2 inline-block">
                    {item.type}
                  </span>

                </div>

              </div>

              <div className="flex items-center gap-1 text-gray-500 text-xs">

                <FiClock />

                {item.time}

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}