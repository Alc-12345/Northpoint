import React, { useState, useEffect } from "react";
import {
  FiSave,
  FiSettings,
  FiDatabase,
} from "react-icons/fi";

export default function PropertyPanel({
  selectedNode,
  onUpdate,
}) {

  const [form, setForm] = useState({
    name: "",
    description: "",
    type: "",
    expression: "",
    employee: "",
    hours: "",
    status: "Ready",
  });

  useEffect(() => {

    if (!selectedNode) return;

    setForm({
      name: selectedNode.data?.label || "",
      description: selectedNode.data?.description || "",
      type: selectedNode.data?.type || "",
      expression: selectedNode.data?.expression || "",
      employee: selectedNode.data?.employee || "",
      hours: selectedNode.data?.hours || "",
      status: selectedNode.data?.status || "Ready",
    });

  }, [selectedNode]);

  const handleChange = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = () => {

    if (!selectedNode) return;

    onUpdate(selectedNode.id, form);

  };

  return (
    <div className="w-80 bg-[#111827] border-l border-slate-700 h-full overflow-auto">

      <div className="p-5">

        <div className="flex items-center gap-3 mb-6">

          <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
            <FiSettings />
          </div>

          <div>
            <h2 className="text-white font-bold text-lg">
              Node Properties
            </h2>

            <p className="text-slate-400 text-sm">
              Configure ETL Block
            </p>
          </div>

        </div>

        {!selectedNode ? (

          <div className="text-center py-12">

            <FiDatabase
              size={50}
              className="mx-auto text-slate-500"
            />

            <p className="text-slate-400 mt-4">
              Select a node from canvas
            </p>

          </div>

        ) : (

          <>

            <label className="text-slate-300 text-sm">
              Node Name
            </label>

            <input
              value={form.name}
              onChange={(e)=>handleChange("name",e.target.value)}
              className="w-full mt-2 mb-4 bg-slate-800 p-3 rounded text-white"
            />

            <label className="text-slate-300 text-sm">
              Description
            </label>

            <textarea
              rows={3}
              value={form.description}
              onChange={(e)=>handleChange("description",e.target.value)}
              className="w-full mt-2 mb-4 bg-slate-800 p-3 rounded text-white"
            />

            <label className="text-slate-300 text-sm">
              Node Type
            </label>

            <select
              value={form.type}
              onChange={(e)=>handleChange("type",e.target.value)}
              className="w-full mt-2 mb-4 bg-slate-800 p-3 rounded text-white"
            >
              <option value="csv">CSV</option>
              <option value="excel">Excel</option>
              <option value="sql">SQL</option>
              <option value="api">API</option>
              <option value="filter">Filter</option>
              <option value="join">Join</option>
              <option value="formula">Formula</option>
              <option value="aggregate">Aggregate</option>
            </select>

            <label className="text-slate-300 text-sm">
              Employee
            </label>

            <input
              value={form.employee}
              onChange={(e)=>handleChange("employee",e.target.value)}
              className="w-full mt-2 mb-4 bg-slate-800 p-3 rounded text-white"
            />

            <label className="text-slate-300 text-sm">
              Hours
            </label>

            <input
              value={form.hours}
              onChange={(e)=>handleChange("hours",e.target.value)}
              className="w-full mt-2 mb-4 bg-slate-800 p-3 rounded text-white"
            />

            <label className="text-slate-300 text-sm">
              SQL / Formula
            </label>

            <textarea
              rows={4}
              value={form.expression}
              onChange={(e)=>handleChange("expression",e.target.value)}
              className="w-full mt-2 mb-4 bg-slate-800 p-3 rounded text-white"
            />

            <label className="text-slate-300 text-sm">
              Status
            </label>

            <select
              value={form.status}
              onChange={(e)=>handleChange("status",e.target.value)}
              className="w-full mt-2 mb-5 bg-slate-800 p-3 rounded text-white"
            >
              <option>Ready</option>
              <option>Running</option>
              <option>Completed</option>
              <option>Failed</option>
            </select>

            <button
              onClick={handleSave}
              className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg flex justify-center items-center gap-2"
            >
              <FiSave />
              Save Configuration
            </button>

          </>

        )}

      </div>

    </div>
  );
}