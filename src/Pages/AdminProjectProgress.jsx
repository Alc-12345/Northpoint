import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { projectApi, taskApi } from "../services/api";

const percent = value => Math.max(0, Math.min(100, Number(value) || 0));
const taskProgress = task => task.status === "Completed" ? 100 : percent(task.progress);
const average = tasks => tasks.length ? Math.round(tasks.reduce((sum, task) => sum + taskProgress(task), 0) / tasks.length) : 0;

function ProgressBar({ value }) {
  return <div><div className="mb-2 text-sm">{value}% complete</div><div role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100} aria-label="Completion" className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700"><div className="h-full bg-cyan-500" style={{ width: `${value}%` }} /></div></div>;
}

export default function AdminProjectProgress() {
  const { id } = useParams();
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    Promise.all([projectApi.getAll(), taskApi.getAll()]).then(([data, work]) => {
      if (active) { setProjects(data); setTasks(work); }
    }).catch(err => { if (active) setError(err.message); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);
  const projectTasks = project => tasks.filter(task => [project._id, project.name, project.projectCode].filter(Boolean).includes(task.project));
  const selected = projects.find(project => project._id === id);
  return <div className="text-gray-800 dark:text-gray-200">
    <h1 className="text-2xl font-bold">{selected ? `${selected.name} — Employee Progress` : "Project Progress"}</h1>
    <p className="mt-2 mb-6 text-gray-500">Progress is the average completion of project tasks. Projects without tasks show their saved progress.</p>
    {error && <p role="alert" className="mb-4 text-red-500">{error}</p>}
    {loading ? <p>Loading project progress...</p> : id ? <>
      <Link to="/projects/progress" className="mb-6 inline-block text-cyan-500">← All projects</Link>
      {selected ? <>
        <div className="mb-6 rounded-xl border p-5 dark:border-[#243244]"><ProgressBar value={projectTasks(selected).length ? average(projectTasks(selected)) : percent(selected.progress)} /></div>
        {!selected.assignedTeam?.length && <p>No employees assigned. <Link to="/assign-project" className="text-cyan-500">Assign employees</Link></p>}
        <div className="grid gap-4 md:grid-cols-2">
          {selected.assignedTeam?.map(employee => {
            const work = projectTasks(selected).filter(task => [employee._id, employee.email, employee.name].filter(Boolean).includes(task.assignedTo));
            return <div key={employee._id} className="rounded-xl border bg-white p-5 dark:bg-[#111C2D] dark:border-[#243244]">
              <h2 className="font-semibold">{employee.name}</h2><p className="mb-4 text-sm text-gray-500">{employee.role || employee.department || employee.email}</p>
              <ProgressBar value={average(work)} />
              <p className="mt-3 text-sm">{work.filter(task => task.status === "Completed").length} / {work.length} tasks completed · {work.reduce((sum, task) => sum + (task.totalWorkingHours || 0), 0)} hours logged</p>
              {!work.length && <p className="mt-2 text-sm text-gray-500">No tasks assigned for this project.</p>}
              <ul className="mt-4 space-y-2">{work.map(task => <li key={task._id} className="border-t pt-2 text-sm dark:border-[#243244]"><div className="flex justify-between gap-3"><span>{task.title}</span><span>{taskProgress(task)}%</span></div><p className="text-gray-500">{task.status}</p></li>)}</ul>
            </div>;
          })}
        </div>
      </> : !error && <p>Project not found.</p>}
    </> : <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {projects.map(project => <Link key={project._id} to={`/projects/${project._id}/progress`} className="rounded-xl border bg-white p-6 transition hover:border-cyan-500 focus-visible:outline-cyan-500 dark:bg-[#111C2D] dark:border-[#243244]">
        <p className="text-xs text-gray-500">{project.projectCode}</p><h2 className="mt-1 mb-2 text-xl font-semibold">{project.name}</h2><p className="mb-4 text-sm text-gray-500">{project.status} · {project.assignedTeam?.length || 0} employees</p>
        <ProgressBar value={projectTasks(project).length ? average(projectTasks(project)) : percent(project.progress)} /><p className="mt-4 text-sm text-cyan-500">View employee progress →</p>
      </Link>)}
      {!projects.length && !error && <p>No projects found.</p>}
    </div>}
  </div>;
}
