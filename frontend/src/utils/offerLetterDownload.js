const escapeXml = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' }[char]));
const money = value => Number(value).toLocaleString("en-IN", { maximumFractionDigits: 2 });

export function remunerationWords(amount) {
  const small = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
  const words = n => {
    if (n < 20) return small[n];
    if (n < 100) return `${tens[Math.floor(n / 10)]}${n % 10 ? ` ${small[n % 10]}` : ""}`;
    for (const [unit, label] of [[10000000, "Crore"], [100000, "Lakh"], [1000, "Thousand"], [100, "Hundred"]]) {
      if (n >= unit) return `${words(Math.floor(n / unit))} ${label}${n % unit ? ` ${words(n % unit)}` : ""}`;
    }
  };
  const paise = Math.round(Number(amount) * 100);
  if (!Number.isFinite(paise) || paise < 0 || paise > 1200000000000) return "";
  return `Rupees ${words(Math.floor(paise / 100))}${paise % 100 ? ` and ${words(paise % 100)} Paise` : ""} Only`;
}

export function offerLetterFields(values) {
  const fields = { ...values, monthlySalary: money(values.monthlySalary), annualSalary: money(Math.round(Number(values.monthlySalary) * 12 * 100) / 100) };
  for (const [prefix, key] of [["issue", "issueDate"], ["start", "startDate"]]) {
    const date = new Date(`${values[key]}T00:00:00Z`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(values[key]) || !Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== values[key]) throw new Error("Enter valid letter and start dates.");
    const day = date.getUTCDate();
    fields[`${prefix}Day`] = String(day);
    fields[`${prefix}Ordinal`] = day % 100 >= 11 && day % 100 <= 13 ? "th" : ({ 1: "st", 2: "nd", 3: "rd" }[day % 10] || "th");
    fields[`${prefix}Month`] = date.toLocaleString("en-GB", { month: "long", timeZone: "UTC" });
    fields[`${prefix}Year`] = String(date.getUTCFullYear());
  }
  if (!Number.isFinite(Number(values.monthlySalary)) || Number(values.monthlySalary) < 0) throw new Error("Enter valid remuneration.");
  return fields;
}

export async function fillOfferLetter(templateBytes, values) {
  const { default: JSZip } = await import("jszip");
  const zip = await JSZip.loadAsync(templateBytes);
  const fields = offerLetterFields(values);
  const xml = await zip.file("word/document.xml").async("string");
  const filled = xml.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    if (fields[key] == null) throw new Error(`Missing letter field: ${key}`);
    return escapeXml(fields[key]);
  });
  zip.file("word/document.xml", filled);
  return zip.generateAsync({ type: "uint8array", compression: "DEFLATE" });
}

export async function downloadOfferLetter(values) {
  const response = await fetch(`${import.meta.env.BASE_URL}templates/offer-letter.docx`);
  if (!response.ok) throw new Error("The offer letter template could not be loaded.");
  const documentBytes = await fillOfferLetter(await response.arrayBuffer(), values);
  const bytes = await offerLetterPdf(documentBytes);
  const url = URL.createObjectURL(new Blob([bytes], { type: "application/pdf" }));
  const anchor = document.createElement("a");
  anchor.href = url; anchor.download = `Offer_Letter_${values.candidateName.replace(/[^\p{L}\p{N}_-]/gu, "_")}.pdf`;
  document.body.appendChild(anchor); anchor.click(); anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}

export async function offerLetterPdf(documentBytes) {
  const [{ renderAsync }, { default: html2canvas }, { PDFDocument }] = await Promise.all([
    import("docx-preview"), import("html2canvas"), import("pdf-lib"),
  ]);
  const container = document.createElement("div");
  container.setAttribute("aria-hidden", "true");
  container.style.cssText = "position:fixed;left:-10000px;top:0;width:794px;background:white;color:black;pointer-events:none;";
  document.body.appendChild(container);
  try {
    await renderAsync(documentBytes, container, container, {
      className: "offer-document", inWrapper: false, breakPages: true,
      ignoreLastRenderedPageBreak: false, useBase64URL: true,
    });
    formatOfferTables(container);
    await document.fonts.ready;
    await Promise.all(Array.from(container.querySelectorAll("img"), async image => {
      await image.decode();
    }));
    const pages = Array.from(container.querySelectorAll("section.offer-document"));
    if (!pages.length) throw new Error("The offer letter could not be rendered. Please try again.");
    const pdf = await PDFDocument.create();
    pdf.setTitle("Offer Letter with Annexure I");
    for (const element of pages) {
      const canvas = await html2canvas(element, {
        scale: 2, backgroundColor: "#ffffff", logging: false,
        windowWidth: 1200, windowHeight: 1600,
      });
      const artwork = await pdf.embedPng(canvas.toDataURL("image/png"));
      const page = pdf.addPage([595.28, 841.89]);
      const scale = Math.min(page.getWidth() / artwork.width, page.getHeight() / artwork.height);
      const width = artwork.width * scale;
      const height = artwork.height * scale;
      page.drawImage(artwork, { x: (page.getWidth() - width) / 2, y: page.getHeight() - height, width, height });
      canvas.width = 0; canvas.height = 0;
    }
    return await pdf.save();
  } finally {
    container.remove();
  }
}

export function formatOfferTables(container) {
  const style = document.createElement("style");
  style.textContent = `
    .offer-document table.offer-remuneration {
      width: 100% !important; table-layout: fixed !important;
      border-collapse: collapse !important; margin: 12pt 0 18pt !important;
    }
    .offer-document table.offer-remuneration tr {
      height: auto !important; min-height: 0 !important;
    }
    .offer-document table.offer-remuneration td {
      height: auto !important; padding: 8pt 9pt !important;
      border: 1pt solid #000 !important; vertical-align: middle !important;
      overflow-wrap: anywhere; color: #000; font-size: 11pt !important;
    }
    .offer-document table.offer-remuneration p {
      margin: 0 !important; padding: 0 !important; height: auto !important;
      min-height: 0 !important; line-height: 1.4 !important;
    }
    .offer-document table.offer-remuneration span {
      font-size: 11pt !important; line-height: inherit !important;
    }
    .offer-document table.offer-remuneration tr:first-child td {
      font-weight: bold;
    }
  `;
  container.appendChild(style);
  for (const table of container.querySelectorAll("table")) {
    if (table.rows[0]?.textContent.includes("Particulars") && table.textContent.includes("Fixed Consolidated Remuneration")) {
      table.classList.add("offer-remuneration");
    }
  }
}
