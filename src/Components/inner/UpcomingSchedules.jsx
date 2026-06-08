import React, { useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

export default function UpcomingSchedules() {

  /* Start with March 2023 like your screenshot */
  const [currentMonth, setCurrentMonth] = useState(
    new Date(2023, 2, 1)
  );

  const [selectedDate, setSelectedDate] = useState(6);

  const days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  /* Generate full calendar including prev & next month */
  const generateCalendar = () => {

    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDay = new Date(year, month, 1).getDay();

    const lastDate = new Date(year, month + 1, 0).getDate();

    const prevLastDate = new Date(year, month, 0).getDate();

    const dates = [];

    /* Previous month dates */
    for (let i = firstDay; i > 0; i--) {
      dates.push({
        date: prevLastDate - i + 1,
        current: false,
      });
    }

    /* Current month dates */
    for (let i = 1; i <= lastDate; i++) {
      dates.push({
        date: i,
        current: true,
      });
    }

    /* Next month dates */
    while (dates.length < 42) {
      dates.push({
        date: dates.length - lastDate - firstDay + 1,
        current: false,
      });
    }

    return dates;
  };

  const calendarDates = generateCalendar();

  /* Month text */
  const monthYear = currentMonth.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  /* Navigation */
  const prevMonth = () => {
    setCurrentMonth(
      new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() - 1,
        1
      )
    );
  };

  const nextMonth = () => {
    setCurrentMonth(
      new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() + 1,
        1
      )
    );
  };

  /* Events */
  const events = [
    {
      day: 20,
      week: "Mon",
      title: "Development planning",
      company: "W3it Technologies",
      time: "12:05 PM",
    },
    {
      day: 20,
      week: "Mon",
      title: "Development planning",
      company: "W3it Technologies",
      time: "12:05 PM",
    },
  ];

  return (
    <div
      className="
      w-full h-full
      bg-white dark:bg-[#0b1220]
      border border-gray-200 dark:border-[#243244]
      rounded-xl
      p-6
      transition-colors duration-300
    "
    >

      {/* Title */}
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Upcoming Schedules
      </h2>

      {/* Month Navigation */}
      <div className="flex justify-between items-center mb-4">

        <button
          onClick={prevMonth}
          className="bg-blue-500/20 text-blue-500 dark:text-blue-400 p-2 rounded"
        >
          <FiChevronLeft />
        </button>

        <div className="text-gray-800 dark:text-gray-300 font-medium">
          {monthYear}
        </div>

        <button
          onClick={nextMonth}
          className="bg-blue-500/20 text-blue-500 dark:text-blue-400 p-2 rounded"
        >
          <FiChevronRight />
        </button>

      </div>

      {/* Week Days */}
      <div className="grid grid-cols-7 text-center mb-2">

        {days.map((day, index) => (
          <div
            key={index}
            className={`
              text-sm font-medium
              ${
                index === 0
                  ? "text-red-500"
                  : "text-gray-500 dark:text-gray-400"
              }
            `}
          >
            {day}
          </div>
        ))}

      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-y-2 mb-4">

        {calendarDates.map((item, index) => {

          const isSunday = index % 7 === 0;

          const isSelected =
            item.current && item.date === selectedDate;

          return (
            <div
              key={index}
              onClick={() =>
                item.current && setSelectedDate(item.date)
              }
              className={`
                w-10 h-10
                flex items-center justify-center
                mx-auto
                rounded-lg
                cursor-pointer
                relative
                transition
                ${
                  isSelected
                    ? "bg-blue-500 text-white"
                    : item.current
                    ? isSunday
                      ? "text-red-500"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                    : "text-gray-400"
                }
              `}
            >

              {item.date}

              {/* Event Dot */}
              {item.current && item.date === 6 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              )}

            </div>
          );
        })}

      </div>

      {/* Events Section */}
      <div className="border-t border-gray-300 dark:border-[#243244] pt-4">

        <div className="text-gray-500 dark:text-gray-400 text-sm mb-3">
          EVENTS
        </div>

        {events.map((event, index) => (

          <div
            key={index}
            className="flex justify-between items-center mb-4"
          >

            {/* Left */}
            <div className="flex gap-3">

              <div
                className="
                bg-blue-500/20
                text-blue-500 dark:text-blue-400
                p-2
                rounded
                text-center
                w-12
              "
              >
                <div className="font-semibold">
                  {event.day}
                </div>

                <div className="text-xs">
                  {event.week}
                </div>

              </div>

              <div>

                <div className="text-gray-900 dark:text-white">
                  {event.title}
                </div>

                <div className="text-gray-500 dark:text-gray-400 text-sm">
                  {event.company}
                </div>

              </div>

            </div>

            {/* Time */}
            <div className="text-gray-500 dark:text-gray-400 text-sm">
              {event.time}
            </div>

          </div>

        ))}

      </div>

    </div>
  );
}
