const common = [
  { key: "documentNumber", label: "Document number", required: true },
  { key: "issueDate", label: "Issue date", type: "date", required: true },
  { key: "companyName", label: "Company name", required: true },
  { key: "companyAddress", label: "Company address", type: "textarea", required: true },
  { key: "recipientName", label: "Recipient / client name", required: true },
  { key: "recipientEmail", label: "Recipient email", type: "email", required: true },
  { key: "recipientAddress", label: "Recipient address", type: "textarea" },
  { key: "signatory", label: "Authorized signatory", required: true },
];
export const documentTypes = {
  internship: {
    title: "Internship Letter",
    fields: [...common,
      { key: "position", label: "Internship role", required: true },
      { key: "department", label: "Department", required: true },
      { key: "startDate", label: "Start date", type: "date", required: true },
      { key: "endDate", label: "End date", type: "date", required: true },
      { key: "stipend", label: "Monthly stipend (INR)", type: "number", required: true },
      { key: "location", label: "Work location / mode", required: true },
      { key: "terms", label: "Terms and conditions", type: "textarea" },
    ],
    template: "Dear {{recipientName}},\n\nWe are pleased to offer you an internship as {{position}} in the {{department}} department at {{companyName}}.\n\nYour internship begins on {{startDate}} and ends on {{endDate}}. Your work location / mode is {{location}}. Your monthly stipend is INR {{stipend}}.\n\n{{terms}}\n\nPlease confirm your acceptance of this internship.\n\nSincerely,\n{{signatory}}\n{{companyName}}",
  },
  "offer-letter": {
    title: "Offer Letter",
    fields: [...common,
      { key: "position", label: "Job title", required: true },
      { key: "department", label: "Department", required: true },
      { key: "startDate", label: "Joining date", type: "date", required: true },
      { key: "salary", label: "Annual salary (INR)", type: "number", required: true },
      { key: "employmentType", label: "Employment type", required: true },
      { key: "probation", label: "Probation period", required: true },
      { key: "location", label: "Work location / mode", required: true },
      { key: "terms", label: "Benefits and conditions", type: "textarea" },
    ],
    template: "Dear {{recipientName}},\n\nWe are pleased to offer you the position of {{position}} in the {{department}} department at {{companyName}}.\n\nYour joining date is {{startDate}}. This is a {{employmentType}} position based at {{location}}, with an annual salary of INR {{salary}} and a probation period of {{probation}}.\n\n{{terms}}\n\nPlease sign below to confirm your acceptance.\n\nSincerely,\n{{signatory}}\n{{companyName}}\n\nAccepted by: ____________________\nDate: ____________________",
  },
  quotation: {
    title: "Quotation",
    fields: [...common,
      { key: "validUntil", label: "Valid until", type: "date", required: true },
      { key: "projectName", label: "Project / service name", required: true },
      { key: "scope", label: "Scope of work", type: "textarea", required: true },
      { key: "paymentTerms", label: "Payment terms", type: "textarea", required: true },
      { key: "deliveryTimeline", label: "Delivery timeline", required: true },
      { key: "taxRate", label: "Tax (%)", type: "number", required: true, max: 100 },
      { key: "notes", label: "Additional notes", type: "textarea" },
    ],
    template: "Prepared for {{recipientName}}\n\nProject / service: {{projectName}}\nValid until: {{validUntil}}\n\nScope of work\n{{scope}}\n\nDelivery timeline: {{deliveryTimeline}}\n\nPayment terms\n{{paymentTerms}}\n\n{{notes}}\n\nAuthorized by {{signatory}}\n{{companyName}}",
  },
};

export function quotationTotals(items = [], taxRate = 0) {
  const subtotal = Math.round(items.reduce((sum, item) => sum + Number(item.quantity) * Number(item.rate), 0) * 100) / 100;
  const tax = Math.round(subtotal * Number(taxRate) ) / 100;
  return { subtotal, tax, total: Math.round((subtotal + tax) * 100) / 100 };
}

export function fillTemplate(template, values) {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => String(values[key] ?? ""));
}

export function validateDocument(type, values = {}, items = [], template = "") {
  const config = Object.hasOwn(documentTypes, type) ? documentTypes[type] : null;
  if (!config) return ["Unknown document type"];
  if (!values || typeof values !== "object" || Array.isArray(values)) return ["Document fields are required"];
  const errors = [];
  for (const field of config.fields) {
    const value = values[field.key];
    if (field.required && (value === undefined || value === null || String(value).trim() === "")) errors.push(`${field.label} is required`);
    if (value !== undefined && value !== "") {
      if (!["string", "number"].includes(typeof value) || String(value).length > 10000) errors.push(`${field.label} is invalid or too long`);
      if (field.type === "number" && (!Number.isFinite(Number(value)) || Number(value) < 0 || Number(value) > (field.max ?? 1e12))) errors.push(`${field.label} is outside the allowed range`);
      if (field.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) errors.push("Enter a valid recipient email");
      if (field.type === "date" && (!/^\d{4}-\d{2}-\d{2}$/.test(value) || !Number.isFinite(Date.parse(value)) || new Date(value).toISOString().slice(0, 10) !== value)) errors.push(`${field.label} is invalid`);
    }
  }
  if (values.endDate && values.startDate && values.endDate < values.startDate) errors.push("End date must be on or after start date");
  if (values.validUntil && values.issueDate && values.validUntil < values.issueDate) errors.push("Validity date must be on or after issue date");
  if (typeof template !== "string" || !template.trim() || template.length > 30000) errors.push("Enter a template up to 30,000 characters");
  if (typeof template === "string") {
    const keys = new Set(config.fields.map(field => field.key));
    for (const match of template.matchAll(/\{\{(\w+)\}\}/g)) if (!keys.has(match[1])) errors.push(`Unknown template field: ${match[1]}`);
  }
  if (type === "quotation" && (!Array.isArray(items) || !items.length || items.length > 100 || items.some(item => !item || typeof item.description !== "string" || !item.description.trim() || item.description.length > 1000 || !Number.isFinite(Number(item.quantity)) || Number(item.quantity) <= 0 || Number(item.quantity) > 1e6 || item.rate === "" || item.rate == null || !Number.isFinite(Number(item.rate)) || Number(item.rate) < 0 || Number(item.rate) > 1e9))) errors.push("Add 1–100 quotation items with a description, positive quantity and non-negative rate");
  return [...new Set(errors)];
}
