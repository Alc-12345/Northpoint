import React from "react";
import {
  FiFile,
  FiDatabase,
  FiFilter,
  FiGitMerge,
  FiShuffle,
  FiLayers,
  FiCode,
  FiUpload,
} from "react-icons/fi";

const blocks = [
  {
    label: "CSV Input",
    type: "csv",
    icon: <FiFile size={18} />,
  },
  {
    label: "Excel Input",
    type: "excel",
    icon: <FiFile size={18} />,
  },
  {
    label: "SQL Input",
    type: "sql",
    icon: <FiDatabase size={18} />,
  },
  {
    label: "API Input",
    type: "api",
    icon: <FiUpload size={18} />,
  },
  {
    label: "Filter",
    type: "filter",
    icon: <FiFilter size={18} />,
  },
  {
    label: "Formula",
    type: "formula",
    icon: <FiCode size={18} />,
  },
  {
    label: "Join",
    type: "join",
    icon: <FiGitMerge size={18} />,
  },
  {
    label: "Union",
    type: "union",
    icon: <FiShuffle size={18} />,
  },
  {
    label: "Aggregate",
    type: "aggregate",
    icon: <FiLayers size={18} />,
  },
];

export default function ETLSidebar() {
  const onDragStart = (event, nodeType, label) => {
    event.dataTransfer.setData(
      "application/reactflow",
      JSON.stringify({
        type: nodeType,
        label,
      })
    );

    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className="w-72 bg-[#111827] border-r border-slate-700 h-full overflow-auto">

      <div className="p-5">

        <h2 className="text-xl text-white font-bold mb-5">
          ETL Components
        </h2>

        <div className="space-y-3">

          {blocks.map((item) => (

            <div
              key={item.label}
              draggable
              onDragStart={(e) =>
                onDragStart(e, item.type, item.label)
              }
              className="bg-[#1E293B] hover:bg-blue-600 transition-all duration-200 rounded-lg p-3 cursor-grab flex items-center gap-3 text-white shadow"
            >

              {item.icon}

              <span>{item.label}</span>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}