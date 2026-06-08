import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useEffect, useState } from "react";

export default function ProjectStatus() {

  // Detect theme from html class
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

  const data = [
    { name: "Completed Projects", value: 125, color: "#3B82F6" },
    { name: "Progress Projects", value: 125, color: "#22C55E" },
    { name: "Cancelled", value: 125, color: "#EF4444" },
    { name: "Yet to Start", value: 125, color: "#F59E0B" },
  ];

  const total = 100;

  return (
    <div
      className={`
        rounded-xl border p-6 shadow-sm transition-all duration-300
        ${isDark
          ? "bg-[#0b1220] border-[#2c2c2c] text-white"
          : "bg-white border-gray-200 text-gray-900"}
      `}
    >

      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-lg">
          Projects Status
        </h2>

        <span className="text-blue-500 text-sm cursor-pointer">
          Today ▾
        </span>
      </div>

      {/* Chart */}
      <div className="relative w-full h-56">

        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              innerRadius={80}
              outerRadius={95}
              paddingAngle={2}
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <h1 className="text-3xl font-bold">
            {total}
          </h1>

          <p className={isDark ? "text-gray-400" : "text-gray-500"}>
            Total projects
          </p>
        </div>

      </div>

      {/* Legend */}
      <div className="mt-4 space-y-3">

        {data.map((item, index) => (
          <div key={index} className="flex justify-between items-center">

            <div className="flex items-center gap-3">

              <span
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: item.color }}
              />

              <span className={isDark ? "text-gray-300" : "text-gray-700"}>
                {item.name}
              </span>

            </div>

            <span className={isDark ? "text-gray-400" : "text-gray-500"}>
              {item.value} Projects
            </span>

          </div>
        ))}

      </div>

    </div>
  );
}
