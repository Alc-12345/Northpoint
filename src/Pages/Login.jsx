import React, { useState } from "react";
<<<<<<< Updated upstream
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
=======
<<<<<<< HEAD
import { FiMail, FiLock, FiLogIn } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { authApi } from "../services/api";

export default function EmployeeLogin() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dashboardByRole = {
    superadmin: "/",
    employee: "/employee-dashboard",
    client: "/client/dashboard",
  };

  const handleChange = (e) => {
    setError("");
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError("");
      setIsSubmitting(true);

      const data = await authApi.login(form);

      localStorage.setItem("authToken", data.token);
      localStorage.setItem("authUser", JSON.stringify(data.user));

      navigate(dashboardByRole[data.user?.role] || "/employee-dashboard", {
        replace: true,
      });
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
=======
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
>>>>>>> 2a029920a1dd6c46449b0ceed2e7563687156bf6
>>>>>>> Stashed changes

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

<<<<<<< Updated upstream
=======
<<<<<<< HEAD
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {error}
              </div>
            )}
=======
>>>>>>> Stashed changes
        {/* Email */}
        <div className="mb-5">
          <label className="text-gray-300 text-sm mb-2 block">
            Email Address
          </label>
<<<<<<< Updated upstream
=======
>>>>>>> 2a029920a1dd6c46449b0ceed2e7563687156bf6
>>>>>>> Stashed changes

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
<<<<<<< Updated upstream
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
=======
<<<<<<< HEAD
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-500/60 transition-all py-3 rounded-lg text-white font-semibold flex justify-center items-center gap-2"
            >
              <FiLogIn size={18} />
              {isSubmitting ? "Logging in..." : "Login"}
=======
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
>>>>>>> Stashed changes
              {showPassword ? (
                <FiEyeOff className="text-gray-400 text-xl" />
              ) : (
                <FiEye className="text-gray-400 text-xl" />
              )}
<<<<<<< Updated upstream
=======
>>>>>>> 2a029920a1dd6c46449b0ceed2e7563687156bf6
>>>>>>> Stashed changes
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
