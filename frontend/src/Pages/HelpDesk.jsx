import React, { useState } from "react";
import {
  FiSearch,
  FiPlus,
  FiEye,
  FiAlertCircle,
  FiClock,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";

const tickets = [
  {
    id: "#1001",
    subject: "Unable to Login",
    user: "Rahul Sharma",
    department: "Employee",
    priority: "High",
    status: "Open",
    date: "28 Jun 2026",
  },
  {
    id: "#1002",
    subject: "Salary Slip Issue",
    user: "Amit Patel",
    department: "Employee",
    priority: "Medium",
    status: "In Progress",
    date: "27 Jun 2026",
  },
  {
    id: "#1003",
    subject: "Website Bug",
    user: "John Client",
    department: "Client",
    priority: "Low",
    status: "Resolved",
    date: "26 Jun 2026",
  },
  {
    id: "#1004",
    subject: "Leave Approval",
    user: "Sonal",
    department: "Employee",
    priority: "High",
    status: "Closed",
    date: "25 Jun 2026",
  },
];

export default function HelpDesk() {
  const [search, setSearch] = useState("");

  const filtered = tickets.filter(
    (ticket) =>
      ticket.subject.toLowerCase().includes(search.toLowerCase()) ||
      ticket.user.toLowerCase().includes(search.toLowerCase())
  );

  const cardStyle =
    "bg-white dark:bg-[#111827] rounded-2xl p-5 shadow-lg border border-gray-200 dark:border-[#243244]";

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#0b1220] p-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Help Desk
          </h1>

          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage employee & client support tickets
          </p>
        </div>

        <button className="bg-[#18a8e6] hover:bg-[#1395cf] text-white px-5 py-3 rounded-xl flex items-center gap-2">
          <FiPlus />
          New Ticket
        </button>
      </div>

      {/* Cards */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">

        <div className={cardStyle}>
          <div className="flex justify-between">
            <div>
              <p className="text-gray-500">Open Tickets</p>
              <h2 className="text-3xl font-bold mt-2 dark:text-white">14</h2>
            </div>

            <FiAlertCircle className="text-red-500 text-4xl" />
          </div>
        </div>

        <div className={cardStyle}>
          <div className="flex justify-between">
            <div>
              <p className="text-gray-500">In Progress</p>
              <h2 className="text-3xl font-bold mt-2 dark:text-white">08</h2>
            </div>

            <FiClock className="text-yellow-500 text-4xl" />
          </div>
        </div>

        <div className={cardStyle}>
          <div className="flex justify-between">
            <div>
              <p className="text-gray-500">Resolved</p>
              <h2 className="text-3xl font-bold mt-2 dark:text-white">32</h2>
            </div>

            <FiCheckCircle className="text-green-500 text-4xl" />
          </div>
        </div>

        <div className={cardStyle}>
          <div className="flex justify-between">
            <div>
              <p className="text-gray-500">Closed</p>
              <h2 className="text-3xl font-bold mt-2 dark:text-white">52</h2>
            </div>

            <FiXCircle className="text-blue-500 text-4xl" />
          </div>
        </div>

      </div>

      {/* Search */}

      <div className="bg-white dark:bg-[#111827] rounded-2xl p-5 shadow-lg border border-gray-200 dark:border-[#243244] mb-8">

        <div className="flex flex-col lg:flex-row gap-4">

          <div className="relative flex-1">

            <FiSearch className="absolute top-4 left-4 text-gray-400" />

            <input
              type="text"
              placeholder="Search ticket..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-300 dark:border-[#243244] bg-gray-50 dark:bg-[#0b1220] dark:text-white outline-none"
            />

          </div>

          <select className="px-4 py-3 rounded-xl border dark:border-[#243244] bg-white dark:bg-[#0b1220] dark:text-white">
            <option>All Status</option>
            <option>Open</option>
            <option>In Progress</option>
            <option>Resolved</option>
            <option>Closed</option>
          </select>

          <select className="px-4 py-3 rounded-xl border dark:border-[#243244] bg-white dark:bg-[#0b1220] dark:text-white">
            <option>All Priority</option>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>

        </div>

      </div>

      {/* Table */}

      <div className="bg-white dark:bg-[#111827] rounded-2xl shadow-lg border border-gray-200 dark:border-[#243244] overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-gray-100 dark:bg-[#1b2638]">

              <tr className="text-left">

                <th className="p-4 text-gray-300">Ticket</th>
                <th className="p-4 text-gray-300">User</th>
                <th className="p-4 text-gray-300">Department</th>
                <th className="p-4 text-gray-300">Priority</th>
                <th className="p-4 text-gray-300">Status</th>
                <th className="p-4 text-gray-300">Date</th>
                <th className="p-4 text-gray-300">Action</th>

              </tr>

            </thead>

            <tbody>

              {filtered.map((ticket) => (

                <tr
                  key={ticket.id}
                  className="border-t border-gray-200 dark:border-[#243244] hover:bg-gray-50 dark:hover:bg-[#162033]"
                >
                  <td className="p-4">
                    <div className="font-semibold dark:text-white">
                      {ticket.id}
                    </div>

                    <div className="text-sm text-gray-500">
                      {ticket.subject}
                    </div>
                  </td>

                  <td className="dark:text-white">{ticket.user}</td>

                  <td className="dark:text-white">{ticket.department}</td>

                  <td>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold
                      ${
                        ticket.priority === "High"
                          ? "bg-red-100 text-red-600"
                          : ticket.priority === "Medium"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {ticket.priority}
                    </span>

                  </td>

                  <td>

                    <span className="bg-[#18a8e6]/20 text-[#18a8e6] px-3 py-1 rounded-full text-xs font-semibold">
                      {ticket.status}
                    </span>

                  </td>

                  <td className="dark:text-white">{ticket.date}</td>

                  <td>

                    <button className="text-[#18a8e6] hover:text-blue-400 text-xl">
                      <FiEye />
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

      {/* Activity */}

      <div className="mt-8 bg-white dark:bg-[#111827] rounded-2xl shadow-lg border border-gray-200 dark:border-[#243244] p-6">

        <h2 className="text-xl font-bold mb-5 dark:text-white">
          Recent Activity
        </h2>

        <div className="space-y-4">

          <div className="flex justify-between border-b dark:border-[#243244] pb-3">
            <span className="text-white">Ticket #1002 assigned to HR Team</span>
            <span className="text-gray-500 text-sm">10 min ago</span>
          </div>

          <div className="flex justify-between border-b dark:border-[#243244] pb-3">
            <span className="text-white">New ticket created by Rahul Sharma</span>
            <span className="text-gray-500 text-sm">45 min ago</span>
          </div>

          <div className="flex justify-between">
            <span className="text-white">Ticket #1001 marked as resolved</span>
            <span className="text-gray-500 text-sm">2 hrs ago</span>
          </div>

        </div>

      </div>

    </div>
  );
}