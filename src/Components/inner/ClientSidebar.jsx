import React from "react";
import {
  FiGrid,
  FiUsers,
  FiCheckSquare,
  FiDollarSign,
  FiClock,
  FiSettings,
  FiHelpCircle,
  FiMessageCircle,
   FiTrendingUp,
  FiFolder,
  FiCalendar,
  FiThumbsUp,
  FiBell,
} from "react-icons/fi";
import { NavLink } from "react-router-dom";

export default function ClientSidebar() {
  const menu = [
    {
      icon: <FiGrid size={18} />,
      label: "Dashboard",
      path: "/client/dashboard",
    },
    {
      icon: <FiUsers size={18} />,
      label: "Add Team",
      path: "/client/add-team",
    },
    {
      icon: <FiCheckSquare size={18} />,
      label: "Assign Task",
      path: "/client/assign-task",
    },
    {
      icon: <FiDollarSign size={18} />,
      label: "Finance",
      path: "/client/finance",
    },
    {
      icon: <FiClock size={18} />,
      label: "Hour Bucket",
      path: "/client/hour-bucket",
    },
    {
      icon: < FiTrendingUp size={18} />,
      label: "Project Progress",
      path: "/client/project-progress",
    },
      {
        icon: <FiFolder size={18} />,
        label: "Deliverables",  
        path: "/client/deliverables",
      },
      {
        icon: <FiCalendar size={18} />,
        label: "Timeline",  
        path: "/client/Timeline",
      },
       {
        icon: <FiMessageCircle size={18} />,
        label: "Chats",  
        path: "/client/chats",
      },
       {
        icon: <FiThumbsUp size={18} />,
        label: "Feedback",  
        path: "/client/feedback",
      },
      // {
      //   icon: <FiBell size={18} />,
      //   label: "Notification",  
      //   path: "/client/Notification",
      // },

      
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-[#0B1220] border-r border-[#243244] flex flex-col">

      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-[#243244]">
        <div className="h-10 w-10 rounded-lg bg-[#18A8E6] flex items-center justify-center text-white font-bold">
          C
        </div>

        <span className="ml-3 text-white font-semibold text-lg">
          Client Panel
        </span>
      </div>

      {/* Scrollable Menu */}
  <nav className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-thin scrollbar-thumb-[#18A8E6] scrollbar-track-[#0B1220]">

    {menu.map((item) => (
      <NavLink
        key={item.label}
        to={item.path}
        className={({ isActive }) =>
          `flex items-center gap-3 px-4 py-1 rounded-lg transition-all ${
            isActive
              ? "bg-[#18A8E6] text-white"
              : "text-gray-400 hover:bg-[#172235] hover:text-white"
          }`
        }
      >
        {item.icon}
        <span>{item.label}</span>
      </NavLink>
    ))}

  </nav>

      {/* Footer */}
      <div className="border-t border-[#243244] p-4 space-y-2">

        <button className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-gray-400 hover:bg-[#172235] hover:text-white transition">
          <FiSettings />
          Settings
        </button>

        <button className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-gray-400 hover:bg-[#172235] hover:text-white transition">
          <FiHelpCircle />
          Help & Support
        </button>

      </div>
    </aside>
  );
}