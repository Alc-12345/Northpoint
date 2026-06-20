import React, { useState } from "react";
import { FiMail, FiLock, FiLogIn } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function EmployeeLogin() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(form);

    // API Call Here

    navigate("/employee/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#0b1220] flex items-center justify-center px-5">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="h-20 w-20 rounded-full bg-blue-600 flex items-center justify-center mx-auto text-3xl font-bold text-white shadow-lg">
            E
          </div>

          <h1 className="text-white text-3xl font-bold mt-5">
            Employee Login
          </h1>

          <p className="text-gray-400 mt-2">
            Login to access your dashboard
          </p>
        </div>

        {/* Card */}

        <div className="bg-[#111827] rounded-2xl p-8 shadow-2xl border border-gray-800">

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Email */}

            <div>
              <label className="text-gray-300 text-sm mb-2 block">
                Email Address
              </label>

              <div className="flex items-center bg-[#1f2937] rounded-lg px-4 border border-gray-700">

                <FiMail className="text-gray-400" />

                <input
                  type="email"
                  name="email"
                  placeholder="Enter Email"
                  value={form.email}
                  onChange={handleChange}
                  className="
    w-full
    bg-transparent
    text-white
    placeholder:text-gray-400
    p-3
    outline-none
    border-none
    autofill:bg-transparent
  "
                  required
                />
              </div>
            </div>

            {/* Password */}

            <div>
              <label className="text-gray-300 text-sm mb-2 block">
                Password
              </label>

              <div className="flex items-center bg-[#1f2937] rounded-lg px-4 border border-gray-700">

                <FiLock className="text-gray-400" />

                <input
                  type="password"
                  name="password"
                  placeholder="Enter Password"
                  value={form.password}
                  onChange={handleChange}
                  className="
    w-full
    bg-transparent
    text-white
    placeholder:text-gray-400
    p-3
    outline-none
    border-none
    autofill:bg-transparent
  "
                  required
                />
              </div>
            </div>

            {/* Remember */}

            <div className="flex justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-400">
                <input type="checkbox" />
                Remember Me
              </label>

              <button
                type="button"
                className="text-blue-400 hover:text-blue-500"
              >
                Forgot Password?
              </button>
            </div>

            {/* Login */}

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 transition-all py-3 rounded-lg text-white font-semibold flex justify-center items-center gap-2"
            >
              <FiLogIn size={18} />
              Login
            </button>
          </form>

          <div className="mt-6 text-center text-gray-500 text-sm">
            © 2026 Employee Management System
          </div>
        </div>
      </div>
    </div>
  );
}