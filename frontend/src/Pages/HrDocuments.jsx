import { formatDocumentDate } from "../utils/documentDate.js";
import { GST_RATE } from "../../../backend/shared/invoices.js";
import commercialLogo from "../assets/austin-legacy-corp.png?inline";
import { documentCompanyFields, usesInvoiceCompany, withDocumentCompany } from "../../../backend/shared/documentCompany.js";
import { phaseTotal } from "../utils/commercialDocument.js";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { hrDocumentApi } from "../services/api";
import { documentTypes, normalizeCommercialDraft, quotationTotals, validateDocument } from "../../../backend/shared/hrDocuments";
import { documentHtml, downloadDocument, printDocument } from "../utils/hrDocumentDownload";
import Interns from "./Interns.jsx";
import OfferEmployees from "./OfferEmployees.jsx";

const inputClass = "w-full rounded-lg border border-gray-300 bg-white p-2 text-gray-800 dark:border-[#243244] dark:bg-[#0b1220] dark:text-gray-200";
const buttonClass = "rounded-lg bg-blue-600 px-4 py-2 text-white disabled:opacity-50";
const today = () => new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });

export default function HrDocuments() {
  const { type } = useParams();
  if (type === "internship") return <Interns />;
  if (type === "offer-letter") return <OfferEmployees />;
  if (!Object.hasOwn(documentTypes, type)) return <p className="text-gray-700 dark:text-gray-200">Unknown HR document type.</p>;
  return <DocumentManager key={type} type={type} />;
}

