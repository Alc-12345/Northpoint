import React from "react";
import {
  FiDatabase,
  FiDownload,
  FiGitMerge,
  FiHardDrive,
  FiMonitor,
  FiServer,
  FiSliders,
} from "react-icons/fi";
import { getDefaultOperation, operationGroups } from "../utils/etlConfig";

const blocks = [
  {
    category: "source",
    icon: <FiDatabase size={18} />,
  },
  {
    category: "transform",
    icon: <FiSliders size={18} />,
  },
  {
    category: "combine",
    icon: <FiGitMerge size={18} />,
  },
  {
    category: "output",
    icon: <FiDownload size={18} />,
  },
  {
    category: "frontend",
    icon: <FiMonitor size={18} />,
  },
  {
    category: "backend",
    icon: <FiHardDrive size={18} />,
  },
  {
    category: "server",
    icon: <FiServer size={18} />,
  },
];

export default function ETLSidebar() {
  const onDragStart = (event, block) => {
    const operation = getDefaultOperation(block.category);

    event.dataTransfer.setData(
      "application/reactflow",
      JSON.stringify({
        category: block.category,
        label: operation.label,
        type: operation.type,
      })
    );

    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className="h-full w-44 shrink-0 overflow-auto border-r border-[#383944] bg-[#292a35] sm:w-52">
      <div className="p-3">
        <h2 className="mb-1 text-sm font-semibold text-white">Nodes</h2>
        <p className="mb-4 text-xs text-slate-400">Drag a node onto the canvas.</p>

        <div className="space-y-1.5">
          {blocks.map((item) => {
            const group = operationGroups[item.category];

            return (
              <div
                key={item.category}
                draggable
                onDragStart={(event) => onDragStart(event, item)}
                className="flex cursor-grab items-center gap-2 rounded-lg border border-transparent p-2 text-slate-200 transition-colors hover:border-[#484955] hover:bg-[#343541]"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-slate-900/50">
                  {item.icon}
                </span>
                <span className="min-w-0">
                  <span className="block text-xs font-medium">{group.label}</span>
                  <span className="block truncate text-[10px] text-slate-300">{group.description}</span>
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
