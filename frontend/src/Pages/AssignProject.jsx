import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { employeeApi, projectApi } from "../services/api";

export default function AssignProject() {
  const [employees, setEmployees] = useState([]);
  const [projects, setProjects] = useState([]);
  const [choices, setChoices] = useState({});
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  useEffect(() => {
    let active = true;
    Promise.all([employeeApi.getAll(), projectApi.getAll()]).then(([people, data]) => {
      if (active) { setEmployees(people); setProjects(data); }
    }).catch(err => { if (active) setError(err.message); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);
  const assign = async (employee) => {
    setSaving(employee._id); setError(""); setMessage("");
    try {
      // Fetch the latest team before adding a member to preserve existing assignments.
      const project = await projectApi.getById(choices[employee._id]);
      const ids = project.assignedTeam.map(member => member._id || member);
      if (!ids.includes(employee._id)) ids.push(employee._id);
      const result = await projectApi.assignTeam(project._id, ids);
      setProjects(current => current.map(item => item._id === project._id ? result.project : item));
      setChoices(current => ({ ...current, [employee._id]: "" }));
      setMessage(`${project.name} assigned to ${employee.name}.`);
    } catch (err) { setError(err.message); }
    finally { setSaving(null); }
  };
  return <div className="text-gray-800 dark:text-gray-200">
    <h1 className="text-2xl font-bold">Assign Project</h1>
    <p className="mt-2 mb-6 text-gray-500">Choose an employee, then assign a project to them.</p>
    {error && <p role="alert" className="mb-4 text-red-500">{error}</p>}
    {message && <p role="status" className="mb-4 text-green-600">{message}</p>}
    <input aria-label="Search employees" placeholder="Search employees by name or email" value={search} onChange={e => setSearch(e.target.value)} className="mb-4 w-full rounded-lg border p-3 dark:bg-[#111C2D] dark:border-[#243244]" />
    {loading ? <p>Loading employees and projects...</p> : <>
      {!projects.length && !error && <p className="mb-4">No projects available. <Link to="/add-project" className="text-cyan-500">Add a project</Link> first.</p>}
      <div className="space-y-3">
        {employees.filter(employee => `${employee.name} ${employee.email}`.toLowerCase().includes(search.toLowerCase())).map(employee => {
          const assigned = projects.filter(project => project.assignedTeam?.some(member => (member._id || member) === employee._id));
          return <div key={employee._id} className="flex flex-col gap-4 rounded-xl border bg-white p-5 md:flex-row md:items-center dark:bg-[#111C2D] dark:border-[#243244]">
            <div className="flex-1"><h2 className="font-semibold">{employee.name}</h2><p className="text-sm text-gray-500">{employee.email} · {employee.role || employee.department || "Employee"}</p><p className="mt-2 text-sm">Projects: {assigned.map(project => project.name).join(", ") || "Not assigned"}</p></div>
            <select aria-label={`Project for ${employee.name}`} value={choices[employee._id] || ""} onChange={e => setChoices({ ...choices, [employee._id]: e.target.value })} disabled={saving !== null} className="rounded-lg border p-2 dark:bg-[#0b1220] dark:border-[#243244]">
              <option value="">Select project</option>
              {projects.filter(project => !assigned.some(item => item._id === project._id)).map(project => <option key={project._id} value={project._id}>{project.name}</option>)}
            </select>
            <button onClick={() => assign(employee)} disabled={!choices[employee._id] || saving !== null} className="rounded-lg bg-blue-600 px-4 py-2 text-white disabled:opacity-50">{saving === employee._id ? "Assigning..." : "Assign Project"}</button>
          </div>;
        })}
        {!employees.some(employee => `${employee.name} ${employee.email}`.toLowerCase().includes(search.toLowerCase())) && !error && <p>No employees found.</p>}
      </div>
    </>}
  </div>;
}
