import React, { useState } from "react";
import {
  FiDollarSign,
  FiCreditCard,
  FiTrendingUp,
  FiClock,
  FiSearch,
  FiEye,
  FiDownload,
} from "react-icons/fi";

export default function Finance() {
  const [search, setSearch] = useState("");

  const transactions = [
    {
      id: 1,
      invoice: "INV-1001",
      client: "ABC Pvt Ltd",
      amount: "₹25,000",
      date: "10 Jun 2026",
      status: "Paid",
    },
    {
      id: 2,
      invoice: "INV-1002",
      client: "XYZ Company",
      amount: "₹18,500",
      date: "08 Jun 2026",
      status: "Pending",
    },
    {
      id: 3,
      invoice: "INV-1003",
      client: "Tech Solutions",
      amount: "₹42,000",
      date: "05 Jun 2026",
      status: "Paid",
    },
  ];

  const filtered = transactions.filter(
    (item) =>
      item.invoice.toLowerCase().includes(search.toLowerCase()) ||
      item.client.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0B1220] p-6">

      {/* Header */}

      <div className="mb-6">

        <h1 className="text-3xl font-bold text-white">
          Finance
        </h1>

        <p className="text-gray-400">
          Manage invoices and payments
        </p>

      </div>

      {/* Cards */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">

        <Card
          title="Total Budget"
          value="₹5,50,000"
          icon={<FiDollarSign />}
        />

        <Card
          title="Total Paid"
          value="₹3,90,000"
          icon={<FiCreditCard />}
        />

        <Card
          title="Revenue"
          value="₹1,60,000"
          icon={<FiTrendingUp />}
        />

        <Card
          title="Pending"
          value="₹45,000"
          icon={<FiClock />}
        />

      </div>
      {/* Finance Form */}

<div className="bg-[#111C2D] border border-[#243244] rounded-xl p-6 mb-6">

  <h2 className="text-xl font-semibold text-white mb-5">
    Add Finance Entry
  </h2>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

    {/* Client Name */}
    <input
      type="text"
      placeholder="Client Name"
      className="bg-[#0B1220] border border-[#243244] rounded-lg px-4 py-3 text-white"
    />

    {/* Invoice No */}
    <input
      type="text"
      placeholder="Invoice Number"
      className="bg-[#0B1220] border border-[#243244] rounded-lg px-4 py-3 text-white"
    />

    {/* Amount */}
    <input
      type="number"
      placeholder="Amount"
      className="bg-[#0B1220] border border-[#243244] rounded-lg px-4 py-3 text-white"
    />

    {/* Payment Type */}
    <select className="bg-[#0B1220] border border-[#243244] rounded-lg px-4 py-3 text-white">

      <option>Payment Type</option>

      <option>Cash</option>

      <option>UPI</option>

      <option>Bank Transfer</option>

      <option>Cheque</option>

    </select>

    {/* Payment Date */}
    <input
      type="date"
      className="bg-[#0B1220] border border-[#243244] rounded-lg px-4 py-3 text-white"
    />

    {/* Status */}
    <select className="bg-[#0B1220] border border-[#243244] rounded-lg px-4 py-3 text-white">

      <option>Pending</option>

      <option>Paid</option>

      <option>Cancelled</option>

    </select>

    {/* Description */}
    <textarea
      rows="4"
      placeholder="Payment Description"
      className="md:col-span-2 bg-[#0B1220] border border-[#243244] rounded-lg px-4 py-3 text-white"
    />

    {/* Upload Receipt */}
    <input
      type="file"
      className="md:col-span-2 bg-[#0B1220] border border-[#243244] rounded-lg px-4 py-2 text-gray-300"
    />

    {/* Button */}
    <button
      className="md:col-span-2 bg-[#18A8E6] hover:bg-[#1394cb] text-white py-3 rounded-lg font-semibold"
    >
      Save Finance Entry
    </button>

  </div>

</div>

      {/* Search */}

      <div className="bg-[#111C2D] border border-[#243244] rounded-xl p-4 mb-6">

        <div className="relative max-w-md">

          <FiSearch className="absolute left-3 top-3 text-gray-400" />

          <input
            type="text"
            placeholder="Search Invoice..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#0B1220] border border-[#243244] rounded-lg pl-10 pr-4 py-2 text-white"
          />

        </div>

      </div>

      {/* Table */}

      <div className="bg-[#111C2D] border border-[#243244] rounded-xl overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-[#172235] text-gray-300">

              <tr>

                <th className="text-left p-4">Invoice</th>

                <th className="text-left p-4">Client</th>

                <th className="text-left p-4">Amount</th>

                <th className="text-left p-4">Date</th>

                <th className="text-left p-4">Status</th>

                <th className="text-center p-4">Action</th>

              </tr>

            </thead>

            <tbody>

              {filtered.map((item) => (

                <tr
                  key={item.id}
                  className="border-t border-[#243244] hover:bg-[#172235]"
                >

                  <td className="p-4 text-white">
                    {item.invoice}
                  </td>

                  <td className="p-4 text-gray-300">
                    {item.client}
                  </td>

                  <td className="p-4 text-gray-300">
                    {item.amount}
                  </td>

                  <td className="p-4 text-gray-300">
                    {item.date}
                  </td>

                  <td className="p-4">

                    <span
                      className={`px-3 py-1 rounded-full text-xs ${
                        item.status === "Paid"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {item.status}
                    </span>

                  </td>

                  <td className="p-4">

                    <div className="flex justify-center gap-3">

                      <button className="text-blue-400 hover:text-blue-300">
                        <FiEye size={18} />
                      </button>

                      <button className="text-green-400 hover:text-green-300">
                        <FiDownload size={18} />
                      </button>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

function Card({ title, value, icon }) {
  return (
    <div className="bg-[#111C2D] border border-[#243244] rounded-xl p-5">

      <div className="flex justify-between items-center">

        <div>

          <p className="text-gray-400 text-sm">
            {title}
          </p>

          <h2 className="text-3xl font-bold text-white mt-2">
            {value}
          </h2>

        </div>

        <div className="w-12 h-12 rounded-xl bg-[#18A8E6]/20 text-[#18A8E6] flex items-center justify-center text-xl">
          {icon}
        </div>

      </div>

    </div>
  );
}