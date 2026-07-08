import React from "react";
import {
  FiDownload,
  FiPlay,
  FiRefreshCw,
  FiRotateCcw,
  FiRotateCw,
  FiSave,
  FiUpload,
  FiZoomIn,
  FiZoomOut,
} from "react-icons/fi";
import { exportWorkflow } from "../utils/workflowUtils";

export default function CanvasToolbar({
  nodes = [],
  edges = [],
  onSave,
  onRun,
  onImport,
  onUndo,
  onRedo,
  onZoomIn,
  onZoomOut,
  onReset,
  isRunning,
  apiMessage,
}) {
  return (
    <div className="flex h-14 items-center justify-between border-b border-slate-700 bg-[#111827] px-4">
      <div className="flex min-w-0 items-center gap-3">
        <h2 className="text-lg font-bold text-white">ETL Builder</h2>
        <span className="hidden text-sm text-slate-400 sm:inline">Visual Workflow Designer</span>
        {apiMessage && <span className="truncate text-xs text-slate-400">{apiMessage}</span>}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onSave}
          className="flex items-center gap-2 rounded bg-blue-600 px-3 py-2 text-white transition hover:bg-blue-700"
        >
          <FiSave size={16} />
          Save
        </button>

        <button
          onClick={onRun}
          disabled={isRunning}
          className="flex items-center gap-2 rounded bg-green-600 px-3 py-2 text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <FiPlay size={16} />
          {isRunning ? "Running" : "Run"}
        </button>

        <button
          onClick={onImport}
          className="flex items-center gap-2 rounded bg-slate-700 px-3 py-2 text-white transition hover:bg-slate-600"
        >
          <FiUpload size={16} />
          Import
        </button>

        <button
          onClick={() => exportWorkflow(nodes, edges)}
          className="flex items-center gap-2 rounded bg-slate-700 px-3 py-2 text-white transition hover:bg-slate-600"
        >
          <FiDownload size={16} />
          Export
        </button>

        <div className="mx-2 h-8 w-px bg-slate-600" />

        <button onClick={onUndo} className="rounded bg-slate-700 p-2 text-white transition hover:bg-slate-600" title="Undo">
          <FiRotateCcw />
        </button>

        <button onClick={onRedo} className="rounded bg-slate-700 p-2 text-white transition hover:bg-slate-600" title="Redo">
          <FiRotateCw />
        </button>

        <div className="mx-2 h-8 w-px bg-slate-600" />

        <button onClick={onZoomOut} className="rounded bg-slate-700 p-2 text-white transition hover:bg-slate-600" title="Zoom out">
          <FiZoomOut />
        </button>

        <button onClick={onZoomIn} className="rounded bg-slate-700 p-2 text-white transition hover:bg-slate-600" title="Zoom in">
          <FiZoomIn />
        </button>

        <button onClick={onReset} className="rounded bg-slate-700 p-2 text-white transition hover:bg-slate-600" title="Reset view">
          <FiRefreshCw />
        </button>
      </div>
    </div>
  );
}
