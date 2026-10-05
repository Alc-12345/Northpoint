import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

export default function CreateSalary() {

  const navigate = useNavigate();

  const [salary, setSalary] = useState({
    empId: "",
    name: "",
    department: "",
    basic: "",
    hraPercent: "",
    allowancePercent: "",
    bonusPercent: ""
  });

  const basic = Number(salary.basic || 0);

  const hra = (basic * Number(salary.hraPercent || 0)) / 100;
  const allowance = (basic * Number(salary.allowancePercent || 0)) / 100;
  const bonus = (basic * Number(salary.bonusPercent || 0)) / 100;

  const gross = basic + hra + allowance + bonus;

  const handleSubmit = (e) => {
    e.preventDefault();

    const finalSalary = {
      ...salary,
      hra,
      allowance,
      bonus,
      gross
    };

    console.log("Salary Data:", finalSalary);

    alert("Salary Created");

    navigate("/payroll");
  };

  return (

    <div className="p-6 bg-gray-100 dark:bg-[#0b1220] min-h-screen text-gray-800 dark:text-gray-200">

      {/* Header */}

      <div className="flex justify-between items-center mb-6">

        <div>
          <h2 className="text-2xl font-bold">
            Create Salary
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Add employee salary structure
          </p>
        </div>

        {/* <button
          onClick={() => navigate("/payroll")}
          className="flex items-center gap-2 px-3 py-2 bg-gray-200 dark:bg-[#0b1220]
          rounded-lg border dark:border-[#243244] hover:bg-gray-300 dark:hover:bg-[#2a2a2a]"
        >
          <FiArrowLeft />
          Back
        </button> */}

      </div>

      {/* Form Card */}

      <div className="max-w-4xl bg-white dark:bg-[#0b1220] rounded-xl shadow border dark:border-[#243244] p-6">

        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">

          <input
            placeholder="Employee ID"
            className="border dark:border-[#243244] bg-white dark:bg-[#0b1220]
            px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) =>
              setSalary({ ...salary, empId: e.target.value })
            }
          />

          <input
            placeholder="Employee Name"
            className="border dark:border-[#243244] bg-white dark:bg-[#0b1220]
            px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) =>
              setSalary({ ...salary, name: e.target.value })
            }
          />

          <input
            placeholder="Department"
            className="border dark:border-[#243244] bg-white dark:bg-[#0b1220]
            px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) =>
              setSalary({ ...salary, department: e.target.value })
            }
          />

          <input
            type="number"
            placeholder="Basic Salary"
            className="border dark:border-[#243244] bg-white dark:bg-[#0b1220]
            px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) =>
              setSalary({ ...salary, basic: e.target.value })
            }
          />

          <input
            type="number"
            placeholder="HRA %"
            className="border dark:border-[#243244] bg-white dark:bg-[#0b1220]
            px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) =>
              setSalary({ ...salary, hraPercent: e.target.value })
            }
          />

          <input
            type="number"
            placeholder="Allowance %"
            className="border dark:border-[#243244] bg-white dark:bg-[#0b1220]
            px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) =>
              setSalary({ ...salary, allowancePercent: e.target.value })
            }
          />

          <input
            type="number"
            placeholder="Bonus %"
            className="border dark:border-[#243244] bg-white dark:bg-[#0b1220]
            px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) =>
              setSalary({ ...salary, bonusPercent: e.target.value })
            }
          />

          {/* Salary Breakdown */}

          <div className="col-span-2 p-4 rounded-lg bg-gray-100 dark:bg-[#0b1220] border dark:border-[#243244]">

            <div className="text-sm space-y-1">
{/* 
              <p>HRA: ₹{hra}</p>
              <p>Allowance: ₹{allowance}</p>
              <p>Bonus: ₹{bonus}</p> */}

              <p className="font-semibold text-green-600 pt-2">
                Gross Salary: ₹{gross}
              </p>

            </div>

          </div>

          {/* Buttons */}

          <div className="col-span-2 flex gap-3">

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow"
            >
              Save Salary
            </button>

            <button
              type="button"
              onClick={() => navigate("/payroll")}
              className="px-6 py-2 border dark:border-[#243244] rounded-lg
              hover:bg-gray-100 dark:hover:bg-[#2a2a2a]"
            >
              Cancel
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}
