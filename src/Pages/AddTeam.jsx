import React, { useState } from "react";
import {
  FiPlus,
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiUsers,
  FiUserCheck,
  FiCode,
  FiBriefcase,
} from "react-icons/fi";

export default function AddTeam() {
  const [search, setSearch] = useState("");

  const teamMembers = [
    {
      id: 1,
      name: "Rahul Sharma",
      role: "Frontend Developer",
      email: "rahul@gmail.com",
      phone: "+91 9876543210",
      status: "Active",
    },
    {
      id: 2,
      name: "Priya Singh",
      role: "UI/UX Designer",
      email: "priya@gmail.com",
      phone: "+91 9876501234",
      status: "Active",
    },
    {
      id: 3,
      name: "Amit Kumar",
      role: "Backend Developer",
      email: "amit@gmail.com",
      phone: "+91 9988776655",
      status: "Inactive",
    },
    {
      id: 4,
      name: "Neha Jain",
      role: "Project Manager",
      email: "neha@gmail.com",
      phone: "+91 9876549876",
      status: "Active",
    },
  ];

  const filteredMembers = teamMembers.filter(
    (member) =>
      member.name.toLowerCase().includes(search.toLowerCase()) ||
      member.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0B1220] p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Team Management
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Manage all project team members
          </p>
        </div>

        <button className="flex items-center gap-2 bg-[#18A8E6] hover:bg-[#1394cb] text-white px-4 py-2 rounded-lg transition">
          <FiPlus />
          Add Member
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">
        <Card
          title="Total Members"
          value="24"
          icon={<FiUsers />}
        />

        <Card
          title="Active Members"
          value="18"
          icon={<FiUserCheck />}
        />

        <Card
          title="Developers"
          value="12"
          icon={<FiCode />}
        />

        <Card
          title="Managers"
          value="4"
          icon={<FiBriefcase />}
        />
      </div>

      {/* Search */}
      <div className="bg-[#111C2D] border border-[#243244] rounded-xl p-4 mb-6">
        <div className="relative max-w-md">
          <FiSearch className="absolute left-3 top-3 text-gray-400" />

          <input
            type="text"
            placeholder="Search member..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#0B1220] border border-[#243244] rounded-lg pl-10 pr-4 py-2 text-white outline-none"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#111C2D] border border-[#243244] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#172235] text-gray-300">
              <tr>
                <th className="text-left p-4">Name</th>
                <th className="text-left p-4">Role</th>
                <th className="text-left p-4">Email</th>
                <th className="text-left p-4">Phone</th>
                <th className="text-left p-4">Status</th>
                <th className="text-center p-4">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredMembers.map((member) => (
                <tr
                  key={member.id}
                  className="border-t border-[#243244] hover:bg-[#172235]"
                >
                  <td className="p-4 text-white font-medium">
                    {member.name}
                  </td>

                  <td className="p-4 text-gray-300">
                    {member.role}
                  </td>

                  <td className="p-4 text-gray-300">
                    {member.email}
                  </td>

                  <td className="p-4 text-gray-300">
                    {member.phone}
                  </td>

                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${
                        member.status === "Active"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {member.status}
                    </span>
                  </td>

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