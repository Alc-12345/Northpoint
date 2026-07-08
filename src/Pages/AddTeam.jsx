import { useEffect, useMemo, useState } from "react";
import {
  FiBriefcase,
  FiCheckCircle,
  FiCode,
  FiSearch,
  FiUserCheck,
  FiUsers,
} from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import { employeeApi, projectApi } from "../services/api";

export default function AddTeam() {
  const location = useLocation();
  const navigate = useNavigate();
  const project = location.state?.project;
  const [employees, setEmployees] = useState([]);
  const [selectedIds, setSelectedIds] = useState(
    project?.assignedTeam?.map((employee) => employee._id || employee) || []
  );
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const [role, setRole] = useState("");
  const [skill, setSkill] = useState("");
  const [availability, setAvailability] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const departments = useMemo(
    () => [...new Set(employees.map((employee) => employee.department).filter(Boolean))],
    [employees]
  );
  const roles = useMemo(
    () => [...new Set(employees.map((employee) => employee.role).filter(Boolean))],
    [employees]
  );
  const skills = useMemo(
    () => [
      ...new Set(
        employees
          .flatMap((employee) => String(employee.skills || "").split(","))
          .map((item) => item.trim())
          .filter(Boolean)
      ),
    ],
    [employees]
  );

  const filteredEmployees = employees.filter((employee) => {
    const text = `${employee.name} ${employee.role} ${employee.department} ${employee.skills}`.toLowerCase();
    const matchesSearch = text.includes(search.toLowerCase());
    const matchesDepartment = !department || employee.department === department;
    const matchesRole = !role || employee.role === role;
    const matchesSkill = !skill || String(employee.skills || "").toLowerCase().includes(skill.toLowerCase());
    const matchesAvailability = !availability || employee.status === availability;

    return matchesSearch && matchesDepartment && matchesRole && matchesSkill && matchesAvailability;
  });

  const toggleEmployee = (id) => {
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((employeeId) => employeeId !== id) : [...current, id]
    );
  };

  const handleAssignTeam = async () => {
    if (!project?._id) {
      setError("Open this page from a project Add Team button to assign employees.");
      return;
    }

    try {
      setError("");
      setSuccess("");
      setIsSubmitting(true);
      await projectApi.assignTeam(project._id, selectedIds);
      setSuccess("Team assigned successfully. Employees can now see this project.");
      setTimeout(() => navigate("/projects"), 900);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1220] p-6">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Assign Team</h1>
          <p className="mt-1 text-sm text-gray-400">
            Select one or more employees for the active project.
          </p>
          {project && (
            <p className="mt-2 text-sm text-[#18A8E6]">
              Project: {project.projectCode || project._id} | {project.name}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={handleAssignTeam}
          disabled={isSubmitting || selectedIds.length === 0}
          className="inline-flex items-center gap-2 rounded-lg bg-[#18A8E6] px-5 py-2 text-white hover:bg-[#1493cb] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <FiCheckCircle />
          {isSubmitting ? "Assigning..." : `Assign Team (${selectedIds.length})`}
        </button>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        <Card title="Total Employees" value={employees.length} icon={<FiUsers />} />
        <Card title="Available" value={employees.filter((item) => item.status === "Active").length} icon={<FiUserCheck />} />
        <Card title="Selected" value={selectedIds.length} icon={<FiCheckCircle />} />
        <Card title="Roles" value={roles.length} icon={<FiBriefcase />} />
      </div>

      {(error || success) && (
        <div className={`mb-4 rounded-lg border px-4 py-3 text-sm ${error ? "border-red-500/40 bg-red-500/10 text-red-200" : "border-green-500/40 bg-green-500/10 text-green-200"}`}>
          {error || success}
        </div>
      )}

      <div className="mb-6 rounded-xl border border-[#243244] bg-[#111C2D] p-4">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <div className="relative">
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search employee"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full rounded-lg border border-[#243244] bg-[#0B1220] py-2 pl-10 pr-4 text-white outline-none"
            />
          </div>
          <Filter value={department} onChange={setDepartment} placeholder="Department" options={departments} />
          <Filter value={role} onChange={setRole} placeholder="Role" options={roles} />
          <Filter value={skill} onChange={setSkill} placeholder="Skill" options={skills} />
          <Filter value={availability} onChange={setAvailability} placeholder="Availability" options={["Active", "Pending", "On Leave"]} />
        </div>
      </div>

      {isLoading && <div className="text-sm text-gray-400">Loading employees...</div>}
      {!isLoading && filteredEmployees.length === 0 && (
        <div className="text-sm text-gray-400">No matching employees found.</div>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredEmployees.map((employee) => {
          const isSelected = selectedIds.includes(employee._id);

          return (
            <button
              key={employee._id}
              type="button"
              onClick={() => toggleEmployee(employee._id)}
              className={`rounded-xl border p-5 text-left transition ${
                isSelected
                  ? "border-[#18A8E6] bg-[#18A8E6]/10"
                  : "border-[#243244] bg-[#111C2D] hover:bg-[#172235]"
              }`}
            >
              <div className="flex items-start gap-4">
                <img
                  src={employee.photo || "https://i.pravatar.cc/80"}
                  alt={employee.name}
                  className="h-14 w-14 rounded-full object-cover"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-white">{employee.name}</h3>
                      <p className="text-sm text-gray-400">{employee.role || "Team Member"}</p>
                    </div>
                    {isSelected && <FiCheckCircle className="text-[#18A8E6]" />}
                  </div>
                  <div className="mt-4 space-y-1 text-sm text-gray-300">
                    <p>Department: {employee.department || "-"}</p>
                    <p>Skills: {employee.skills || "-"}</p>
                    <p>Current Project: {employee.project || "None"}</p>
                    <p>Availability: {employee.status || "Pending"}</p>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Filter({ value, onChange, placeholder, options }) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="w-full rounded-lg border border-[#243244] bg-[#0B1220] px-4 py-2 text-white outline-none"
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

function Card({ title, value, icon }) {
  return (
    <div className="rounded-xl border border-[#243244] bg-[#111C2D] p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-400">{title}</p>
          <h2 className="mt-2 text-3xl font-bold text-white">{value}</h2>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#18A8E6]/20 text-xl text-[#18A8E6]">
          {icon || <FiCode />}
        </div>
      </div>
    </div>
  );
}
