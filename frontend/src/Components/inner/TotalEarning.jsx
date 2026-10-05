import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import { useState } from "react";

export default function TotalEarning() {

  const [active, setActive] = useState("Month");

  const data = [
    { name: "May", value: 640 },
    { name: "Jun", value: 670 },
    { name: "Jul", value: 590 },
    { name: "Aug", value: 700 },
    { name: "Sep", value: 600 },
    { name: "Oct", value: 720 },
    { name: "Nov", value: 610 },
  ];

  const tabs = ["Day", "Week", "Month", "Year"];

  return (

    <div
      className="
        bg-white    dark:bg-[#0b1220]
        border border-gray-200 dark:border-[#243244]
        rounded-xl shadow-sm
        p-5 h-full flex flex-col
        transition-colors duration-300
      "
    >

      {/* Header */}

      <p className="text-sm text-gray-500 dark:text-gray-400">
        Total Earning
      </p>

      <h2 className="text-3xl font-bold text-gray-800 dark:text-white mt-2">
        ₹ 6,743.00
      </h2>


      {/* Tabs */}

      <div className="flex gap-4 text-xs mt-4 mb-4">

        {tabs.map((tab) => (

          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={`
              pb-1 transition
              ${
                active === tab
                  ? "text-blue-500 border-b-2 border-blue-500"
                  : "text-gray-500 dark:text-gray-400 hover:text-blue-500"
              }
            `}
          >
            {tab}
          </button>

        ))}

      </div>


      {/* Chart */}

      <div className="flex-1 min-h-[250px]">

        <ResponsiveContainer width="100%" height="100%">

          <LineChart data={data}>

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              strokeOpacity={0.15}
            />

            <XAxis
              dataKey="name"
              stroke="#9ca3af"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
            />

            <YAxis
              stroke="#9ca3af"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "#1f2937",
                border: "none",
                borderRadius: "8px",
                color: "#fff",
              }}
            />

            <Line
              type="monotone"
              dataKey="value"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={false}
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

    </div>

  );

}
