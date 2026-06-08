import React, { useState } from "react";

const EmployeeLeave = () => {
  const [formData, setFormData] = useState({
    leaveType: "",
    startDate: "",
    endDate: "",
    reason: "",
  });

  const [leaveHistory, setLeaveHistory] = useState([
    {
      type: "Sick Leave",
      start: "2026-03-01",
      end: "2026-03-02",
      status: "Approved",
    },
    {
      type: "Casual Leave",
      start: "2026-02-15",
      end: "2026-02-15",
      status: "Pending",
    },
  ]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newLeave = {
      type: formData.leaveType,
      start: formData.startDate,
      end: formData.endDate,
      status: "Pending",
    };

    setLeaveHistory([newLeave, ...leaveHistory]);

    setFormData({
      leaveType: "",
      startDate: "",
      endDate: "",
      reason: "",
    });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen dark:bg-gray-700">

      {/* Page Title */}
      <h1 className="text-2xl font-semibold  text-gray-700 dark:text-white mb-6">
        Employee Leave
      </h1>

      {/* Leave Apply Form */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6">

        <h2 className="text-lg font-semibold text-gray-700 dark:text-white mb-4">
          Apply Leave
        </h2>

        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">

          <select
            name="leaveType"
            value={formData.leaveType}
            onChange={handleChange}
            className="border rounded-lg p-2 dark:bg-gray-700 dark:text-white"
            required
          >
            <option value="">Select Leave Type</option>
            <option value="Sick Leave">Sick Leave</option>
            <option value="Casual Leave">Casual Leave</option>
            <option value="Annual Leave">Annual Leave</option>
          </select>

          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className="border rounded-lg p-2 dark:bg-gray-700 dark:text-white"
            required
          />

          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            className="border rounded-lg p-2 dark:bg-gray-700 dark:text-white"
            required
          />

          <input
            type="text"
            name="reason"
            placeholder="Reason"
            value={formData.reason}
            onChange={handleChange}
            className="border rounded-lg p-2 dark:bg-gray-700 dark:text-white"
          />

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg md:col-span-2"
          >
            Apply Leave
          </button>

        </form>
      </div>

      {/* Leave History */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">

        <h2 className="text-lg font-semibold text-gray-700 dark:text-white mb-4">
          Leave History
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">

            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="p-3 text-left">Leave Type</th>
                <th className="p-3 text-left">Start Date</th>
                <th className="p-3 text-left">End Date</th>
                <th className="p-3 text-left">Status</th>
              </tr>
            </thead>

            <tbody>
              {leaveHistory.map((leave, index) => (
                <tr
                  key={index}
                  className="border-b dark:border-[#243244]"
                >
                  <td className="p-3 dark:text-white">{leave.type}</td>
                  <td className="p-3 dark:text-white">{leave.start}</td>
                  <td className="p-3 dark:text-white">{leave.end}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        leave.status === "Approved"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {leave.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>

      </div>

    </div>
  );
};

export default EmployeeLeave;
