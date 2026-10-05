import React from "react";
import {
  FiArrowLeft,
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
  onBack,
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
    <div className="flex min-h-12 shrink-0 flex-wrap items-center justify-between gap-2 border-b border-[#383944] bg-[#292a35] px-2.5 py-1.5">
      <div className="flex min-w-0 items-center gap-2">
        <button type="button" onClick={onBack} className="flex items-center gap-1.5 rounded bg-slate-700 px-2.5 py-1.5 text-xs text-white transition hover:bg-slate-600" aria-label="Back from ETL">
          <FiArrowLeft size={16} /> Back
        </button>
        <h2 className="text-sm font-semibold text-white">ETL Builder</h2>
        <span className="hidden text-xs text-slate-400 xl:inline">Workflow editor</span>
        {apiMessage && <span className="max-w-48 truncate text-[10px] text-slate-400">{apiMessage}</span>}
      </div>

      <div className="flex flex-wrap items-center gap-1.5 text-xs">
        <button
          onClick={onSave}
          className="flex items-center gap-2 rounded bg-blue-600 px-2.5 py-1.5 text-white transition hover:bg-blue-700"
        >
          <FiSave size={16} />
          Save
        </button>

        <button
          onClick={onRun}
          disabled={isRunning}
          className="flex items-center gap-2 rounded bg-[#ff6d5a] px-2.5 py-1.5 text-white transition hover:bg-[#e85c4a] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <FiPlay size={16} />
          {isRunning ? "Running" : "Run"}
        </button>

        <button
          onClick={onImport}
          className="flex items-center gap-2 rounded bg-slate-700 px-2.5 py-1.5 text-white transition hover:bg-slate-600"
        >
          <FiUpload size={16} />
          Import
        </button>

        <button
          onClick={() => exportWorkflow(nodes, edges)}
          className="flex items-center gap-2 rounded bg-slate-700 px-2.5 py-1.5 text-white transition hover:bg-slate-600"
        >
          <FiDownload size={16} />
          Export
        </button>

        <div className="mx-1 h-5 w-px bg-slate-600" />

        <button onClick={onUndo} className="rounded bg-slate-700 p-1.5 text-white transition hover:bg-slate-600" title="Undo">
          <FiRotateCcw />
        </button>

        <button onClick={onRedo} className="rounded bg-slate-700 p-1.5 text-white transition hover:bg-slate-600" title="Redo">
          <FiRotateCw />
        </button>

        <div className="mx-1 h-5 w-px bg-slate-600" />

        <button onClick={onZoomOut} className="rounded bg-slate-700 p-1.5 text-white transition hover:bg-slate-600" title="Zoom out">
          <FiZoomOut />
        </button>

        <button onClick={onZoomIn} className="rounded bg-slate-700 p-1.5 text-white transition hover:bg-slate-600" title="Zoom in">
          <FiZoomIn />
        </button>

        <button onClick={onReset} className="rounded bg-slate-700 p-1.5 text-white transition hover:bg-slate-600" title="Reset view">
          <FiRefreshCw />
        </button>
      </div>
    </div>
  );
}
