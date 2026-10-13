import { useState } from "react";
import { downloadOfferLetter, remunerationWords } from "../utils/offerLetterDownload.js";

const inputClass = "mt-1 w-full rounded-lg border border-gray-300 bg-white p-2.5 text-gray-800 dark:border-[#243244] dark:bg-[#0b1220] dark:text-gray-200";
const defaults = intern => ({ candidateName: intern?.candidateName || "", role: intern?.role || "", startDate: intern?.startDate || "", issueDate: new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" }), monthlySalary: "15000", salaryWords: "Rupees One Lakh Eighty Thousand Only", paymentRemarks: "Payable monthly", reviewCycle: "Annual Review Cycle", variableIncentive: "Discretionary", incentiveRemarks: "Subject to Company Performance" });

export default function OfferLetter({ intern, onBack, backLabel = "Back to interns" }) {
  const [values, setValues] = useState(() => defaults(intern));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const update = event => { const { name, value } = event.target; setValues(current => ({ ...current, [name]: value, ...(name === "monthlySalary" ? { salaryWords: remunerationWords(Number(value) * 12) } : {}) })); setError(""); setMessage(""); };
  const download = async event => {
    event.preventDefault(); setError(""); setMessage("");
    if (Object.values(values).some(value => !value.trim())) { setError("Complete all required offer letter fields."); return; }
    setBusy(true);
    try { await downloadOfferLetter(Object.fromEntries(Object.entries(values).map(([key, value]) => [key, value.trim()]))); setMessage("Your offer letter PDF with Annexure I has been downloaded."); }
    catch (err) { setError(err.message || "The letter could not be generated. Please try again."); }
    finally { setBusy(false); }
  };
  const field = (key, label, type = "text") => <label key={key} htmlFor={`offer-${key}`} className="text-sm">{label} *<input id={`offer-${key}`} name={key} type={type} required maxLength={200} min={type === "number" ? "0" : undefined} max={type === "number" ? "1000000000" : undefined} step={type === "number" ? "0.01" : undefined} value={values[key]} onChange={update} className={inputClass} /></label>;
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
        {error && <p role="alert" className="mt-4 text-sm text-red-500">{error}</p>}
        {message && <p role="status" className="mt-4 text-sm text-green-600">{message}</p>}
        <div className="mt-6 flex flex-col justify-end gap-3 border-t pt-5 sm:flex-row dark:border-[#243244]"><button type="button" onClick={() => { setValues(defaults(intern)); setError(""); setMessage(""); }} className="rounded-lg border px-5 py-3">Reset form</button><button type="submit" className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white disabled:opacity-50">{busy ? "Generating PDF…" : "Download Offer Letter PDF"}</button></div>
      </fieldset>
    </form>
  </div>;
}
