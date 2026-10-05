import { FiGrid, FiList, FiDownload } from "react-icons/fi";

export default function AllEmployeesHeader({ view, setView }) {

  const handleExport = () => {
    alert("Export functionality coming soon!");
  };

  return (
    <div className="w-full bg-white dark:bg-[#0b1220] rounded-xl border-b dark:border-[#243244] px-6 py-4 flex items-center justify-between">
      
      <div className="flex flex-col">
        <h1 className="text-lg font-semibold text-gray-800 dark:text-white">
          Employee
        </h1>

        <p className="text-sm text-gray-500 dark:text-gray-400">
          Home /{" "}
          <span className="text-gray-700 dark:text-gray-300">
            All Employees
          </span>
        </p>
      </div>

      <div className="flex items-center gap-3">

        <div className="flex bg-gray-100 dark:bg-[#2A2A2A] rounded-lg p-1">
          
          <button
            onClick={() => setView("grid")}
            className={`p-2 rounded ${
              view === "grid"
                ? "bg-white dark:bg-[#0b1220] shadow text-gray-700 dark:text-white"
                : "text-gray-600 dark:text-gray-300"
            }`}
          >
            <FiGrid size={16} />
          </button>

          <button
            onClick={() => setView("list")}
            className={`p-2 rounded ${
              view === "list"
                ? "bg-white dark:bg-[#0b1220] shadow text-gray-700 dark:text-white"
                : "text-gray-600 dark:text-gray-300"
            }`}
          >
            <FiList size={16} />
          </button>
        </div>

        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2A2A2A]"
        >
          <FiDownload size={16} />
          Export
        </button>

      </div>
    </div>
  );
}
