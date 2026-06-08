import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiChevronDown, FiMoreVertical } from "react-icons/fi";

export default function EmployeeGridSection({ view }) {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(8);

  const employees = [
    {
      id: 1,
      name: "Anthony Lewis",
      role: "Software Developer",
      email: "anthony@example.com",
      phone: "+91 9876543210",
      projects: 20,
      done: 13,
      progress: 7,
      productivity: 65,
      color: "bg-purple-500",
      avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    },
    {
      id: 2,
      name: "Brian Villalobos",
      role: "Developer",
      email: "brian@example.com",
      phone: "+91 9876543211",
      projects: 30,
      done: 10,
      progress: 20,
      productivity: 30,
      color: "bg-yellow-500",
      avatar: "https://randomuser.me/api/portraits/men/2.jpg",
    },
    {
      id: 3,
      name: "Harvey Smith",
      role: "Developer",
      email: "harvey@example.com",
      phone: "+91 9876543212",
      projects: 25,
      done: 7,
      progress: 18,
      productivity: 20,
      color: "bg-red-500",
      avatar: "https://randomuser.me/api/portraits/men/3.jpg",
    },
  ];

  return (
    <div className="bg-white dark:bg-[#0b1220] border dark:border-[#243244] rounded-xl">

      {/* HEADER */}
      <div className="px-6 py-4 border-b dark:border-[#243244] flex justify-between items-center">
        <h2 className="text-sm font-semibold text-gray-800 dark:text-white">
          Employees {view === "grid" ? "Grid" : "List"}
        </h2>

        <button className="flex items-center gap-2 px-4 py-2 border rounded-lg dark:border-gray-600 text-sm">
          Sort By
          <FiChevronDown />
        </button>
      </div>

      {/* CONTENT */}
      <div className="p-6">

        <div
          className={`${
            view === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
              : "flex flex-col gap-4"
          }`}
        >

          {employees.slice(0, visible).map((emp) => (

            <div
              key={emp.id}
              onClick={() =>
                navigate(`/employees/${emp.id}`, {
                  state: emp,
                })
              }
              className={`relative border dark:border-[#243244] rounded-xl p-5 hover:shadow-lg transition cursor-pointer bg-white dark:bg-[#0b1220] ${
                view === "list" ? "flex items-center justify-between gap-4" : ""
              }`}
            >

              {/* MENU ICON (FIXED POSITION ISSUE) */}
              {view === "grid" && (
                <div className="absolute top-4 right-4">
                  <FiMoreVertical />
                </div>
              )}

              {/* LEFT SIDE */}
              <div className="flex items-center gap-6 w-full">

                {/* Checkbox + Avatar */}
                <div className="flex items-center gap-5">
                  <input
                    type="checkbox"
                    onClick={(e) => e.stopPropagation()}
                  />

                  <img
                    src={emp.avatar}
                    alt={emp.name}
                    className="w-12 h-12 rounded-full border-2 border-orange-500"
                  />
                </div>

                {/* Info */}
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-white">
                    {emp.name}
                  </h3>

                  <span className="text-xs bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300 px-2 py-1 rounded">
                    {emp.role}
                  </span>

                  {view === "list" && (
                    <p className="text-xs text-gray-500 mt-1">
                      {emp.email} • {emp.phone}
                    </p>
                  )}
                </div>

              </div>

              {/* GRID EXTRA CONTENT */}
              {view === "grid" && (
                <>
                  {/* Stats */}
                  <div className="grid grid-cols-3 text-center mt-4">
                    <div>
                      <p className="text-xs text-gray-500">Projects</p>
                      <p className="font-semibold">{emp.projects}</p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">Done</p>
                      <p className="font-semibold">{emp.done}</p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">Progress</p>
                      <p className="font-semibold">{emp.progress}</p>
                    </div>
                  </div>

                  {/* Productivity */}
                  <div className="mt-4">
                    <div className="flex justify-between text-xs">
                      <span>Productivity</span>
                      <span>{emp.productivity}%</span>
                    </div>

                    <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full">
                      <div
                        className={`${emp.color} h-1.5 rounded-full`}
                        style={{ width: `${emp.productivity}%` }}
                      />
                    </div>
                  </div>
                </>
              )}

              {/* LIST RIGHT SIDE */}
              {view === "list" && (
                <div className="text-sm text-gray-500 whitespace-nowrap">
                  {emp.productivity}%
                </div>
              )}

            </div>

          ))}

        </div>

      </div>
    </div>
  );
}
