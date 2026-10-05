import React, { useState } from "react";
import {
  FiCalendar,
  FiPlus,
  FiClock,
  FiTrash2,
} from "react-icons/fi";

export default function AdminCalendarManager() {
  const [events, setEvents] = useState([
    {
      title: "Project Meeting",
      type: "Meeting",
      startDate: "2026-06-12",
      endDate: "2026-06-12",
      startTime: "10:00",
      endTime: "11:00",
      assign: "All Employees",
    },
  ]);

  const [form, setForm] = useState({
    title: "",
    type: "Meeting",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    assign: "All Employees",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const addEvent = (e) => {
    e.preventDefault();

    if (!form.title || !form.startDate) return;

    setEvents([...events, form]);

    setForm({
      title: "",
      type: "Meeting",
      startDate: "",
      endDate: "",
      startTime: "",
      endTime: "",
      assign: "All Employees",
    });
  };

  const deleteEvent = (index) => {
    setEvents(events.filter((_, i) => i !== index));
  };

  return (
    <div className="admin-dashboard p-6 bg-gray-100 dark:bg-[#0b1220] min-h-screen">

      <div className="flex items-center gap-3 mb-6">
        <FiCalendar className="text-blue-600 text-2xl" />
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Calendar Manager
        </h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">

        {/* Create Event */}

        <div className="lg:col-span-1 bg-white dark:bg-[#111827] rounded-xl shadow p-6 border dark:border-[#243244]">

          <h2 className="text-lg font-semibold mb-4 dark:text-white flex items-center gap-2">
            <FiPlus />
            Create Event
          </h2>

          <form onSubmit={addEvent} className="space-y-4">

            <input
              type="text"
              name="title"
              placeholder="Event Title"
              value={form.title}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border dark:border-[#243244] dark:bg-[#0b1220] dark:text-white"
            />

            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border dark:border-[#243244] dark:bg-[#0b1220] dark:text-white"
            >
              <option>Meeting</option>
              <option>Deadline</option>
              <option>Holiday</option>
              <option>Training</option>
            </select>

            <input
              type="date"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border dark:border-[#243244] dark:bg-[#0b1220] dark:text-white"
            />

            <input
              type="date"
              name="endDate"
              value={form.endDate}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border dark:border-[#243244] dark:bg-[#0b1220] dark:text-white"
            />

            <input
              type="time"
              name="startTime"
              value={form.startTime}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border dark:border-[#243244] dark:bg-[#0b1220] dark:text-white"
            />

            <input
              type="time"
              name="endTime"
              value={form.endTime}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border dark:border-[#243244] dark:bg-[#0b1220] dark:text-white"
            />

            <select
              name="assign"
              value={form.assign}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border dark:border-[#243244] dark:bg-[#0b1220] dark:text-white"
            >
              <option>All Employees</option>
              <option>Development Team</option>
              <option>Design Team</option>
            </select>

            <button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg"
            >
              Create Event
            </button>

          </form>
        </div>

        {/* Event List */}

        <div className="lg:col-span-2 bg-white dark:bg-[#111827] rounded-xl shadow p-6 border dark:border-[#243244]">

          <h2 className="text-lg font-semibold mb-5 dark:text-white">
            Upcoming Events
          </h2>

          <div className="space-y-4">

            {events.map((event, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-4 rounded-xl border dark:border-[#243244] hover:bg-gray-50 dark:hover:bg-[#0b1220]"
              >
                <div>

                  <h3 className="font-semibold text-gray-800 dark:text-white">
                    {event.title}
                  </h3>

                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {event.type}
                  </p>

                  <div className="flex gap-4 mt-2 text-sm text-gray-500">

                    <span className="flex items-center gap-1">
                      <FiCalendar />
                      {event.startDate}
                    </span>

                    <span className="flex items-center gap-1">
                      <FiClock />
                      {event.startTime}
                    </span>

                  </div>

                  <p className="mt-2 text-blue-600 text-sm">
                    Assigned : {event.assign}
                  </p>

                </div>

                <button
                  onClick={() => deleteEvent(index)}
                  className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-600 hover:text-white transition"
                >
                  <FiTrash2 />
                </button>

              </div>
            ))}

          </div>

        </div>

      </div>

    </div>
  );
}