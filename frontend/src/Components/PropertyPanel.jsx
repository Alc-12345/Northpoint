import { sqlFunctions, mathFunctions, getFunctionDefinition } from "../../../backend/shared/etlFunctions.js";
import React, { useState } from "react";
import { FiSettings } from "react-icons/fi";
import { operationGroups } from "../utils/etlConfig";
import { parseSourceFile, isProgressNode } from "../../../backend/shared/etlEngine.js";

const fieldClass = "mt-2 mb-4 w-full rounded bg-slate-800 p-3 text-white outline-none focus:ring-2 focus:ring-blue-500";
const headersFor = rows => [...new Set(rows.flatMap(row => Object.keys(row)))];
const display = value => value && typeof value === "object" ? JSON.stringify(value) : String(value ?? "");
const download = (rows, format) => {
  const headers = headersFor(rows);
  const escape = value => `"${display(value).replaceAll('"', '""')}"`;
  const content = format === "json" ? JSON.stringify(rows, null, 2) : [headers.map(escape).join(","), ...rows.map(row => headers.map(h => escape(row[h])).join(","))].join("\n");
  const url = URL.createObjectURL(new Blob([content], { type: format === "json" ? "application/json" : "text/csv" }));
  const link = document.createElement("a"); link.href = url; link.download = `output.${format}`; link.click(); URL.revokeObjectURL(url);
};

