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
  FiTrash2,
} from "react-icons/fi";

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

export default function CustomNode({ id, data, selected }) {
  const type = data?.type || "csv";
  const label = data?.label || "New Node";
  const status = data?.status || "Ready";
  const progress = Math.min(100, Math.max(0, Number(data?.progress || 0)));
  const detail = data?.fileName || data?.sqlTable || data?.category || "source";
  const accent = colors[type] || "#3B82F6";

  return (
    <div className="group relative w-32 text-center">
      <div
        className={`relative mx-auto flex h-[88px] w-[88px] items-center justify-center rounded-2xl border-2 bg-[#252631] shadow-sm transition-colors ${selected ? "border-[#ff6d5a] ring-4 ring-[#ff6d5a]/10" : "border-[#555663] hover:border-slate-300"}`}
      >
        <Handle type="target" position={Position.Left} className="!h-2.5 !w-2.5 !border-2 !border-[#a1a1aa] !bg-[#20212b]" />
        <Handle type="source" position={Position.Right} className="!h-2.5 !w-2.5 !border-2 !border-[#a1a1aa] !bg-[#20212b]" />
        <span className="flex h-12 w-12 items-center justify-center rounded-xl [&>svg]:h-8 [&>svg]:w-8" style={{ color: accent, backgroundColor: `${accent}18` }}>
          {icons[type] || <FiDatabase size={32} />}
        </span>
        <button
          type="button"
          aria-label={`Delete ${label}`}
          title="Delete node"
          className="nodrag nopan absolute -right-2 -top-2 rounded-md border border-slate-600 bg-[#30313e] p-1 text-slate-300 opacity-0 transition-opacity hover:text-red-400 focus:opacity-100 group-hover:opacity-100 group-focus-within:opacity-100"
          onClick={(event) => {
            event.stopPropagation();
            data?.onDelete?.(id);
          }}
        >
          <FiTrash2 size={12} />
        </button>
        {status === "Running" && (
          <div className="absolute inset-x-2 bottom-1.5 h-1 overflow-hidden rounded-full bg-slate-700">
            <div className="h-full bg-[#ff6d5a] transition-all" style={{ width: `${progress}%` }} />
          </div>
        )}
      </div>
      <h4 className="mt-2 truncate text-xs font-semibold text-slate-100" title={label}>{label}</h4>
      <p className="mt-0.5 truncate text-[10px] capitalize text-slate-400" title={detail}>{detail}</p>
      {status !== "Ready" && (
        <span className={`mt-1 inline-block rounded px-1.5 py-0.5 text-[10px] ${statusClasses[status] || statusClasses.Ready}`}>
          {status}
        </span>
      )}
    </div>
  );
}
