import DateInput from "../Components/DateInput.jsx";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Award, FileText, Plus, Search } from "lucide-react";
import { hrDocumentApi } from "../services/api";
import { certificateDate, completionDate } from "../utils/internshipCertificate";
import InternshipCertificate from "./InternshipCertificate.jsx";
import OfferLetter from "./OfferLetter.jsx";
import { isPanelPreview } from "../utils/auth";

const inputClass = "w-full rounded-lg border border-gray-300 bg-white p-2.5 text-gray-800 dark:border-[#243244] dark:bg-[#0b1220] dark:text-gray-200";
const emptyIntern = () => ({ candidateName: "", role: "", companyName: "Northpoint", startDate: "", duration: "3" });

export default function Interns({ offerLetters = false }) {
  let canAdd = false;
  try { canAdd = ["admin", "superadmin"].includes(JSON.parse(localStorage.getItem("authUser") || "null")?.role); } catch { /* Invalid session data does not grant access. */ }
  const [interns, setInterns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [loadError, setLoadError] = useState("");
  const [adding, setAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  const [values, setValues] = useState(emptyIntern);
  const [selected, setSelected] = useState(null);
  const [offerSelected, setOfferSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [refresh, setRefresh] = useState(0);
  useEffect(() => {
    let active = true;
    setLoading(true); setLoadError("");
    hrDocumentApi.getInterns().then(data => { if (active) setInterns(data); })
      .catch(err => { if (active) setLoadError(err.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [refresh]);
  const add = async event => {
    event.preventDefault(); setError("");
    if (!canAdd) { setError("Only administrators can add interns."); return; }
    if (["candidateName", "role", "companyName"].some(key => !values[key].trim()) || !completionDate(values.startDate, values.duration)) { setError("Complete all required intern details."); return; }
    setSaving(true);
    try {
      const intern = await hrDocumentApi.addIntern(values);
      setInterns(current => [intern, ...current]); setAdding(false); setValues(emptyIntern());
    } catch (err) { setError(err.message); }
    finally { setSaving(false); }
  };
  if (offerSelected) return <OfferLetter key={offerSelected._id} intern={offerSelected} onBack={() => setOfferSelected(null)} />;
  if (selected) return <InternshipCertificate key={selected._id} intern={selected} onBack={() => setSelected(null)} />;
  const filtered = interns.filter(intern => `${intern.candidateName} ${intern.role} ${intern.companyName}`.toLowerCase().includes(search.trim().toLowerCase()));
  return <div className="text-gray-800 dark:text-gray-200">
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
      <div><h1 className="text-2xl font-bold">{offerLetters ? "Offer Letters" : "Interns"}</h1><p className="mt-2 text-sm text-gray-500">Manage interns and use the completion or offer letter icons to create their documents.</p></div>
      {canAdd && <button type="button" onClick={() => { setAdding(true); setError(""); }} className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white"><Plus size={18} />Add Intern</button>}
    </div>
    {isPanelPreview() && <p role="status" className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800 dark:border-[#243244] dark:bg-[#111C2D] dark:text-blue-300">Admin panel preview: interns added here are saved only for this browser session. <Link to="/login" className="font-semibold underline">Sign in</Link> to save and load your organization’s interns.</p>}
    {canAdd && adding && <form onSubmit={add} className="mb-6 rounded-xl border bg-white p-6 dark:border-[#243244] dark:bg-[#111C2D]">
      <h2 className="mb-5 text-lg font-semibold">Add intern</h2>
      <fieldset disabled={saving} className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {[["candidateName", "Candidate name", "text"], ["role", "Internship role", "text"], ["companyName", "Company name", "text"], ["startDate", "Internship start date", "date"]].map(([key, label, type]) => <label key={key} htmlFor={`intern-${key}`} className="text-sm">{label} *{key === "startDate" ? <DateInput id={`intern-${key}`} required value={values[key]} onChange={event => setValues(current => ({ ...current, [key]: event.target.value }))} className={inputClass} /> : <input id={`intern-${key}`} type={type} required maxLength={120} value={values[key]} onChange={event => setValues(current => ({ ...current, [key]: event.target.value }))} className={`${inputClass} mt-1`} />}</label>)}
        <label htmlFor="intern-duration" className="text-sm">Duration *<select id="intern-duration" value={values.duration} onChange={event => setValues(current => ({ ...current, duration: event.target.value }))} className={`${inputClass} mt-1`}><option value="3">3 months</option><option value="6">6 months</option></select></label>
        <div className="text-sm"><span>Internship end date</span><p className="mt-1 rounded-lg bg-gray-50 p-2.5 dark:bg-[#0b1220]">{values.startDate ? certificateDate(completionDate(values.startDate, values.duration)) : "Choose a start date"}</p></div>
        {error && <p role="alert" className="col-span-full text-sm text-red-500">{error}</p>}
        <div className="col-span-full flex flex-wrap justify-end gap-3 border-t pt-5 dark:border-[#243244]"><button type="button" onClick={() => { setAdding(false); setValues(emptyIntern()); setError(""); }} className="rounded-lg border px-5 py-2.5">Cancel</button><button type="submit" className="rounded-lg bg-blue-600 px-5 py-2.5 text-white">{saving ? "Adding…" : "Add to List"}</button></div>
      </fieldset>
    </form>}
    <section className="overflow-hidden rounded-xl border bg-white dark:border-[#243244] dark:bg-[#111C2D]">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b p-5 dark:border-[#243244]"><h2 className="font-semibold">Interns list <span className="ml-2 text-sm text-gray-500">({interns.length})</span></h2><div className="relative w-full sm:w-80"><Search size={18} className="absolute left-3 top-3 text-gray-500" /><input aria-label="Search interns" placeholder="Search name, role or company" value={search} onChange={event => setSearch(event.target.value)} className={`${inputClass} pl-10`} /></div></div>
      {loadError && <div role="alert" className="p-5 text-red-500">Could not load interns: {loadError}. <button type="button" onClick={() => setRefresh(current => current + 1)} className="underline">Retry</button></div>}
      {loading ? <p className="p-6">Loading interns…</p> : <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-gray-50 text-gray-500 dark:bg-[#0b1220]"><tr>{["Candidate name", "Role", "Company", "Start date", "Duration", "End date", "Actions", "Offer Letter"].map(label => <th key={label} scope="col" className="whitespace-nowrap px-5 py-4 font-medium">{label}</th>)}</tr></thead><tbody>
        {filtered.map(intern => <tr key={intern._id} className="border-t dark:border-[#243244]"><td className="px-5 py-4 font-semibold">{intern.candidateName}</td><td className="px-5 py-4">{intern.role}</td><td className="px-5 py-4">{intern.companyName}</td><td className="whitespace-nowrap px-5 py-4">{certificateDate(intern.startDate)}</td><td className="whitespace-nowrap px-5 py-4">{intern.duration} months</td><td className="whitespace-nowrap px-5 py-4">{certificateDate(completionDate(intern.startDate, intern.duration))}</td><td className="px-5 py-4"><button type="button" title="Completion certificate" aria-label={`Open completion certificate for ${intern.candidateName}`} onClick={() => setSelected(intern)} className="rounded-lg border border-blue-200 p-2 text-blue-500 hover:bg-blue-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500 dark:border-[#243244] dark:hover:bg-[#243244]"><Award size={20} /></button></td><td className="px-5 py-4"><button type="button" title="Offer letter" aria-label={`Open offer letter for ${intern.candidateName}`} onClick={() => setOfferSelected(intern)} className="rounded-lg border border-blue-200 p-2 text-blue-500 hover:bg-blue-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500 dark:border-[#243244] dark:hover:bg-[#243244]"><FileText size={20} /></button></td></tr>)}
        {!filtered.length && <tr><td colSpan={8} className="p-8 text-center text-gray-500">{search ? "No matching interns." : loadError ? "Interns list is unavailable." : canAdd ? "No interns yet. Click Add Intern to create the first entry." : "No interns yet. An administrator can add interns."}</td></tr>}
      </tbody></table></div>}
    </section>
  </div>;
}
