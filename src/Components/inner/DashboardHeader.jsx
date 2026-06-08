import { FiPlus } from "react-icons/fi";

export default function DashboardHeader() {
  return (
    <div className="w-full px-1 py-2 flex items-center justify-between
                    border-b border-gray-200 dark:border-[#243244]
                    bg-gray-100 dark:bg-[#0b1220]">

      <div className="flex items-center gap-2 text-sm">

        <span className="font-semibold text-sm text-gray-900 gap-4 dark:text-white">
          Dashboard
        </span>

        <span className="text-gray-400 ">   </span>

        <span className="text-gray-500 dark:text-gray-400">
          Home
        </span>

        <span className="text-gray-400">/</span>

        <span className="text-blue-500 font-medium">
          Dashboard
        </span>

      </div>

      <button className="flex items-center gap-2 text-blue-500
                         hover:text-blue-600 text-sm font-medium">

        <FiPlus size={16} />

        Add Task

      </button>

    </div>
  );
}
