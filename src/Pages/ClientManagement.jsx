import { useEffect, useState } from "react";
import { FiPlus, FiEdit, FiTrash2 } from "react-icons/fi";
import { Link } from "react-router-dom";
import { clientApi } from "../services/api";

export default function ClientManagementPage() {
  const [clients, setClients] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadClients = async () => {
      try {
        const data = await clientApi.getAll();
        setClients(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadClients();
  }, []);

  const handleDelete = async (id) => {
    try {
      await clientApi.remove(id);
      setClients(clients.filter((client) => client._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="p-6 bg-gray-100 dark:bg-[#121212] min-h-screen text-gray-800 dark:text-gray-200 transition">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Client Management</h2>

        <Link
          to="/clients/add"
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <FiPlus />
          Add Client
        </Link>
      </div>

      <div className="bg-white dark:bg-[#0b1220] rounded-xl shadow-sm border border-gray-200 dark:border-[#243244] overflow-x-auto">
        {error && (
          <div className="m-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600">
            {error}
          </div>
        )}
        {isLoading && (
          <div className="p-6 text-sm text-gray-500">Loading clients...</div>
        )}
        {!isLoading && clients.length === 0 && !error && (
          <div className="p-6 text-sm text-gray-500">No clients found.</div>
        )}
        <table className="w-full text-sm">
          <thead className="bg-gray-100 dark:bg-[#2a2a2a]">
            <tr>
              <th className="p-3 text-left">Company</th>
              <th className="p-3 text-left">Industry</th>
              <th className="p-3 text-left">Contact Person</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Phone</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {clients.map((client) => (
              <tr
                key={client._id}
                className="border-t border-gray-200 dark:border-[#243244]"
              >
                <td className="p-3 font-medium">{client.name}</td>
                <td className="p-3">{client.industry}</td>
                <td className="p-3">{client.contact}</td>
                <td className="p-3">{client.email}</td>
                <td className="p-3">{client.phone}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      client.status === "Active"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {client.status}
                  </span>
                </td>

                <td className="p-3 flex justify-center gap-3">
                  <button className="text-blue-600 hover:text-blue-800">
                    <FiEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(client._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
