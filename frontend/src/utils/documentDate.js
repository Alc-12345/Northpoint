export function formatDocumentDate(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value ?? ""));
  if (!match) return value ?? "";
  const [, year, month, day] = match;
  const date = new Date(`${year}-${month}-${day}T00:00:00Z`);
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value) return value;
  const n = Number(day);
  const suffix = n % 100 >= 11 && n % 100 <= 13 ? "th" : ({ 1: "st", 2: "nd", 3: "rd" }[n % 10] || "th");
  return `${n}${suffix} ${date.toLocaleString("en-GB", { month: "short", timeZone: "UTC" })} ${year}`;
}

export const formatDocumentValues = values => Object.fromEntries(Object.entries(values).map(([key, value]) => [key, typeof value === "string" ? formatDocumentDate(value) : value]));
export const commercialIssuer = { name: "Austin Legacy Corp ", signatory: "Ashish Patrick Austin", title: "Founder & Chief Executive Officer" };
