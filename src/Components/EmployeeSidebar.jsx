import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FiHome,
  FiUser,
  FiFolder,
  FiCheckSquare,
  FiCalendar,
  FiClock,
  FiMessageCircle,
  FiBell,
  FiFileText,
  FiSettings,
  FiLogOut,
  FiSun,
  FiMoon,
  FiMenu,
  FiSearch
  ,FiCode
} from "react-icons/fi";
import { logout } from "../utils/auth";

const EmployeeSidebar = ({ children }) => {

  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // Apply theme
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleLogout = () => {
    logout(navigate);
  };

  const linkClass =
    "flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200";

  const activeClass = "bg-blue-600 text-white";

  return (
    <div className="flex">

      {/* ================= SIDEBAR ================= */}

      <div className="w-64 h-screen fixed left-0 top-0 bg-white dark:bg-[#0b1220] text-gray-700 dark:text-gray-300 border-r dark:border-[#243244] flex flex-col transition-colors duration-300">

        {/* Logo */}

        <div className="p-5 h-16 border-b dark:border-[#243244]">
          <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-white">
            <span className="text-blue-600">EMP</span> Panel
          </h1>
        </div>

        {/* Menu */}

        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">

          <NavLink
            to="/employee-dashboard"
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

          {/* <NavLink
            to="/employee-profile"
            className={({ isActive }) =>
              `${linkClass} ${
                isActive
                  ? activeClass
                  : "hover:bg-gray-100 dark:hover:bg-gray-800"
              }`
            }
          >
            <FiUser /> Profile
          </NavLink> */}

          <NavLink
            to="/employee-projects"
            className={({ isActive }) =>
              `${linkClass} ${
                isActive
                  ? activeClass
                  : "hover:bg-gray-100 dark:hover:bg-gray-800"
              }`
            }
          >
            <FiFolder /> Projects
          </NavLink>

          <NavLink
            to="/student/practice-lab"
            className={({ isActive }) => `${linkClass} ${isActive ? activeClass : "hover:bg-gray-100 dark:hover:bg-gray-800"}`}
          >
            <FiCode /> Practice Lab
          </NavLink>

          <NavLink
            to="/employee-teams"
            className={({ isActive }) =>
              `${linkClass} ${
                isActive
                  ? activeClass
                  : "hover:bg-gray-100 dark:hover:bg-gray-800"
              }`
            }
          >
            <FiUser /> Teams
          </NavLink>

          <NavLink
            to="/employee-tasks"
            className={({ isActive }) =>
              `${linkClass} ${
                isActive
                  ? activeClass
                  : "hover:bg-gray-100 dark:hover:bg-gray-800"
              }`
            }
          >
            <FiCheckSquare /> Tasks
          </NavLink>

          <NavLink
            to="/employee-calendar"
            className={({ isActive }) =>
              `${linkClass} ${
                isActive
                  ? activeClass
                  : "hover:bg-gray-100 dark:hover:bg-gray-800"
              }`
            }
          >
            <FiCalendar /> Calendar
          </NavLink>

          <NavLink
            to="/employee-attendance"
            className={({ isActive }) =>
              `${linkClass} ${
                isActive
                  ? activeClass
                  : "hover:bg-gray-100 dark:hover:bg-gray-800"
              }`
            }
          >
            <FiClock /> Attendance
          </NavLink>

          <NavLink
            to="/employee-leave"
            className={({ isActive }) =>
              `${linkClass} ${
                isActive
                  ? activeClass
                  : "hover:bg-gray-100 dark:hover:bg-gray-800"
              }`
            }
          >
            <FiFileText /> Leaves
          </NavLink>

          <NavLink
            to="/employee-messages"
            className={({ isActive }) =>
              `${linkClass} ${
                isActive
                  ? activeClass
                  : "hover:bg-gray-100 dark:hover:bg-gray-800"
              }`
            }
          >
            <FiMessageCircle /> Messages
          </NavLink>

          <NavLink
            to="/employee-notifications"
            className={({ isActive }) =>
              `${linkClass} ${
                isActive
                  ? activeClass
                  : "hover:bg-gray-100 dark:hover:bg-gray-800"
              }`
            }
          >
            <FiBell /> Notifications
          </NavLink>

          <NavLink
            to="/employee-documents"
            className={({ isActive }) =>
              `${linkClass} ${
                isActive
                  ? activeClass
                  : "hover:bg-gray-100 dark:hover:bg-gray-800"
              }`
            }
          >
            <FiFileText /> Documents
          </NavLink>

          <NavLink
            to="/employee-settings"
            className={({ isActive }) =>
              `${linkClass} ${
                isActive
                  ? activeClass
                  : "hover:bg-gray-100 dark:hover:bg-gray-800"
              }`
            }
          >
            <FiSettings /> Settings
          </NavLink>

        </div>

        {/* Logout */}

        <div className="p-4 border-t dark:border-[#243244]">
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-3 text-red-600 w-full hover:bg-red-100 dark:hover:bg-red-900 px-4 py-2 rounded-lg"
          >
            <FiLogOut />
            Logout
          </button>
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-lg bg-gray-100 dark:bg-[#0b1220] text-gray-700 dark:text-white focus:outline-none w-64 dark:border dark:border-[#243244]"
              />
            </div>

          </div>

          {/* Right */}

          <div className="flex items-center gap-6">

            {/* Theme Toggle */}

            <div className="flex items-center gap-2 text-gray-700 dark:text-white">
              {theme === "dark" ? <FiMoon /> : <FiSun />}
            </div>

            <button
              onClick={toggleTheme}
              className="w-10 h-5 flex items-center bg-gray-300 dark:bg-blue-600 rounded-full p-1 transition-all"
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ${
                  theme === "dark" ? "translate-x-5" : ""
                }`}
              />
            </button>

            <FiBell 
              onClick={() => navigate("/employee-notifications")}
              className="cursor-pointer text-gray-600 dark:text-gray-300 hover:text-blue-600 transition" 
            />

            <img
              src="https://i.pravatar.cc/40"
              alt="profile"
              className="w-8 h-8 rounded-full"
            />

          </div>

        </div>

        {/* Page Content */}

        <div className="p-6">{children}</div>

      </div>

    </div>
  );
};

export default EmployeeSidebar;
