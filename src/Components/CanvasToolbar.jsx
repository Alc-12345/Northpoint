import React from "react";
import {
  FiSave,
  FiPlay,
  FiUpload,
  FiDownload,
  FiRotateCcw,
  FiRotateCw,
  FiZoomIn,
  FiZoomOut,
  FiRefreshCw,
} from "react-icons/fi";
import {
  saveWorkflow,
  exportWorkflow,
} from "../utils/workflowUtils";

export default function CanvasToolbar({
  nodes,
  edges,
  onRun,
  onImport,
  onUndo,
  onRedo,
  onZoomIn,
  onZoomOut,
  onReset,
}) {
  return (
    <div className="h-14 bg-[#111827] border-b border-slate-700 flex items-center justify-between px-4">

      {/* Left */}
      <div className="flex items-center gap-3">

        <h2 className="text-lg font-bold text-white">
          ETL Builder
        </h2>

        <span className="text-slate-400 text-sm">
          Visual Workflow Designer
        </span>

      </div>

      {/* Right */}

      <div className="flex items-center gap-2">

        <button
          onClick={() => saveWorkflow(nodes, edges)}
          className="bg-blue-600 hover:bg-blue-700 transition px-3 py-2 rounded flex items-center gap-2"
        >
          <FiSave size={16} />
          Save
        </button>

        <button
  onClick={() => {
    console.log("Run clicked");
    onRun?.();
  }}
  className="bg-green-600 hover:bg-green-700 transition px-3 py-2 rounded flex items-center gap-2"
>
  <FiPlay size={16} />
  Run
</button>

        <button
          onClick={onImport}
          className="bg-slate-700 hover:bg-slate-600 transition px-3 py-2 rounded flex items-center gap-2"
        >
          <FiUpload size={16} />
          Import
        </button>

       <button
  onClick={() => exportWorkflow(nodes, edges)}
  className="bg-slate-700 hover:bg-slate-600 transition px-3 py-2 rounded flex items-center gap-2"
>
  <FiDownload size={16} />
  Export
</button>

        <div className="w-px h-8 bg-slate-600 mx-2"></div>

        <button
          onClick={onUndo}
          className="bg-slate-700 hover:bg-slate-600 transition p-2 rounded"
        >
          <FiRotateCcw />
        </button>

        <button
          onClick={onRedo}
          className="bg-slate-700 hover:bg-slate-600 transition p-2 rounded"
        >
          <FiRotateCw />
        </button>

        <div className="w-px h-8 bg-slate-600 mx-2"></div>

        <button
          onClick={onZoomOut}
          className="bg-slate-700 hover:bg-slate-600 transition p-2 rounded"
        >
          <FiZoomOut />
        </button>

        <button
          onClick={onZoomIn}
          className="bg-slate-700 hover:bg-slate-600 transition p-2 rounded"
        >
          <FiZoomIn />
        </button>

        <button
          onClick={onReset}
          className="bg-slate-700 hover:bg-slate-600 transition p-2 rounded"
        >
          <FiRefreshCw />
        </button>

      </div>

    </div>
  );
}