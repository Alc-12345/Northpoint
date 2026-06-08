import { useEffect, useState } from "react";
import { FiDownload, FiPlus, FiUserPlus } from "react-icons/fi";

export default function Employees() {

  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };
    checkTheme();

    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const employees = [
    {
      id: "1001",
      name: "Ricky Antony",
      role: "Web Designer",
      email: "abc@gmail.com",
      phone: "+91 123 456 7890",
      gender: "Male",
      location: "Delhi",
      status: "Active",
      img: "https://i.pravatar.cc/40?img=1",
    },
    {
      id: "1002",
      name: "Ricky Antony",
      role: "Web Designer",
      email: "abc@gmail.com",
      phone: "+91 123 456 7890",
      gender: "Male",
      location: "Delhi",
      status: "Pending",
      img: "https://i.pravatar.cc/40?img=2",
    },
    {
      id: "1003",
      name: "Ricky Antony",
      role: "Web Designer",
      email: "abc@gmail.com",
      phone: "+91 123 456 7890",
      gender: "Male",
      location: "Delhi",
      status: "Active",
      img: "https://i.pravatar.cc/40?img=3",
    },
    {
      id: "1004",
      name: "Ricky Antony",
      role: "Web Designer",
      email: "abc@gmail.com",
      phone: "+91 123 456 7890",
      gender: "Male",
      location: "Delhi",
      status: "Active",
      img: "https://i.pravatar.cc/40?img=4",
    },
    {
      id: "1005",
      name: "Ricky Antony",
      role: "Web Designer",
      email: "abc@gmail.com",
      phone: "+91 123 456 7890",
      gender: "Male",
      location: "Delhi",
      status: "Pending",
      img: "https://i.pravatar.cc/40?img=5",
    },
  ];

  return (
    <div
      className={`
        rounded-xl border shadow-sm p-6 transition-all duration-300

        ${isDark
          ? "bg-[#0b1220] border-[#2c2c2c] text-white"
          : "bg-white border-gray-200 text-gray-800"}
      `}
    >

      {/* Header */}
      <div className="flex justify-between items-center mb-5">

        <h2 className="text-lg font-semibold">
          Employees
        </h2>

        <div className="flex gap-3 items-center">

          <button className="flex items-center gap-2 text-blue-500 text-sm hover:underline">
            <FiDownload />
            Export Report
          </button>

          <button className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm">
            <FiPlus />
            Add Employee
          </button>

          <button
            className={`
              flex items-center gap-2 px-3 py-1.5 rounded-md text-sm border

              ${isDark
                ? "border-gray-600 hover:bg-[#2a2a2a]"
                : "border-gray-300 hover:bg-gray-100"}
            `}
          >
            <FiUserPlus />
            Invite Employee
          </button>

        </div>

      </div>

      {/* Table */}
      <div className="overflow-x-auto">

        <table className="w-full text-sm">

          <thead>
            <tr
              className={`
                border-b

                ${isDark
                  ? "border-[#2c2c2c] text-gray-400"
                  : "border-gray-200 text-gray-500"}
              `}
            >
              <th className="py-3 text-left font-medium">Employee ID</th>
              <th className="text-left font-medium">Employee Name</th>
              <th className="text-left font-medium">Email Address</th>
              <th className="text-left font-medium">Contact Number</th>
              <th className="text-left font-medium">Gender</th>
              <th className="text-left font-medium">Location</th>
              <th className="text-left font-medium">Status</th>
            </tr>
          </thead>

          <tbody>

            {employees.map((emp) => (
              <tr
                key={emp.id}
                className={`
                  border-b transition

                  ${isDark
                    ? "border-[#2c2c2c] hover:bg-[#2a2a2a]"
                    : "border-gray-100 hover:bg-gray-50"}
                `}
              >

                <td className="py-4">{emp.id}</td>

                <td>
                  <div className="flex items-center gap-3">

                    <img
                      src={emp.img}
                      className="w-9 h-9 rounded-md"
                    />

                    <div>
                      <div className="font-medium">
                        {emp.name}
                      </div>

                      <div className="text-xs text-gray-400">
                        {emp.role}
                      </div>
                    </div>

                  </div>
                </td>

                <td className="text-gray-500">
                  {emp.email}
                </td>

                <td className="text-blue-500 font-medium">
                  {emp.phone}
                </td>

                <td>{emp.gender}</td>

                <td>{emp.location}</td>

                <td>
                  <span
                    className={`
                      px-2 py-1 rounded text-xs font-medium

                      ${
                        emp.status === "Active"
                          ? "bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-400"
                          : "bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400"
                      }
                    `}
                  >
                    {emp.status}
                  </span>
                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

      {/* Footer */}
      <div className="flex justify-between items-center mt-5 text-sm">

        <span className="text-gray-400">
          Showing 1 to 5 of 10 entries
        </span>

        <div className="flex gap-2">

          <button className="px-3 py-1 rounded bg-blue-500 text-white">
            1
          </button>

          <button
            className={`
              px-3 py-1 rounded border

              ${isDark
                ? "border-gray-600 hover:bg-[#2a2a2a]"
                : "border-gray-300 hover:bg-gray-100"}
            `}
          >
            2
          </button>

        </div>

      </div>

    </div>
  );
}
