import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { hrDocumentApi } from "../services/api";
import { documentTypes, fillTemplate, quotationTotals, validateDocument } from "../../../shared/hrDocuments";
import { downloadDocument, printDocument } from "../utils/hrDocumentDownload";

const inputClass = "w-full rounded-lg border border-gray-300 bg-white p-2 text-gray-800 dark:border-[#243244] dark:bg-[#0b1220] dark:text-gray-200";
const buttonClass = "rounded-lg bg-blue-600 px-4 py-2 text-white disabled:opacity-50";
const today = () => new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });

export default function HrDocuments() {
  const { type } = useParams();
  if (!Object.hasOwn(documentTypes, type)) return <p className="text-gray-700 dark:text-gray-200">Unknown HR document type.</p>;
  return <DocumentManager key={type} type={type} />;
}

function DocumentManager({ type }) {
  const config = documentTypes[type];
  const initialValues = () => Object.fromEntries(config.fields.map(field => [field.key, field.key === "issueDate" ? today() : field.key === "companyName" ? "Northpoint" : field.type === "number" ? "0" : ""]));
  const [values, setValues] = useState(initialValues);
  const [template, setTemplate] = useState(config.template);
  const [items, setItems] = useState([{ description: "", quantity: 1, rate: "" }]);
  const [records, setRecords] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  useEffect(() => {
    let active = true;
    hrDocumentApi.getAll(type).then(data => { if (active) setRecords(data); })
      .catch(err => { if (active) setLoadError(err.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [type]);
  const reset = () => { setValues(initialValues()); setItems([{ description: "", quantity: 1, rate: "" }]); setTemplate(config.template); setEditingId(null); setError(""); };
  const save = async event => {
    event.preventDefault(); setError(""); setMessage("");
    const errors = validateDocument(type, values, items, template);
    if (errors.length) { setError(errors.join(". ")); return; }
    setSaving(true);
    try {
      const data = { values, items: type === "quotation" ? items : [], template };
      const record = editingId ? await hrDocumentApi.update(type, editingId, data) : await hrDocumentApi.create(type, data);
      setRecords(current => [record, ...current.filter(item => item._id !== record._id)]);
      setEditingId(record._id); setMessage("Document saved. Download it from the saved list below.");
    } catch (err) { setError(err.message); }
    finally { setSaving(false); }
  };
  const edit = record => { setValues(record.values); setTemplate(record.template); setItems(record.items); setEditingId(record._id); setMessage(""); setError(""); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const print = record => { try { printDocument(record); } catch (err) { setError(err.message); } };
  const totals = quotationTotals(items, values.taxRate);
  const filtered = records.filter(record => `${record.values.recipientName} ${record.values.documentNumber}`.toLowerCase().includes(search.toLowerCase()));
  return <div className="text-gray-800 dark:text-gray-200">
    <div className="mb-6 flex items-center justify-between gap-4"><div><h1 className="text-2xl font-bold">{config.title}</h1><p className="mt-2 text-sm text-gray-500">Fill the fields, set the document format, and save. Saved documents can be edited or downloaded anytime.</p></div><button type="button" disabled={saving} onClick={reset} className={buttonClass}>New Document</button></div>
    {error && <p role="alert" className="mb-4 text-red-500">{error}</p>}
    {message && <p role="status" className="mb-4 text-green-600">{message}</p>}
    <form onSubmit={save} className="mb-8 rounded-xl border bg-white p-6 dark:border-[#243244] dark:bg-[#111C2D]">
      <h2 className="mb-5 text-lg font-semibold">{editingId ? "Edit saved document" : "Create document"}</h2>
      <fieldset disabled={saving}>
        <div className="grid gap-4 md:grid-cols-2">{config.fields.map(field => <div key={field.key}>
          <label htmlFor={field.key} className="mb-1 block text-sm">{field.label}{field.required ? " *" : ""}</label>
          {field.type === "textarea" ? <textarea id={field.key} required={field.required} maxLength={10000} rows={3} value={values[field.key] || ""} onChange={event => setValues({ ...values, [field.key]: event.target.value })} className={inputClass} /> : <input id={field.key} type={field.type || "text"} required={field.required} min={field.type === "number" ? 0 : undefined} max={field.max} step={field.type === "number" ? "0.01" : undefined} value={values[field.key] ?? ""} onChange={event => setValues({ ...values, [field.key]: event.target.value })} className={inputClass} />}
        </div>)}</div>
        {type === "quotation" && <div className="mt-6"><h2 className="mb-3 font-semibold">Quotation Items (INR)</h2>
          {items.map((item, index) => <div key={index} className="mb-3 grid gap-2 md:grid-cols-[2fr_1fr_1fr_auto]">
            {[['description', 'Description', 'text'], ['quantity', 'Quantity', 'number'], ['rate', 'Rate (INR)', 'number']].map(([key, label, fieldType]) => <label key={key} className="text-sm">{label}<input aria-label={`${label} for item ${index + 1}`} type={fieldType} required min={key === "quantity" ? 0.01 : key === "rate" ? 0 : undefined} step={fieldType === "number" ? "0.01" : undefined} value={item[key]} onChange={event => setItems(items.map((row, rowIndex) => rowIndex === index ? { ...row, [key]: event.target.value } : row))} className={inputClass} /></label>)}
            <button type="button" disabled={items.length === 1} onClick={() => setItems(items.filter((_, rowIndex) => rowIndex !== index))} className="self-end rounded border px-3 py-2 disabled:opacity-40">Remove</button>
          </div>)}
          <button type="button" disabled={items.length >= 100} onClick={() => setItems([...items, { description: "", quantity: 1, rate: "" }])} className="text-cyan-500">+ Add Item</button>
          <p className="mt-4">Subtotal: INR {totals.subtotal.toFixed(2)} · Tax: INR {totals.tax.toFixed(2)} · <strong>Total: INR {totals.total.toFixed(2)}</strong></p>
        </div>}
        <details className="mt-6 rounded-lg border p-4 dark:border-[#243244]"><summary className="cursor-pointer font-semibold">Document Format</summary><p className="my-3 text-sm text-gray-500">Set the letter text using placeholders. Field values replace these when you download. Company header, document details and quotation pricing are included automatically.</p>
          <div className="mb-3 flex flex-wrap gap-2">{config.fields.map(field => <button key={field.key} type="button" onClick={() => setTemplate(current => `${current} {{${field.key}}}`)} className="rounded bg-gray-100 px-2 py-1 text-xs dark:bg-[#243244]">{`{{${field.key}}}`}</button>)}</div>
          <label htmlFor="template" className="mb-1 block text-sm">Template text</label><textarea id="template" required maxLength={30000} rows={12} value={template} onChange={event => setTemplate(event.target.value)} className={inputClass} />
          <button type="button" onClick={() => setTemplate(config.template)} className="mt-2 text-sm text-cyan-500">Reset to standard format</button>
        </details>
        <details className="mt-4"><summary className="cursor-pointer font-semibold">Preview Letter Text</summary><div className="mt-3 whitespace-pre-wrap break-words rounded-lg bg-gray-50 p-5 dark:bg-[#0b1220]">{fillTemplate(template, values)}</div></details>
        <button type="submit" className={`${buttonClass} mt-6`}>{saving ? "Saving..." : editingId ? "Save Changes" : "Save Document"}</button>
      </fieldset>
    </form>
    <section><h2 className="mb-4 text-xl font-semibold">Saved {config.title}s</h2><input aria-label="Search saved documents" placeholder="Search by recipient or document number" value={search} onChange={event => setSearch(event.target.value)} className={`${inputClass} mb-4`} />
      {loadError && <p role="alert" className="mb-4 text-red-500">Saved list could not load: {loadError}. Reload this page to retry.</p>}
      <p className="mb-4 text-sm text-gray-500">Download saves a formatted HTML document. PDF / Print opens the same layout; choose “Save as PDF” in the print dialog.</p>
      {loading ? <p>Loading saved documents...</p> : !filtered.length ? <p>{search ? "No matching documents." : "No saved documents yet."}</p> : <div className="space-y-3">{filtered.map(record => <div key={record._id} className="flex flex-col justify-between gap-4 rounded-xl border bg-white p-5 md:flex-row md:items-center dark:border-[#243244] dark:bg-[#111C2D]"><div><h3 className="font-semibold">{record.values.documentNumber} · {record.values.recipientName}</h3><p className="text-sm text-gray-500">Issued {record.values.issueDate} · Saved {new Date(record.updatedAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</p></div><div className="flex flex-wrap gap-2"><button disabled={saving} onClick={() => edit(record)} className="rounded border px-3 py-2">Edit</button><button onClick={() => downloadDocument(record)} className={buttonClass}>Download</button><button onClick={() => print(record)} className="rounded border px-3 py-2">PDF / Print</button></div></div>)}</div>}
    </section>
  </div>;
}
