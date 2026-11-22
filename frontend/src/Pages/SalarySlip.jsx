import { useEffect, useState } from "react";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import logo from "../assets/austin-legacy-corp.png";
import { hrDocumentApi } from "../services/api";

const details = [["employeeName", "Employee Name"], ["designation", "Designation"], ["joiningDate", "Date of Joining", "date"], ["payPeriod", "Pay Period", "month"], ["payDate", "Pay Date", "date"], ["pfNumber", "PF / A Number"], ["uan", "UAN"], ["esiNumber", "ESI Number"], ["pan", "PAN"], ["bankAccount", "Bank Account No"]];
const earnings = [["basic", "Basic"], ["hra", "House Rent Allowance"], ["conveyance", "Conveyance Allowance"], ["telephone", "Telephone/Internet Allowance"], ["leaveTravel", "Leave Travel Allowance"], ["incentives", "Performance Incentives"]];
const deductions = [["epf", "EPF Contribution"], ["professionalTax", "Professional Tax"]];
const money = value => Number(value || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const date = value => value ? new Date(`${value}T00:00:00`).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—";
const period = value => value ? new Date(`${value}-01T00:00:00`).toLocaleDateString("en-IN", { month: "long", year: "numeric" }) : "—";
const input = "mt-1 w-full rounded-lg border border-gray-300 bg-white p-2.5 text-gray-800 dark:border-[#243244] dark:bg-[#0b1220] dark:text-gray-200";

async function makePdf(values, gross, deducted, company) {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595.28, 841.89]);
  const font = await pdf.embedFont(StandardFonts.Helvetica), bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const black = rgb(0.1, 0.1, 0.1), muted = rgb(0.4, 0.4, 0.4), line = rgb(0.85, 0.85, 0.85);
  const text = (value, x, y, size = 10, face = font, color = black, max = 500) => {
    const str = String(value || "-").replace(/[^\x20-\x7e]/g, "-");
    let fitted = size;
    while (face.widthOfTextAtSize(str, fitted) > max && fitted > 5) fitted -= 0.5;
    page.drawText(str, { x, y, size: fitted, font: face, color, maxWidth: max });
  };
  const rule = (x1, x2, y) => page.drawLine({ start: { x: x1, y }, end: { x: x2, y }, thickness: 0.6, color: line });
  const imageBytes = await fetch(company.logo || logo).then(r => { if (!r.ok) throw new Error("Company logo could not be loaded."); return r.arrayBuffer(); });
  const signature = new Uint8Array(imageBytes);
  const image = signature[0] === 0xff && signature[1] === 0xd8 ? await pdf.embedJpg(imageBytes) : await pdf.embedPng(imageBytes);
  const scaled = image.scaleToFit(95, 65);
  page.drawImage(image, { x: 555 - scaled.width, y: 765 + (65 - scaled.height) / 2, width: scaled.width, height: scaled.height });
  text(company.name, 35, 810, 18, bold, black, 380);
  if (company.address) {
    const words = company.address.trim().split(/\s+/);
    let split = 1;
    for (let i = 1; i < words.length; i++) {
      const difference = n => Math.abs(font.widthOfTextAtSize(words.slice(0, n).join(" "), 9) - font.widthOfTextAtSize(words.slice(n).join(" "), 9));
      if (difference(i) < difference(split)) split = i;
    }
    text(words.slice(0, split).join(" "), 35, 790, 9, font, muted, 380);
    if (split < words.length) text(words.slice(split).join(" "), 35, 778, 9, font, muted, 380);
  }
  rule(30, 565, 762);
  text(`Payslip For the month of ${period(values.payPeriod)}`, 35, 738, 14, bold);
  text("Employee Pay Summary", 35, 718, 11, bold);
  details.forEach(([key, label], i) => { const y = 697 - i * 17; text(label, 35, y, 9, font, muted, 110); text(key === "payPeriod" ? period(values[key]) : key === "joiningDate" || key === "payDate" ? date(values[key]) : values[key], 150, y, 9, font, black, 165); });
  page.drawRectangle({ x: 335, y: 605, width: 220, height: 75, borderColor: line, borderWidth: 1 });
  text("Employee Net Pay", 390, 660, 10, font, muted);
  text(`INR ${money(gross - deducted)}`, 390, 640, 15, bold, black, 145);
  text(`Paid Days : ${values.paidDays || "0"}  |  LOP Days : ${values.lopDays || "0"}`, 360, 620, 9, font, muted, 180);
  rule(30, 285, 510); rule(310, 565, 510);
  const table = (rows, x, heading, totalLabel, total) => {
    page.drawRectangle({ x, y: 481, width: 255, height: 20, color: rgb(0.95, 0.95, 0.95) });
    text(heading, x + 6, 487, 10, bold); text("Amount", x + 195, 487, 10, bold);
    rows.forEach(([key, label], i) => { text(label, x + 6, 465 - i * 19, 9, font, black, 175); const amount = money(values[key]); text(amount, x + 249 - font.widthOfTextAtSize(amount, 9), 465 - i * 19, 9); });
    rule(x, x + 255, 345); text(totalLabel, x + 6, 328, 10, bold); const amount = money(total); text(amount, x + 249 - bold.widthOfTextAtSize(amount, 10), 328, 10, bold);
  };
  table(earnings, 30, "Earnings", "Gross Earnings", gross); table(deductions, 310, "Deductions", "Total Deductions", deducted);
  page.drawRectangle({ x: 0, y: 275, width: 595, height: 36, color: rgb(0.88, 0.96, 0.87) });
  text(`Total Net Payable   INR ${money(gross - deducted)}`, 35, 287, 12, bold);
  text("Total Net Payable = Gross Earnings - Total Deductions.", 35, 250, 9);
  text("This document has been electronically generated and does not require a signature.", 95, 225, 9, font, muted, 410);
  return new Blob([await pdf.save()], { type: "application/pdf" });
}

