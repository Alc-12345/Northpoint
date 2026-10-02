import React, { useEffect, useState } from "react";
import { taskApi, etlApi } from "../services/api";

const fieldClass = "mt-1 w-full rounded-lg border border-gray-300 bg-white p-2 text-sm dark:border-slate-600 dark:bg-slate-900 dark:text-white";

function WorkUpdate({ task, availableNodes, onSaved }) {
  const [form, setForm] = useState({ status: task.status, progress: task.progress || 0, description: task.description || "", hours: "", note: "", etlNodeId: task.etlNodeId || "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const change = event => setForm(current => ({ ...current, [event.target.name]: event.target.value }));
  const submit = async event => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const updated = await taskApi.addWorkUpdate(task._id, { ...form, hours: Number(form.hours), progress: Number(form.progress) });
      onSaved(updated);
      setForm(current => ({ ...current, hours: "", note: "", status: updated.status, progress: updated.progress }));
    } catch (err) { setError(err.message); }
    finally { setSaving(false); }
  };
  return (
    <form onSubmit={submit} className="mt-4 space-y-3 border-t border-gray-200 pt-4 text-sm dark:border-slate-700 dark:text-slate-300">
      {error && <p role="alert" className="text-red-500">{error}</p>}
      <label className="block">Status
        <select name="status" value={form.status} onChange={change} className={fieldClass}>
          <option>Pending</option><option>In Progress</option><option>Completed</option>
        </select>
      </label>
      <label className="block">Progress (%)
        <input name="progress" type="number" min="0" max="100" required value={form.status === "Completed" ? 100 : form.progress} disabled={form.status === "Completed"} onChange={change} className={fieldClass} />
      </label>
      <label className="block">Description
        <textarea name="description" rows={2} value={form.description} onChange={change} className={fieldClass} />
      </label>
      <label className="block">ETL node
        <select name="etlNodeId" value={form.etlNodeId} onChange={change} className={fieldClass}>
          <option value="">Create a task node automatically</option>
          {availableNodes.filter(node => !node.data?.taskId || node.data.taskId === task._id).map(node => <option key={node.id} value={node.id}>{node.data?.label || node.id}</option>)}
        </select>
      </label>
      <label className="block">Hours spent on this update
        <input name="hours" type="number" min="0.01" step="0.01" required value={form.hours} onChange={change} className={fieldClass} placeholder="e.g. 1.5" />
      </label>
      <label className="block">Work done
        <textarea name="note" rows={2} required value={form.note} onChange={change} className={fieldClass} placeholder="Describe the UI changes or task work" />
      </label>
      <p className="text-xs text-gray-500 dark:text-slate-400">Submitted hours are locked. Each update adds a new entry.</p>
      <button disabled={saving} className="rounded-lg bg-blue-600 px-4 py-2 text-white disabled:opacity-50">{saving ? "Saving…" : "Save work update"}</button>
    </form>
  );
}

export default function EmployeeTasks() {
  const [tasks, setTasks] = useState([]);
  const [nodes, setNodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    let cancelled = false;
    taskApi.getAll().then(data => { if (!cancelled) setTasks(data); })
      .catch(err => { if (!cancelled) setError(err.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    etlApi.getWorkflow().then(workflow => { if (!cancelled) setNodes(workflow.nodes || []); }).catch(() => {});
    return () => { cancelled = true; };
  }, []);
  const saved = task => {
    setTasks(current => current.map(item => item._id === task._id ? task : item));
    etlApi.getWorkflow().then(workflow => setNodes(workflow.nodes || [])).catch(() => {});
  };
  return (
    <div className="min-h-screen bg-gray-100 p-6 dark:bg-gray-900">
      <h1 className="mb-6 text-2xl font-bold dark:text-white">My Tasks</h1>
      {error && <p role="alert" className="mb-4 text-red-500">{error}</p>}
      {loading && <p className="text-gray-500">Loading tasks…</p>}
      {!loading && !error && !tasks.length && <p className="text-gray-500">No assigned tasks yet.</p>}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {tasks.map(task => (
          <article key={task._id} className="rounded-xl bg-white p-5 shadow dark:bg-gray-800">
            <h2 className="text-lg font-semibold dark:text-white">{task.title}</h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">{task.project || "No project"} · {task.priority} priority</p>
            <p className="mt-2 text-sm font-medium dark:text-slate-200">{task.status} · {Number(task.totalWorkingHours || 0).toFixed(2)} h logged</p>
            {task.dueDate && <p className="mt-1 text-xs text-gray-500">Due {new Date(task.dueDate).toLocaleDateString()}</p>}
            <WorkUpdate task={task} availableNodes={nodes} onSaved={saved} />
            {!!task.workLogs?.length && <details className="mt-4 text-sm dark:text-slate-300">
              <summary className="cursor-pointer">Work history ({task.workLogs.length})</summary>
              {task.workLogs.slice().reverse().map(log => <div key={log._id} className="mt-2 rounded bg-gray-100 p-2 dark:bg-slate-900"><p>{log.note}</p><p className="mt-1 text-xs text-gray-500">{log.hours} h · {new Date(log.createdAt).toLocaleString()}</p></div>)}
            </details>}
          </article>
        ))}
      </div>
    </div>
  );
}
