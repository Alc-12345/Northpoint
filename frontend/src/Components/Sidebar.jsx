import { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  FiHome,
  FiUsers,
  FiDollarSign,
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
  FiHelpCircle,
  FiCalendar,
  FiLogOut,
  FiBookOpen,
} from "react-icons/fi";
import logo from "../assets/Logo.png"; // Adjust the path to your logo image
import "../navigation.css";
import { logout } from "../utils/auth";
import { canUseFinance } from "../utils/financeAccess";

const Sidebar = ({ children }) => {
const { pathname } = useLocation();
const financeAllowed = canUseFinance();
const routeMenu = pathname.startsWith("/employees") || pathname === "/payroll" ? "employees" : pathname.startsWith("/projects") || ["/add-project", "/assign-project", "/add-teams"].includes(pathname) ? "projects" : pathname.startsWith("/hr/") ? "hr" : null;
const [activeMenu, setActiveMenu] = useState(routeMenu);
  const [collapsed, setCollapsed] = useState(() => window.innerWidth <= 700);
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();


  // Apply theme
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const update = event => setTheme(event.detail.theme);
    window.addEventListener("northpoint:preferences", update);
    return () => window.removeEventListener("northpoint:preferences", update);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };
  const handleLogout = () => {
    logout(navigate);
  };
  const toggleMenu = (menu) => {
  if (collapsed) setCollapsed(false);
  setActiveMenu(activeMenu === menu ? null : menu);
};

  const linkClass =
    "flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200";
  const activeClass = "bg-[#18a8e6] text-white";

  return (
    <div className={`nav-shell flex ${collapsed ? "nav-collapsed" : "nav-expanded"}`}>
      {/* ================= LEFT SIDEBAR ================= */}
      <div className="nav-rail w-64 h-screen fixed left-0 top-0 bg-white dark:bg-[#0b1220] text-gray-700 dark:text-slate-300 border-r dark:border-[#18a8e6]/50 flex flex-col transition-colors duration-300">
        {/* Logo */}
        <NavLink to="/" className="nav-brand" aria-label="Northpoint dashboard">
          <img src={logo} alt="" className="nav-brand-logo" />
          <div className="nav-brand-copy"><strong>Northpoint</strong><span>Admin workspace</span></div>
        </NavLink>
        {/* <div className="px-5 pt-3 h-16 border-b dark:border-[#243244]">
        
          <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-white">
            <span className="text-[#18a8e6]">CRM</span>
          </h1>
        </div> */}

        {/* Scrollable Menu */}
        <div className="nav-menu flex-1 overflow-y-auto px-4 py-4 space-y-2">
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

          {[
            { key: "employees", label: "Employees", icon: <FiUsers />, links: [["Attendance", "/employees/attendance"], ["Add Employee", "/employees/add"], ["Salary", "/payroll"]] },
            { key: "projects", label: "Projects", icon: <FiFolder />, links: [["Add Project", "/projects"], ["Assign Project", "/assign-project"], ["Progress", "/projects/progress"]] },
            { key: "hr", label: "HR", icon: <FiFileText />, links: [["Locker", "/hr/locker"], ["Internship", "/hr/internship"], ["Offer Letter", "/hr/offer-letter"], ["Quotation", "/hr/quotation"], ["Commercials", "/hr/commercials"], ["Experience Letter", "/hr/experience-letter"], ["Appointment Letter", "/hr/appointment-letter"], ["Letterhead", "/hr/letterhead"], ["Notepad", "/hr/notepad"]] },
          ].map(({ key, label, icon, links }) => (
            <div key={key}>
              <button type="button" onClick={() => toggleMenu(key)} aria-expanded={activeMenu === key}
                className="flex items-center justify-between w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                <span className="flex items-center gap-3">{icon} {label}</span>
                <FiChevronDown className={activeMenu === key ? "rotate-180" : ""} />
              </button>
              {activeMenu === key && <div className="nav-submenu ml-6 mt-2 space-y-1 text-sm">
                {links.filter(([, to]) => to !== "/payroll" || financeAllowed).map(([text, to]) => <NavLink key={to} to={to} end className={({ isActive }) => `block px-3 py-2 rounded ${isActive ? activeClass : "hover:bg-gray-100 dark:hover:bg-gray-800"}`}>{text}</NavLink>)}
              </div>}
            </div>
          ))}

          {financeAllowed && <div>
            <button
                onClick={() => toggleMenu("Finance")}
              className="flex items-center justify-between w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
            >
              <span className="flex items-center gap-3">
                <FiDollarSign /> Finance
              </span>
              <FiChevronDown
                  className={`transition-transform ${
                  activeMenu === "Finance" ? "rotate-180" : ""
                }`}
              />
            </button>
            {activeMenu === "Finance" && (
              <div className="nav-submenu ml-6 mt-2 space-y-1 text-sm">
                <NavLink
                  to="/client-billing-finance"
                  className="block px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                > Finance
                </NavLink>
                <NavLink to="/finance/invoices" className="block px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">Invoices</NavLink>
              </div>
            )}
            {activeMenu === "Finance" && (
              <div className="nav-submenu ml-6 mt-2 space-y-1 text-sm">
                <NavLink
                  to="/payroll"
                  className="block px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                >
                Salary
                 </NavLink>
              </div>
            )}
            
          </div>}

          

          <NavLink to="/documents" className={linkClass}><FiFileText /> Document distribution</NavLink>
          <NavLink to="/merge-pdf" className={({ isActive }) => `${linkClass} ${isActive ? activeClass : "hover:bg-gray-100 dark:hover:bg-gray-800"}`}><FiFileText /> Merge PDFs</NavLink>

          {/* Reports */}
          <NavLink to="/reports" className={linkClass}>
            <FiFileText /> Reports
          </NavLink>

          {/* <NavLink to="/payroll" className={linkClass}>
            <FiUser /> Payroll
          </NavLink> */}
          <NavLink to="/manage-calendar" className={linkClass}>
            <FiCalendar />Calendar
          </NavLink>

          <NavLink to="/clients" className={linkClass}>
            <FiUser /> Leads
          </NavLink>
          <NavLink to="/etl" className={linkClass}>
            <FiUser /> ETL
          </NavLink>
          <NavLink to="/training" className={linkClass}>
            <FiBookOpen /> Training Management
          </NavLink>
         
          {/* <NavLink to="/charts" className={linkClass}>
           <FiPieChart /> <span>Charts</span>
          </NavLink> */}
          <NavLink to="/help-desk" className={linkClass}>
            <FiHelpCircle /> Help Desk
          </NavLink>

         
        
          
        </div>
      </div>

      {/* ================= RIGHT SIDE ================= */}
      <div className="nav-content flex-1 ml-64 min-h-screen bg-gray-100 dark:bg-[#0b1220] transition-colors duration-300">
        {/* Header */}
        <div className="nav-header h-16 bg-white dark:bg-[#0b1220] border-b dark:border-[#243244] flex items-center justify-between px-6">
          {/* Left */}
          <div className="flex items-center gap-4">
            <button type="button" className="nav-icon-button" aria-label={collapsed ? "Expand navigation" : "Collapse navigation"} aria-expanded={!collapsed} onClick={() => setCollapsed(!collapsed)}><FiMenu /></button>
          

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
          <div className="nav-actions flex items-center gap-6">
            {/* Theme Toggle */}
            <div className="nav-theme-toggle flex items-center justify-between gap-2">
              <span className="flex items-center gap-5 text-gray-700 dark:text-white">
                {theme === "dark" ? <FiMoon /> : <FiSun />}
                {/* {theme === "dark" ? "Dark" : "Light"} */}
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
            <FiSettings 
              onClick={() => navigate("/settings")}
              className="cursor-pointer text-gray-600 dark:text-gray-300 hover:text-[#18a8e6] transition" 
            />
            <FiBell 
              onClick={() => navigate("/notifications")}
              className="cursor-pointer text-gray-600 dark:text-gray-300 hover:text-[#18a8e6] transition" 
            />
            <FiMail className="cursor-pointer text-gray-600 dark:text-gray-300" />

            <button
              type="button"
              onClick={handleLogout}
              className="nav-logout bg-[#18a8e6] text-white px-4 py-1.5 rounded-lg flex items-center gap-2"
            >
              <FiLogOut />
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
        <div className="nav-page p-6">{children}</div>
      </div>
    </div>
  );
};

export default Sidebar;
