import React from "react";
import { FiUser, FiMail, FiBriefcase } from "react-icons/fi";

const Forms = () => {
  return (
    <div>
      {/* Page Header */}

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Forms
        </h1>
        <p className="text-sm text-gray-500">
          Manage forms for employees, clients and projects
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Add Employee Form */}

        <div className="bg-white dark:bg-[#2A2A2A] p-6 rounded-xl shadow">
          <h2 className="font-semibold mb-4 flex items-center gap-2 text-gray-800 dark:text-white">
            <FiUser /> Add Employee
          </h2>

          <form className="space-y-4">
            <input
              type="text"
              placeholder="Employee Name"
              className="w-full border dark:border-[#243244] p-2 rounded bg-transparent"
            />

            <input
              type="email"
              placeholder="Email"
              className="w-full border dark:border-[#243244] p-2 rounded bg-transparent"
            />

            <input
              type="text"
              placeholder="Position"
              className="w-full border dark:border-[#243244] p-2 rounded bg-transparent"
            />

            <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
              Add Employee
            </button>
          </form>
        </div>

        {/* Add Client Form */}

        <div className="bg-white dark:bg-[#2A2A2A] p-6 rounded-xl shadow">
          <h2 className="font-semibold mb-4 flex items-center gap-2 text-gray-800 dark:text-white">
            <FiMail /> Add Client
          </h2>

          <form className="space-y-4">
            <input
              type="text"
              placeholder="Client Name"
              className="w-full border dark:border-[#243244] p-2 rounded bg-transparent"
            />

            <input
              type="email"
              placeholder="Client Email"
              className="w-full border dark:border-[#243244] p-2 rounded bg-transparent"
            />

            <input
              type="text"
              placeholder="Company Name"
              className="w-full border dark:border-[#243244] p-2 rounded bg-transparent"
            />

            <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
              Add Client
            </button>
          </form>
        </div>

        {/* Create Project Form */}

        <div className="bg-white dark:bg-[#2A2A2A] p-6 rounded-xl shadow">
          <h2 className="font-semibold mb-4 flex items-center gap-2 text-gray-800 dark:text-white">
            <FiBriefcase /> Create Project
          </h2>

          <form className="space-y-4">
            <input
              type="text"
              placeholder="Project Name"
              className="w-full border dark:border-[#243244] p-2 rounded bg-transparent"
            />

            <input
              type="text"
              placeholder="Client Name"
              className="w-full border dark:border-[#243244] p-2 rounded bg-transparent"
            />

            <textarea
              placeholder="Project Description"
              className="w-full border dark:border-[#243244] p-2 rounded bg-transparent"
            ></textarea>

            <button className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700">
              Create Project
            </button>
          </form>
        </div>
      </div>

      {/* Contact Form Section */}

      <div className="mt-8 bg-white dark:bg-[#2A2A2A] p-6 rounded-xl shadow max-w-2xl">
        <h2 className="font-semibold mb-4 text-gray-800 dark:text-white">
          Contact Support
        </h2>

        <form className="space-y-4">
          <input
            type="text"
            placeholder="Your Name"
            className="w-full border dark:border-[#243244] p-2 rounded bg-transparent"
          />

          <input
            type="email"
            placeholder="Your Email"
            className="w-full border dark:border-[#243244] p-2 rounded bg-transparent"
          />

          <textarea
            placeholder="Your Message"
            className="w-full border dark:border-[#243244] p-2 rounded bg-transparent"
          ></textarea>

          <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default Forms;
