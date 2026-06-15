import React, { useState } from "react";
import {
  FiClock,
  FiUser,
  FiClipboard,
  FiCalendar,
  FiFileText,
  FiPlusCircle,
} from "react-icons/fi";

export default function HourBucketRequest() {
  const [formData, setFormData] = useState({
    task: "",
    // assignedTo: "",
    currentHours: "",
    requestedHours: "",
    reason: "",
    deadline: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(formData);

    alert("Hour Bucket Request Submitted Successfully!");

    setFormData({
      task: "",
    //   assignedTo: "",
      currentHours: "",
      requestedHours: "",
      reason: "",
      deadline: "",
    });
  };

  return (
    <div className="min-h-screen bg-[#0B1220] p-6">
      {/* Header */}

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white">
          Hour Bucket Request
        </h1>

        <p className="text-gray-400 mt-1">
          Request additional hours for project tasks
        </p>
      </div>

      {/* Form */}

      <div className="max-w-5xl mx-auto bg-[#111C2D] border border-[#243244] rounded-xl p-8">

        <form onSubmit={handleSubmit}>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Task */}

            <div>
              <label className="text-gray-300 text-sm mb-2 block">
                Task Name
              </label>

              <div className="relative">
                <FiClipboard className="absolute left-3 top-3 text-gray-400" />

                <input
                  type="text"
                  name="task"
                  value={formData.task}
                  onChange={handleChange}
                  placeholder="Enter Task Name"
                  className="w-full bg-[#0B1220] border border-[#243244] rounded-lg pl-10 pr-4 py-3 text-white outline-none"
                  required
                />
              </div>
            </div>

            {/* Assigned */}
{/* 
            <div>
              <label className="text-gray-300 text-sm mb-2 block">
                Assigned Developer
              </label>

              <div className="relative">
                <FiUser className="absolute left-3 top-3 text-gray-400" />

                <input
                  type="text"
                  name="assignedTo"
                  value={formData.assignedTo}
                  onChange={handleChange}
                  placeholder="Developer Name"
                  className="w-full bg-[#0B1220] border border-[#243244] rounded-lg pl-10 pr-4 py-3 text-white outline-none"
                />
              </div>
            </div> */}

            {/* Current Hours */}

            <div>
              <label className="text-gray-300 text-sm mb-2 block">
                Current Hour Bucket
              </label>

              <div className="relative">
                <FiClock className="absolute left-3 top-3 text-gray-400" />

                <input
                  type="number"
                  name="currentHours"
                  value={formData.currentHours}
                  onChange={handleChange}
                  placeholder="Ex: 20"
                  className="w-full bg-[#0B1220] border border-[#243244] rounded-lg pl-10 pr-4 py-3 text-white outline-none"
                  required
                />
              </div>
            </div>

            {/* Requested Hours */}

            <div>
              <label className="text-gray-300 text-sm mb-2 block">
                Additional Hours Required
              </label>

              <div className="relative">
                <FiPlusCircle className="absolute left-3 top-3 text-gray-400" />

                <input
                  type="number"
                  name="requestedHours"
                  value={formData.requestedHours}
                  onChange={handleChange}
                  placeholder="Ex: 8"
                  className="w-full bg-[#0B1220] border border-[#243244] rounded-lg pl-10 pr-4 py-3 text-white outline-none"
                  required
                />
              </div>
            </div>

            {/* Deadline */}

            <div>
              <label className="text-gray-300 text-sm mb-2 block">
                New Deadline
              </label>

              <div className="relative">
                <FiCalendar className="absolute left-3 top-3 text-gray-400" />

                <input
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                  className="w-full bg-[#0B1220] border border-[#243244] rounded-lg pl-10 pr-4 py-3 text-white outline-none"
                />
              </div>
            </div>

            {/* Total Hours */}

            <div>
              <label className="text-gray-300 text-sm mb-2 block">
                Total Hours After Approval
              </label>

              <input
                type="text"
                readOnly
                value={
                  Number(formData.currentHours || 0) +
                  Number(formData.requestedHours || 0)
                }
                className="w-full bg-[#172235] border border-[#243244] rounded-lg px-4 py-3 text-cyan-400 font-semibold"
              />
            </div>
          </div>

          {/* Reason */}

          <div className="mt-6">
            <label className="text-gray-300 text-sm mb-2 block">
              Reason For Extra Hours
            </label>

            <div className="relative">
              <FiFileText className="absolute left-3 top-3 text-gray-400" />

              <textarea
                rows={5}
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                placeholder="Write reason..."
                className="w-full bg-[#0B1220] border border-[#243244] rounded-lg pl-10 pr-4 py-3 text-white outline-none resize-none"
                required
              />
            </div>
          </div>

          {/* Summary */}

          <div className="mt-8 bg-[#172235] rounded-xl p-5 border border-[#243244]">

            <h3 className="text-white text-lg font-semibold mb-4">
              Hour Bucket Summary
            </h3>

            <div className="grid md:grid-cols-3 gap-4">

              <div>
                <p className="text-gray-400 text-sm">
                  Current Hours
                </p>

                <p className="text-cyan-400 text-2xl font-bold">
                  {formData.currentHours || 0} Hrs
                </p>
              </div>

              <div>
                <p className="text-gray-400 text-sm">
                  Extra Hours
                </p>

                <p className="text-yellow-400 text-2xl font-bold">
                  + {formData.requestedHours || 0} Hrs
                </p>
              </div>

              <div>
                <p className="text-gray-400 text-sm">
                  Total Hours
                </p>

                <p className="text-green-400 text-2xl font-bold">
                  {Number(formData.currentHours || 0) +
                    Number(formData.requestedHours || 0)}{" "}
                  Hrs
                </p>
              </div>

            </div>
          </div>

          {/* Button */}

          <div className="flex justify-end mt-8">

            <button
              type="submit"
              className="bg-[#18A8E6] hover:bg-[#1595cf] px-8 py-3 rounded-lg text-white font-semibold transition-all"
            >
              Submit Hour Request
            </button>

          </div>

        </form>

      </div>
    </div>
  );
}