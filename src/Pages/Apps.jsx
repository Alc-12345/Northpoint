import React, { useState } from "react";
import {
  FiCalendar,
  FiMessageSquare,
  FiMail,
  FiCheckSquare,
  FiFolder,
  FiUsers,
  FiBell,
  FiFileText,
  FiArrowLeft,
} from "react-icons/fi";

const Apps = () => {
  const [activeApp, setActiveApp] = useState(null);

  const apps = [
    {
      title: "Calendar",
      key: "calendar",
      desc: "Schedule meetings & events",
      icon: <FiCalendar size={28} />,
      color: "from-blue-500 to-blue-700",
    },
    {
      title: "Team Chat",
      key: "chat",
      desc: "Communicate with your team",
      icon: <FiMessageSquare size={28} />,
      color: "from-green-500 to-green-700",
    },
    {
      title: "Email",
      key: "email",
      desc: "Manage company emails",
      icon: <FiMail size={28} />,
      color: "from-purple-500 to-purple-700",
    },
    {
      title: "Tasks",
      key: "tasks",
      desc: "Track daily tasks",
      icon: <FiCheckSquare size={28} />,
      color: "from-orange-500 to-orange-700",
    },
    {
      title: "File Manager",
      key: "files",
      desc: "Manage documents & files",
      icon: <FiFolder size={28} />,
      color: "from-pink-500 to-pink-700",
    },
    {
      title: "Contacts",
      key: "contacts",
      desc: "Team & client contacts",
      icon: <FiUsers size={28} />,
      color: "from-indigo-500 to-indigo-700",
    },
    {
      title: "Notifications",
      key: "notifications",
      desc: "System alerts & updates",
      icon: <FiBell size={28} />,
      color: "from-red-500 to-red-700",
    },
    {
      title: "Documents",
      key: "documents",
      desc: "Reports & company docs",
      icon: <FiFileText size={28} />,
      color: "from-teal-500 to-teal-700",
    },
  ];

  // ---------------- OPEN APP ----------------

  if (activeApp) {
    return (
      <div>
        <button
          onClick={() => setActiveApp(null)}
          className="flex items-center gap-2 mb-6 text-blue-600 font-medium"
        >
          <FiArrowLeft /> Back to Apps
        </button>

        <div className="bg-white dark:bg-[#2A2A2A] rounded-xl shadow p-10 text-center">
          <h1 className="text-2xl font-bold mb-4 capitalize">
            {activeApp} Module
          </h1>

          <p className="text-gray-500">
            This is the {activeApp} module interface.
          </p>
        </div>
      </div>
    );
  }

  // ---------------- APPS GRID ----------------

  return (
    <div>
      {/* Page Title */}

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Apps
        </h1>
        <p className="text-gray-500 text-sm">
          Quick access to productivity applications
        </p>
      </div>

      {/* Cards */}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {apps.map((app) => (
          <div
            key={app.key}
            onClick={() => setActiveApp(app.key)}
            className="group bg-white dark:bg-[#2A2A2A] rounded-xl shadow hover:shadow-xl transition duration-300 cursor-pointer p-6 relative overflow-hidden"
          >
            {/* Gradient Icon */}

            <div
              className={`w-12 h-12 flex items-center justify-center rounded-lg text-white bg-gradient-to-r ${app.color} mb-4`}
            >
              {app.icon}
            </div>

            {/* Title */}

            <h2 className="font-semibold text-lg text-gray-800 dark:text-white">
              {app.title}
            </h2>

            {/* Description */}

            <p className="text-sm text-gray-500 mt-1">{app.desc}</p>

            {/* Hover Effect */}

            <div className="absolute inset-0 bg-blue-600 opacity-0 group-hover:opacity-5 transition"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Apps;
