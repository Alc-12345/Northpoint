import React from "react";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiBriefcase,
  FiCode,
  FiEdit,
} from "react-icons/fi";

const EmployeeProfile = () => {
  const employee = {
    name: "Rahul Sharma",
    role: "Frontend Developer",
    email: "rahul@company.com",
    phone: "+91 9876543210",
    location: "Jaipur, India",
    department: "Development",
    experience: "3 Years",
    skills: ["React", "JavaScript", "Tailwind", "Node.js"],
    projects: 12,
    tasksCompleted: 86,
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen dark:bg-gray-900">
      {/* Page Title */}
      <h1 className="text-2xl font-bold mb-6 dark:text-white">
        Employee Profile
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Profile Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
          <div className="flex flex-col items-center text-center">

            <img
              src="https://i.pravatar.cc/150?img=12"
              alt="profile"
              className="w-28 h-28 rounded-full mb-4"
            />

            <h2 className="text-xl font-semibold dark:text-white">
              {employee.name}
            </h2>

            <p className="text-gray-500">{employee.role}</p>

            <button className="mt-4 flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              <FiEdit />
              Edit Profile
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mt-6 text-center">

            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
              <h3 className="text-lg font-bold dark:text-white">
                {employee.projects}
              </h3>
              <p className="text-sm text-gray-500">Projects</p>
            </div>

            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
              <h3 className="text-lg font-bold dark:text-white">
                {employee.tasksCompleted}
              </h3>
              <p className="text-sm text-gray-500">Tasks Done</p>
            </div>

          </div>
        </div>

        {/* Details Section */}
        <div className="lg:col-span-2 space-y-6">

          {/* Personal Info */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold mb-4 dark:text-white">
              Personal Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div className="flex items-center gap-3">
                <FiUser className="text-blue-600" />
                <span className="dark:text-gray-300">
                  {employee.name}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <FiBriefcase className="text-green-600" />
                <span className="dark:text-gray-300">
                  {employee.department}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <FiMail className="text-purple-600" />
                <span className="dark:text-gray-300">
                  {employee.email}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <FiPhone className="text-red-600" />
                <span className="dark:text-gray-300">
                  {employee.phone}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <FiMapPin className="text-orange-600" />
                <span className="dark:text-gray-300">
                  {employee.location}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <FiBriefcase className="text-indigo-600" />
                <span className="dark:text-gray-300">
                  {employee.experience} Experience
                </span>
              </div>

            </div>
          </div>

          {/* Skills Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold mb-4 dark:text-white">
              Tech Stack / Skills
            </h2>

            <div className="flex flex-wrap gap-3">

              {employee.skills.map((skill, index) => (
                <span
                  key={index}
                  className="flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                >
                  <FiCode />
                  {skill}
                </span>
              ))}

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default EmployeeProfile;