export default function SalarySlip() {
  const [values, setValues] = useState({});
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [company, setCompany] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  useEffect(() => () => { if (previewUrl) URL.revokeObjectURL(previewUrl); }, [previewUrl]);
  const [companyError, setCompanyError] = useState("");
  useEffect(() => {
    let active = true;
    const refresh = () => hrDocumentApi.getCompanySettings()
      .then(data => { if (active) { setCompany(data); setCompanyError(""); } })
      .catch(err => { if (active) { setCompany(null); setCompanyError(err.message || "Unable to load company settings."); } });
    refresh();
    window.addEventListener("focus", refresh);
    return () => { active = false; window.removeEventListener("focus", refresh); };
  }, []);
  const update = e => setValues(current => ({ ...current, [e.target.name]: e.target.value }));
  const total = rows => rows.reduce((sum, [key]) => sum + Math.round(Number(values[key] || 0) * 100), 0) / 100;
  const gross = total(earnings), deducted = total(deductions);
  const field = ([key, label, type = "text"], required = false) => <label key={key} className="text-sm">{label}{required && " *"}<input className={input} name={key} type={type} value={values[key] || ""} onChange={update} required={required} maxLength={type === "text" ? 120 : undefined} min={type === "number" ? "0" : undefined} max={type === "number" ? "1000000000" : undefined} step={type === "number" ? "0.01" : undefined} /></label>;
  const generate = async (e, preview = false) => {
    e.preventDefault(); setError("");
    if (!company) { setError("Load the Invoice company settings before continuing."); return; }
    if (deducted > gross) { setError("Total deductions cannot exceed gross earnings."); return; }
    setBusy(true);
    try {
      const url = URL.createObjectURL(await makePdf(values, gross, deducted, company));
      if (preview) setPreviewUrl(url);
      else {
        const link = document.createElement("a"); link.href = url;
        link.download = `salary-slip-${(values.employeeName || "employee").replace(/[^a-z0-9]+/gi, "-")}-${values.payPeriod}.pdf`;
        link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
      }
    } catch (err) { setError(err.message || "Unable to generate the PDF."); } finally { setBusy(false); }
  };
  return <div className="text-gray-800 dark:text-gray-200"><h1 className="text-2xl font-bold">Salary Slip</h1><p className="mb-6 mt-2 text-sm text-gray-500">Enter the payslip details to download a salary slip. Details are not saved.</p>
    <div className="mb-4 rounded-lg border p-4 text-sm"><p>Company name and address come from <a href="/finance/invoices" className="text-cyan-600 underline">Invoice → Company Settings</a>.</p>{companyError ? <p role="alert" className="mt-2 text-red-500">Company settings could not load: {companyError}. Reload to retry.</p> : !company ? <p>Loading company settings...</p> : <p className="mt-2 whitespace-pre-line">{company.name}<br />{company.address}</p>}</div>
    <form onSubmit={e => generate(e)} className="space-y-6 rounded-xl border bg-white p-6 dark:border-[#243244] dark:bg-[#111C2D]">
      <section><h2 className="mb-4 text-lg font-semibold">Employee pay summary</h2><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{details.map(item => field(item, ["employeeName", "payPeriod"].includes(item[0])))}{field(["paidDays", "Paid Days", "number"])}{field(["lopDays", "LOP Days", "number"])}</div></section>
      <section className="grid gap-6 border-t pt-5 md:grid-cols-2 dark:border-[#243244]"><div><h2 className="mb-4 text-lg font-semibold">Earnings (INR)</h2><div className="grid gap-4">{earnings.map(([key, label]) => field([key, label, "number"]))}</div><p className="mt-4 font-semibold">Gross Earnings: ₹{money(gross)}</p></div><div><h2 className="mb-4 text-lg font-semibold">Deductions (INR)</h2><div className="grid gap-4">{deductions.map(([key, label]) => field([key, label, "number"]))}</div><p className="mt-4 font-semibold">Total Deductions: ₹{money(deducted)}</p></div></section>
      <div className="rounded-lg bg-green-50 p-4 text-green-900"><strong>Total Net Payable: ₹{money(gross - deducted)}</strong><p className="mt-1 text-sm">Gross earnings minus total deductions</p></div>
      {error && <p role="alert" className="text-sm text-red-600">{error}</p>}<div className="flex flex-wrap justify-end gap-3"><button type="button" onClick={e => { if (e.currentTarget.form.reportValidity()) generate(e, true); }} disabled={busy || !company} className="rounded-lg border border-blue-600 px-6 py-3 font-semibold text-blue-600 disabled:opacity-50">Preview Salary Slip</button><button disabled={busy || !company} className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white disabled:opacity-50">{busy ? "Generating PDF…" : "Download Salary Slip PDF"}</button></div>
    </form>{previewUrl && <section className="mt-6 rounded-xl border bg-white p-4 dark:border-[#243244] dark:bg-[#111C2D]"><div className="mb-3 flex items-center justify-between"><h2 className="text-lg font-semibold">Salary Slip Preview</h2><button type="button" onClick={() => setPreviewUrl("")} className="rounded border px-3 py-1">Close preview</button></div><iframe title="Salary slip preview" src={previewUrl} className="h-[75vh] w-full rounded border" /></section>}</div>;
}
