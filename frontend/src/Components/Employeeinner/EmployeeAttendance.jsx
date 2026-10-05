import { useState, useEffect } from "react";
import {
  FiSearch,
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

const attendanceData = [
  {
    date: "14/01/2024",
    checkIn: "09:00 AM",
    status: "Present",
    checkOut: "06:45 PM",
    break: "30 Min",
    late: "32 Min",
    overtime: "20 Min",
    hours: "8.55 Hrs",
  },
  {
    date: "21/01/2024",
    checkIn: "09:00 AM",
    status: "Present",
    checkOut: "06:12 PM",
    break: "20 Min",
    late: "-",
    overtime: "45 Min",
    hours: "7.54 Hrs",
  },
  {
    date: "20/02/2024",
    checkIn: "09:00 AM",
    status: "Present",
    checkOut: "06:13 PM",
    break: "50 Min",
    late: "-",
    overtime: "33 Min",
    hours: "8.45 Hrs",
  },
  {
    date: "15/03/2024",
    checkIn: "09:00 AM",
    status: "Present",
    checkOut: "06:23 PM",
    break: "41 Min",
    late: "-",
    overtime: "50 Min",
    hours: "8.35 Hrs",
  },
  {
    date: "12/04/2024",
    checkIn: "09:00 AM",
    status: "Present",
    checkOut: "06:43 PM",
    break: "23 Min",
    late: "-",
    overtime: "10 Min",
    hours: "8.22 Hrs",
  },
  {
    date: "20/05/2024",
    checkIn: "09:00 AM",
    status: "Present",
    checkOut: "07:15 PM",
    break: "03 Min",
    late: "-",
    overtime: "-",
    hours: "8.32 Hrs",
  },
  {
    date: "06/07/2024",
    checkIn: "09:00 AM",
    status: "Present",
    checkOut: "07:13 PM",
    break: "32 Min",
    late: "-",
    overtime: "-",
    hours: "9.15 Hrs",
  },
  {
    date: "02/09/2024",
    checkIn: "09:00 AM",
    status: "Present",
    checkOut: "09:17 PM",
    break: "14 Min",
    late: "12 Min",
    overtime: "-",
    hours: "9.25 Hrs",
  },
  {
    date: "15/11/2024",
    checkIn: "09:00 AM",
    status: "Present",
    checkOut: "08:15 PM",
    break: "12 Min",
    late: "-",
    overtime: "-",
    hours: "8.35 Hrs",
  },
  {
    date: "10/12/2024",
    checkIn: "09:00 AM",
    status: "Absent",
    checkOut: "09:23 PM",
    break: "10 Min",
    late: "-",
    overtime: "-",
    hours: "8.22 Hrs",
  },
];

export default function EmployeeAttendance() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const rowsPerPage = 10;

  const filtered = attendanceData.filter((item) =>
    item.date.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / rowsPerPage);

  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = Math.min(currentPage * rowsPerPage, filtered.length);

  const currentData = filtered.slice(startIndex, endIndex);

  const getStatusColor = (status) =>
    status === "Present"
      ? "text-green-500 dark:text-green-400"
      : "text-red-500 dark:text-red-400";

  const getHoursColor = (hours) => {
    const num = parseFloat(hours);

    if (num >= 9)
      return "bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400";

    if (num >= 8)
      return "bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-400";

    return "bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400";
  };

  return (
    <div className="bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 transition">

      {/* Header */}
      <div className="flex justify-between items-center border-b border-zinc-200 dark:border-zinc-700 pb-3 mb-4 flex-wrap gap-3">

        <h2 className="text-lg font-semibold">
          Employee Attendance
        </h2>

        <div className="flex gap-2 flex-wrap">

          <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
            <FiCalendar />
            dd/mm/yyyy
          </button>

          <select className="px-3 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
            <option>Select Status</option>
          </select>

          <select className="px-3 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
            <option>Sort By : Last 7 Days</option>
          </select>

        </div>

      </div>

      {/* Controls */}
      <div className="flex justify-between items-center mb-4 flex-wrap gap-3">

        <div className="text-sm">
          Row Per Page 10 Entries
        </div>

        <div className="relative">

          <FiSearch className="absolute left-3 top-3 text-zinc-400" />

          <input
            type="text"
            placeholder="Search"
            className="pl-10 pr-4 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

        </div>

      </div>

      {/* Table */}
      <div className="overflow-x-auto">

        <table className="w-full">

          <thead className="bg-zinc-100 dark:bg-zinc-800">

            <tr className="text-left">

              <th className="p-3">Date</th>
              <th className="p-3">Check In</th>
              <th className="p-3">Status</th>
              <th className="p-3">Check Out</th>
              <th className="p-3">Break</th>
              <th className="p-3">Late</th>
              <th className="p-3">Overtime</th>
              <th className="p-3">Production Hours</th>

            </tr>

          </thead>

          <tbody>

            {currentData.map((item, index) => (

              <tr
                key={index}
                className="border-t border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800"
              >

                <td className="p-3">{item.date}</td>

                <td className="p-3">{item.checkIn}</td>

                <td className="p-3">
                  <span className={getStatusColor(item.status)}>
                    ● {item.status}
                  </span>
                </td>

                <td className="p-3">{item.checkOut}</td>

                <td className="p-3">{item.break}</td>

                <td className="p-3">{item.late}</td>

                <td className="p-3">{item.overtime}</td>

                <td className="p-3">
                  <span className={`px-3 py-1 rounded-lg text-sm font-medium ${getHoursColor(item.hours)}`}>
                    {item.hours}
                  </span>
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {/* Footer */}
      <div className="flex justify-between items-center mt-4 border-t border-zinc-200 dark:border-zinc-700 pt-4">

        <div className="text-sm text-zinc-500 dark:text-zinc-400">
          Showing {startIndex + 1} to {endIndex} of {filtered.length} entries
        </div>

        <div className="flex items-center gap-2">

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.max(prev - 1, 1))
            }
            className="w-8 h-8 flex items-center justify-center rounded-full border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <FiChevronLeft />
          </button>

          {[...Array(totalPages)].map((_, i) => (

            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`w-8 h-8 rounded-full border text-sm
                ${
                  currentPage === i + 1
                    ? "bg-orange-500 text-white border-orange-500"
                    : "border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                }`}
            >
              {i + 1}
            </button>

          ))}

          <button
            onClick={() =>
              setCurrentPage((prev) =>
                Math.min(prev + 1, totalPages)
              )
            }
            className="w-8 h-8 flex items-center justify-center rounded-full border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <FiChevronRight />
          </button>

        </div>

      </div>

    </div>
  );
}
