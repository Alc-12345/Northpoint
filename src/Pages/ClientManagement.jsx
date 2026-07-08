import { useEffect, useState } from "react";
import { FiBriefcase, FiEdit, FiPlus, FiTrash2 } from "react-icons/fi";
import { Link } from "react-router-dom";
import { leadApi } from "../services/api";

const statusClass = {
  New: "bg-sky-100 text-sky-700",
  Contacted: "bg-blue-100 text-blue-700",
  Qualified: "bg-violet-100 text-violet-700",
  Converted: "bg-green-100 text-green-700",
  Lost: "bg-red-100 text-red-700",
};

export default function ClientManagementPage() {
  const [leads, setLeads] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [draftStatus, setDraftStatus] = useState("New");

  useEffect(() => {
    const loadLeads = async () => {
      try {
        const data = await leadApi.getAll();
        setLeads(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadLeads();
  }, []);

  const handleDelete = async (id) => {
    try {
      await leadApi.remove(id);
      setLeads(leads.filter((lead) => lead._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditStart = (lead) => {
    setEditingId(lead._id);
    setDraftStatus(lead.status || "New");
  };

  const handleEditSave = async (id) => {
    try {
      const updated = await leadApi.update(id, { status: draftStatus });
      setLeads(leads.map((lead) => (lead._id === id ? updated : lead)));
      setEditingId(null);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="admin-dashboard min-h-screen bg-gray-100 p-6 text-gray-800 transition-colors duration-300 dark:bg-[#0b1220] dark:text-gray-200">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Leads</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Project requests from the website contact form.</p>
        </div>

        <Link
          to="/clients/add"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          <FiPlus />
          Add Lead
        </Link>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm dark:border-[#243244] dark:bg-[#0b1220]">
        {error && (
          <div className="m-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600">
            {error}
          </div>
        )}
        {isLoading && <div className="p-6 text-sm text-gray-500">Loading leads...</div>}
        {!isLoading && leads.length === 0 && !error && (
          <div className="p-6 text-sm text-gray-500">No leads found.</div>
        )}

        <table className="w-full text-sm">
          <thead className="bg-gray-100 dark:bg-[#2a2a2a]">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Need</th>
              <th className="p-3 text-left">Stage</th>
              <th className="p-3 text-left">Budget</th>
              <th className="p-3 text-left">Timeline</th>
              <th className="p-3 text-left">Industry</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {leads.map((lead) => (
              <tr key={lead._id} className="border-t border-gray-200 dark:border-[#243244]">
                <td className="p-3 font-medium">{lead.name}</td>
                <td className="p-3">{lead.email}</td>
                <td className="p-3">{lead.projectNeed || lead.service || "-"}</td>
                <td className="p-3">{lead.projectStage || "-"}</td>
                <td className="p-3">{lead.projectBudget || lead.budget || "-"}</td>
                <td className="p-3">{lead.projectTimeline || "-"}</td>
                <td className="p-3">{lead.industry || "-"}</td>
                <td className="p-3">
                  {editingId === lead._id ? (
                    <select
                      value={draftStatus}
                      onChange={(event) => setDraftStatus(event.target.value)}
                      className="rounded-lg border border-gray-300 bg-white p-2 dark:border-gray-600 dark:bg-[#0b1220]"
                    >
                      <option>New</option>
                      <option>Contacted</option>
                      <option>Qualified</option>
                      <option>Converted</option>
                      <option>Lost</option>
                    </select>
                  ) : (
                    <span className={`rounded-full px-2 py-1 text-xs font-medium ${statusClass[lead.status] || statusClass.New}`}>
                      {lead.status || "New"}
                    </span>
                  )}
                </td>
                <td className="p-3">
                  <div className="flex justify-center gap-3">
                    <Link
                      to="/add-project"
                      state={{ lead }}
                      className="text-green-600 hover:text-green-800"
                      title="Add project from lead"
                    >
                      <FiBriefcase />
                    </Link>
                    {editingId === lead._id ? (
                      <button onClick={() => handleEditSave(lead._id)} className="text-blue-600 hover:text-blue-800">
                        Save
                      </button>
                    ) : (
                      <button onClick={() => handleEditStart(lead)} className="text-blue-600 hover:text-blue-800" title="Edit status">
                        <FiEdit />
                      </button>
                    )}
                    <button onClick={() => handleDelete(lead._id)} className="text-red-600 hover:text-red-800" title="Delete lead">
                      <FiTrash2 />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
