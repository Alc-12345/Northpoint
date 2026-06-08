import { useState } from "react";
import {
  FiMonitor,
  FiKey,
  FiServer,
  FiShield,
  FiFileText,
  FiPlus,
} from "react-icons/fi";
import { Link } from "react-router-dom";

export default function AssetManagementPage() {
  const [activeTab, setActiveTab] = useState("laptop");

  const tabs = [
    { id: "laptop", label: "Laptop Assignment", icon: <FiMonitor /> },
    { id: "license", label: "Software Licenses", icon: <FiKey /> },
    { id: "cloud", label: "Server & Cloud Cost", icon: <FiServer /> },
    { id: "access", label: "Access Management", icon: <FiShield /> },
    { id: "nda", label: "NDA & Documents", icon: <FiFileText /> },
  ];

  return (
    <div className="p-6 bg-gray-100 dark:bg-[#121212] min-h-screen text-gray-800 dark:text-gray-200 transition">
      <h2 className="text-2xl font-bold mb-6">Asset & Resource Management</h2>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition
              ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-white dark:bg-[#0b1220] border border-gray-200 dark:border-[#243244] hover:bg-gray-100 dark:hover:bg-[#2a2a2a]"
              }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Card */}
      <div className="bg-white dark:bg-[#0b1220] p-6 rounded-xl shadow-sm border border-gray-200 dark:border-[#243244]">
        {activeTab === "laptop" && <LaptopAssignment />}
        {activeTab === "license" && <SoftwareLicenses />}
        {activeTab === "cloud" && <CloudMonitoring />}
        {activeTab === "access" && <AccessManagement />}
        {activeTab === "nda" && <NDADocuments />}
      </div>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function LaptopAssignment() {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Laptop Assignment</h3>

      <table className="w-full text-sm border border-gray-200 dark:border-[#243244]">
        <thead className="bg-gray-100 dark:bg-[#2a2a2a]">
          <tr>
            <th className="p-2 border dark:border-[#243244]">Employee</th>
            <th className="p-2 border dark:border-[#243244]">Device</th>
            <th className="p-2 border dark:border-[#243244]">Serial No</th>
            <th className="p-2 border dark:border-[#243244]">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="p-2 border dark:border-[#243244]">Rahul Sharma</td>
            <td className="p-2 border dark:border-[#243244]">MacBook Pro</td>
            <td className="p-2 border dark:border-[#243244]">MBP-98234</td>
            <td className="p-2 border dark:border-[#243244] text-green-600">
              Assigned
            </td>
          </tr>
        </tbody>
      </table>

      <Link
        to="/assign"
        className="mt-4 inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        + Assign New Laptop
      </Link>
    </div>
  );
}

function SoftwareLicenses() {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Software License Tracking</h3>

      <ul className="space-y-3">
        <li className="border border-gray-200 dark:border-[#243244] p-3 rounded-lg">
          VS Code Pro – 25 Licenses – Expiry: Dec 2026
        </li>
        <li className="border border-gray-200 dark:border-[#243244] p-3 rounded-lg">
          AWS Subscription – ₹45,000/month
        </li>
      </ul>
    </div>
  );
}

function CloudMonitoring() {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">
        Server & Cloud Cost Monitoring
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <CloudCard title="AWS Monthly Cost" value="₹45,000" />
        <CloudCard title="Azure Usage" value="₹30,000" />
        <CloudCard title="DigitalOcean" value="₹12,000" />
      </div>
    </div>
  );
}

function AccessManagement() {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Access Management</h3>

      <table className="w-full text-sm border border-gray-200 dark:border-[#243244]">
        <thead className="bg-gray-100 dark:bg-[#2a2a2a]">
          <tr>
            <th className="p-2 border dark:border-[#243244]">Employee</th>
            <th className="p-2 border dark:border-[#243244]">System</th>
            <th className="p-2 border dark:border-[#243244]">Access Level</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="p-2 border dark:border-[#243244]">Priya Singh</td>
            <td className="p-2 border dark:border-[#243244]">
              Production Server
            </td>
            <td className="p-2 border dark:border-[#243244] text-red-500">
              Admin
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function NDADocuments() {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">NDA & Document Tracking</h3>

      <ul className="space-y-3">
        <li className="border border-gray-200 dark:border-[#243244] p-3 rounded-lg">
          Rahul Sharma – NDA Signed – 02 Jan 2024
        </li>
        <li className="border border-gray-200 dark:border-[#243244] p-3 rounded-lg">
          Priya Singh – NDA Pending
        </li>
      </ul>
    </div>
  );
}

/* Reusable Cloud Card */
function CloudCard({ title, value }) {
  return (
    <div className="border border-gray-200 dark:border-[#243244] rounded-xl p-5 shadow-sm bg-white dark:bg-[#0b1220]">
      <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
      <h4 className="text-xl font-bold mt-2">{value}</h4>
    </div>
  );
}
