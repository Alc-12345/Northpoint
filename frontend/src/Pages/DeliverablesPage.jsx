import React from "react";
import {
  FiUpload,
  FiCheckCircle,
  FiDownload,
  FiFileText,
} from "react-icons/fi";

const uploadedFiles = [
  { name: "Project Proposal.pdf", date: "2026-06-01", size: "2.3 MB" },
  { name: "Design Mockup.fig", date: "2026-06-03", size: "5.1 MB" },
];

const completedWork = [
  { name: "Landing Page Design", status: "Completed" },
  { name: "Dashboard UI", status: "Completed" },
];

const downloads = [
  { name: "Final Report.pdf", type: "PDF", size: "4.2 MB" },
  { name: "Source Code.zip", type: "ZIP", size: "12 MB" },
];

export default function DeliverablesPage() {
  return (
    <div className="p-6 space-y-6 bg-[#0B1220] min-h-screen">

      {/* Header */}
      <h1 className="text-2xl font-bold text-white">
        Deliverables
      </h1>

      {/* Uploaded Files */}
      <div className="bg-[#111C2D] border-[#243244] p-5 rounded-xl shadow text-white">
        <div className="flex items-center gap-2 mb-4">
          <FiUpload className="text-white" />
          <h2 className="text-lg  font-semibold">Uploaded Files</h2>
        </div>

        <table className="w-full text-left">
          <thead>
            <tr className="text-white border-b">
              <th className="py-2">File Name</th>
              <th>Date</th>
              <th>Size</th>
            </tr>
          </thead>
          <tbody>
            {uploadedFiles.map((file, i) => (
              <tr key={i} className="border-b hover:bg-[#172235]">
                <td className="py-2 flex items-center gap-2">
                  <FiFileText className="text-gray-500" />
                  {file.name}
                </td>
                <td>{file.date}</td>
                <td>{file.size}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Completed Work */}
      <div className="bg-[#111C2D]  border-[#243244] p-5 rounded-xl shadow">
        <div className="flex items-center gap-2 mb-4">
          <FiCheckCircle className="text-green-500" />
          <h2 className="text-lg text-white font-semibold">Completed Work</h2>
        </div>

        <ul className="space-y-3">
          {completedWork.map((work, i) => (
            <li
              key={i}
              className="flex justify-between items-center p-3 bg-[#172235] text-white rounded"
            >
              <span>{work.name}</span>
              <span className="text-green-600 font-medium">
                {work.status}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Downloads */}
      <div className="bg-[#111C2D] border-[#243244] p-5 rounded-xl shadow">
        <div className="flex items-center gap-2 mb-4">
          <FiDownload className="text-gray-200" />
          <h2 className="text-lg text-white font-semibold">Downloads</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {downloads.map((file, i) => (
            <div
              key={i}
              className="p-4 border rounded-lg flex justify-between items-center hover:shadow"
            >
              <div>
                <p className="font-medium text-white">{file.name}</p>
                <p className="text-sm text-gray-400">
                  {file.type} • {file.size}
                </p>
              </div>

              <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
                Download
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}