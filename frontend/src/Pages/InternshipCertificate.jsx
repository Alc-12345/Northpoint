import DateInput from "../Components/DateInput.jsx";
import { useState } from "react";
import { completionDate, certificateDate, downloadCertificate } from "../utils/internshipCertificate";

const inputClass = "w-full rounded-lg border border-gray-300 bg-white p-2.5 text-gray-800 dark:border-[#243244] dark:bg-[#0b1220] dark:text-gray-200";
const defaults = () => ({ candidateName: "", issueDate: new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" }), startDate: "", duration: "3", role: "", companyName: "Northpoint", signatory: "", designation: "Director" });

export default function InternshipCertificate({ intern, onBack }) {
  const initialValues = () => ({ ...defaults(), ...(intern ? { candidateName: intern.candidateName, startDate: intern.startDate, duration: intern.duration, role: intern.role, companyName: intern.companyName } : {}) });
  const [values, setValues] = useState(initialValues);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const endDate = completionDate(values.startDate, values.duration);
  const update = event => { setValues(current => ({ ...current, [event.target.name]: event.target.value })); setMessage(""); setError(""); };
  const download = async event => {
    event.preventDefault(); setError(""); setMessage("");
    if (["candidateName", "companyName", "role", "signatory", "designation"].some(key => !values[key].trim()) || !endDate || !values.issueDate) { setError("Complete all required certificate fields."); return; }
    if (values.issueDate < endDate) { setError("Certificate date must be on or after the internship end date."); return; }
    setBusy(true);
    try { await downloadCertificate(Object.fromEntries(Object.entries(values).map(([key, value]) => [key, value.trim()]))); setMessage("Your certificate PDF has been downloaded."); }
    catch { setError("The certificate could not be generated. Please try downloading again."); }
    finally { setBusy(false); }
  };
  return <div className="text-gray-800 dark:text-gray-200">
    {onBack && <button type="button" onClick={onBack} className="mb-4 text-sm text-blue-500">← Back to interns</button>}
    <h1 className="text-2xl font-bold">Internship Completion Certificate</h1>
    <p className="mt-2 mb-6 text-sm text-gray-500">Fill in the candidate details, choose 3 or 6 months, and download the completed certificate as a PDF.</p>
    <div className="w-full">
      <form onSubmit={download} className="rounded-xl border bg-white p-6 dark:border-[#243244] dark:bg-[#111C2D]">
        <h2 className="mb-5 text-lg font-semibold">Certificate details</h2>
        <fieldset disabled={busy} className="grid min-w-0 grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {[["candidateName", "Candidate name", "text"], ["issueDate", "Certificate date", "date"], ["startDate", "Internship start date", "date"]].map(([key, label, type]) => <label key={key} className="block text-sm" htmlFor={key}>{label} *{key === "startDate" ? <DateInput id={key} name={key} required value={values[key]} onChange={update} className={inputClass} /> : <input id={key} name={key} type={type} required maxLength={120} value={values[key]} onChange={update} className={`${inputClass} mt-1`} />}</label>)}
          <label htmlFor="duration" className="block text-sm">Internship duration *<select id="duration" name="duration" value={values.duration} onChange={update} className={`${inputClass} mt-1`}><option value="3">3 months</option><option value="6">6 months</option></select></label>
          <div className="text-sm"><span className="block">Internship end date</span><p className="mt-1 rounded-lg bg-gray-50 p-2.5 dark:bg-[#0b1220]"><strong>{endDate ? certificateDate(endDate) : "Choose a start date"}</strong></p></div>
          {[["role", "Internship role"], ["companyName", "Company name"], ["signatory", "Authorized signatory name"], ["designation", "Signatory designation"]].map(([key, label]) => <label key={key} className="block text-sm" htmlFor={key}>{label} *<input id={key} name={key} required maxLength={120} value={values[key]} onChange={update} className={`${inputClass} mt-1`} /></label>)}
          {error && <p role="alert" className="col-span-full text-sm text-red-500">{error}</p>}
          {message && <p role="status" className="col-span-full text-sm text-green-600">{message}</p>}
          <div className="col-span-full mt-1 flex flex-col gap-3 border-t border-gray-200 pt-5 sm:flex-row sm:justify-end dark:border-[#243244]">
            <button type="button" onClick={() => { setValues(initialValues()); setError(""); setMessage(""); }} className="rounded-lg border px-5 py-3">Reset form</button>
            <button type="submit" className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white disabled:opacity-50">{busy ? "Generating PDF…" : "Download Certificate PDF"}</button>
          </div>
        </fieldset>
      </form>
    </div>
  </div>;
}
