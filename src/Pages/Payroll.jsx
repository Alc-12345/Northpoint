import { useNavigate } from "react-router-dom";
import { FiPlus } from "react-icons/fi";

export default function SalaryPage() {

  const navigate = useNavigate();

  const salaries = [
    {
      id: "EMP001",
      name: "Rahul Sharma",
      department: "IT",
      basic: 50000,
      hra: 15000,
      allowance: 5000,
      bonus: 3000,
    },
     {
      id: "EMP002",
      name: "Rohit Sharma",
      department: "IT",
      basic: 50000,
      hra: 20000,
      allowance: 5000,
      bonus: 3000,
    },
     {
      id: "EMP003",
      name: "Rahul Sharma",
      department: "IT",
      basic: 50000,
      hra: 15000,
      allowance: 5000,
      bonus: 3000,
    },
     {
      id: "EMP004",
      name: "Rohit Sharma",
      department: "IT",
      basic: 50000,
      hra: 15000,
      allowance: 5000,
      bonus: 3000,
    },
     {
      id: "EMP005",
      name: "Kapil",
      department: "IT",
      basic: 50000,
      hra: 15000,
      allowance: 5000,
      bonus: 3000,
    },
    
  ];

  return (
    <div className="p-6 bg-gray-100 dark:bg-[#0b1220] min-h-screen text-gray-800 dark:text-gray-200">

      {/* Header */}

      <div className="flex justify-between items-center mb-6">

        <div>
          <h2 className="text-2xl font-bold">
            Salary Structure
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage employee salary details
          </p>
        </div>

        <button
          onClick={() => navigate("/salary")}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 
          text-white px-4 py-2 rounded-lg shadow"
        >
          <FiPlus />
          Create Salary
        </button>

      </div>

      {/* Table Card */}

      <div className="bg-white dark:bg-[#0b1220] rounded-xl shadow border dark:border-[#243244] overflow-hidden">

        <table className="w-full text-sm">

          {/* Table Head */}

          <thead className="bg-gray-100 dark:bg-[#2a2a2a] text-gray-600 dark:text-gray-300">

            <tr>
              <th className="p-3 text-left border-b dark:border-[#243244]">Emp ID</th>
              <th className="p-3 text-left border-b dark:border-[#243244]">Name</th>
              <th className="p-3 text-left border-b dark:border-[#243244]">Department</th>
              <th className="p-3 text-left border-b dark:border-[#243244]">Basic</th>
              <th className="p-3 text-left border-b dark:border-[#243244]">HRA</th>
              <th className="p-3 text-left border-b dark:border-[#243244]">Allowance</th>
              <th className="p-3 text-left border-b dark:border-[#243244]">Bonus</th>
              <th className="p-3 text-left border-b dark:border-[#243244]">Gross</th>
            </tr>

          </thead>

          {/* Table Body */}

          <tbody>

            {salaries.map((emp) => {

              const gross =
                emp.basic +
                emp.hra +
                emp.allowance +
                emp.bonus;

              return (
                <tr
                  key={emp.id}
                  className="hover:bg-gray-50 dark:hover:bg-[#2a2a2a] transition"
                >

                  <td className="p-3 border-b dark:border-[#243244]">
                    {emp.id}
                  </td>

                  <td className="p-3 border-b dark:border-[#243244] font-medium">
                    {emp.name}
                  </td>

                  <td className="p-3 border-b dark:border-[#243244]">
                    {emp.department}
                  </td>

                  <td className="p-3 border-b dark:border-[#243244]">
                    ₹{emp.basic}
                  </td>

                  <td className="p-3 border-b dark:border-[#243244]">
                    ₹{emp.hra}
                  </td>

                  <td className="p-3 border-b dark:border-[#243244]">
                    ₹{emp.allowance}
                  </td>

                  <td className="p-3 border-b dark:border-[#243244]">
                    ₹{emp.bonus}
                  </td>

                  <td className="p-3 border-b dark:border-[#243244] font-semibold text-green-600">
                    ₹{gross}
                  </td>

                </tr>
              );
            })}

          </tbody>

        </table>

      </div>

    </div>
  );
}
