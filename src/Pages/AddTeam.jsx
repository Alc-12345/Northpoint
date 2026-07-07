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
  const [members, setMembers] = useState([]);

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

  const addMember = () => {
    setMembers([
      ...members,
      {
        employee: "",
        role: "",
        technology: "",
        department: "",
      },
    ]);
  };

  const removeMember = (index) => {
    setMembers(members.filter((_, i) => i !== index));
  };

  const handleMemberChange = (index, field, value) => {
    const updated = [...members];
    updated[index][field] = value;
    setMembers(updated);
  };

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
      {/* ================= CREATE TEAM ================= */}

<div className="bg-[#111C2D] border border-[#243244] rounded-xl p-6 mb-6">

  <div className="flex items-center justify-between mb-6">
    <div>
      <h2 className="text-2xl font-bold text-white">
        Create New Team
      </h2>
      <p className="text-gray-400 text-sm">
        Create a team and assign project information
      </p>
    </div>

    <button className="bg-[#18A8E6] hover:bg-[#1493cb] text-white px-5 py-2 rounded-lg">
      Save Team
    </button>
  </div>

  {/* Team Information */}

  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

    <div>
      <label className="text-gray-300 text-sm block mb-2">
        Team Name
      </label>

      <input
        type="text"
        placeholder="Frontend Team"
        className="w-full bg-[#0B1220] border border-[#243244] rounded-lg px-4 py-3 text-white outline-none"
      />
    </div>

    <div>
      <label className="text-gray-300 text-sm block mb-2">
        Project
      </label>

      <select className="w-full bg-[#0B1220] border border-[#243244] rounded-lg px-4 py-3 text-white">
        <option>Select Project</option>
        <option>School ERP</option>
        <option>Client Dashboard</option>
        <option>CRM System</option>
      </select>
    </div>

    <div>
      <label className="text-gray-300 text-sm block mb-2">
        Client
      </label>

      <select className="w-full bg-[#0B1220] border border-[#243244] rounded-lg px-4 py-3 text-white">
        <option>Select Client</option>
        <option>ABC Technologies</option>
        <option>Northpoint</option>
        <option>XYZ Pvt Ltd</option>
      </select>
    </div>

    <div>
      <label className="text-gray-300 text-sm block mb-2">
        Team Lead
      </label>

      <select className="w-full bg-[#0B1220] border border-[#243244] rounded-lg px-4 py-3 text-white">
        <option>Select Team Lead</option>
        <option>Rahul Sharma</option>
        <option>Priya Singh</option>
        <option>Amit Kumar</option>
      </select>
    </div>

    <div>
      <label className="text-gray-300 text-sm block mb-2">
        Team Type
      </label>

      <select className="w-full bg-[#0B1220] border border-[#243244] rounded-lg px-4 py-3 text-white">
        <option>Development</option>
        <option>UI/UX</option>
        <option>QA</option>
        <option>DevOps</option>
      </select>
    </div>

    <div>
      <label className="text-gray-300 text-sm block mb-2">
        Status
      </label>

      <select className="w-full bg-[#0B1220] border border-[#243244] rounded-lg px-4 py-3 text-white">
        <option>Active</option>
        <option>Inactive</option>
        <option>On Hold</option>
      </select>
    </div>

    <div>
      <label className="text-gray-300 text-sm block mb-2">
        Start Date
      </label>

      <input
        type="date"
        className="w-full bg-[#0B1220] border border-[#243244] rounded-lg px-4 py-3 text-white"
      />
    </div>

    <div>
      <label className="text-gray-300 text-sm block mb-2">
        Deadline
      </label>

      <input
        type="date"
        className="w-full bg-[#0B1220] border border-[#243244] rounded-lg px-4 py-3 text-white"
      />
    </div>

    <div>
      <label className="text-gray-300 text-sm block mb-2">
        Priority
      </label>

      <select className="w-full bg-[#0B1220] border border-[#243244] rounded-lg px-4 py-3 text-white">
        <option>High</option>
        <option>Medium</option>
        <option>Low</option>
      </select>
    </div>

  </div>

  {/* Team Members */}

  <div className="mt-8">

    <div className="flex justify-between items-center mb-4">

      <h3 className="text-lg text-white font-semibold">
        Team Members
      </h3>

      <button
        type="button"
        onClick={addMember}
        className="bg-[#18A8E6] hover:bg-[#1493cb] text-white px-4 py-2 rounded-lg flex items-center gap-2"
      >
        <FiPlus />
        Add Member
      </button>

    </div>

    {members.length === 0 ? (
      <div className="text-gray-400">No team members added yet. Click "Add Member" to add one.</div>
    ) : (
      members.map((member, index) => (
        <div
          key={index}
          className="bg-[#0B1220] border border-[#243244] rounded-xl p-5 mt-5"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-white font-semibold">Member {index + 1}</h3>
            <button
              type="button"
              onClick={() => removeMember(index)}
              className="text-red-400 hover:text-red-300"
            >
              Remove
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <select
              value={member.employee}
              onChange={(e) => handleMemberChange(index, "employee", e.target.value)}
              className="bg-[#111C2D] border border-[#243244] rounded-lg px-4 py-3 text-white"
            >
              <option value="">Select Employee</option>
              <option>Rahul Sharma</option>
              <option>Priya Singh</option>
              <option>Amit Kumar</option>
              <option>Neha Jain</option>
            </select>

            <select
              value={member.role}
              onChange={(e) => handleMemberChange(index, "role", e.target.value)}
              className="bg-[#111C2D] border border-[#243244] rounded-lg px-4 py-3 text-white"
            >
              <option value="">Select Role</option>
              <option>Developer</option>
              <option>Lead</option>
              <option>Designer</option>
              <option>QA</option>
            </select>

            <select
              value={member.technology}
              onChange={(e) => handleMemberChange(index, "technology", e.target.value)}
              className="bg-[#111C2D] border border-[#243244] rounded-lg px-4 py-3 text-white"
            >
              <option value="">Select Technology</option>
              <option>React</option>
              <option>Node</option>
              <option>MongoDB</option>
              <option>Flutter</option>
            </select>

            <select
              value={member.department}
              onChange={(e) => handleMemberChange(index, "department", e.target.value)}
              className="bg-[#111C2D] border border-[#243244] rounded-lg px-4 py-3 text-white"
            >
              <option value="">Select Department</option>
              <option>Development</option>
              <option>Design</option>
              <option>QA</option>
              <option>DevOps</option>
            </select>
          </div>
        </div>
      ))
    )}

  </div>

  {/* Description */}

  <div className="mt-8">

    <label className="text-gray-300 text-sm block mb-2">
      Team Description
    </label>

    <textarea
      rows={4}
      placeholder="Write team description..."
      className="w-full bg-[#0B1220] border border-[#243244] rounded-lg px-4 py-3 text-white resize-none"
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