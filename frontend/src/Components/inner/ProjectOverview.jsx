import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { useState } from "react";

export default function ProjectOverview() {
  const [active, setActive] = useState("Week");

  const data = [
    { name: "Jan", green: 40, red: 30, bar: 70 },
    { name: "Feb", green: 65, red: 25, bar: 85 },
    { name: "Mar", green: 50, red: 45, bar: 70 },
    { name: "Apr", green: 75, red: 30, bar: 95 },
    { name: "May", green: 48, red: 25, bar: 60 },
    { name: "Jun", green: 60, red: 40, bar: 90 },
    { name: "Jul", green: 45, red: 20, bar: 75 },
    { name: "Aug", green: 65, red: 42, bar: 80 },
    { name: "Sep", green: 75, red: 35, bar: 92 },
    { name: "Oct", green: 45, red: 15, bar: 35 },
    { name: "Nov", green: 50, red: 32, bar: 72 },
    { name: "Dec", green: 45, red: 20, bar: 95 },
  ];

  return (
    <div
      className="
        bg-white   dark:bg-[#0b1220]
        border border-gray-200 dark:border-[#243244]
        rounded-xl shadow-sm
        p-6
        transition-colors duration-300
      "
    >

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">

        <h2 className="text-sm font-semibold text-gray-800 dark:text-white">
          Projects Overview
        </h2>

        <div className="flex gap-2">

          {["Week", "Month", "Year", "All"].map((item) => (

            <button
              key={item}
              onClick={() => setActive(item)}
              className={`
                px-3 py-1 text-xs rounded-md transition
                ${
                  active === item
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                }
              `}
            >
              {item}
            </button>

          ))}

        </div>

      </div>

      {/* Chart */}
      <div className="w-full h-[300px]">

        <ResponsiveContainer width="100%" height="100%">

          <ComposedChart data={data}>

            {/* Gradient */}
            <defs>

              <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">

                <stop offset="0%" stopColor="#22c55e" stopOpacity={0.4} />
                <stop offset="50%" stopColor="#22c55e" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />

              </linearGradient>

            </defs>

            {/* Grid */}
            <CartesianGrid
              strokeDasharray="3 3"
              strokeOpacity={0.1}
              vertical={false}
            />

            {/* X Axis */}
            <XAxis
              dataKey="name"
              stroke="#9ca3af"
              tick={{ fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />

            {/* Y Axis */}
            <YAxis
              stroke="#9ca3af"
              tick={{ fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />

            {/* Tooltip */}
            <Tooltip
              contentStyle={{
                backgroundColor: "#1f2937",
                borderRadius: "8px",
                border: "none",
                color: "#fff",
              }}
            />

            {/* Bar */}
            <Bar
              dataKey="bar"
              fill="#3b82f6"
              barSize={6}
              radius={[4, 4, 0, 0]}
            />

            {/* Area */}
            <Area
              type="monotone"
              dataKey="green"
              stroke="none"
              fill="url(#greenGradient)"
            />

            {/* Green Line */}
            <Line
              type="monotone"
              dataKey="green"
              stroke="#22c55e"
              strokeWidth={3}
              dot={false}
            />

            {/* Red Line */}
            <Line
              type="monotone"
              dataKey="red"
              stroke="#ef4444"
              strokeWidth={2}
              dot={false}
              strokeDasharray="6 6"
            />

          </ComposedChart>

        </ResponsiveContainer>

      </div>

      {/* Bottom Stats */}
      <div className="
        grid grid-cols-2 md:grid-cols-4 gap-6 mt-8 text-center
        border-t border-gray-200 dark:border-[#243244] pt-6
      ">

        <StatItem value="12,721" label="Number of Projects" />
        <StatItem value="721" label="Active Projects" />
        <StatItem value="₹ 2,50,523" label="Revenue" />
        <StatItem value="12.75h" label="Working Hours" />

      </div>

    </div>
  );
}

/* Stat Component */
function StatItem({ value, label }) {
  return (
    <div>

      <h3 className="text-lg font-bold text-gray-800 dark:text-white">
        {value}
      </h3>

      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
        {label}
      </p>

    </div>
  );
}