export function DocumentManager({ type }) {
  const config = documentTypes[type];
  const location = useLocation();
  const navigate = useNavigate();
  const linkedQuotation = type === "commercials" ? location.state?.quotation : null;
  const [downloadingBundle, setDownloadingBundle] = useState(false);
  const initialValues = () => Object.fromEntries(config.fields.map(field => [field.key, field.key === "issueDate" ? today() : field.key === "companyName" ? "ALC" : field.type === "timeline" ? [] : field.type === "number" ? "0" : ""]));
  const [draftValues, setValues] = useState(() => {
    const initial = location.state?.quotationDraft || initialValues();
    if (!linkedQuotation) return initial;
    const q = linkedQuotation.values;
    return { ...initial, ...Object.fromEntries(["recipientName", "recipientEmail", "recipientAddress", "signatory", "paymentTerms", "deliveryTimeline"].map(key => [key, q[key] || ""])), documentNumber: `${q.documentNumber}-COM`, commercialValue: quotationTotals(linkedQuotation.items, q.taxRate).total };
  });
  const [company, setCompany] = useState(null);
  const [companyError, setCompanyError] = useState("");
  const sharedCompany = usesInvoiceCompany(type);
  const companyValues = withDocumentCompany({ type, values: draftValues }, company).values;
  const values = type === "quotation" ? { ...companyValues, taxRate: GST_RATE } : companyValues;
  const companyReady = !sharedCompany || Boolean(company);
  const forOutput = record => withDocumentCompany(record, company ? { ...company, logo: company.logo || commercialLogo } : null);
  useEffect(() => {
    if (!sharedCompany) return;
    let active = true;
    const refresh = () => hrDocumentApi.getCompanySettings()
      .then(data => { if (active) { setCompany(data); setCompanyError(""); } })
      .catch(err => { if (active) { setCompany(null); setCompanyError(err.message); } });
    refresh();
    window.addEventListener("focus", refresh);
    return () => { active = false; window.removeEventListener("focus", refresh); };
  }, [sharedCompany]);
  const [template, setTemplate] = useState(config.template);
  const [items, setItems] = useState(location.state?.quotationItems || [{ description: "", quantity: 1, rate: "" }]);
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
    hrDocumentApi.getAll(type).then(data => { if (active) setRecords(data.map(normalizeCommercialDraft)); })
      .catch(err => { if (active) setLoadError(err.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [type]);
  const reset = () => { setValues(initialValues()); setItems([{ description: "", quantity: 1, rate: "" }]); setTemplate(config.template); setEditingId(null); setError(""); };
  const save = async event => {
    event.preventDefault(); setError(""); setMessage("");
    if (!companyReady) { setError("Load the Invoice company settings before saving."); return; }
    const errors = validateDocument(type, values, items, template);
    if (errors.length) { setError(errors.join(". ")); return; }
    setSaving(true);
    try {
      const data = { values, items: type === "quotation" ? items : [], template: type === "quotation" ? config.template : template };
      const record = editingId ? await hrDocumentApi.update(type, editingId, data) : await hrDocumentApi.create(type, data);
      setRecords(current => [record, ...current.filter(item => item._id !== record._id)]);
      setEditingId(record._id); setMessage("Document saved. Download it from the saved list below.");
    } catch (err) { setError(err.message); }
    finally { setSaving(false); }
  };
  const edit = record => { record = normalizeCommercialDraft(record); setValues({ ...initialValues(), ...record.values }); setTemplate(type === "quotation" ? config.template : record.template); setItems(record.items); setEditingId(record._id); setMessage(""); setError(""); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const continueToCommercials = () => {
    setError("");
    const errors = validateDocument(type, values, items, config.template);
    if (!companyReady) errors.push("Load Invoice company settings before continuing.");
    if (errors.length) { setError(errors.join(". ")); return; }
    navigate("/hr/commercials", { state: { quotation: { type: "quotation", values: draftValues, items, template: config.template } } });
  };
  const downloadBundle = async () => {
    setError("");
    const errors = validateDocument("commercials", values, [], template);
    if (!companyReady) errors.push("Load Invoice company settings before downloading.");
    if (errors.length) { setError(errors.join(". ")); return; }
    setDownloadingBundle(true);
    try {
      const { downloadQuotationBundle } = await import("../utils/quotationBundlePdf.js");
      await downloadQuotationBundle(forOutput(linkedQuotation), forOutput({ type, values, items: [], template }));
      setMessage("Combined PDF downloaded: quotation on page 1, Commercials from page 2.");
    } catch (err) { setError(err.message); }
    finally { setDownloadingBundle(false); }
  };
  const print = record => { try { printDocument(forOutput(record)); } catch (err) { setError(err.message); } };
  const totals = quotationTotals(items, values.taxRate);
  const fieldGroups = type === "quotation" ? [
    { title: "Company / Bill From", keys: ["companyName", "companyAddress", "companyGstin", "companyEmail", "companyPhone", "signatory"] },
    { title: "Client / Bill To", keys: ["recipientName", "recipientEmail", "recipientAddress"] },
    { title: "Quotation Details", keys: ["documentNumber", "issueDate", "validUntil", "taxRate"] },
  ] : type === "commercials" ? [
    { title: "Issuer & Client", keys: ["documentNumber", "issueDate", "companyName", "companyAddress", "companyGstin", "companyEmail", "companyPhone", "recipientName", "recipientEmail", "recipientAddress", "signatory"] },
    { title: "Project & Commercial Justification", keys: ["projectName", "projectPeriod", "scope", "overview", "commercialValue", "taxTerms", "paymentTerms", "deliveryTimeline"] },
    { title: "Original Development Phase", keys: ["originalPhase", "originalTimeline"] },
    { title: "Hosting & Infrastructure", keys: ["hostingNote"] },
    { title: "Acceptance & Signature", keys: ["clientSignatory", "clientSignatoryTitle"] },
  ] : [{ title: "Document details", keys: config.fields.map(field => field.key) }];
  const filtered = records.filter(record => `${record.values.recipientName} ${record.values.documentNumber}`.toLowerCase().includes(search.toLowerCase()));
  return <div className="text-gray-800 dark:text-gray-200">
    <div className="mb-6 flex items-center justify-between gap-4"><div><h1 className="text-2xl font-bold">{config.title}</h1><p className="mt-2 text-sm text-gray-500">Fill the fields, set the document format, and save. Saved documents can be edited or downloaded anytime.</p></div><button type="button" disabled={saving} onClick={reset} className={buttonClass}>New Document</button></div>
    {error && <p role="alert" className="mb-4 text-red-500">{error}</p>}
    {sharedCompany && <div className="mb-4 rounded-lg border p-4"><p className="text-sm">Company details and logo come from <a href="/finance/invoices" className="text-cyan-600 underline">Invoice → Company Settings</a>. Changes apply to previews and exports of all quotations and commercials.</p>{companyError ? <p role="alert" className="mt-2 text-red-500">Company settings could not load: {companyError}. Reload to retry.</p> : !company ? <p>Loading company settings...</p> : company.logo ? <img src={company.logo} alt="Company logo" className="mt-3 max-h-24 max-w-72 object-contain" /> : null}</div>}
    {linkedQuotation && <div className="mb-4 rounded-lg border border-blue-300 bg-blue-50 p-4 text-gray-800"><p>Step 2 of 2: Commercials for quotation <strong>{linkedQuotation.values.documentNumber}</strong>. Complete this form to download both documents in one PDF.</p><button type="button" onClick={() => navigate("/hr/quotation", { state: { quotationDraft: linkedQuotation.values, quotationItems: linkedQuotation.items } })} className="mt-2 text-blue-600 underline">Back to quotation</button></div>}
    {message && <p role="status" className="mb-4 text-green-600">{message}</p>}
    <form onSubmit={save} className="mb-8 rounded-xl border bg-white p-6 dark:border-[#243244] dark:bg-[#111C2D]">
      <h2 className="mb-5 text-lg font-semibold">{editingId ? "Edit saved document" : "Create document"}</h2>
      <fieldset disabled={saving || downloadingBundle || !companyReady}>
        <div className="grid gap-6 md:grid-cols-2">{fieldGroups.map(group => <section key={group.title}><h3 className="mb-3 font-semibold">{group.title}</h3><div className="grid gap-4">{group.keys.map(key => config.fields.find(field => field.key === key)).map(field => <div key={field.key}>
          <label htmlFor={field.key} className="mb-1 block text-sm">{field.label}{field.required ? " *" : ""}</label>
          {field.type === "timeline" ? <CommercialTimeline field={field} rows={Array.isArray(values[field.key]) ? values[field.key] : []} onChange={rows => setValues({ ...values, [field.key]: rows })} /> : field.type === "textarea" ? <textarea readOnly={field.readOnly || (sharedCompany && Object.hasOwn(documentCompanyFields, field.key))} id={field.key} required={field.required} maxLength={field.maxLength ?? 10000} rows={field.key === "invoiceTerms" ? 9 : 3} value={values[field.key] || ""} onChange={event => setValues({ ...values, [field.key]: event.target.value })} className={inputClass} /> : <input readOnly={field.readOnly || (sharedCompany && Object.hasOwn(documentCompanyFields, field.key))} id={field.key} type={field.type || "text"} required={field.required} min={field.type === "number" ? 0 : undefined} max={field.max} step={field.type === "number" ? "0.01" : undefined} value={values[field.key] ?? ""} onChange={event => setValues({ ...values, [field.key]: event.target.value })} className={inputClass} />}{field.type === "date" && values[field.key] && <p className="mt-1 text-sm text-gray-500">{formatDocumentDate(values[field.key])}</p>}
        </div>)}</div></section>)}</div>
        {type === "quotation" && <div className="mt-6"><h2 className="mb-3 font-semibold">Quotation Items (INR)</h2>
          {items.map((item, index) => <div key={index} className="mb-3 grid gap-2 md:grid-cols-[2fr_1fr_1fr_auto]">
            {[['description', 'Description', 'text'], ['quantity', 'Quantity', 'number'], ['rate', 'Rate (INR)', 'number']].map(([key, label, fieldType]) => <label key={key} className="text-sm">{label}<input aria-label={`${label} for item ${index + 1}`} type={fieldType} required min={key === "quantity" ? 0.01 : key === "rate" ? 0 : undefined} step={fieldType === "number" ? "0.01" : undefined} value={item[key]} onChange={event => setItems(items.map((row, rowIndex) => rowIndex === index ? { ...row, [key]: event.target.value } : row))} className={inputClass} /></label>)}
            <button type="button" disabled={items.length === 1} onClick={() => setItems(items.filter((_, rowIndex) => rowIndex !== index))} className="self-end rounded border px-3 py-2 disabled:opacity-40">Remove</button>
          </div>)}
          <button type="button" disabled={items.length >= 100} onClick={() => setItems([...items, { description: "", quantity: 1, rate: "" }])} className="text-cyan-500">+ Add Item</button>
          <p className="mt-4">Subtotal: INR {totals.subtotal.toLocaleString("en-IN", { maximumFractionDigits: 0 })} · GST (18%): INR {totals.tax.toLocaleString("en-IN", { maximumFractionDigits: 0 })} · <strong>Total: INR {totals.total.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</strong></p>
        </div>}
        {type !== "quotation" && <details open={config.allowBlank || undefined} className="mt-6 rounded-lg border p-4 dark:border-[#243244]"><summary className="cursor-pointer font-semibold">{config.allowBlank ? "Writing space (optional)" : type === "commercials" ? "Closing Note" : "Document Format"}</summary><p className="my-3 text-sm text-gray-500">{config.allowBlank ? "Write freely below or leave empty for a blank printable page. Letterhead includes your company header; Notepad provides a plain writing page." : type === "commercials" ? "The report follows the commercial justification reference: cover, project overview, development scope table, hosting, closing note and acceptance signatures. Edit the closing note below; the other sections use your form values. The phase total is calculated from timeline rows; enter the negotiated final value separately." : "Set the letter text using placeholders. Field values replace these when you download. Company header, document details and quotation pricing are included automatically."}</p>
          <div className="mb-3 flex flex-wrap gap-2">{config.fields.filter(field => field.type !== "timeline").map(field => <button key={field.key} type="button" onClick={() => setTemplate(current => `${current} {{${field.key}}}`)} className="rounded bg-gray-100 px-2 py-1 text-xs dark:bg-[#243244]">{`{{${field.key}}}`}</button>)}</div>
          <label htmlFor="template" className="mb-1 block text-sm">Template text</label><textarea id="template" required={!config.allowBlank} maxLength={30000} placeholder={config.allowBlank ? "Leave empty for a blank page, or write your notes here…" : undefined} rows={config.allowBlank ? 20 : 12} value={template} onChange={event => setTemplate(event.target.value)} className={inputClass} />
          <button type="button" onClick={() => setTemplate(config.template)} className="mt-2 text-sm text-cyan-500">Reset to standard format</button>
        </details>}
        <details className="mt-4"><summary className="cursor-pointer font-semibold">Preview Document</summary><iframe title="Document preview" sandbox="" srcDoc={documentHtml(forOutput({ type, values, items, template }))} className="mt-3 h-[850px] w-full rounded-lg border bg-white" /></details>
        {type === "quotation" && <button type="button" onClick={continueToCommercials} className={`${buttonClass} mt-6 mr-3`}>Continue to Commercials →</button>}
        {linkedQuotation && <button type="button" onClick={downloadBundle} className={`${buttonClass} mt-6 mr-3`}>{downloadingBundle ? "Creating PDF..." : "Download Quotation + Commercials PDF"}</button>}
        <button type="submit" className={`${buttonClass} mt-6`}>{saving ? "Saving..." : editingId ? "Save Changes" : "Save Document"}</button>
      </fieldset>
    </form>
    <section><h2 className="mb-4 text-xl font-semibold">Saved {config.title}s</h2><input aria-label="Search saved documents" placeholder="Search by recipient or document number" value={search} onChange={event => setSearch(event.target.value)} className={`${inputClass} mb-4`} />
      {loadError && <p role="alert" className="mb-4 text-red-500">Saved list could not load: {loadError}. Reload this page to retry.</p>}
      <p className="mb-4 text-sm text-gray-500">Download saves a formatted HTML document. PDF / Print opens the same layout; choose “Save as PDF” in the print dialog.</p>
      {loading ? <p>Loading saved documents...</p> : !filtered.length ? <p>{search ? "No matching documents." : "No saved documents yet."}</p> : <div className="space-y-3">{filtered.map(record => <div key={record._id} className="flex flex-col justify-between gap-4 rounded-xl border bg-white p-5 md:flex-row md:items-center dark:border-[#243244] dark:bg-[#111C2D]"><div><h3 className="font-semibold">{record.values.documentNumber} · {record.values.recipientName}</h3><p className="text-sm text-gray-500">Issued {formatDocumentDate(record.values.issueDate)} · Saved {new Date(record.updatedAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</p></div><div className="flex flex-wrap gap-2"><button disabled={saving} onClick={() => edit(record)} className="rounded border px-3 py-2">Edit</button><button disabled={!companyReady} onClick={() => downloadDocument(forOutput(record))} className={buttonClass}>Download</button><button disabled={!companyReady} onClick={() => print(record)} className="rounded border px-3 py-2">PDF / Print</button></div></div>)}</div>}
    </section>
  </div>;
}

function CommercialTimeline({ field, rows, onChange }) {
  return <div id={field.key} className="space-y-3">
    {rows.map((row, index) => <div key={index} className="space-y-2 rounded-lg border p-3">
      <label className="block text-sm">Timeline<input required maxLength={200} placeholder="April – June 2026" value={row.timeline} onChange={event => onChange(rows.map((item, i) => i === index ? { ...item, timeline: event.target.value } : item))} className={inputClass} /></label>
      <label className="block text-sm">Scope expansion / work description<textarea required maxLength={10000} rows={4} value={row.description} onChange={event => onChange(rows.map((item, i) => i === index ? { ...item, description: event.target.value } : item))} className={inputClass} /></label>
      <label className="block text-sm">Estimated commercial value (INR)<input required type="number" min="0" max="1000000000000" step="0.01" value={row.amount} onChange={event => onChange(rows.map((item, i) => i === index ? { ...item, amount: event.target.value } : item))} className={inputClass} /></label>
      <button type="button" onClick={() => onChange(rows.filter((_, i) => i !== index))} className="text-sm text-red-500">Remove row {index + 1}</button>
    </div>)}
    <button type="button" disabled={rows.length >= 100} onClick={() => onChange([...rows, { timeline: "", description: "", amount: "" }])} className="text-cyan-600 disabled:opacity-50">+ Add timeline row</button>
    <p className="text-sm font-semibold">Phase total: INR {phaseTotal(rows).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
  </div>;
}
