import React, { useState } from "react";
import { FiDatabase, FiDownload, FiSave, FiSettings, FiUpload } from "react-icons/fi";
import { getOperationLabel, operationGroups } from "../utils/etlConfig";

const fieldClass = "mt-2 mb-4 w-full rounded bg-slate-800 p-3 text-white outline-none focus:ring-2 focus:ring-blue-500";

const defaultOutputRows = [
  { id: "1001", name: "Sample Customer", status: "Completed", result: "Valid" },
  { id: "1002", name: "Demo Account", status: "Completed", result: "Valid" },
  { id: "1003", name: "Test Record", status: "Completed", result: "Review" },
];

const downloadBlob = (content, fileName, type) => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
};

const rowsToCsv = (rows) => {
  if (!rows.length) return "";

  const headers = Object.keys(rows[0]);
  const escapeCell = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;

  return [
    headers.join(","),
    ...rows.map((row) => headers.map((header) => escapeCell(row[header])).join(",")),
  ].join("\n");
};

const getInitialForm = (selectedNode) => ({
  name: selectedNode.data?.label || "",
  category: selectedNode.data?.category || "source",
  type: selectedNode.data?.type || "csv",
  endpoint: selectedNode.data?.endpoint || "",
  method: selectedNode.data?.method || "GET",
  expression: selectedNode.data?.expression || "",
  sqlConnection: selectedNode.data?.sqlConnection || "",
  sqlTable: selectedNode.data?.sqlTable || "",
  status: selectedNode.data?.status || "Ready",
  progress: selectedNode.data?.progress || 0,
  fileName: selectedNode.data?.fileName || "",
  fileSize: selectedNode.data?.fileSize || "",
  outputRows: selectedNode.data?.outputRows || [],
});

