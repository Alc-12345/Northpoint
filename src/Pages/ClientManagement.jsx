import { useEffect, useState } from "react";
import {
  FiBriefcase,
  FiEdit,
  FiGrid,
  FiList,
  FiPlus,
  FiTrash2,
} from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { leadApi } from "../services/api";

const statusClass = {
  "New Lead": "bg-sky-100 text-sky-700",
  New: "bg-sky-100 text-sky-700",
  Contacted: "bg-blue-100 text-blue-700",
  Qualified: "bg-violet-100 text-violet-700",
  Converted: "bg-green-100 text-green-700",
  Lost: "bg-red-100 text-red-700",
};

export default function ClientManagementPage() {
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [draftStatus, setDraftStatus] = useState("New Lead");
  const [view, setView] = useState("table");
  const [convertingId, setConvertingId] = useState(null);

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
    setDraftStatus(lead.status || "New Lead");
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

  const handleConvert = async (lead) => {
    try {
      setError("");
      setConvertingId(lead._id);
      const result = await leadApi.convert(lead._id);
      setLeads(leads.map((item) => (item._id === lead._id ? result.lead : item)));
      navigate("/clients/add", {
        state: {
          clientPrefill: result.clientPrefill,
          convertedProject: result.project,
        },
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setConvertingId(null);
    }
  };

  return (
    <div className="admin-dashboard min-h-screen bg-gray-100 p-6 text-gray-800 transition-colors duration-300 dark:bg-[#0b1220] dark:text-gray-200">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Lead Management</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Leads entered by your team with one-click project conversion.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex rounded-lg border border-gray-200 bg-white p-1 dark:border-[#243244] dark:bg-[#0b1220]">
            <button
              type="button"
              onClick={() => setView("table")}
              className={`rounded-md px-3 py-2 ${view === "table" ? "bg-blue-600 text-white" : "text-gray-500"}`}
              title="Table view"
            >
              <FiList />
            </button>
            <button
              type="button"
              onClick={() => setView("card")}
              className={`rounded-md px-3 py-2 ${view === "card" ? "bg-blue-600 text-white" : "text-gray-500"}`}
              title="Card view"
            >
              <FiGrid />
            </button>
          </div>
          <Link
            to="/clients/add"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            <FiPlus />
            Add Lead
          </Link>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-[#243244] dark:bg-[#0b1220]">
        {error && (
          <div className="m-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600">
            {error}
          </div>
        )}
        {isLoading && <div className="p-6 text-sm text-gray-500">Loading leads...</div>}
        {!isLoading && leads.length === 0 && !error && (
          <div className="p-6 text-sm text-gray-500">No leads found.</div>
        )}

        {!isLoading && view === "card" && (
          <div className="grid gap-4 p-4 md:grid-cols-2 xl:grid-cols-3">
            {leads.map((lead) => (
              <LeadCard
                key={lead._id}
                lead={lead}
                convertingId={convertingId}
                onConvert={handleConvert}
                onEdit={handleEditStart}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        {!isLoading && view === "table" && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 dark:bg-[#2a2a2a]">
                <tr>
                  <th className="p-3 text-left">Lead ID</th>
                  <th className="p-3 text-left">Company</th>
                  <th className="p-3 text-left">Client</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Service</th>
                  <th className="p-3 text-left">Budget</th>
                  <th className="p-3 text-left">Source</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {leads.map((lead) => (
                  <tr key={lead._id} className="border-t border-gray-200 dark:border-[#243244]">
                    <td className="p-3">{lead.leadId || "-"}</td>
                    <td className="p-3 font-medium">{lead.company || "-"}</td>
                    <td className="p-3">{lead.name}</td>
                    <td className="p-3">{lead.email}</td>
                    <td className="p-3">{lead.projectNeed || lead.service || "-"}</td>
                    <td className="p-3">{lead.projectBudget || lead.budget || "-"}</td>
                    <td className="p-3">{lead.source || "Manual"}</td>
                    <td className="p-3">
                      {editingId === lead._id ? (
                        <select
                          value={draftStatus}
                          onChange={(event) => setDraftStatus(event.target.value)}
                          className="rounded-lg border border-gray-300 bg-white p-2 dark:border-gray-600 dark:bg-[#0b1220]"
                        >
                          <option>New Lead</option>
                          <option>Contacted</option>
                          <option>Qualified</option>
                          <option>Converted</option>
                          <option>Lost</option>
                        </select>
                      ) : (
                        <span className={`rounded-full px-2 py-1 text-xs font-medium ${statusClass[lead.status] || statusClass["New Lead"]}`}>
                          {lead.status || "New Lead"}
                        </span>
                      )}
                    </td>
                    <td className="p-3">
                      <div className="flex justify-center gap-3">
                        <button
                          type="button"
                          onClick={() => handleConvert(lead)}
                          disabled={convertingId === lead._id}
                          className="text-green-600 hover:text-green-800 disabled:opacity-50"
                          title="Convert to project"
                        >
                          <FiBriefcase />
                        </button>
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
        )}
      </div>
    </div>
  );
}

function LeadCard({ lead, convertingId, onConvert, onEdit, onDelete }) {
  return (
    <div className="rounded-xl border border-gray-200 p-4 dark:border-[#243244]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs text-gray-500">{lead.leadId || "Lead"}</p>
          <h3 className="mt-1 font-semibold">{lead.company || lead.name}</h3>
          <p className="text-sm text-gray-500">
            {lead.name} | {lead.email}
          </p>
        </div>
        <span className={`rounded-full px-2 py-1 text-xs font-medium ${statusClass[lead.status] || statusClass["New Lead"]}`}>
          {lead.status || "New Lead"}
        </span>
      </div>
      <div className="mt-4 space-y-1 text-sm">
        <p>Service: {lead.projectNeed || lead.service || "-"}</p>
        <p>Budget: {lead.projectBudget || lead.budget || "-"}</p>
        <p>Source: {lead.source || "Manual"}</p>
      </div>
      <div className="mt-4 flex gap-3">
        <button
          type="button"
          onClick={() => onConvert(lead)}
          disabled={convertingId === lead._id}
          className="rounded-lg bg-green-600 px-3 py-2 text-sm text-white hover:bg-green-700 disabled:opacity-60"
        >
          {convertingId === lead._id ? "Converting..." : "Convert to Project"}
        </button>
        <button type="button" onClick={() => onEdit(lead)} className="rounded-lg border px-3 py-2 text-sm">
          Edit
        </button>
        <button type="button" onClick={() => onDelete(lead._id)} className="rounded-lg border px-3 py-2 text-sm text-red-600">
          Delete
        </button>
      </div>
    </div>
  );
}
