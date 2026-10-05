import React from "react";
import {
  FiDollarSign,
  FiDownload,
  FiCreditCard,
  FiAlertCircle,
} from "react-icons/fi";

const invoices = [
  {
    id: "INV-1001",
    date: "02 Jun 2026",
    amount: "$1,500",
    status: "Paid",
  },
  {
    id: "INV-1002",
    date: "15 Jun 2026",
    amount: "$2,000",
    status: "Pending",
  },
  {
    id: "INV-1003",
    date: "25 Jun 2026",
    amount: "$800",
    status: "Paid",
  },
];

const payments = [
  {
    date: "02 Jun 2026",
    method: "Bank Transfer",
    amount: "$1,500",
  },
  {
    date: "25 Jun 2026",
    method: "UPI",
    amount: "$800",
  },
];

export default function Finance() {
  return (
    <div className="min-h-screen bg-[#0B1220] p-6">

      {/* Header */}

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white">
          Finance Dashboard
        </h1>

        <p className="text-gray-400 mt-1">
          Invoice history, payment records and pending dues.
        </p>
      </div>

      {/* Cards */}

      <div className="grid md:grid-cols-3 gap-5 mb-6">

        <Card
          title="Project Value"
          value="$12,500"
          icon={<FiDollarSign />}
        />

        <Card
          title="Amount Paid"
          value="$7,700"
          icon={<FiCreditCard />}
        />

        <Card
          title="Pending Due"
          value="$4,800"
          icon={<FiAlertCircle />}
        />

      </div>

      {/* Invoice History */}

      <div className="bg-[#111C2D] border border-[#243244] rounded-xl p-5 mb-6">

        <h2 className="text-white text-xl mb-5">
          Invoice History
        </h2>

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead>

              <tr className="border-b border-[#243244] text-gray-400">

                <th className="p-3 text-left">
                  Invoice ID
                </th>

                <th className="p-3 text-left">
                  Date
                </th>

                <th className="p-3 text-left">
                  Amount
                </th>

                <th className="p-3 text-left">
                  Status
                </th>

                <th className="p-3 text-center">
                  Download
                </th>

              </tr>

            </thead>

            <tbody>

              {invoices.map((item) => (

                <tr
                  key={item.id}
                  className="border-b border-[#243244]"
                >

                  <td className="p-4 text-white">
                    {item.id}
                  </td>

                  <td className="p-4 text-gray-300">
                    {item.date}
                  </td>

                  <td className="p-4 text-gray-300">
                    {item.amount}
                  </td>

                  <td className="p-4">

                    <span
                      className={`px-3 py-1 rounded-full text-xs ${
                        item.status === "Paid"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-orange-500/20 text-orange-400"
                      }`}
                    >
                      {item.status}
                    </span>

                  </td>

                  <td className="text-center">

                    <button className="text-[#18A8E6]">
                      <FiDownload />
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

      {/* Bottom Section */}

      <div className="grid lg:grid-cols-2 gap-6">

        {/* Payment Records */}

        <div className="bg-[#111C2D] border border-[#243244] rounded-xl p-5">

          <h2 className="text-xl text-white mb-5">
            Payment Records
          </h2>

          <div className="space-y-4">

            {payments.map((item, index) => (

              <div
                key={index}
                className="bg-[#172235] rounded-lg p-4 flex justify-between"
              >

                <div>

                  <p className="text-white">
                    {item.method}
                  </p>

                  <p className="text-gray-400 text-sm">
                    {item.date}
                  </p>

                </div>

                <h3 className="text-[#18A8E6] font-semibold">
                  {item.amount}
                </h3>

              </div>

            ))}

          </div>

        </div>

        {/* Pending Due */}

        <div className="bg-[#111C2D] border border-[#243244] rounded-xl p-5">

          <h2 className="text-xl text-white mb-5">
            Pending Dues
          </h2>

          <div className="bg-[#172235] rounded-xl p-5">

            <h1 className="text-4xl font-bold text-red-400">
              $4,800
            </h1>

            <p className="text-gray-400 mt-2">
              Due Date : 10 July 2026
            </p>

            <button className="mt-5 bg-[#18A8E6] px-5 py-2 rounded-lg text-white">
              Pay Now
            </button>

          </div>

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

          <p className="text-gray-400">
            {title}
          </p>

          <h2 className="text-3xl font-bold text-white mt-2">
            {value}
          </h2>

        </div>

        <div className="w-12 h-12 rounded-xl bg-[#18A8E6]/20 flex items-center justify-center text-[#18A8E6] text-xl">
          {icon}
        </div>

      </div>

    </div>
  );
}