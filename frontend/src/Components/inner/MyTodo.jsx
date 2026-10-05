import { useState } from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

export default function MyTodo() {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      text: "Complete this projects Monday",
      date: "2023-12-26 07:50",
      status: "late",
      done: false,
    },
    {
      id: 2,
      text: "Prepare client meeting presentation",
      date: "2023-12-25 05:30",
      status: "late",
      done: false,
    },
    {
      id: 3,
      text: "Submit monthly report",
      date: "2023-12-20 10:15",
      status: "finished",
      done: true,
    },
    {
      id: 4,
      text: "Update project documentation",
      date: "2023-12-18 02:40",
      status: "finished",
      done: true,
    },
  ]);

  const toggleTask = (id) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  return (
    <div
      className="
        bg-white  dark:bg-[#0b1220]
        border border-gray-200 dark:border-[#243244]
        rounded-xl shadow-sm
        p-5 h-full
        transition-colors duration-300
      "
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-sm font-semibold text-gray-800 dark:text-white">
          My To Do Items
        </h2>

        <span className="text-xs text-blue-600 dark:text-blue-400 cursor-pointer hover:underline">
          View All + Add To Do
        </span>
      </div>

      {/* Late Section */}
      <SectionTitle
        title="Latest To Do’s"
        color="bg-orange-500"
      />

      {tasks
        .filter((task) => task.status === "late")
        .map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            toggleTask={toggleTask}
            deleteTask={deleteTask}
          />
        ))}

      {/* Finished Section */}
      <SectionTitle
        title="Latest Finished To Do’s"
        color="bg-green-500"
      />

      {tasks
        .filter((task) => task.status === "finished")
        .map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            toggleTask={toggleTask}
            deleteTask={deleteTask}
          />
        ))}
    </div>
  );
}

/* Section Title */
function SectionTitle({ title, color }) {
  return (
    <div className="flex items-center gap-2 text-xs font-medium text-gray-600 dark:text-gray-400 mb-3 mt-4">
      <span className={`w-2 h-2 rounded-full ${color}`} />
      {title}
    </div>
  );
}

/* Task Item */
function TaskItem({ task, toggleTask, deleteTask }) {
  return (
    <div
      className="
        group flex items-start justify-between
        py-3 px-2 rounded-md
        border-b border-gray-200 dark:border-[#243244]
        hover:bg-gray-50 dark:hover:bg-[#172235]
        transition
      "
    >
      {/* Left */}
      <div className="flex items-start gap-3">

        <input
          type="checkbox"
          checked={task.done}
          onChange={() => toggleTask(task.id)}
          className="mt-1 accent-blue-500"
        />

        <div>

          <p
            className={`text-sm ${
              task.done
                ? "line-through text-gray-400"
                : "text-gray-800 dark:text-gray-200"
            }`}
          >
            {task.text}
          </p>

          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {task.date}
          </p>

        </div>

      </div>

      {/* Right Buttons */}
      <div className="flex items-center gap-2 opacity-70 group-hover:opacity-100 transition">

        <button
          onClick={() => deleteTask(task.id)}
          className="
            p-2 rounded-lg text-gray-400
            hover:bg-red-500/15 hover:text-red-500
            transition
          "
        >
          <FiTrash2 size={14} />
        </button>

        <button
          className="
            p-2 rounded-lg text-gray-400
            hover:bg-blue-500/15 hover:text-blue-500
            transition
          "
        >
          <FiEdit2 size={14} />
        </button>

      </div>

    </div>
  );
}
