import React, { useState } from "react";
import {
  FiSearch,
  FiUser,
  FiCheckCircle,
  FiUsers,
} from "react-icons/fi";

export default function AssignTeam() {
  const employees = [
    {
      id: 1,
      name: "Rahul Sharma",
      role: "Frontend Developer",
      department: "Development",
      experience: "3 Years",
      status: "Available",
    },
    {
      id: 2,
      name: "Priya Singh",
      role: "Backend Developer",
      department: "Development",
      experience: "4 Years",
      status: "Available",
    },
    {
      id: 3,
      name: "Amit Verma",
      role: "UI/UX Designer",
      department: "Design",
      experience: "2 Years",
      status: "Busy",
    },
    {
      id: 4,
      name: "Sneha Jain",
      role: "QA Engineer",
      department: "Testing",
      experience: "5 Years",
      status: "Available",
    },
    {
      id: 5,
      name: "Rohit Kumar",
      role: "React Developer",
      department: "Development",
      experience: "2 Years",
      status: "Available",
    },
    {
      id: 6,
      name: "Anjali Mehta",
      role: "Node.js Developer",
      department: "Development",
      experience: "3 Years",
      status: "Busy",
    },
    {
      id: 7,
      name: "Vikas Gupta",
      role: "Flutter Developer",
      department: "Mobile",
      experience: "4 Years",
      status: "Available",
    },
    {
      id: 8,
      name: "Pooja Sharma",
      role: "Project Manager",
      department: "Management",
      experience: "6 Years",
      status: "Available",
    },
    {
      id: 9,
      name: "Nitin Yadav",
      role: "Python Developer",
      department: "Development",
      experience: "5 Years",
      status: "Available",
    },
    {
      id: 10,
      name: "Karan Patel",
      role: "DevOps Engineer",
      department: "Infrastructure",
      experience: "4 Years",
      status: "Busy",
    },
    {
      id: 11,
      name: "Riya Kapoor",
      role: "Angular Developer",
      department: "Development",
      experience: "3 Years",
      status: "Available",
    },
    {
      id: 12,
      name: "Abhishek Singh",
      role: "Full Stack Developer",
      department: "Development",
      experience: "5 Years",
      status: "Available",
    },
  ];

  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState([]);

  const toggleEmployee = (id) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((item) => item !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  const filteredEmployees = employees.filter((emp) =>
    emp.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0B1220] text-white p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Assign Team</h1>
          <p className="text-gray-400 mt-2">
            Select multiple employees and assign them to the project.
          </p>
        </div>

        <button className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold">
          Assign Team ({selected.length})
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-8">
        <FiSearch className="absolute left-4 top-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search Employee..."
          className="w-full bg-[#162033] border border-gray-700 rounded-xl pl-12 pr-4 py-3 outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Employee List */}
      <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6">
        {filteredEmployees.map((emp) => (
          <div
            key={emp.id}
            className={`rounded-2xl p-6 border transition ${
              selected.includes(emp.id)
                ? "border-blue-500 bg-[#162033]"
                : "border-gray-700 bg-[#101827]"
            }`}
          >
            <div className="flex justify-between items-center">
              <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-2xl">
                <FiUser />
              </div>

              <input
                type="checkbox"
                checked={selected.includes(emp.id)}
                onChange={() => toggleEmployee(emp.id)}
                className="w-5 h-5"
              />
            </div>

            <h2 className="text-xl font-semibold mt-5">{emp.name}</h2>

            <p className="text-blue-400 mt-1">{emp.role}</p>

            <div className="mt-4 space-y-2 text-sm text-gray-300">
              <p>
                <strong>Department:</strong> {emp.department}
              </p>

              <p>
                <strong>Experience:</strong> {emp.experience}
              </p>

              <p className="flex items-center gap-2">
                <FiCheckCircle className="text-green-400" />
                {emp.status}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Employees */}
      <div className="mt-10 bg-[#162033] rounded-xl p-6 border border-gray-700">
        <div className="flex items-center gap-3 mb-5">
          <FiUsers size={24} />
          <h2 className="text-xl font-semibold">
            Selected Employees ({selected.length})
          </h2>
        </div>

        <div className="flex flex-wrap gap-3">
          {employees
            .filter((emp) => selected.includes(emp.id))
            .map((emp) => (
              <span
                key={emp.id}
                className="bg-blue-600 px-4 py-2 rounded-full text-sm"
              >
                {emp.name}
              </span>
            ))}
        </div>
      </div>
    </div>
  );
}