import React from "react";
import moment from "moment";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { FiCalendar, FiClock } from "react-icons/fi";

const localizer = momentLocalizer(moment);

const EmployeeCalendar = () => {
  const events = [
    {
      title: "Project Meeting",
      start: new Date(2026, 2, 8, 10, 0),
      end: new Date(2026, 2, 8, 11, 0),
    },
    {
      title: "UI Design Deadline",
      start: new Date(2026, 2, 12),
      end: new Date(2026, 2, 12),
    },
    {
      title: "Client Presentation",
      start: new Date(2026, 2, 15, 14, 0),
      end: new Date(2026, 2, 15, 15, 0),
    },
    {
      title: "Team Standup",
      start: new Date(2026, 2, 18, 9, 0),
      end: new Date(2026, 2, 18, 9, 30),
    },
  ];

  const upcoming = [
    { title: "Project Meeting", date: "8 Mar 2026", time: "10:00 AM" },
    { title: "UI Deadline", date: "12 Mar 2026", time: "11:59 PM" },
    { title: "Client Presentation", date: "15 Mar 2026", time: "2:00 PM" },
  ];

  const eventStyleGetter = () => {
    return {
      style: {
        backgroundColor: "#2563eb",
        borderRadius: "6px",
        color: "white",
        border: "none",
        padding: "2px 6px",
      },
    };
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen dark:bg-gray-900">

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <FiCalendar className="text-blue-600 text-xl" />
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
          Employee Calendar
        </h1>
      </div>

      <div className="grid grid-cols-12 gap-6">

        {/* Calendar Section */}
        <div className="col-span-12 lg:col-span-9 bg-white dark:bg-gray-800 p-6 rounded-xl shadow">

          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            views={["month", "week", "day", "agenda"]}
            eventPropGetter={eventStyleGetter}
            style={{ height: 520 }}
          />

        </div>

        {/* Upcoming Events */}
        <div className="col-span-12 lg:col-span-3 bg-white dark:bg-gray-800 p-6 rounded-xl shadow">

          <h2 className="text-lg font-semibold mb-4 dark:text-white">
            Upcoming Events
          </h2>

          <div className="space-y-4">
            {upcoming.map((event, index) => (
              <div
                key={index}
                className="p-3 rounded-lg border dark:border-[#243244] hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                <h3 className="font-medium text-gray-800 dark:text-white">
                  {event.title}
                </h3>

                <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                  <FiCalendar />
                  {event.date}
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <FiClock />
                  {event.time}
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
};

export default EmployeeCalendar;
