import { useEffect, useState } from "react";
import { downloadOfferLetter, remunerationWords, offerLetterParagraphs, salaryBreakdown } from "../utils/offerLetterDownload.js";

import { canUseFinance } from "../utils/financeAccess";

const inputClass = "mt-1 w-full rounded-lg border border-gray-300 bg-white p-2.5 text-gray-800 dark:border-[#243244] dark:bg-[#0b1220] dark:text-gray-200";
const defaults = intern => ({ candidateName: intern?.candidateName || "", role: intern?.role || "", startDate: intern?.startDate || "", issueDate: new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" }), monthlySalary: "15000", salaryWords: "Rupees One Lakh Eighty Thousand Only", paymentRemarks: "Payable monthly", reviewCycle: "Annual Review Cycle", variableIncentive: "Discretionary", incentiveRemarks: "Subject to Company Performance" });

export default function OfferLetter({ intern, onBack, backLabel = "Back to interns" }) {
  const [values, setValues] = useState(() => defaults(intern));
  const [salaryComponents, setSalaryComponents] = useState([]);
  const [paragraphs, setParagraphs] = useState([]);
  const [paragraphEdits, setParagraphEdits] = useState({});
  const [templateLoading, setTemplateLoading] = useState(true);
  const [templateError, setTemplateError] = useState("");
  const canEditTerms = canUseFinance();
  useEffect(() => {
    let active = true;
    fetch(`${import.meta.env.BASE_URL}templates/offer-letter.docx`)
      .then(response => { if (!response.ok) throw new Error("The offer letter template could not be loaded."); return response.arrayBuffer(); })
      .then(offerLetterParagraphs)
      .then(rows => { if (active) setParagraphs(rows); })
      .catch(err => { if (active) setTemplateError(err.message); })
      .finally(() => { if (active) setTemplateLoading(false); });
    return () => { active = false; };
  }, []);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const update = event => { const { name, value } = event.target; setValues(current => ({ ...current, [name]: value, ...(name === "monthlySalary" ? { salaryWords: remunerationWords(Number(value) * 12) } : {}) })); setError(""); setMessage(""); };
  const download = async event => {
    event.preventDefault(); setError(""); setMessage("");
    if (Object.values(values).some(value => !value.trim())) { setError("Complete all required offer letter fields."); return; }
    setBusy(true);
    try { await downloadOfferLetter({ salaryComponents, ...Object.fromEntries(Object.entries(values).map(([key, value]) => [key, value.trim()])), paragraphEdits: canEditTerms ? paragraphEdits : {} }); setMessage("Your offer letter PDF with Annexure I has been downloaded."); }
    catch (err) { setError(err.message || "The letter could not be generated. Please try again."); }
    finally { setBusy(false); }
  };
  const field = (key, label, type = "text") => <label key={key} htmlFor={`offer-${key}`} className="text-sm">{label} *<input id={`offer-${key}`} name={key} type={type} required maxLength={200} min={type === "number" ? "0" : undefined} max={type === "number" ? "1000000000" : undefined} step={type === "number" ? "0.01" : undefined} value={values[key]} onChange={update} className={inputClass} /></label>;
  let breakdown = null, breakdownError = "";
  try { breakdown = salaryBreakdown({ ...values, salaryComponents }); } catch (err) { breakdownError = err.message; }
  const addComponent = (label = "", type = "earning", frequency = "monthly") => setSalaryComponents(current => [...current, { label, type, frequency, amount: "" }]);
  const changeComponent = (index, key, value) => setSalaryComponents(current => current.map((row, i) => i === index ? { ...row, [key]: value } : row));
  return <div className="text-gray-800 dark:text-gray-200">
    <button type="button" onClick={onBack} className="mb-4 text-sm text-blue-500">← {backLabel}</button>
    <h1 className="text-2xl font-bold">Offer Letter</h1>
    <p className="mb-6 mt-2 text-sm text-gray-500">Fill the employment details and Annexure I remuneration schedule to download the letter.</p>
    <form onSubmit={download} className="rounded-xl border bg-white p-6 dark:border-[#243244] dark:bg-[#111C2D]">
      <fieldset disabled={busy}>
        <h2 className="mb-5 text-lg font-semibold">Employment details</h2>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">{field("candidateName", "Candidate name")}{field("role", "Role")}{field("startDate", "Employment start date", "date")}{field("issueDate", "Letter date", "date")}</div>
        <h2 className="mb-5 mt-6 border-t pt-5 text-lg font-semibold dark:border-[#243244]">Annexure I — Remuneration schedule</h2>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {field("monthlySalary", "Monthly fixed remuneration (INR)", "number")}
          <div className="text-sm"><span>Annual fixed remuneration (INR)</span><p className="mt-1 rounded-lg bg-gray-50 p-2.5 dark:bg-[#0b1220]">{(Math.round(Number(values.monthlySalary || 0) * 12 * 100) / 100).toLocaleString("en-IN")}</p></div>
          {field("salaryWords", "Annual remuneration in words")}{field("paymentRemarks", "Payment remarks")}{field("reviewCycle", "Performance review eligibility")}{field("variableIncentive", "Variable incentive")}{field("incentiveRemarks", "Incentive remarks")}
        </div>
        <section className="mt-6 border-t pt-5 dark:border-[#243244]">
          <h2 className="text-lg font-semibold">Editable salary breakdown</h2>
          <p className="my-2 text-sm text-gray-500">The fixed salary above is the base. Add optional earnings or employee deductions below; leave this section empty if none apply. Enter ESI and PF amounts as applicable. Annual bonuses are counted once per year.</p>
          <div className="my-4 flex flex-wrap gap-3">
            {[["ESI", "deduction", "monthly"], ["PF", "deduction", "monthly"], ["Additional bonus", "earning", "annual"], ["", "earning", "monthly"]].map(([label, type, frequency]) => <button key={label} type="button" disabled={salaryComponents.length >= 30} onClick={() => addComponent(label, type, frequency)} className="rounded-lg border px-3 py-2 disabled:opacity-50">+ {label || "Custom component"}</button>)}
          </div>
          <div className="space-y-3">{salaryComponents.map((component, index) => <div key={index} className="grid gap-3 rounded-lg border p-3 md:grid-cols-5 dark:border-[#243244]">
            <label className="text-sm">Component<input aria-label={`Component ${index + 1} name`} required maxLength={120} value={component.label} onChange={e => changeComponent(index, "label", e.target.value)} className={inputClass} /></label>
            <label className="text-sm">Type<select aria-label={`Component ${index + 1} type`} value={component.type} onChange={e => changeComponent(index, "type", e.target.value)} className={inputClass}><option value="earning">Additional earning</option><option value="deduction">Employee deduction</option></select></label>
            <label className="text-sm">Frequency<select aria-label={`Component ${index + 1} frequency`} value={component.frequency} onChange={e => changeComponent(index, "frequency", e.target.value)} className={inputClass}><option value="monthly">Monthly</option><option value="annual">Annual</option></select></label>
            <label className="text-sm">Amount (INR)<input aria-label={`Component ${index + 1} amount`} type="number" required min="0" max="1000000000" step="0.01" value={component.amount} onChange={e => changeComponent(index, "amount", e.target.value)} className={inputClass} /></label>
            <button type="button" onClick={() => setSalaryComponents(current => current.filter((_, i) => i !== index))} className="self-end rounded-lg border px-3 py-2.5">Remove</button>
          </div>)}</div>
          {breakdown && <p className="mt-4 text-sm">Annual gross: INR {breakdown.annualEarnings.toLocaleString("en-IN")} · Annual deductions: INR {breakdown.annualDeductions.toLocaleString("en-IN")} · <strong>Annual net: INR {breakdown.annualNet.toLocaleString("en-IN")}</strong></p>}
          {salaryComponents.length > 0 && breakdownError && <p role="alert" className="mt-3 text-sm text-red-500">{breakdownError}</p>}
        </section>
        {canEditTerms && <section className="mt-6 border-t pt-5 dark:border-[#243244]">
          <h2 className="text-lg font-semibold">Edit terms, conditions and Annexure I</h2>
          <p className="mt-2 mb-4 text-sm text-gray-500">Changes apply to this letter’s PDF. Expand a section to edit its headings, clauses, table text and declarations. Keep placeholders such as {"{{candidateName}}"} and {"{{annualSalary}}"} to fill them from the fields above. Clear a paragraph to omit its text.</p>
          {templateLoading && <p role="status">Loading letter sections…</p>}
          {templateError && <p role="alert" className="text-red-500">{templateError}</p>}
          {["Terms and conditions", "Annexure I"].map(group => <details key={group} className="mb-3 rounded-lg border p-4 dark:border-[#243244]">
            <summary className="cursor-pointer font-semibold">{group}</summary>
            <div className="mt-4 space-y-4">{paragraphs.filter(paragraph => paragraph.group === group).map((paragraph, position) => <label key={paragraph.index} className="block text-sm">
              {group} — paragraph {position + 1}
              <textarea aria-label={`${group} paragraph ${position + 1}`} rows={paragraph.text.length > 180 ? 5 : 2} maxLength={10000} value={paragraphEdits[paragraph.index] ?? paragraph.text} onChange={event => { setParagraphEdits(current => ({ ...current, [paragraph.index]: event.target.value })); setMessage(""); }} className={inputClass} />
            </label>)}</div>
          </details>)}
        </section>}
        {error && <p role="alert" className="mt-4 text-sm text-red-500">{error}</p>}
        {message && <p role="status" className="mt-4 text-sm text-green-600">{message}</p>}
        <div className="mt-6 flex flex-col justify-end gap-3 border-t pt-5 sm:flex-row dark:border-[#243244]"><button type="button" onClick={() => { setValues(defaults(intern)); setSalaryComponents([]); setParagraphEdits({}); setError(""); setMessage(""); }} className="rounded-lg border px-5 py-3">Reset form</button><button type="submit" disabled={templateLoading || Boolean(templateError)} className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white disabled:opacity-50">{busy ? "Generating PDF…" : "Download Offer Letter PDF"}</button></div>
      </fieldset>
    </form>
  </div>;
}