function PropertyForm({ selectedNode, onUpdate }) {
  const [form, setForm] = useState(() => getInitialForm(selectedNode));

  const handleChange = (key, value) => {
    setForm((prev) => {
      if (key === "progress") {
        return {
          ...prev,
          progress: Math.min(100, Math.max(0, Number(value) || 0)),
        };
      }

      if (key !== "type") {
        return {
          ...prev,
          [key]: value,
        };
      }

      return {
        ...prev,
        type: value,
        name: getOperationLabel(value),
      };
    });
  };

  const handleSave = () => {
    onUpdate(selectedNode.id, form);
  };

  const operations = operationGroups[form.category]?.operations || operationGroups.source.operations;
  const canUpload = ["csv", "excel"].includes(form.type);
  const canDownloadOutput = ["preview", "output"].includes(form.type);
  const outputRows = form.outputRows.length ? form.outputRows : defaultOutputRows;
  const uploadAccept = form.type === "excel" ? ".xls,.xlsx" : ".csv,text/csv";

  return (
    <>
      <label className="text-sm text-slate-300">Node Name</label>
      <input value={form.name} onChange={(event) => handleChange("name", event.target.value)} className={fieldClass} />

      <label className="text-sm text-slate-300">Operation</label>
      <select value={form.type} onChange={(event) => handleChange("type", event.target.value)} className={fieldClass}>
        {operations.map((operation) => (
          <option key={operation.type} value={operation.type}>
            {operation.label}
          </option>
        ))}
      </select>

      {canUpload && (
        <div className="mb-4">
          <label className="text-sm text-slate-300">Upload File</label>
          <label className="mt-2 flex cursor-pointer items-center justify-center gap-2 rounded border border-dashed border-slate-600 bg-slate-800 p-4 text-sm text-slate-200 transition hover:border-blue-500 hover:bg-slate-700">
            <FiUpload />
            {form.fileName || `Choose ${form.type.toUpperCase()} file`}
            <input
              type="file"
              accept={uploadAccept}
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (!file) return;

                setForm((prev) => ({
                  ...prev,
                  fileName: file.name,
                  fileSize: `${Math.ceil(file.size / 1024)} KB`,
                }));
              }}
            />
          </label>
          {form.fileName && (
            <p className="mt-2 truncate text-xs text-slate-400">
              {form.fileName} {form.fileSize ? `(${form.fileSize})` : ""}
            </p>
          )}
        </div>
      )}

      {form.type === "sql" && (
        <>
          <label className="text-sm text-slate-300">SQL Connection</label>
          <input
            value={form.sqlConnection}
            onChange={(event) => handleChange("sqlConnection", event.target.value)}
            placeholder="Production warehouse"
            className={fieldClass}
          />

          <label className="text-sm text-slate-300">Table / View</label>
          <input
            value={form.sqlTable}
            onChange={(event) => handleChange("sqlTable", event.target.value)}
            placeholder="public.customers"
            className={fieldClass}
          />

          <label className="text-sm text-slate-300">SQL Query</label>
          <textarea
            rows={5}
            value={form.expression}
            onChange={(event) => handleChange("expression", event.target.value)}
            placeholder="SELECT * FROM public.customers"
            className={fieldClass}
          />
        </>
      )}

      {form.type === "api" && (
        <>
          <label className="text-sm text-slate-300">API Method</label>
          <select value={form.method} onChange={(event) => handleChange("method", event.target.value)} className={fieldClass}>
            <option>GET</option>
            <option>POST</option>
            <option>PUT</option>
            <option>PATCH</option>
          </select>

          <label className="text-sm text-slate-300">API Endpoint</label>
          <input
            value={form.endpoint}
            onChange={(event) => handleChange("endpoint", event.target.value)}
            placeholder="https://api.example.com/customers"
            className={fieldClass}
          />
        </>
      )}

      {!["csv", "excel", "sql", "api", "preview", "output"].includes(form.type) && (
        <>
          <label className="text-sm text-slate-300">Rule / Expression</label>
          <textarea
            rows={4}
            value={form.expression}
            onChange={(event) => handleChange("expression", event.target.value)}
            placeholder="email IS NOT NULL"
            className={fieldClass}
          />
        </>
      )}

      {canDownloadOutput && (
        <div className="mb-4 rounded-lg border border-slate-700 bg-slate-900/60 p-3">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white">View Output</h3>
              <p className="text-xs text-slate-400">Operated data preview</p>
            </div>
            <span className="rounded bg-blue-500/20 px-2 py-1 text-xs text-blue-300">
              {outputRows.length} rows
            </span>
          </div>

          <div className="mb-3 max-h-36 overflow-auto rounded border border-slate-700">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-800 text-slate-300">
                <tr>
                  {Object.keys(outputRows[0] || {}).map((header) => (
                    <th key={header} className="px-2 py-2 font-semibold">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200">
                {outputRows.map((row, index) => (
                  <tr key={`${row.id || "row"}-${index}`}>
                    {Object.keys(outputRows[0] || {}).map((header) => (
                      <td key={header} className="px-2 py-2">
                        {row[header]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => downloadBlob(rowsToCsv(outputRows), "operated-data.csv", "text/csv")}
              className="flex items-center justify-center gap-2 rounded bg-slate-700 px-3 py-2 text-sm text-white hover:bg-slate-600"
            >
              <FiDownload />
              CSV
            </button>
            <button
              type="button"
              onClick={() =>
                downloadBlob(JSON.stringify(outputRows, null, 2), "operated-data.json", "application/json")
              }
              className="flex items-center justify-center gap-2 rounded bg-slate-700 px-3 py-2 text-sm text-white hover:bg-slate-600"
            >
              <FiDownload />
              JSON
            </button>
          </div>
        </div>
      )}

      <label className="text-sm text-slate-300">Status</label>
      <select value={form.status} onChange={(event) => handleChange("status", event.target.value)} className={fieldClass}>
        <option>Ready</option>
        <option>Running</option>
        <option>Completed</option>
        <option>Failed</option>
      </select>

      <div className="mb-4">
        <div className="mb-2 flex items-center justify-between">
          <label className="text-sm text-slate-300">Progress</label>
          <span className="text-sm font-semibold text-white">{form.progress}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={form.progress}
          onChange={(event) => handleChange("progress", event.target.value)}
          className="w-full accent-blue-500"
        />
        <input
          type="number"
          min="0"
          max="100"
          value={form.progress}
          onChange={(event) => handleChange("progress", event.target.value)}
          className="mt-2 w-full rounded bg-slate-800 p-3 text-white outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        onClick={handleSave}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-3 text-white hover:bg-blue-700"
      >
        <FiSave />
        Save Configuration
      </button>
    </>
  );
}

export default function PropertyPanel({ selectedNode, onUpdate }) {
  return (
    <div className="h-full w-80 overflow-auto border-l border-slate-700 bg-[#111827]">
      <div className="p-5">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
            <FiSettings />
          </div>

          <div>
            <h2 className="text-lg font-bold text-white">Node Properties</h2>
            <p className="text-sm text-slate-400">Configure ETL block</p>
          </div>
        </div>

        {!selectedNode ? (
          <div className="py-12 text-center">
            <FiDatabase size={50} className="mx-auto text-slate-500" />
            <p className="mt-4 text-slate-400">Select a node from canvas</p>
          </div>
        ) : (
          <PropertyForm key={selectedNode.id} selectedNode={selectedNode} onUpdate={onUpdate} />
        )}
      </div>
    </div>
  );
}
