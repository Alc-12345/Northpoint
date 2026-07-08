import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiChevronDown, FiEdit, FiMoreVertical, FiTrash2 } from "react-icons/fi";
import { employeeApi } from "../../services/api";

export default function EmployeeGridSection({ view }) {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(8);
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [draftStatus, setDraftStatus] = useState("Pending");

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        const data = await employeeApi.getAll();
        setEmployees(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadEmployees();
  }, []);

  const handleDelete = async (id) => {
    try {
      await employeeApi.remove(id);
      setEmployees(employees.filter((employee) => employee._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditStart = (employee) => {
    setEditingId(employee._id);
    setDraftStatus(employee.status || "Pending");
  };

  const handleEditSave = async (id) => {
    try {
      const updated = await employeeApi.update(id, { status: draftStatus });
      setEmployees(employees.map((employee) => (employee._id === id ? updated : employee)));
      setEditingId(null);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="bg-white dark:bg-[#0b1220] border dark:border-[#243244] rounded-xl">

      {/* HEADER */}
      <div className="px-6 py-4 border-b dark:border-[#243244] flex justify-between items-center">
        <h2 className="text-sm font-semibold text-gray-800 dark:text-white">
          Employees {view === "grid" ? "Grid" : "List"}
        </h2>

        <button className="flex items-center gap-2 px-4 py-2 border rounded-lg dark:border-gray-600 text-sm">
          Sort By
          <FiChevronDown />
        </button>
      </div>

      {/* CONTENT */}
      <div className="p-6">
        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600">
            {error}
          </div>
        )}
        {isLoading && (
          <div className="text-sm text-gray-500">Loading employees...</div>
        )}
        {!isLoading && employees.length === 0 && !error && (
          <div className="text-sm text-gray-500">No employees found.</div>
        )}

        <div
          className={`${
            view === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
              : "flex flex-col gap-4"
          }`}
        >

          {employees.slice(0, visible).map((emp) => (

            <div
              key={emp._id}
              onClick={() =>
                navigate(`/employees/${emp._id}`, {
                  state: emp,
                })
              }
              className={`relative border dark:border-[#243244] rounded-xl p-5 hover:shadow-lg transition cursor-pointer bg-white dark:bg-[#0b1220] ${
                view === "list" ? "flex items-center justify-between gap-4" : ""
              }`}
            >

              {/* MENU ICON (FIXED POSITION ISSUE) */}
              {view === "grid" && (
                <div className="absolute top-4 right-4 flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditStart(emp);
                    }}
                    className="text-blue-600 hover:text-blue-800"
                    title="Edit status"
                  >
                    <FiEdit />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(emp._id);
                    }}
                    className="text-red-600 hover:text-red-800"
                    title="Delete employee"
                  >
                    <FiTrash2 />
                  </button>
                  <FiMoreVertical />
                </div>
              )}

              {/* LEFT SIDE */}
              <div className="flex items-center gap-6 w-full">

                {/* Checkbox + Avatar */}
                <div className="flex items-center gap-5">
                  <input
                    type="checkbox"
                    onClick={(e) => e.stopPropagation()}
                  />

                  <img
                    src={
                      emp.photo ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        emp.name
                      )}&background=f97316&color=fff`
                    }
                    alt={emp.name}
                    className="w-12 h-12 rounded-full border-2 border-orange-500"
                  />
                </div>

                {/* Info */}
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-white">
                    {emp.name}
                  </h3>

                  <span className="text-xs bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300 px-2 py-1 rounded">
                    {emp.role || "Employee"}
                  </span>

                  {view === "list" && (
                    <p className="text-xs text-gray-500 mt-1">
                      {emp.email} • {emp.phone}
                    </p>
                  )}
                </div>

              </div>

              {/* GRID EXTRA CONTENT */}
              {view === "grid" && (
                <>
                  {/* Stats */}
                  <div className="grid grid-cols-3 text-center mt-4">
                    <div>
                      <p className="text-xs text-gray-500">Projects</p>
                      <p className="font-semibold">{emp.project ? 1 : 0}</p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">Done</p>
                      <p className="font-semibold">0</p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">Progress</p>
                      <p className="font-semibold">{emp.status}</p>
                    </div>
                  </div>

                  {/* Productivity */}
                  <div className="mt-4">
                    <div className="flex justify-between text-xs">
                      <span>Productivity</span>
                      <span>{emp.status === "Active" ? 75 : 25}%</span>
                    </div>

                    <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full">
                      <div
                        className={`${emp.color} h-1.5 rounded-full`}
                        style={{ width: emp.status === "Active" ? "75%" : "25%" }}
                      />
                    </div>
                  </div>
                </>
              )}

              {/* LIST RIGHT SIDE */}
              {view === "list" && (
                <div className="flex items-center gap-2 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{emp.status}</div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditStart(emp);
                    }}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <FiEdit />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(emp._id);
                    }}
                    className="text-red-600 hover:text-red-800"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              )}

              {editingId === emp._id && (
                <div className="mt-4 border-t border-gray-200 dark:border-[#243244] pt-3">
                  <label className="block text-sm mb-1">Status</label>
                  <select value={draftStatus} onChange={(e) => setDraftStatus(e.target.value)} className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-[#2a2a2a] border-gray-300 dark:border-gray-600">
                    <option value="Pending">Pending</option>
                    <option value="Ongoing">Ongoing</option>
                    <option value="Completed">Completed</option>
                    <option value="Active">Active</option>
                    <option value="On Leave">On Leave</option>
                    <option value="Resigned">Resigned</option>
                  </select>
                  <div className="mt-3 flex gap-2">
                    <button onClick={(e) => { e.stopPropagation(); handleEditSave(emp._id); }} className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm">Save</button>
                    <button onClick={(e) => { e.stopPropagation(); setEditingId(null); }} className="px-3 py-2 border rounded-lg text-sm">Cancel</button>
                  </div>
                </div>
              )}

            </div>

          ))}

        </div>

        {employees.length > visible && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => setVisible((current) => current + 8)}
              className="rounded-lg bg-orange-500 px-5 py-2 text-sm text-white hover:bg-orange-600"
            >
              Load More
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
