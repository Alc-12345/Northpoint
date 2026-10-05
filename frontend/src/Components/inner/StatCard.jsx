import {
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import { FaRupeeSign } from "react-icons/fa";
import { FiCalendar } from "react-icons/fi";
import { useEffect, useState } from "react";

export default function StatCard() {

  const [isDark, setIsDark] = useState(false);

  /* Detect Dark Mode */
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


  /* Chart Data */

  const depositData = [
    { value: 200 },
    { value: 420 },
    { value: 300 },
    { value: 360 },
    { value: 310 },
    { value: 380 },
  ];

  const expenseData = [
    { value: 300 },
    { value: 500 },
    { value: 420 },
    { value: 480 },
    { value: 430 },
    { value: 470 },
  ];

  const projectData = [
    { name: "Complete", value: 62 },
    { name: "Pending", value: 25 },
    { name: "Not Start", value: 13 },
  ];


  /* Colors */

  const COLORS = [
    "#22c55e",
    "#3b82f6",
    isDark ? "#6b7280" : "#9ca3af",
  ];

  const blueStroke = isDark ? "#3b82f6" : "#2563eb";
  const redStroke = isDark ? "#ef4444" : "#dc2626";


  return (

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">


      {/* Total Deposit */}

      <Card>

        <div className="flex justify-between">

          <div>

            <p className="text-xs text-gray-500 dark:text-gray-400">
              Total Deposit
            </p>

            <h3 className="text-lg font-bold text-gray-800 dark:text-white">
              ₹1200.00
            </h3>

          </div>

          <IconBox color="blue">
            <FaRupeeSign size={14}/>
          </IconBox>

        </div>


        <div className="h-14 mt-4 -mx-4">

          <ResponsiveContainer width="100%" height="100%">

            <AreaChart data={depositData}>

              <defs>

                <linearGradient id="depositGradient">

                  <stop offset="0%" stopColor={blueStroke} stopOpacity={0.5}/>
                  <stop offset="100%" stopColor={blueStroke} stopOpacity={0}/>

                </linearGradient>

              </defs>

              <Area
                type="monotone"
                dataKey="value"
                stroke={blueStroke}
                strokeWidth={2}
                fill="url(#depositGradient)"
                dot={false}
              />

            </AreaChart>

          </ResponsiveContainer>

        </div>

      </Card>



      {/* Projects */}

      <Card className="flex items-center justify-between">

        <div className="relative w-24 h-24">

          <ResponsiveContainer>

            <PieChart>

              <Pie
                data={projectData}
                innerRadius={22}
                outerRadius={32}
                dataKey="value"
              >

                {projectData.map((entry,index)=>(
                  <Cell key={index} fill={COLORS[index]}/>
                ))}

              </Pie>

            </PieChart>

          </ResponsiveContainer>

          <div className="absolute inset-0 flex items-center justify-center font-bold text-gray-800 dark:text-white">
            62%
          </div>

        </div>


        <div>

          <p className="text-xs text-gray-500 dark:text-gray-400">
            All Projects
          </p>

          <div className="mt-2 space-y-1 text-xs text-gray-700 dark:text-gray-300">

            <Legend color="bg-green-500" label="Complete"/>
            <Legend color="bg-blue-500" label="Pending"/>
            <Legend color="bg-gray-400 dark:bg-gray-500" label="Not Start"/>

          </div>

        </div>

      </Card>



      {/* Expenses */}

      <Card>

        <div className="flex justify-between">

          <div>

            <p className="text-xs text-gray-500 dark:text-gray-400">
              Total Expenses
            </p>

            <h3 className="text-lg font-bold text-gray-800 dark:text-white">
              ₹1200.00
            </h3>

          </div>

          <IconBox color="red">
            <FaRupeeSign size={14}/>
          </IconBox>

        </div>


        <div className="h-14 mt-4 -mx-4">

          <ResponsiveContainer>

            <AreaChart data={expenseData}>

              <defs>

                <linearGradient id="expenseGradient">

                  <stop offset="0%" stopColor={redStroke} stopOpacity={0.5}/>
                  <stop offset="100%" stopColor={redStroke} stopOpacity={0}/>

                </linearGradient>

              </defs>

              <Area
                type="monotone"
                dataKey="value"
                stroke={redStroke}
                strokeWidth={2}
                fill="url(#expenseGradient)"
                dot={false}
              />

            </AreaChart>

          </ResponsiveContainer>

        </div>

      </Card>



      {/* Tasks */}

      <Card>

        <div className="flex justify-between">

          <div>

            <p className="text-xs text-gray-500 dark:text-gray-400">
              Tasks
            </p>

            <h3 className="text-lg font-bold text-gray-800 dark:text-white">
              20
            </h3>

            <p className="text-xs text-gray-500 dark:text-gray-400">
              Tasks Not Finished
            </p>

          </div>

          <IconBox color="blue">
            <FiCalendar size={14}/>
          </IconBox>

        </div>


        <div className="mt-4">

          <div className="h-2 bg-gray-200 dark:bg-[#2a2a2a] rounded-full">

            <div className="h-2 bg-blue-500 w-[70%] rounded-full"/>

          </div>

          <p className="text-xs text-right mt-1 text-gray-500 dark:text-gray-400">
            20/28
          </p>

        </div>

      </Card>


    </div>

  );

}



/* Card Wrapper */

function Card({ children, className="" }){

  return(

    <div className={`
      bg-white
      dark:bg-[#0b1220]
      border border-gray-200
      dark:border-[#243244]
      rounded-xl shadow-sm
      p-4
      transition-colors duration-300
      ${className}
    `}>

      {children}

    </div>

  );

}



/* Icon Wrapper */

function IconBox({ children, color }){

  const colors = {

    blue: "bg-blue-500/10 text-blue-500",

    red: "bg-red-500/10 text-red-500",

  };

  return(

    <div className={`p-2 rounded-md ${colors[color]}`}>
      {children}
    </div>

  );

}



/* Legend */

function Legend({color,label}){

  return(

    <div className="flex items-center gap-2">

      <span className={`w-2 h-2 rounded-full ${color}`}></span>

      <span>{label}</span>

    </div>

  );

}