function TaskProperties({ node }) {
  return (
    <div className="space-y-4 text-sm text-slate-300">
      <h3 className="font-semibold text-white">{node.data.label}</h3>
      <p>{node.data.description || "No description yet."}</p>
      <p>Assigned to: {node.data.assignedTo || "Unassigned"}</p>
      <p>Status: {node.data.status} · {node.data.progress}%</p>
      <p className="font-semibold text-orange-300">{Number(node.data.totalWorkingHours || 0).toFixed(2)} working hours</p>
      <p className="text-xs text-slate-400">Updates sync from employee tasks. Submitted hours are locked.</p>
      <div className="space-y-2">
        {(node.data.workLogs || []).slice().reverse().map((log, index) => (
          <div key={log._id || index} className="rounded-lg bg-slate-800 p-3">
            <p>{log.note}</p>
            <p className="mt-1 text-xs text-slate-400">{log.hours} h · {log.employee}</p>
            <p className="mt-1 text-[10px] text-slate-500">{new Date(log.createdAt).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function PropertyForm({ selectedNode, onUpdate, nodes, edges }) {
  const [form, setForm] = useState(() => ({ ...selectedNode.data, name: selectedNode.data.label, filterOperator: selectedNode.data.filterOperator || "eq", joinType: selectedNode.data.joinType || "inner", aggregateFunction: selectedNode.data.aggregateFunction || "count" }));
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const update = (key, value) => setForm(prev => ({ ...prev, [key]: value,
    ...(key === "type" ? { functionName: undefined } : {}),
    ...(key === "type" && prev.category === "source" ? { sourceRows: undefined, fileName: "", fileSize: "", fileContent: "" } : {}),
  }));
  const field = (label, key, placeholder = "") => <label className="block text-sm text-slate-300">{label}<input value={form[key] ?? ""} onChange={e => update(key, e.target.value)} placeholder={placeholder} className={fieldClass} /></label>;
  const select = (label, key, choices, defaultValue = "") => <label className="block text-sm text-slate-300">{label}<select value={form[key] ?? defaultValue} onChange={e => update(key, e.target.value)} className={fieldClass}>{choices.map(([value, text]) => <option key={value} value={value}>{text}</option>)}</select></label>;
  const progressOnly = isProgressNode(form);
  const functionDefinition = getFunctionDefinition(form);
  const rows = selectedNode.data.outputRows || [];
  const headers = headersFor(rows);
  const incoming = edges.filter(e => e.target === selectedNode.id).map(e => nodes.find(n => n.id === e.source)).filter(Boolean);
  const save = () => {
    setError("");
    if (progressOnly && (!Number.isFinite(Number(form.totalWorkingHours || 0)) || Number(form.totalWorkingHours || 0) < 0)) { setError("Working hours must be zero or greater."); return; }
    onUpdate(selectedNode.id, { ...form, totalWorkingHours: Number(form.totalWorkingHours || 0), outputRows: progressOnly ? form.outputRows : [] });
  };
  return <div>
    {field("Node Name", "name")}
    {select(progressOnly ? "Work Type" : "Operation", "type", (operationGroups[form.category]?.operations || []).map(o => [o.type, o.label]))}
    {form.category === "source" && <div className="mb-4">
      <label className="block text-sm text-slate-300">Upload and store file
        <input type="file" accept={form.type === "json-file" ? ".json,application/json" : ".csv,text/csv"} className={fieldClass} disabled={uploading} onChange={async e => {
          const file = e.target.files?.[0]; if (!file) return;
          setUploading(true); setError("");
          try {
            if (file.size > 5 * 1024 * 1024) throw new Error("Choose a file smaller than 5 MB.");
            const content = await file.text();
            const sourceRows = parseSourceFile(content, form.type);
            const next = { ...form, fileName: file.name, fileSize: `${Math.ceil(file.size / 1024)} KB`, fileContent: content, sourceRows, outputRows: [], status: "Ready", progress: 0 };
            setForm(next); onUpdate(selectedNode.id, next);
          } catch (err) { setError(err.message); }
          finally { setUploading(false); }
        }} />
      </label>
      <p className="text-xs text-slate-400">{uploading ? "Reading file…" : form.fileName ? `${form.fileName} · ${form.sourceRows?.length ?? 0} stored rows` : "Upload a CSV with headers or a JSON array of objects."}</p>
    </div>}
    {form.type === "filter" && <>
      {field("Filter Column", "filterColumn", "status")}
      {select("Condition", "filterOperator", [["eq", "Equals"], ["ne", "Does not equal"], ["contains", "Contains"], ["gt", "Greater than"], ["gte", "Greater or equal"], ["lt", "Less than"], ["lte", "Less or equal"]])}
      {field("Value", "filterValue", "Active")}
    </>}
    {form.type === "select" && <>
      {field("Columns to keep (comma separated)", "selectColumns", "id, name, amount")}
      {field("Rename columns (JSON mapping)", "renameColumns", '{"name":"customer"}')}
    </>}
    {["sql-function", "math"].includes(form.type) && <>
      {select("Function", "functionName", (form.type === "math" ? mathFunctions : sqlFunctions).map(fn => [fn.value, fn.label]), form.type === "math" ? "add" : "upper")}
      {field("Input column", "functionColumn", form.type === "math" ? "amount" : "name")}
      {field("Result column (new or existing)", "resultColumn", "result")}
      {functionDefinition?.args.includes("operand") && <>
        {select("Second value", "operandMode", [["constant", "Constant"], ["column", "Another column"]], "constant")}
        {form.operandMode === "column" ? field("Second column", "operandColumn", "quantity") : field("Constant value", "operandValue", form.type === "math" ? "2" : "text")}
      </>}
      {functionDefinition?.args.includes("precision") && field("Decimal places (0–10)", "precision", "0")}
      {functionDefinition?.args.includes("search") && field("Text to replace", "searchText", "old")}
      {functionDefinition?.args.includes("replacement") && field("Replacement text", "replacementText", "new")}
      {functionDefinition?.args.includes("start") && field("Start position (first character = 1)", "substringStart", "1")}
      {functionDefinition?.args.includes("length") && field("Character count (optional)", "substringLength", "Leave empty for remaining text")}
      <p className="mb-4 text-xs text-slate-400">Runs on every incoming row. Save the configuration, then run the workflow.</p>
    </>}
    {form.type === "join" && <>
      {select("Left input", "leftInput", [["", "Choose connected input"], ...incoming.map(n => [n.id, n.data.label || n.id])])}
      <p className="mb-4 text-xs text-slate-400">Connect exactly two inputs. The other input is the right side. Duplicate column names use a right. prefix.</p>
      {field("Left join key", "leftKey", "customer_id")}
      {field("Right join key", "rightKey", "id")}
      {select("Join type", "joinType", [["inner", "Inner join"], ["left", "Left join"]])}
    </>}
    {form.type === "union" && <label className="mb-4 block text-sm"><input type="checkbox" checked={Boolean(form.unionDistinct)} onChange={e => update("unionDistinct", e.target.checked)} /> Remove duplicate rows</label>}
    {form.type === "aggregate" && <>
      {field("Group by (comma separated, optional)", "groupBy", "department")}
      {select("Function", "aggregateFunction", [["count", "Count rows"], ["sum", "Sum"], ["avg", "Average"], ["min", "Minimum"], ["max", "Maximum"]])}
      {form.aggregateFunction !== "count" && field("Numeric column", "aggregateColumn", "amount")}
      {field("Result column name", "aggregateAlias", form.aggregateFunction)}
    </>}
    {form.category === "output" && <div className="mb-4">
      <p className="mb-2 text-sm">{rows.length} output rows</p>
      {!rows.length && <p className="mb-3 text-xs text-slate-400">Connect an input and run the workflow. Empty results show zero rows.</p>}
      <div className="max-h-72 overflow-auto"><table className="w-full text-left text-xs"><thead><tr>{headers.map(h => <th key={h} className="p-2">{h}</th>)}</tr></thead><tbody>{rows.slice(0, 200).map((row, i) => <tr key={i}>{headers.map(h => <td key={h} className="border-t border-slate-700 p-2">{display(row[h])}</td>)}</tr>)}</tbody></table></div>
      {rows.length > 200 && <p className="text-xs text-slate-400">Showing first 200 rows. Downloads include all rows.</p>}
      <div className="mt-3 flex gap-3">{["csv", "json"].map(format => <button key={format} type="button" onClick={() => download(rows, format)} className="rounded bg-slate-700 px-3 py-2 text-sm">Download {format.toUpperCase()}</button>)}</div>
    </div>}
    {progressOnly && <>
      {field("Description / work update", "description")}
      {select("Status", "status", [["Ready", "Ready"], ["Running", "In Progress"], ["Completed", "Completed"], ["Failed", "Blocked"]], "Ready")}
      <label className="block text-sm">Progress (%)<input type="number" min="0" max="100" value={form.progress || 0} onChange={e => update("progress", Math.min(100, Math.max(0, Number(e.target.value) || 0)))} className={fieldClass} /></label>
      <label className="block text-sm">Working hours<input type="number" min="0" step="any" value={form.totalWorkingHours || 0} onChange={e => update("totalWorkingHours", e.target.value)} className={fieldClass} /></label>
    </>}
    {error && <p role="alert" className="mb-3 text-sm text-red-300">{error}</p>}
    {<button disabled={uploading} type="button" onClick={save} className="w-full rounded bg-blue-600 py-3 text-sm disabled:opacity-50">Save Configuration</button>}
  </div>;
}

export default function PropertyPanel({ selectedNode, onUpdate, onClose, nodes = [], edges = [] }) {
  if (!selectedNode) return null;
  return <aside className="h-full w-80 shrink-0 overflow-auto border-l border-[#383944] bg-[#292a35] p-4">
    <div className="mb-5 flex items-center gap-2"><FiSettings /><h2 className="text-sm font-semibold">Node Properties</h2><button type="button" onClick={onClose} aria-label="Close node properties" className="ml-auto px-2">×</button></div>
    {selectedNode.data?.taskId ? <TaskProperties node={selectedNode} /> : <PropertyForm key={`${selectedNode.id}-${selectedNode.data.type}`} selectedNode={selectedNode} onUpdate={onUpdate} nodes={nodes} edges={edges} />}
  </aside>;
}
