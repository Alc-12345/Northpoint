import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  FiHome,
  FiUsers,
  FiClock,
  FiDollarSign,
  FiCheckSquare,
  FiFolder,
  FiFileText,
  FiUser,
  FiChevronDown,
  FiMoon,
  FiSun,
  FiMenu,
  FiSearch,
  FiSettings,
  FiBell,
  FiMail,
  FiPieChart,
  FiEdit,
  FiHelpCircle,
} from "react-icons/fi";

const Sidebar = ({ children }) => {
const [activeMenu, setActiveMenu] = useState(null);
  const [theme, setTheme] = useState("light");


  // Load saved theme
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark";
    setTheme(savedTheme);
    document.documentElement.classList.toggle("dark", savedTheme === "dark");
  }, []);

  // Apply theme
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };
  const toggleMenu = (menu) => {
  setActiveMenu(activeMenu === menu ? null : menu);
};

  const linkClass =
    "flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200";
  const activeClass = "bg-[#18a8e6] text-white";

  return (
    <div className="flex">
      {/* ================= LEFT SIDEBAR ================= */}
      <div className="w-64 h-screen fixed left-0 top-0 bg-white dark:bg-[#0b1220] text-gray-700 dark:text-slate-300 border-r dark:border-[#18a8e6]/50 flex flex-col transition-colors duration-300">
        {/* Logo */}
        <div className="p-5 border-b dark:border-[#243244]">
          <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-white">
            <span className="text-[#18a8e6]">CRM</span>
          </h1>
        </div>

        {/* Scrollable Menu */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
          {/* Dashboard */}
          <NavLink
            to="/"
            className={({ isActive }) =>
              `${linkClass} ${
                isActive
                  ? activeClass
                  : "hover:bg-gray-100 dark:hover:bg-gray-800"
              }`
            }
          >
            <FiHome /> Dashboard
          </NavLink>

          {/* Employees Dropdown */}
          <div>
            <button
             onClick={() => toggleMenu("employees")}
              className="flex items-center justify-between w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
            >
              <span className="flex items-center gap-3">
                <FiUsers /> Employees
              </span>
              <FiChevronDown
                className={`transition-transform ${
                  activeMenu === "employees" ? "rotate-180" : ""
                }`}
              />
            </button>

            {activeMenu === "employees" && (
              <div className="ml-6 mt-2 space-y-1 text-sm">
                <NavLink
                  to="/employees/all"
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded ${
                      isActive
                        ? "bg-[#18a8e6] text-white"
                        : "hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`
                  }
                >
                  All Employees
                </NavLink>
                  
                <NavLink
                  to="/employees/attendance"
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded ${
                      isActive
                        ? "bg-[#18a8e6] text-white"
                        : "hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`
                  }
                >
                  Attendance
                </NavLink>
              </div>
            )}
          </div>
          <div>

          {/* Core HR */}
          <button
                onClick={() => toggleMenu("hr")}
              className="flex items-center justify-between w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
            >
              <span className="flex items-center gap-3">
                <FiClock />HR
              </span>
              <FiChevronDown
                  className={`transition-transform ${
                  activeMenu === "hr" ? "rotate-180" : ""
                }`}
              />
            </button>
            {activeMenu === "hr" && (
              <div className="ml-6 mt-2 space-y-1 text-sm">
                <NavLink
                  to="/employees/add"
                  className="block px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                >
                  Add Employee
                </NavLink>
              </div>
            )}
            {activeMenu === "hr" && (
              <div className="ml-6 mt-2 space-y-1 text-sm">
                <NavLink
                  to="/client-billing-finance"
                  className="block px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                > Finance
                </NavLink>
              </div>
            )}
            {activeMenu === "hr" && (
              <div className="ml-6 mt-2 space-y-1 text-sm">
                <NavLink
                  to="/payroll"
                  className="block px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                >
                Salary
                 </NavLink>
              </div>
            )}
                  {activeMenu === "hr" && (
              <div className="ml-6 mt-2 space-y-1 text-sm">
                <NavLink
                  to="/add-task"
                  className="block px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                >
               Add Task
                 </NavLink>
              </div>
            )}
          </div>
{/* 
          <NavLink to="/client-billing-finance" className={linkClass}>
            <FiDollarSign /> Finance
          </NavLink> */}

          {/* Tasks Dropdown */}
          <div>
            <button
              onClick={() => toggleMenu("tasks")}
              className="flex items-center justify-between w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            >
              <span className="flex items-center gap-3">
                <FiCheckSquare /> Tasks
              </span>
              <FiChevronDown
                className={`transition-transform ${activeMenu === "tasks" ? "rotate-180" : ""}`}
              />
            </button>

            {activeMenu === "tasks" && (
              <div className="ml-6 mt-2 space-y-1 text-sm">
                <NavLink
                  to="/tasks"
                  className="block px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                >
                  All Tasks
                </NavLink>
                <NavLink
                  to="/tasks/completed"
                  className="block px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                >
                  Completed
                </NavLink>
              </div>
            )}
          </div>

          {/* Projects */}
          <div className="pt-2">
            <div className="flex items-center justify-between px-1 pb-2 text-sm font-semibold text-gray-700 dark:text-white">
              <NavLink to="/projects" className="flex items-center gap-3">
                <FiFolder /> Projects
              </NavLink>
              <span className="text-lg leading-none text-slate-500 dark:text-slate-400">+</span>
            </div>
            <div className="space-y-2 text-sm">
              <NavLink
                to="/projects"
                className="flex items-center gap-3 rounded-lg px-4 py-1.5 hover:bg-gray-100 dark:hover:bg-[#172235]"
              >
                <span className="h-3 w-3 rounded bg-pink-400" />
                Event Planning
              </NavLink>
              <NavLink
                to="/projects"
                className="flex items-center gap-3 rounded-lg px-4 py-1.5 hover:bg-gray-100 dark:hover:bg-[#172235]"
              >
                <span className="h-3 w-3 rounded bg-blue-400" />
                Breakfast Plan
              </NavLink>
            </div>
            <div className="mt-4 rounded-lg border border-gray-200 p-4 dark:border-[#243244] dark:bg-[#0b1220]">
              <p className="text-[11px] uppercase tracking-widest text-slate-500 dark:text-slate-400">
                User Summary
              </p>
              <div className="mt-4 flex items-center justify-between gap-3 text-xs">
                <span className="text-gray-700 dark:text-slate-300">Admins: 12</span>
                <span className="text-gray-700 dark:text-slate-300">Emp: 330</span>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="space-y-2 text-[11px] text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    Active (310)
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-slate-500" />
                    Inactive (32)
                  </div>
                </div>
                <div className="h-12 w-12 rounded-full border-4 border-emerald-400 border-l-slate-600" />
              </div>
            </div>
          </div>

          {/* Reports */}
          <NavLink to="/reports" className={linkClass}>
            <FiFileText /> Reports
          </NavLink>

          {/* <NavLink to="/payroll" className={linkClass}>
            <FiUser /> Payroll
          </NavLink> */}

          {/* Clients */}
          <NavLink to="/client-dashboard" className={linkClass}>
            <FiUser /> Client Dashboard
          </NavLink>

          <NavLink to="/clients" className={linkClass}>
            <FiUser /> Manage Clients
          </NavLink>

          {/* Asset Management */}
          <NavLink to="/asset-management" className={linkClass}>
            <FiUser /> Asset Management
          </NavLink>
          {/* <NavLink to="/chats" className={linkClass}>
            <FiMessageCircle/> <span>Chats</span>
          </NavLink> */}
          {/* CRM */}
           <NavLink to="/apps" className={linkClass}>
            <FiHome /> <span>Apps</span>
          </NavLink>
          <NavLink to="/charts" className={linkClass}>
           <FiPieChart /> <span>Charts</span>
          </NavLink>
          <NavLink to="/help" className={linkClass}>
            <FiHelpCircle /> Help Desk
          </NavLink>

         
        
          
        </div>
      </div>

      {/* ================= RIGHT SIDE ================= */}
      <div className="flex-1 ml-64 min-h-screen bg-gray-100 dark:bg-[#0b1220] transition-colors duration-300">
        {/* Header */}
        <div className="h-16 bg-white dark:bg-[#0b1220] border-b dark:border-[#243244] flex items-center justify-between px-6">
          {/* Left */}
          <div className="flex items-center gap-4">
            <FiMenu className="cursor-pointer text-gray-600 dark:text-gray-300" />

            <div className="relative">
              <FiSearch className="absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search"
                className="pl-10 pr-4 py-2 rounded-lg bg-gray-100 dark:bg-[#0b1220] text-gray-700 dark:text-white focus:outline-none w-64 dark:border dark:border-[#243244]"
              />
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-6">
            {/* Theme Toggle */}
            <div className="p-4 border-t dark:border-[#243244] flex items-center justify-between">
              <span className="flex items-center gap-2 text-gray-700 dark:text-white">
                {theme === "dark" ? <FiMoon /> : <FiSun />}
                {theme === "dark" ? "Dark" : "Light"}
              </span>

              <button
                onClick={toggleTheme}
                className="w-10 h-5 flex items-center gap-3 bg-gray-300 dark:bg-[#18a8e6] rounded-full p-1 transition-all duration-300"
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ${
                    theme === "dark" ? "translate-x-5" : ""
                  }`}
                />
              </button>
            </div>
            <FiSettings className="cursor-pointer text-gray-600 dark:text-gray-300" />
            <FiBell className="cursor-pointer text-gray-600 dark:text-gray-300" />
            <FiMail className="cursor-pointer text-gray-600 dark:text-gray-300" />

            <button className="bg-[#18a8e6] text-white px-4 py-1.5 rounded-lg">
              Logout
            </button>

            <div className="flex items-center gap-2">
              <img
                src="https://i.pravatar.cc/40"
                alt="Profile"
                className="w-8 h-8 rounded-full"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-white">
                Thomas Fleming
              </span>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

export default Sidebar;
