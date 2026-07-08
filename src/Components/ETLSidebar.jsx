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
    <div className="h-full w-72 overflow-auto border-r border-slate-700 bg-[#111827]">
      <div className="p-5">
        <h2 className="mb-1 text-xl font-bold text-white">ETL Components</h2>
        <p className="mb-5 text-sm text-slate-400">Pick the main block here. Select the operation inside the card.</p>

        <div className="space-y-3">
          {blocks.map((item) => {
            const group = operationGroups[item.category];

            return (
              <div
                key={item.category}
                draggable
                onDragStart={(event) => onDragStart(event, item)}
                className="flex cursor-grab items-center gap-3 rounded-lg bg-[#1E293B] p-3 text-white shadow transition-all duration-200 hover:bg-blue-600"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded bg-slate-900/50">
                  {item.icon}
                </span>
                <span className="min-w-0">
                  <span className="block font-semibold">{group.label}</span>
                  <span className="block truncate text-xs text-slate-300">{group.description}</span>
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
