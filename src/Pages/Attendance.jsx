import {
  FiClock,
  FiTrendingUp,
  FiTrendingDown,
  FiDownload,
} from "react-icons/fi";
import EmployeeAttendance from "../Components/Employeeinner/EmployeeAttendance";
export default function Attendance() {

  return (
    <div className="
      p-6 space-y-6
      bg-gray-100 dark:bg-[#0b1220] 
      min-h-screen transition-colors
    ">


      {/* HEADER */}
      <div className="flex justify-between items-center">

        <div>

          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Employee Attendance
          </h2>

          <p className="text-sm text-gray-500 dark:text-gray-400">
            Dashboard / Employee / Leaves
          </p>

        </div>


        <div className="flex gap-3">

          <button className="
            flex items-center gap-2
            px-4 py-2 rounded-lg
            border border-gray-300 dark:border-[#243244]
            text-gray-700 dark:text-gray-300
            hover:bg-gray-200 dark:hover:bg-gray-800
          ">
            <FiDownload size={16}/>
            Export
          </button>


          <button className="
            bg-orange-500 hover:bg-orange-600
            text-white px-4 py-2 rounded-lg
          ">
            Report
          </button>

        </div>

      </div>



      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">


        {/* LEFT GREETING CARD */}
        <div className="lg:col-span-3">

          <GreetingCard />

        </div>



        {/* RIGHT SECTION */}
        <div className="lg:col-span-9 space-y-6">


          {/* STAT GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

            <StatCard
              value="8.36 / 9"
              title="Total Hours Today"
              percent="15%"
              positive
            />

            <StatCard
              value="8.36 / 40"
              title="Total Hours Week"
              percent="15%"
              positive
            />

            <StatCard
              value="126 / 160"
              title="Total Hours Month"
              percent="21%"
              negative
            />

            <StatCard
              value="16 / 28"
              title="Overtime this Month"
              percent="8%"
              negative
            />

          </div>



          {/* TIMELINE */}
          <TimelineCard />


        </div>
      <div className="lg:col-span-12">
        <EmployeeAttendance />
      </div>
      </div>

    </div>
  );
}



/* GREETING CARD */
function GreetingCard() {

  return (
    <div className="
      bg-white dark:bg-[#0b1220]
      border border-gray-200 dark:border-[#243244]
      rounded-xl p-5 h-full
    ">

      <p className="text-gray-500 dark:text-gray-400 text-sm">
        Good Morning, Adrian
      </p>

      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        08:35 AM, 11 Mar 2025
      </h3>


      <div className="flex justify-center my-4">

        <img
          src="https://randomuser.me/api/portraits/men/1.jpg"
          className="w-20 h-20 rounded-full border-4 border-blue-500"
        />

      </div>


      <div className="text-center">

        <span className="
          bg-orange-500 text-white
          text-xs px-3 py-1 rounded
        ">
          Production : 3.45 hrs
        </span>

      </div>


      <p className="text-center text-gray-500 dark:text-gray-400 text-sm mt-3">
        Punch In at 10.00 AM
      </p>


      <button className="
        w-full mt-4 py-2 rounded-lg
        bg-gray-200 dark:bg-gray-700
        text-gray-900 dark:text-white
      ">
        Punch Out
      </button>

    </div>
  );
}



/* STAT CARD */
function StatCard({ value, title, percent, positive }) {

  return (
    <div className="
      bg-white dark:bg-[#0b1220]
      border border-gray-200 dark:border-[#243244]
      rounded-xl p-5
    ">

      <div className="flex justify-between">

        <FiClock className="text-orange-500"/>

        <span className={`
          text-xs flex items-center gap-1
          ${positive ? "text-green-500" : "text-red-500"}
        `}>
          {positive ? <FiTrendingUp/> : <FiTrendingDown/>}
          {percent}
        </span>

      </div>


      <h3 className="mt-3 text-lg font-semibold text-gray-900 dark:text-white">
        {value}
      </h3>

      <p className="text-sm text-gray-500 dark:text-gray-400">
        {title}
      </p>

    </div>
  );
}



/* TIMELINE CARD */
function TimelineCard() {

  return (
    <div className="
      bg-white dark:bg-[#0b1220]
      border border-gray-200 dark:border-[#243244]
      rounded-xl p-6
    ">

      {/* Stats */}
      <div className="grid grid-cols-4 gap-6 mb-4">

        <TimelineStat
          color="bg-blue-500"
          label="Total Working hours"
          value="12h 36m"
        />

        <TimelineStat
          color="bg-green-500"
          label="Productive Hours"
          value="08h 36m"
        />

        <TimelineStat
          color="bg-yellow-500"
          label="Break hours"
          value="22m 15s"
        />

        <TimelineStat
          color="bg-indigo-500"
          label="Overtime"
          value="02h 15m"
        />

      </div>


      {/* Timeline Bar */}
      <div className="flex gap-1 mt-4">

        <Bar color="bg-green-500" width="25%"/>
        <Bar color="bg-yellow-500" width="10%"/>
        <Bar color="bg-green-500" width="20%"/>
        <Bar color="bg-indigo-500" width="10%"/>
        <Bar color="bg-green-500" width="25%"/>

      </div>


      {/* Time Labels */}
      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">

        <span>06:00</span>
        <span>07:00</span>
        <span>08:00</span>
        <span>09:00</span>
        <span>10:00</span>
        <span>11:00</span>

      </div>

    </div>
  );
}



/* TIMELINE STAT */
function TimelineStat({ color, label, value }) {

  return (
    <div className="flex items-center gap-2">

      <div className={`w-3 h-3 rounded-full ${color}`} />

      <div>

        <p className="text-xs text-gray-500 dark:text-gray-400">
          {label}
        </p>

        <p className="text-sm font-semibold text-gray-900 dark:text-white">
          {value}
        </p>

      </div>

    </div>
  );
}



/* BAR */
function Bar({ color, width }) {

  return (
    <div
      className={`h-3 rounded ${color}`}
      style={{ width }}
    />
  );
}
