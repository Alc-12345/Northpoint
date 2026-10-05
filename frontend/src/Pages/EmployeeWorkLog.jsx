import { useEffect, useState } from "react";
import { taskApi, etlApi } from "../services/api";
import { WorkUpdate } from "./EmployeeTasks";

export default function EmployeeWorkLog() {
  const [tasks, setTasks] = useState([]);
  const [nodes, setNodes] = useState([]);
  const [selected, setSelected] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  useEffect(() => {
    let active = true;
    taskApi.getAll().then(items => { if (active) { setTasks(items); setSelected(items[0]?._id || ""); } })
      .catch(err => { if (active) setError(err.message); })
      .finally(() => { if (active) setLoading(false); });
    etlApi.getWorkflow().then(workflow => { if (active) setNodes(workflow.nodes || []); }).catch(() => {});
    return () => { active = false; };
  }, []);
  const saved = updated => {
    setTasks(items => items.map(task => task._id === updated._id ? updated : task));
    setSuccess("Daily update saved. Your progress and total hours are reflected in ETL.");
    etlApi.getWorkflow().then(workflow => setNodes(workflow.nodes || [])).catch(() => {});
  };
  const task = tasks.find(item => item._id === selected);
  const logs = tasks.flatMap(item => (item.workLogs || []).map(log => ({ ...log, task: item.title, project: item.project, day: log.workDate || new Date(log.createdAt).toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" }) })))
    .filter(log => !date || log.day === date).sort((a, b) => b.day.localeCompare(a.day) || new Date(b.createdAt) - new Date(a.createdAt));
  const total = logs.reduce((sum, log) => sum + log.hours, 0);
  return (
    <div className="space-y-6 text-gray-800 dark:text-white">
      <div><h1 className="text-2xl font-bold">Daily Updates & Working Hours</h1><p className="mt-2 text-sm text-gray-500">Record work against your assigned tasks. Each update adds to your task’s ETL hours and progress.</p></div>
      {error && <p role="alert" className="text-red-600">{error}</p>}
      {success && <p role="status" className="text-green-600">{success}</p>}
      {loading ? <p>Loading your work…</p> : !tasks.length ? <p>No assigned tasks yet. Your administrator can assign work to you.</p> : <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
          <h2 className="text-lg font-semibold">Submit a daily update</h2>
          <label className="mt-4 block text-sm">Assigned task
            <select value={selected} onChange={event => { setSelected(event.target.value); setSuccess(""); }} className="mt-2 w-full rounded-lg border p-2 dark:bg-slate-900">
              {tasks.map(item => <option key={item._id} value={item._id}>{item.title} — {item.project || "No project"}</option>)}
            </select>
          </label>
          {task && <><p className="mt-3 text-sm text-gray-500">Deadline: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "Not set"} · {Number(task.totalWorkingHours || 0).toFixed(2)} h total</p><WorkUpdate key={task._id} task={task} availableNodes={nodes} onSaved={saved} /></>}
        </section>
        <section className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
          <h2 className="text-lg font-semibold">Work history</h2>
          <label className="mt-4 block text-sm">Filter by work date<input type="date" value={date} onChange={event => setDate(event.target.value)} className="ml-3 rounded-lg border p-2 dark:bg-slate-900" /></label>
          {date && <button onClick={() => setDate("")} className="mt-2 text-sm text-blue-600">Show all dates</button>}
          <p className="my-4 font-medium">{total.toFixed(2)} hours · {logs.length} updates</p>
          {!logs.length && <p className="text-sm text-gray-500">No work entries for this selection.</p>}
          <div className="max-h-[650px] space-y-3 overflow-y-auto">{logs.map(log => <article key={log._id} className="rounded-lg border p-4 dark:border-slate-700">
            <div className="flex justify-between gap-3"><h3 className="font-medium">{log.task}</h3><span>{log.hours} h</span></div>
            <p className="mt-1 text-xs text-gray-500">{log.project} · {log.day}{log.status ? ` · ${log.status} · ${log.progress}%` : ""}</p>
            <p className="mt-2 whitespace-pre-wrap text-sm">{log.note}</p>
          </article>)}</div>
        </section>
      </div>}
    </div>
  );
}
