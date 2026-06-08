import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddEmployee() {
  const navigate = useNavigate();

  const inputClass =
    "w-full border border-gray-200 dark:border-[#243244] " +
    "bg-white dark:bg-[#0b1220] text-gray-800 dark:text-white " +
    "px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500";

  const labelClass =
    "block text-sm font-medium mb-1 text-gray-600 dark:text-gray-300";

  const sectionTitle =
    "text-lg font-semibold text-gray-800 dark:text-white border-b border-gray-200 dark:border-[#243244] pb-2 mb-4";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    role: "",
    project: "",
    salary: "",
    joiningDate: "",
    skills: "",
    status: "Active",
    photo: null,
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setFormData({
        ...formData,
        photo: file,
      });
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    navigate("/employees");
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#0b1220] p-8">
      <div className="max-w-5xl mx-auto bg-white dark:bg-[#0b1220] border border-gray-200 dark:border-[#243244] rounded-xl shadow-sm p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Add New Employee
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          {/* ================= BASIC INFO ================= */}
          <div>
            <h2 className={sectionTitle}>Basic Information</h2>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>Full Name *</label>
                <input
                  type="text"
                  name="name"
                  required
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Email *</label>
                <input
                  type="email"
                  name="email"
                  required
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Phone</label>
                <input
                  type="text"
                  name="phone"
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Department</label>
                <input
                  type="text"
                  name="department"
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* ================= ROLE & PROJECT ================= */}
          <div>
            <h2 className={sectionTitle}>Role & Project Assignment</h2>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>Role</label>
                <input
                  type="text"
                  name="role"
                  placeholder="Frontend Developer"
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Assign Project</label>
                <input
                  type="text"
                  name="project"
                  placeholder="ERP System"
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* ================= SALARY ================= */}
          <div>
            <h2 className={sectionTitle}>Salary & Status</h2>

            <div className="grid grid-cols-3 gap-6">
              <div>
                <label className={labelClass}>Salary (₹)</label>
                <input
                  type="number"
                  name="salary"
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Joining Date</label>
                <input
                  type="date"
                  name="joiningDate"
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Status</label>
                <select
                  name="status"
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option>Active</option>
                  <option>On Leave</option>
                  <option>Resigned</option>
                </select>
              </div>
            </div>
          </div>

          {/* ================= SKILLS ================= */}
          <div>
            <h2 className={sectionTitle}>Skills</h2>

            <textarea
              name="skills"
              rows="4"
              placeholder="React, Node.js, MongoDB"
              onChange={handleChange}
              className={inputClass}
            ></textarea>
          </div>
          {/* ================= PHOTO UPLOAD ================= */}
          <div>
            <h2 className={sectionTitle}>Employee Photo</h2>

            <div className="flex items-center gap-6">
              {/* Preview */}
              <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden border">
                {formData.photo ? (
                  <img
                    src={URL.createObjectURL(formData.photo)}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-sm text-gray-500">
                    No Photo
                  </div>
                )}
              </div>

              {/* Upload Button */}
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="block text-sm text-gray-600 dark:text-gray-300"
                />
              </div>
            </div>
          </div>

          {/* ================= BUTTONS ================= */}
          <div className="flex justify-end gap-4 pt-4 border-t border-gray-200 dark:border-[#243244]">
            <button
              type="button"
              onClick={() => navigate("/employees/all")}
              className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Create Employee
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
