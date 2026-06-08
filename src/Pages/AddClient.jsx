import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddClient() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    industry: "",
    contact: "",
    email: "",
    phone: "",
    status: "Active",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("New Client:", formData);

    // 🔥 Later connect to backend API here

    navigate("/clients"); // Redirect back to client list
  };

  return (
    <div className="p-6 bg-gray-100 dark:bg-[#121212] min-h-screen text-gray-800 dark:text-gray-200">
      <h2 className="text-2xl font-bold mb-6">Add New Client</h2>

      <div className="bg-white dark:bg-[#0b1220] p-6 rounded-xl shadow border border-gray-200 dark:border-[#243244] max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Company Name */}
          <div>
            <label className="block text-sm mb-1">Company Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-[#2a2a2a] border-gray-300 dark:border-gray-600"
            />
          </div>

          {/* Industry */}
          <div>
            <label className="block text-sm mb-1">Industry</label>
            <input
              type="text"
              name="industry"
              value={formData.industry}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-[#2a2a2a] border-gray-300 dark:border-gray-600"
            />
          </div>

          {/* Contact Person */}
          <div>
            <label className="block text-sm mb-1">Contact Person</label>
            <input
              type="text"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-[#2a2a2a] border-gray-300 dark:border-gray-600"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm mb-1">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-[#2a2a2a] border-gray-300 dark:border-gray-600"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm mb-1">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-[#2a2a2a] border-gray-300 dark:border-gray-600"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm mb-1">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-[#2a2a2a] border-gray-300 dark:border-gray-600"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate("/clients")}
              className="px-4 py-2 border rounded-lg border-gray-300 dark:border-gray-600"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Save Client
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
