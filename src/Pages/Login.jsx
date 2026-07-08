import React, { useState } from "react";
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiLogIn,
  FiShield,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { authApi } from "../services/api";
import logo from "../assets/Logo.png";

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
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
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
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

  return (
    <div className="min-h-screen bg-[#0b1220] flex items-center justify-center relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600/20 rounded-full blur-[140px]" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/20 rounded-full blur-[140px]" />

      <div className="relative z-10 w-full max-w-md rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl p-8">
        <div className="flex justify-center mb-5">
          <img src={logo} alt="Logo" className="w-20 h-20 object-contain" />
        </div>

        <div className="flex items-center justify-center gap-2 mb-2 text-cyan-300">
          <FiShield size={18} />
          <p className="text-sm font-semibold uppercase tracking-[0.3em]">
            Secure Access
          </p>
        </div>

        <p className="text-center text-gray-400 mt-2 mb-8">
          Welcome Back! Please login to continue.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}

          <div className="mb-5">
            <label className="text-gray-300 text-sm mb-2 block">
              Email Address
            </label>

            <div className="flex items-center bg-[#111827] border border-gray-700 rounded-xl px-4 h-14">
              <FiMail className="text-gray-400 text-xl" />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="admin@example.com"
                className="flex-1 bg-transparent outline-none text-white px-3 placeholder-gray-500"
                required
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="text-gray-300 text-sm mb-2 block">
              Password
            </label>

            <div className="flex items-center bg-[#111827] border border-gray-700 rounded-xl px-4 h-14">
              <FiLock className="text-gray-400 text-xl" />

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter Password"
                className="flex-1 bg-transparent outline-none text-white px-3 placeholder-gray-500"
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="ml-2"
              >
                {showPassword ? (
                  <FiEyeOff className="text-gray-400 text-xl" />
                ) : (
                  <FiEye className="text-gray-400 text-xl" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-14 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-cyan-500/30 disabled:cursor-not-allowed disabled:bg-blue-500/60 flex items-center justify-center gap-2"
          >
            <FiLogIn size={18} />
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-8">
          © 2026 Admin Dashboard
        </p>
      </div>
    </div>
  );
}
