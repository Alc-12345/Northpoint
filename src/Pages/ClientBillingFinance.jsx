import { useState } from "react";

export default function ClientBillingFinance() {

  const inputClass =
    "w-full border border-gray-200 dark:border-[#243244] " +
    "bg-white dark:bg-[#0b1220] text-gray-800 dark:text-white " +
    "px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500";

  const labelClass =
    "block text-sm font-medium mb-1 text-gray-600 dark:text-gray-300";

  const sectionTitle =
    "text-lg font-semibold text-gray-800 dark:text-white border-b border-gray-200 dark:border-[#243244] pb-2 mb-4";

  const [billingType, setBillingType] = useState("Fixed");

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#0b1220] p-8 transition-colors duration-300">

      <div className="bg-white dark:bg-[#0b1220] border border-gray-200 dark:border-[#243244] rounded-xl shadow-sm p-8 transition-colors duration-300">

        {/* Header */}
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-10">
          Client Billing & Finance
        </h1>

        {/* ================= CLIENT PROFILE ================= */}
        <div className="mb-10">
          <h2 className={sectionTitle}>Client Profile</h2>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <label className={labelClass}>Client Name</label>
              <input className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Email</label>
              <input className={inputClass} type="email" />
            </div>
            <div>
              <label className={labelClass}>GST Number</label>
              <input className={inputClass} />
            </div>
          </div>
        </div>

        {/* ================= CONTRACT ================= */}
        <div className="mb-10">
          <h2 className={sectionTitle}>Contract Management</h2>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <label className={labelClass}>Contract Type</label>
              <select
                className={inputClass}
                value={billingType}
                onChange={(e) => setBillingType(e.target.value)}
              >
                <option>Fixed</option>
                <option>Hourly</option>
              </select>
            </div>

            {billingType === "Fixed" && (
              <div>
                <label className={labelClass}>Fixed Amount (₹)</label>
                <input type="number" className={inputClass} />
              </div>
            )}

            {billingType === "Hourly" && (
              <div>
                <label className={labelClass}>Hourly Rate (₹)</label>
                <input type="number" className={inputClass} />
              </div>
            )}

            <div>
              <label className={labelClass}>Contract Duration</label>
              <input type="text" className={inputClass} placeholder="6 months" />
            </div>
          </div>
        </div>

        {/* ================= INVOICE ================= */}
        <div className="mb-10">
          <h2 className={sectionTitle}>Invoice Generation</h2>

          <div className="grid grid-cols-4 gap-6">
            <div>
              <label className={labelClass}>Invoice Number</label>
              <input className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Invoice Date</label>
              <input type="date" className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Recurring</label>
              <select className={inputClass}>
                <option>No</option>
                <option>Monthly</option>
                <option>Quarterly</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>HSN Code</label>
              <input className={inputClass} placeholder="998314" />
            </div>
          </div>
        </div>

        {/* ================= GST CALCULATION ================= */}
        <div className="mb-10">
          <h2 className={sectionTitle}>GST Calculation</h2>

          <div className="grid grid-cols-3 gap-6">
            <div>
              <label className={labelClass}>Amount (₹)</label>
              <input type="number" className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>GST %</label>
              <input type="number" className={inputClass} placeholder="18" />
            </div>

            <div>
              <label className={labelClass}>Total (₹)</label>
              <input className={inputClass} disabled />
            </div>
          </div>
        </div>

        {/* ================= EXPENSE TRACKING ================= */}
        <div className="mb-10">
          <h2 className={sectionTitle}>Expense Tracking</h2>

          <div className="grid grid-cols-3 gap-6">
            <input className={inputClass} placeholder="Software License" />
            <input className={inputClass} placeholder="Cloud Bill" />
            <input className={inputClass} placeholder="Other Expenses" />
          </div>
        </div>

        {/* ================= PROFIT & LOSS ================= */}
        <div className="mb-10">
          <h2 className={sectionTitle}>Profit & Loss</h2>

          <div className="grid grid-cols-3 gap-6">
            <input className={inputClass} placeholder="Total Revenue (₹)" />
            <input className={inputClass} placeholder="Total Expense (₹)" />
            <input className={inputClass} placeholder="Net Profit (₹)" disabled />
          </div>
        </div>

        {/* ================= PAYMENT TRACKING ================= */}
        <div className="mb-10">
          <h2 className={sectionTitle}>Payment Tracking</h2>

          <div className="grid grid-cols-3 gap-6">
            <select className={inputClass}>
              <option>Pending</option>
              <option>Partial</option>
              <option>Paid</option>
            </select>
            <input type="date" className={inputClass} />
            <input className={inputClass} placeholder="Transaction ID" />
          </div>
        </div>

        {/* ================= BILL APPROVAL ================= */}
        <div>
          <h2 className={sectionTitle}>Bill Approval Workflow</h2>

          <div className="grid grid-cols-2 gap-6">
            <select className={inputClass}>
              <option>Pending Approval</option>
              <option>Approved</option>
              <option>Rejected</option>
            </select>

            <input className={inputClass} placeholder="Approved By" />
          </div>
        </div>

      </div>
    </div>
  );
}
