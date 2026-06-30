import React, { useState } from "react";
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiShield,
} from "react-icons/fi";
import logo from "../assets/logo.png"; // Adjust the path to your logo image

export default function AdminLogin() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-[#0b1220] flex items-center justify-center relative overflow-hidden">

      {/* Background Blur */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600/20 rounded-full blur-[140px]" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/20 rounded-full blur-[140px]" />

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl p-8">

        {/* Logo */}
        <div className="flex justify-center mb-5">
          
            <img src={logo} alt="Logo" className="w-20 h-45" />
         
        </div>


        <p className="text-center text-gray-400 mt-2 mb-8">
          Welcome Back! Please login to continue.
        </p>

        {/* Email */}
        <div className="mb-5">
          <label className="text-gray-300 text-sm mb-2 block">
            Email Address
          </label>

          <div className="flex items-center bg-[#111827] border border-gray-700 rounded-xl px-4 h-14">
            <FiMail className="text-gray-400 text-xl" />
            <input
              type="email"
              placeholder="admin@example.com"
              className="flex-1 bg-transparent outline-none text-white px-3 placeholder-gray-500"
            />
          </div>
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="text-gray-300 text-sm mb-2 block">
            Password
          </label>

          <div className="flex items-center bg-[#111827] border border-gray-700 rounded-xl px-4 h-14">
            <FiLock className="text-gray-400 text-xl" />

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter Password"
              className="flex-1 bg-transparent outline-none text-white px-3 placeholder-gray-500"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <FiEyeOff className="text-gray-400 text-xl" />
              ) : (
                <FiEye className="text-gray-400 text-xl" />
              )}
            </button>
          </div>
        </div>

        {/* Login Button */}
        <button
          className="w-full h-14 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500
          hover:from-blue-700 hover:to-cyan-600
          text-white font-semibold text-lg transition-all duration-300
          shadow-lg hover:shadow-cyan-500/30"
        >
          Login
        </button>

        {/* Footer */}
        <p className="text-center text-gray-500 text-sm mt-8">
          © 2026 Admin Dashboard
        </p>
      </div>
    </div>
  );
}