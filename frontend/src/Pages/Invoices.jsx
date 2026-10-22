import { useEffect, useState } from "react";
import { toast, Toaster } from "sonner";
import { isPanelPreview } from "../utils/auth";
import { invoiceApi } from "../services/api";
import {
  calculate,
  defaultSettings,
  statuses,
  validateInvoice,
} from "../../../backend/shared/invoices.js";
import { downloadInvoice, invoicePdf } from "../utils/invoicePdf";
const defaultLogo = new URL("../assets/Logo.png", import.meta.url).href;
const inputClass =
  "w-full border border-gray-200 dark:border-[#243244] bg-white dark:bg-[#0b1220] text-gray-800 dark:text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500";
const buttonClass =
  "px-4 py-2 rounded-lg border border-gray-200 dark:border-[#243244] hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50";
const currency = (value) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(
    value,
  );
const dateToday = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
const dueDate = (date, days) => {
  const d = new Date(`${date}T12:00:00Z`);
  const count = Number(days || 0);
  if (
    !Number.isFinite(d.getTime()) ||
    !Number.isInteger(count) ||
    count < 0 ||
    count > 3650
  )
    return "";
  d.setUTCDate(d.getUTCDate() + count);
  return d.toISOString().slice(0, 10);
};
function Field({ label, value, onChange, type = "text", ...rest }) {
  return (
    <label className="block text-sm space-y-1">
      <span>{label}</span>
      <input
        className={inputClass}
        type={type}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        {...rest}
      />
    </label>
  );
}
function CompanyProfile({ company, onChange }) {
  return (
    <section>
      <h3 className="font-semibold mb-3">Company / Bill From</h3>
      {(
        <img
          src={company.logo || defaultLogo}
          alt="Company logo"
          className="h-16 max-w-52 object-contain mb-3"
        />
      )}
      <label className="block text-sm mb-4">
        Company logo (PNG / JPEG, up to 1 MB)
        <input
          className="block mt-2"
          type="file"
          accept="image/png,image/jpeg"
          onChange={(e) => {
            const file = e.target.files[0];
            if (!file) return;
            if (
              !["image/png", "image/jpeg"].includes(file.type) ||
              file.size > 1024 * 1024
            ) {
              toast.error("Choose a PNG or JPEG up to 1 MB");
              return;
            }
            const reader = new FileReader();
            reader.onload = () => onChange("logo", reader.result);
            reader.readAsDataURL(file);
          }}
        />
      </label>
      <div className="mb-5 space-y-2">
        <label className="block text-sm">
          Payment QR image (PNG / JPEG, up to 1 MB)
          <input
            className="block mt-2"
            type="file"
            accept="image/png,image/jpeg"
            onChange={(event) => {
              const file = event.target.files[0];
              if (!file) return;
              if (
                !["image/png", "image/jpeg"].includes(file.type) ||
                file.size > 1024 * 1024
              ) {
                toast.error("Choose a PNG or JPEG up to 1 MB");
                return;
              }
              const reader = new FileReader();
              reader.onload = () => onChange("paymentQr", reader.result);
              reader.readAsDataURL(file);
            }}
          />
        </label>
        {company.paymentQr && (
          <>
            <img
              src={company.paymentQr}
              alt="Payment QR"
              className="h-28 w-28 object-contain bg-white p-2"
            />
            <button
              type="button"
              className={buttonClass}
              onClick={() => onChange("paymentQr", "")}
            >
              Remove QR
            </button>
          </>
        )}
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        {[
          ["name", "Company name"],
          ["tagline", "Tagline"],
          ["address", "Company address"],
          ["email", "Company email"],
          ["phone", "Phone"],
          ["taxId", "Company GST / Tax ID"],
        ].map(([key, label]) => (
          <Field
            key={key}
            label={label}
            type={key === "email" ? "email" : "text"}
            value={company[key]}
            onChange={(value) => onChange(key, value)}
          />
        ))}
      </div>
    </section>
  );
}
export default function Invoices() {
  const [companyDraft, setCompanyDraft] = useState(null);
  const [companySaving, setCompanySaving] = useState(false);
  const [companyError, setCompanyError] = useState("");
  const [rows, setRows] = useState([]),
    [settings, setSettings] = useState(null),
    [form, setForm] = useState(null),
    [errors, setErrors] = useState([]),
    [saving, setSaving] = useState(false),
    [loading, setLoading] = useState(true),
    [loadError, setLoadError] = useState(""),
    [preview, setPreview] = useState(null),
    [deleting, setDeleting] = useState(null);
  const [filters, setFilters] = useState({
    search: "",
    number: "",
    client: "",
    date: "",
    status: "",
  });
  useEffect(() => {
    Promise.all([invoiceApi.getAll(), invoiceApi.getSettings()])
      .then(([data, config]) => {
        setRows(data);
        setSettings(config);
      })
      .catch((e) => setLoadError(e.message))
      .finally(() => setLoading(false));
  }, []);
  useEffect(
    () => () => {
      if (preview?.url) URL.revokeObjectURL(preview.url);
    },
    [preview],
  );
  useEffect(() => {
    if (!form && !preview && !deleting && !companyDraft) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const close = (event) => {
      if (event.key === "Escape" && !saving && !companySaving) {
        setCompanyDraft(null);
        setForm(null);
        setPreview(null);
        setDeleting(null);
      }
    };
    document.addEventListener("keydown", close);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", close);
    };
  }, [form, preview, deleting, saving, companyDraft, companySaving]);
  const run = async (action) => {
    try {
      await action();
    } catch (e) {
      toast.error(e.message);
    }
  };
  const change = (key, value) => setForm((f) => ({ ...f, [key]: value }));
  const nested = (section, key, value) =>
    setForm((f) => ({ ...f, [section]: { ...f[section], [key]: value } }));
  const create = () => {
    const config = structuredClone(settings || defaultSettings),
      date = dateToday();
    setErrors([]);
    setForm({
      ...config,
      invoiceNumber: `ALC-${date.slice(0, 7)}-${Date.now().toString().slice(-7)}`,
      invoiceDate: date,
      dueDate: dueDate(date, config.dueDays),
      client: { name: "", company: "", address: "", email: "", taxId: "" },
      referenceNumber: "",
      status: "Draft",
      items: [{ description: "", quantity: 1, rate: 0, discount: 0 }],
    });
  };
  const edit = (invoice) => {
    setPreview(null);
    setErrors([]);
    setForm(structuredClone(invoice));
  };
  const totals = form ? calculate(form.items, form.taxPercentage) : null;
  const save = async (e) => {
    e.preventDefault();
    const problems = validateInvoice(form);
    setErrors(problems);
    if (problems.length) return;
    setSaving(true);
    try {
      const data = form._id
        ? await invoiceApi.update(form._id, form)
        : await invoiceApi.create(form);
      setRows((r) => [data, ...r.filter((x) => x._id !== data._id)]);
      setForm(null);
      toast.success("Invoice saved");
    } catch (error) {
      setErrors([error.message]);
    } finally {
      setSaving(false);
    }
  };
  const view = async (row) => {
    const invoice = await invoiceApi.getById(row._id);
    const blob = await invoicePdf(invoice);
    setPreview({ invoice, url: URL.createObjectURL(blob) });
  };
  const filtered = rows.filter(
    (row) =>
      [
        row.invoiceNumber,
        row.client.name,
        row.client.company,
        ...row.items.map((i) => i.description),
      ]
        .join(" ")
        .toLowerCase()
        .includes(filters.search.toLowerCase()) &&
      row.invoiceNumber.toLowerCase().includes(filters.number.toLowerCase()) &&
      `${row.client.name} ${row.client.company}`
        .toLowerCase()
        .includes(filters.client.toLowerCase()) &&
      (!filters.date || row.invoiceDate === filters.date) &&
      (!filters.status || row.status === filters.status),
  );
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#0b1220] p-4 md:p-8 text-gray-800 dark:text-white">
      <Toaster richColors position="top-right" />
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Invoices</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage client invoices and payment details.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            className={buttonClass}
            disabled={!settings}
            onClick={() => {
              setCompanyError("");
              setCompanyDraft(structuredClone(settings));
            }}
          >
            Company Settings
          </button>
          <button
            className="bg-orange-500 text-white px-5 py-2 rounded-lg disabled:opacity-50"
            disabled={!settings}
            onClick={create}
          >
            Create Invoice
          </button>
        </div>
      </div>
      {isPanelPreview() && (
        <p
          role="status"
          className="mb-4 rounded-lg border border-orange-200 bg-orange-50 p-3 text-sm text-gray-800"
        >
          Preview mode: invoices and company defaults are saved only for this
          preview session. Sign in as an administrator to use live invoices.
        </p>
      )}
      {loadError && (
        <p role="alert" className="text-red-500 mb-4">
          {loadError}
        </p>
      )}
      <div className="bg-white dark:bg-[#111C2D] border border-gray-200 dark:border-[#243244] rounded-xl p-5">
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-5">
          {[
            ["search", "Search"],
            ["number", "Invoice number"],
            ["client", "Client / company"],
            ["date", "Invoice date"],
          ].map(([key, label]) => (
            <Field
              key={key}
              label={label}
              type={key === "date" ? "date" : "text"}
              value={filters[key]}
              onChange={(value) => setFilters((f) => ({ ...f, [key]: value }))}
            />
          ))}
          <label className="text-sm space-y-1 block">
            Status
            <select
              className={inputClass}
              value={filters.status}
              onChange={(e) =>
                setFilters((f) => ({ ...f, status: e.target.value }))
              }
            >
              <option value="">All statuses</option>
              {statuses.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-gray-200 dark:border-[#243244]">
                {[
                  "Invoice No.",
                  "Invoice Date",
                  "Client / Company",
                  "Description",
                  "Subtotal",
                  "Tax",
                  "Total",
                  "Status",
                  "Actions",
                ].map((t) => (
                  <th className="p-3 whitespace-nowrap" key={t}>
                    {t}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr
                  key={row._id}
                  className="border-b border-gray-200 dark:border-[#243244]"
                >
                  <td className="p-3 font-medium">{row.invoiceNumber}</td>
                  <td className="p-3 whitespace-nowrap">{row.invoiceDate}</td>
                  <td className="p-3">
                    {row.client.name}
                    <div className="text-gray-500">{row.client.company}</div>
                  </td>
                  <td
                    className="p-3 max-w-52 truncate"
                    title={row.items.map((i) => i.description).join("; ")}
                  >
                    {row.items.map((i) => i.description).join("; ")}
                  </td>
                  {[row.subtotal, row.taxAmount, row.total].map((v, i) => (
                    <td key={i} className="p-3 whitespace-nowrap">
                      {currency(v)}
                    </td>
                  ))}
                  <td className="p-3">
                    <span className="bg-gray-100 dark:bg-gray-800 rounded-full px-3 py-1">
                      {row.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2 whitespace-nowrap">
                      <button
                        className={buttonClass}
                        onClick={() => run(() => view(row))}
                      >
                        View
                      </button>
                      <button className={buttonClass} onClick={() => edit(row)}>
                        Edit
                      </button>
                      <button
                        className={buttonClass}
                        onClick={() => run(() => downloadInvoice(row))}
                      >
                        PDF
                      </button>
                      <button
                        className={`${buttonClass} text-red-500`}
                        onClick={() => setDeleting(row)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!filtered.length && (
            <p className="text-center py-12 text-gray-500">
              {loading ? "Loading invoices…" : "No invoices found."}
            </p>
          )}
        </div>
      </div>
      {companyDraft && (
        <div
          className="fixed inset-0 z-50 bg-black/60 overflow-y-auto p-4 md:p-8"
          role="dialog"
          aria-modal="true"
          aria-label="Company Settings"
        >
          <form
            className="max-w-2xl mx-auto bg-white dark:bg-[#111C2D] rounded-xl p-6 space-y-5"
            onSubmit={async (e) => {
              e.preventDefault();
              setCompanySaving(true);
              setCompanyError("");
              try {
                setSettings(await invoiceApi.saveSettings(companyDraft));
                setCompanyDraft(null);
                toast.success(
                  "Company details saved. New invoices will use them automatically.",
                );
              } catch (error) {
                setCompanyError(error.message);
              } finally {
                setCompanySaving(false);
              }
            }}
          >
            <div className="flex justify-between items-center gap-3">
              <h2 className="text-xl font-semibold">Company Settings</h2>
              <button
                type="button"
                disabled={companySaving}
                className={buttonClass}
                onClick={() => setCompanyDraft(null)}
              >
                Close
              </button>
            </div>
            <p className="text-sm text-gray-500">
              Set your logo, address, phone, email and GST once. These details
              are reused on every new invoice. Existing invoices retain their
              saved company details.
            </p>
            {companyError && (
              <p role="alert" className="text-red-500">
                {companyError}
              </p>
            )}
            <CompanyProfile
              company={companyDraft.company}
              onChange={(key, value) =>
                setCompanyDraft((draft) => ({
                  ...draft,
                  company: { ...draft.company, [key]: value },
                }))
              }
            />
            <div className="flex justify-end">
              <button
                disabled={companySaving}
                className="bg-orange-500 text-white px-5 py-2 rounded-lg disabled:opacity-50"
              >
                {companySaving ? "Saving…" : "Save Company Details"}
              </button>
            </div>
          </form>
        </div>
      )}
      {form && (
        <div
          className="fixed inset-0 bg-black/60 z-50 overflow-y-auto p-3 md:p-8"
          role="dialog"
          aria-modal="true"
          aria-label="Invoice editor"
        >
          <form
            onSubmit={save}
            className="max-w-5xl mx-auto bg-white dark:bg-[#111C2D] rounded-xl p-5 md:p-8 space-y-6"
          >
            <div className="flex justify-between">
              <h2 className="text-xl font-semibold">
                {form._id ? "Edit Invoice" : "Create Invoice"}
              </h2>
              <button
                type="button"
                className={buttonClass}
                onClick={() => setForm(null)}
              >
                Close
              </button>
            </div>
            {!!errors.length && (
              <div
                role="alert"
                className="text-red-500 border border-red-300 rounded-lg p-3"
              >
                {errors.map((error, i) => (
                  <p key={i}>{error}</p>
                ))}
              </div>
            )}
            <section className="rounded-lg border border-gray-200 dark:border-[#243244] p-4">
              <h3 className="font-semibold mb-3">Company / Bill From</h3>
              <div className="flex flex-wrap items-start gap-4">
                {(
                  <img
                    src={form.company.logo || defaultLogo}
                    alt="Company logo"
                    className="h-14 max-w-40 object-contain"
                  />
                )}
                <div className="text-sm space-y-1">
                  <p className="font-semibold">{form.company.name}</p>
                  <p className="whitespace-pre-line">{form.company.address}</p>
                  <p>
                    {[form.company.phone, form.company.email]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                  {form.company.taxId && (
                    <p>GST / Tax ID: {form.company.taxId}</p>
                  )}
                </div>
              </div>
              <p className="mt-3 text-xs text-gray-500">
                Automatically filled from Company Settings. Update company
                details there for future invoices.
              </p>
            </section>
            <section>
              <h3 className="font-semibold mb-3">Invoice information</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <Field
                  label="Invoice number *"
                  value={form.invoiceNumber}
                  onChange={(v) => change("invoiceNumber", v)}
                  required
                />
                <Field
                  label="Invoice date *"
                  type="date"
                  value={form.invoiceDate}
                  onChange={(v) => {
                    change("invoiceDate", v);
                    if (v) change("dueDate", dueDate(v, form.dueDays));
                  }}
                  required
                />
                <Field
                  label="Due date *"
                  type="date"
                  value={form.dueDate}
                  onChange={(v) => change("dueDate", v)}
                  required
                />
                <Field
                  label="Reference / quote number"
                  value={form.referenceNumber}
                  onChange={(v) => change("referenceNumber", v)}
                />
                <Field
                  label="Due days"
                  type="number"
                  min="0"
                  step="1"
                  value={form.dueDays}
                  onChange={(v) => {
                    change("dueDays", v);
                    change("dueDate", dueDate(form.invoiceDate, v));
                  }}
                />
                <label className="text-sm">
                  Status
                  <select
                    className={inputClass}
                    value={form.status}
                    onChange={(e) => change("status", e.target.value)}
                  >
                    {statuses.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </label>
              </div>
            </section>
            <section>
              <h3 className="font-semibold mb-3">Client / Bill To</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  ["name", "Client Name *"],
                  ["company", "Client Company"],
                  ["address", "Client Address"],
                  ["email", "Client Email"],
                  ["taxId", "Client GST "],
                ].map(([key, label]) => (
                  <Field
                    key={key}
                    label={label}
                    type={key === "email" ? "email" : "text"}
                    value={form.client[key]}
                    required={key === "name"}
                    onChange={(v) => nested("client", key, v)}
                  />
                ))}
              </div>
            </section>
            <section>
              <h3 className="font-semibold mb-3">Invoice items</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr>
                      {[
                        "Description",
                        "Quantity",
                        "Rate (INR)",
                        "Discount (%)",
                        "Amount",
                        "",
                      ].map((s, i) => (
                        <th key={i} className="text-left p-2">
                          {s}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {form.items.map((item, i) => (
                      <tr key={i}>
                        {["description", "quantity", "rate", "discount"].map((key) => (
                          <td className="p-2" key={key}>
                            <input
                              aria-label={`Item ${i + 1} ${key}`}
                              className={`${inputClass} ${key === "description" ? "min-w-60" : "min-w-24"}`}
                              type={key === "description" ? "text" : "number"}
                              min={key === "quantity" ? "0.000001" : "0"}
                              max={key === "discount" ? "100" : undefined}
                              step="any"
                              required
                              value={item[key] ?? (key === "discount" ? 0 : "")}
                              onChange={(e) =>
                                change(
                                  "items",
                                  form.items.map((x, j) =>
                                    j === i
                                      ? { ...x, [key]: e.target.value }
                                      : x,
                                  ),
                                )
                              }
                            />
                          </td>
                        ))}
                        <td className="p-2 whitespace-nowrap">
                          {currency(totals.items[i].amount)}
                        </td>
                        <td>
                          <button
                            type="button"
                            className={buttonClass}
                            aria-label={`Remove item ${i + 1}`}
                            onClick={() =>
                              change(
                                "items",
                                form.items.filter((_, j) => j !== i),
                              )
                            }
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button
                type="button"
                className={`${buttonClass} mt-3`}
                onClick={() =>
                  change("items", [
                    ...form.items,
                    { description: "", quantity: 1, rate: 0, discount: 0 },
                  ])
                }
              >
                Add item
              </button>
              <div className="sm:ml-auto sm:w-80 mt-4 space-y-3">
                <Field
                  label="Tax percentage"
                  type="number"
                  min="0"
                  step="any"
                  required
                  value={form.taxPercentage}
                  onChange={(v) => change("taxPercentage", v)}
                />
                <p className="flex justify-between">
                  <span>Subtotal</span>
                  {currency(totals.subtotal)}
                </p>
                <p className="flex justify-between">
                  <span>Tax ({form.taxPercentage}%)</span>
                  {currency(totals.taxAmount)}
                </p>
                <p className="flex justify-between font-bold border-t pt-3">
                  <span>Grand total</span>
                  {currency(totals.total)}
                </p>
              </div>
            </section>
            <section>
              <h3 className="font-semibold mb-3">Payment details</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  ["method", "Payment method"],
                  ["bankName", "Bank name"],
                  ["accountName", "Bank account name"],
                  ["accountNumber", "Account number"],
                  ["ifscCode", "IFSC code"],
                ].map(([key, label]) => (
                  <Field
                    key={key}
                    label={label}
                    value={form.paymentDetails[key]}
                    onChange={(v) => nested("paymentDetails", key, v)}
                  />
                ))}
              </div>
            </section>
            <section>
              <label
                className="font-semibold block mb-3"
                htmlFor="invoice-terms"
              >
                Terms & Conditions
              </label>
              <textarea
                id="invoice-terms"
                rows="12"
                className={inputClass}
                value={form.termsAndConditions}
                onChange={(e) => change("termsAndConditions", e.target.value)}
              />
            </section>
            <div className="flex flex-wrap gap-3 justify-end">
              <button
                type="button"
                disabled={saving}
                className={buttonClass}
                onClick={() =>
                  run(async () => {
                    const config = Object.fromEntries(
                      [
                        "company",
                        "paymentDetails",
                        "termsAndConditions",
                        "paymentTerms",
                        "dueDays",
                        "taxPercentage",
                      ].map((key) => [key, form[key]]),
                    );
                    setSettings(
                      await invoiceApi.saveSettings({
                        ...config,
                        company: settings.company,
                      }),
                    );
                    toast.success("Company defaults saved for future invoices");
                  })
                }
              >
                Save payment / tax / terms defaults
              </button>
              <button
                disabled={saving}
                className="bg-orange-500 text-white px-5 py-2 rounded-lg disabled:opacity-50"
              >
                {saving ? "Saving…" : "Save Invoice"}
              </button>
            </div>
          </form>
        </div>
      )}
      {preview && (
        <div
          className="fixed inset-0 z-50 bg-black/70 p-3 md:p-6 flex flex-col"
          role="dialog"
          aria-modal="true"
          aria-label="Invoice preview"
        >
          <div className="bg-white text-gray-900 p-3 flex flex-wrap gap-2 rounded-t-xl">
            <button
              className={buttonClass}
              onClick={() => edit(preview.invoice)}
            >
              Edit
            </button>
            <button
              className={buttonClass}
              onClick={() => run(() => downloadInvoice(preview.invoice))}
            >
              Download PDF
            </button>
            <button
              className={buttonClass}
              onClick={() => {
                const frame = document.getElementById("invoice-preview");
                try {
                  frame.contentWindow.focus();
                  frame.contentWindow.print();
                } catch {
                  window.open(preview.url, "_blank");
                }
              }}
            >
              Print
            </button>
            <a
              className={buttonClass}
              href={preview.url}
              target="_blank"
              rel="noreferrer"
            >
              Open PDF
            </a>
            <button
              className={`${buttonClass} ml-auto`}
              onClick={() => setPreview(null)}
            >
              Close
            </button>
          </div>
          <iframe
            id="invoice-preview"
            title="Invoice PDF preview"
            src={preview.url}
            className="w-full flex-1 bg-white"
          />
        </div>
      )}
      {deleting && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Delete invoice"
        >
          <div className="bg-white dark:bg-[#111C2D] p-6 rounded-xl max-w-md space-y-4">
            <h2 className="font-semibold">Delete {deleting.invoiceNumber}?</h2>
            <p>This permanently removes the invoice.</p>
            <div className="flex gap-3 justify-end">
              <button
                className={buttonClass}
                disabled={saving}
                onClick={() => setDeleting(null)}
              >
                Cancel
              </button>
              <button
                className="bg-red-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
                disabled={saving}
                onClick={() =>
                  run(async () => {
                    setSaving(true);
                    try {
                      await invoiceApi.remove(deleting._id);
                      setRows((r) => r.filter((x) => x._id !== deleting._id));
                      setDeleting(null);
                      toast.success("Invoice deleted");
                    } finally {
                      setSaving(false);
                    }
                  })
                }
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
