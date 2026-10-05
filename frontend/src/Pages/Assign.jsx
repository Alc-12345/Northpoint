import { useState } from "react";
import { FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function AssignLaptopPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    employee: "",
    department: "",
    deviceName: "",
    brand: "",
    serialNumber: "",
    condition: "New",
    assignDate: "",
    expectedReturn: "",
    status: "Assigned",
    remarks: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Assign Laptop Data:", formData);

    // TODO: Connect API here
    navigate("/assets"); 
  };

  return (
    <div className="p-6 bg-gray-100 dark:bg-[#121212] min-h-screen text-gray-800 dark:text-gray-200">

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg border dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-[#2a2a2a]"
        >
          <FiArrowLeft />
        </button>
        <h2 className="text-2xl font-bold">
          Assign Laptop to Employee
        </h2>
      </div>

      {/* Form Card */}
      <div className="bg-white dark:bg-[#0b1220] p-6 rounded-xl shadow-sm border border-gray-200 dark:border-[#243244] max-w-4xl">

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Employee Name */}
          <div>
            <label className="block text-sm mb-1">Employee Name</label>
            <input
              type="text"
              name="employee"
              value={formData.employee}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-[#2a2a2a] border-gray-300 dark:border-gray-600"
            />
          </div>

          {/* Department */}
          <div>
            <label className="block text-sm mb-1">Department</label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-[#2a2a2a] border-gray-300 dark:border-gray-600"
            >
              <option value="">Select Department</option>
              <option>Development</option>
              <option>QA</option>
              <option>Design</option>
              <option>HR</option>
              <option>Sales</option>
            </select>
          </div>

          {/* Device Name */}
          <div>
            <label className="block text-sm mb-1">Device Name</label>
            <input
              type="text"
              name="deviceName"
              value={formData.deviceName}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-[#2a2a2a] border-gray-300 dark:border-gray-600"
            />
          </div>

          {/* Brand */}
          <div>
            <label className="block text-sm mb-1">Brand</label>
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-[#2a2a2a] border-gray-300 dark:border-gray-600"
            />
          </div>

          {/* Serial Number */}
          <div>
            <label className="block text-sm mb-1">Serial Number</label>
            <input
              type="text"
              name="serialNumber"
              value={formData.serialNumber}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-[#2a2a2a] border-gray-300 dark:border-gray-600"
            />
          </div>

          {/* Condition */}
          <div>
            <label className="block text-sm mb-1">Device Condition</label>
            <select
              name="condition"
              value={formData.condition}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-[#2a2a2a] border-gray-300 dark:border-gray-600"
            >
              <option>New</option>
              <option>Good</option>
              <option>Used</option>
              <option>Repair</option>
            </select>
          </div>

          {/* Assign Date */}
          <div>
            <label className="block text-sm mb-1">Assign Date</label>
            <input
              type="date"
              name="assignDate"
              value={formData.assignDate}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-[#2a2a2a] border-gray-300 dark:border-gray-600"
            />
          </div>

          {/* Expected Return */}
          <div>
            <label className="block text-sm mb-1">Expected Return Date</label>
            <input
              type="date"
              name="expectedReturn"
              value={formData.expectedReturn}
              onChange={handleChange}
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
              <option>Assigned</option>
              <option>Returned</option>
              <option>Maintenance</option>
            </select>
          </div>

          {/* Remarks */}
          <div className="md:col-span-2">
            <label className="block text-sm mb-1">Remarks</label>
            <textarea
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              rows="3"
              className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-[#2a2a2a] border-gray-300 dark:border-gray-600"
            />
          </div>

          {/* Buttons */}
          <div className="md:col-span-2 flex justify-end gap-4 mt-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-5 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-[#2a2a2a]"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            >
              Assign Laptop
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
