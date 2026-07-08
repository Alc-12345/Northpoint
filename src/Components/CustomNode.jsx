import React from "react";
import { Handle, Position } from "@xyflow/react";
import {
  FiCode,
  FiColumns,
  FiDatabase,
  FiDownload,
  FiEye,
  FiFileText,
  FiFilter,
  FiGitMerge,
  FiGlobe,
  FiHardDrive,
  FiLayers,
  FiMonitor,
  FiScissors,
  FiServer,
  FiShuffle,
} from "react-icons/fi";
import { operationGroups } from "../utils/etlConfig";

const icons = {
  csv: <FiFileText size={18} />,
  excel: <FiFileText size={18} />,
  sql: <FiDatabase size={18} />,
  api: <FiGlobe size={18} />,
  filter: <FiFilter size={18} />,
  join: <FiGitMerge size={18} />,
  formula: <FiCode size={18} />,
  aggregate: <FiLayers size={18} />,
  union: <FiShuffle size={18} />,
  select: <FiColumns size={18} />,
  split: <FiScissors size={18} />,
  json: <FiCode size={18} />,
  preview: <FiEye size={18} />,
  output: <FiDownload size={18} />,
  "react-page": <FiMonitor size={18} />,
  "dashboard-ui": <FiMonitor size={18} />,
  "form-ui": <FiMonitor size={18} />,
  "table-ui": <FiMonitor size={18} />,
  "rest-api": <FiGlobe size={18} />,
  "auth-service": <FiHardDrive size={18} />,
  "db-model": <FiDatabase size={18} />,
  "background-job": <FiCode size={18} />,
  "node-server": <FiServer size={18} />,
  "express-route": <FiServer size={18} />,
  "env-config": <FiCode size={18} />,
  deployment: <FiDownload size={18} />,
};

const colors = {
  csv: "#3B82F6",
  excel: "#22C55E",
  sql: "#F59E0B",
  api: "#8B5CF6",
  filter: "#EF4444",
  join: "#06B6D4",
  formula: "#10B981",
  aggregate: "#F97316",
  union: "#6366F1",
  select: "#64748B",
  split: "#0891B2",
  json: "#A855F7",
  preview: "#0EA5E9",
  output: "#16A34A",
  "react-page": "#2563EB",
  "dashboard-ui": "#7C3AED",
  "form-ui": "#DB2777",
  "table-ui": "#0F766E",
  "rest-api": "#0284C7",
  "auth-service": "#DC2626",
  "db-model": "#CA8A04",
  "background-job": "#4F46E5",
  "node-server": "#16A34A",
  "express-route": "#059669",
  "env-config": "#64748B",
  deployment: "#EA580C",
};

const statusClasses = {
  Ready: "bg-green-500/20 text-green-300",
  Running: "bg-blue-500/20 text-blue-300",
  Completed: "bg-emerald-500/20 text-emerald-300",
  Failed: "bg-red-500/20 text-red-300",
};

export default function CustomNode({ id, data }) {
  const type = data?.type || "csv";
  const category = data?.category || "source";
  const label = data?.label || "New Node";
  const status = data?.status || "Ready";
  const progress = Math.min(100, Math.max(0, Number(data?.progress || 0)));
  const fileName = data?.fileName || "";
  const canUpload = ["csv", "excel"].includes(type);
  const sqlLabel = data?.sqlTable || data?.sqlConnection || "";
  const operations = operationGroups[category]?.operations || operationGroups.source.operations;

  const handleOperationChange = (event) => {
    const nextType = event.target.value;
    const operation = operations.find((item) => item.type === nextType);

    data?.onOperationChange?.(id, {
      type: nextType,
      label: operation?.label || label,
    });
  };

  return (
    <div className="min-w-[220px] rounded-xl border border-slate-700 bg-[#1E293B] shadow-xl transition-all duration-300 hover:scale-[1.02] hover:border-blue-500 hover:shadow-blue-500/20">
      <Handle type="target" position={Position.Left} className="!h-4 !w-4 !bg-white" />
      <Handle type="source" position={Position.Right} className="!h-4 !w-4 !bg-blue-500" />

      <div className="flex items-center gap-3 rounded-t-xl p-3" style={{ background: colors[type] || "#3B82F6" }}>
        {icons[type] || <FiDatabase size={18} />}

        <div className="min-w-0">
          <h4 className="truncate font-semibold text-white">{label}</h4>
          <p className="text-xs text-white/70">{category.toUpperCase()}</p>
        </div>
      </div>

      <div className="p-3">
        <div className="text-xs text-slate-400">Operation</div>
        <select
          value={type}
          onChange={handleOperationChange}
          className="nodrag mt-1 w-full rounded border border-slate-600 bg-slate-900 px-2 py-1.5 text-sm text-white outline-none focus:border-blue-500"
        >
          {operations.map((operation) => (
            <option key={operation.type} value={operation.type}>
              {operation.label}
            </option>
          ))}
        </select>

        <div className="mt-3 text-xs text-slate-400">Status</div>
        <span className={`mt-1 inline-block rounded-full px-2 py-1 text-xs ${statusClasses[status] || statusClasses.Ready}`}>
          {status}
        </span>

        <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
          <span>Progress</span>
          <span className="text-slate-200">{progress}%</span>
        </div>
        <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-700">
          <div className="h-full rounded-full bg-blue-500 transition-all" style={{ width: `${progress}%` }} />
        </div>

        {canUpload && fileName && (
          <>
            <div className="mt-3 text-xs text-slate-400">File</div>
            <div className="mt-1 max-w-[190px] truncate text-sm text-white">{fileName}</div>
          </>
        )}

        {type === "sql" && sqlLabel && (
          <>
            <div className="mt-3 text-xs text-slate-400">SQL</div>
            <div className="mt-1 max-w-[190px] truncate text-sm text-white">{sqlLabel}</div>
          </>
        )}
      </div>
    </div>
  );
}
