import React from "react";
import { FiSearch, FiEdit, FiTrash2 } from "react-icons/fi";

const Tables = () => {
  const users = [
    {
      id: 1,
      name: "John Doe",
      email: "john@mail.com",
      role: "Admin",
      status: "Active",
    },
    {
      id: 2,
      name: "Sarah Smith",
      email: "sarah@mail.com",
      role: "Manager",
      status: "Active",
    },
    {
      id: 3,
      name: "Michael Lee",
      email: "michael@mail.com",
      role: "Developer",
      status: "Inactive",
    },
    {
      id: 4,
      name: "Emma Watson",
      email: "emma@mail.com",
      role: "Designer",
      status: "Active",
    },
    {
      id: 5,
      name: "David Miller",
      email: "david@mail.com",
      role: "HR",
      status: "Pending",
    },
    {
      id: 6,
      name: "Sophia Brown",
      email: "sophia@mail.com",
      role: "Support",
      status: "Active",
    },
  ];

  return (
    <div>
      {/* Page Title */}

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Users Table
          </h1>
          <p className="text-sm text-gray-500">
            Manage all users in the system
          </p>
        </div>

        {/* Search */}

        <div className="relative">
          <FiSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search user..."
            className="pl-10 pr-4 py-2 rounded-lg border bg-white dark:bg-[#2A2A2A] dark:border-[#243244]"
          />
        </div>
      </div>

      {/* Table */}

      <div className="bg-white dark:bg-[#2A2A2A] rounded-xl shadow overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-100 dark:bg-[#0b1220] text-gray-600 dark:text-gray-300 text-sm">
            <tr>
              <th className="p-4">ID</th>
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Role</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>

          <tbody className="text-gray-700 dark:text-gray-300">
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-t hover:bg-gray-50 dark:hover:bg-[#0b1220]"
              >
                <td className="p-4">{user.id}</td>

                <td className="p-4 font-medium">{user.name}</td>

                <td className="p-4">{user.email}</td>

                <td className="p-4">{user.role}</td>

                <td className="p-4">
                  <span
                    className={`px-3 py-1 text-xs rounded-full ${
                      user.status === "Active"
                        ? "bg-green-100 text-green-600"
                        : user.status === "Inactive"
                        ? "bg-red-100 text-red-600"
                        : "bg-yellow-100 text-yellow-600"
                    }`}
                  >
                    {user.status}
                  </span>
                </td>

                <td className="p-4 flex gap-3">
                  <button className="text-blue-500 hover:text-blue-700">
                    <FiEdit />
                  </button>

                  <button className="text-red-500 hover:text-red-700">
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}

      <div className="mt-4 text-sm text-gray-500">
        Showing 6 users
      </div>
    </div>
  );
};

export default Tables;
