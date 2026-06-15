import React from "react";
import { Handle, Position } from "@xyflow/react";
import {
  FiDatabase,
  FiFileText,
  FiFilter,
  FiGitMerge,
  FiCode,
  FiLayers,
  FiGlobe,
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
};

export default function CustomNode({ data }) {
const type = data?.type || "csv";
const label = data?.label || "New Node";
const description = data?.description || "No description";

  return (
    <div
      className="
min-w-[200px]
rounded-xl
shadow-xl
border
border-slate-700
bg-[#1E293B]
hover:border-blue-500
hover:shadow-blue-500/20
hover:scale-105
transition-all
duration-300
"
    >
      {/* Input Handle */}
     <Handle
  type="target"
  position={Position.Left}
  className="!w-4 !h-4 !bg-white"
/>

<Handle
  type="source"
  position={Position.Right}
  className="!w-4 !h-4 !bg-blue-500"
/>

      {/* Header */}
      <div
        className="flex items-center gap-3 p-3 rounded-t-xl"
       style={{
  background: colors[type] || "#3B82F6",
}}
      >
        {icons[type] || <FiDatabase size={18} />}

        <div>
          <h4 className="text-white font-semibold">
  {label}
</h4>

          <p className="text-white/70 text-xs">
            {type.toUpperCase()}
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="p-3">

        <div className="text-xs text-slate-400">
          Status
        </div>

        <span className="inline-block mt-1 px-2 py-1 rounded-full bg-green-500/20 text-green-400 text-xs">
  Ready
</span>
        <h4 className="text-white font-semibold">
  {label}
</h4>

     <div className="mt-3 text-xs text-slate-400">
  Description
</div>

<div className="text-white text-sm mt-1">
  {description}
</div>

      </div>

      
    </div>
    
  );
}