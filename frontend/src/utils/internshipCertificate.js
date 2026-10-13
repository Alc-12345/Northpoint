export function completionDate(startDate, months) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(startDate) || ![3, 6].includes(Number(months))) return "";
  const [year, month, day] = startDate.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (date.toISOString().slice(0, 10) !== startDate) return "";
  const lastDay = new Date(Date.UTC(year, month - 1 + Number(months) + 1, 0)).getUTCDate();
  return new Date(Date.UTC(year, month - 1 + Number(months), Math.min(day, lastDay))).toISOString().slice(0, 10);
}

export const certificateDate = value => value ? new Date(`${value}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }) : "[Date]";

// One renderer supplies both the on-screen preview and the downloaded A4 PDF.
export function renderCertificate(values) {
  const canvas = document.createElement("canvas");
  canvas.width = 1684; canvas.height = 1190;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, 1684, 1190);
  const gold = ctx.createLinearGradient(0, 0, 1684, 0);
  gold.addColorStop(0, "#b88c55"); gold.addColorStop(0.5, "#efd7ad"); gold.addColorStop(1, "#b88c55");
  ctx.strokeStyle = gold; ctx.lineWidth = 6;
  [[34, 290, 34, 34, 290, 34], [1394, 34, 1650, 34, 1650, 380], [34, 910, 34, 1156, 290, 1156], [1394, 1156, 1650, 1156, 1650, 910]].forEach(points => {
    ctx.beginPath(); ctx.moveTo(points[0], points[1]); ctx.lineTo(points[2], points[3]); ctx.lineTo(points[4], points[5]); ctx.stroke();
  });
  const text = (value, x, y, size, maxWidth, font = "Arial", weight = "normal", align = "center", color = "#171717") => {
    value = String(value);
    ctx.textAlign = align; ctx.fillStyle = color;
    let actual = size;
    do { ctx.font = `${weight} ${actual}px ${font}`; if (ctx.measureText(value).width <= maxWidth) break; actual -= 1; } while (actual > 12);
    ctx.fillText(value, x, y, maxWidth);
  };
  text(values.companyName || "Northpoint", 842, 165, 76, 1180, "Arial", "bold", "center", "#17648b");
  text("INTERNSHIP COMPLETION", 842, 214, 22, 1100, "Arial", "normal", "center", "#8d6b3e");
  text("CERTIFICATE", 458, 480, 93, 720, "Arial", "bold");
  text("O F   I N T E R N S H I P", 458, 530, 32, 700);
  ctx.strokeStyle = "#a3a3a3"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(854, 365); ctx.lineTo(854, 575); ctx.stroke();
  text("This certificate is awarded to", 1230, 419, 32, 655);
  text(values.candidateName || "Candidate name", 1230, 530, 68, 650, "'Brush Script MT', 'Segoe Script', cursive", "italic");
  text(`From ${values.companyName || "Northpoint"}`, 842, 680, 30, 1430, "Arial", "italic");
  text(`In recognition of their efforts and achievements in completing a ${values.duration === "6" ? "six" : "three"}-month internship program as`, 842, 733, 26, 1470);
  text(values.role || "Internship role", 842, 842, 40, 1400, "Arial", "bold");
  text(`Conducted from ${certificateDate(values.startDate)} – ${certificateDate(completionDate(values.startDate, values.duration))}`, 842, 901, 30, 1430);
  ctx.strokeStyle = "#171717"; ctx.lineWidth = 2;
  [[120, 470], [1214, 1564]].forEach(([start, end]) => { ctx.beginPath(); ctx.moveTo(start, 1030); ctx.lineTo(end, 1030); ctx.stroke(); });
  text(certificateDate(values.issueDate), 295, 1073, 24, 440);
  text(values.signatory || "Authorized signatory", 1389, 1073, 26, 455);
  text(values.designation || "Director", 1389, 1114, 24, 440, "Arial", "italic");
  return canvas;
}

export async function downloadCertificate(values) {
  const { PDFDocument } = await import("pdf-lib");
  const pdf = await PDFDocument.create();
  pdf.setTitle(`Internship Completion Certificate – ${values.candidateName}`);
  const page = pdf.addPage([841.89, 595.28]);
  const artwork = await pdf.embedPng(renderCertificate(values).toDataURL("image/png"));
  page.drawImage(artwork, { x: 0, y: 0, width: 841.89, height: 595.28 });
  const bytes = await pdf.save();
  const url = URL.createObjectURL(new Blob([bytes], { type: "application/pdf" }));
  const anchor = document.createElement("a");
  anchor.href = url; anchor.download = `Internship_Completion_${values.candidateName.replace(/[^\p{L}\p{N}_-]/gu, "_")}.pdf`;
  document.body.appendChild(anchor); anchor.click(); anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}
