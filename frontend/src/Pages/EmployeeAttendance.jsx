
import React, { useState } from "react";

const EmployeeAttendance = () => {
  const [status, setStatus] = useState("Not Checked In");
  const [checkInTime, setCheckInTime] = useState(null);
  const [checkOutTime, setCheckOutTime] = useState(null);

  const handleCheckIn = () => {
    const time = new Date().toLocaleTimeString();
    setCheckInTime(time);
    setStatus("Checked In");
  };

  const handleCheckOut = () => {
    const time = new Date().toLocaleTimeString();
    setCheckOutTime(time);
    setStatus("Checked Out");
  };

  const attendanceHistory = [
    {
      date: "2026-03-01",
      checkIn: "09:10 AM",
      checkOut: "06:00 PM",
      status: "Present",
    },
    {
      date: "2026-03-02",
      checkIn: "09:05 AM",
      checkOut: "06:10 PM",
      status: "Present",
    },
    {
      date: "2026-03-03",
      checkIn: "-",
      checkOut: "-",
      status: "Leave",
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen dark:bg-gray-900">

      {/* Page Title */}
      <h1 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
        Employee Attendance
      </h1>

      {/* Today's Attendance Card */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6">

        <h2 className="text-lg font-semibold text-gray-700 dark:text-white mb-4">
          Today's Attendance
        </h2>

        <p className="mb-2 dark:text-gray-300">
          Status: <strong>{status}</strong>
        </p>

        <p className="mb-2 dark:text-gray-300">
          Check In: {checkInTime || "-"}
        </p>

        <p className="mb-4 dark:text-gray-300">
          Check Out: {checkOutTime || "-"}
        </p>

        <div className="flex gap-4">
          <button
            onClick={handleCheckIn}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
          >
            Check In
          </button>

          <button
            onClick={handleCheckOut}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
          >
            Check Out
          </button>
        </div>
      </div>

      {/* Attendance History */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">

        <h2 className="text-lg font-semibold text-gray-700 dark:text-white mb-4">
          Attendance History
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">

            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Check In</th>
                <th className="p-3 text-left">Check Out</th>
                <th className="p-3 text-left">Status</th>
              </tr>
            </thead>

            <tbody>
              {attendanceHistory.map((item, index) => (
                <tr key={index} className="border-b dark:border-[#243244]">
                  <td className="p-3 dark:text-white">{item.date}</td>
                  <td className="p-3 dark:text-white">{item.checkIn}</td>
                  <td className="p-3 dark:text-white">{item.checkOut}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        item.status === "Present"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {item.status}
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

export default EmployeeAttendance;

