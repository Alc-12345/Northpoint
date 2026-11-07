// Validate before updating React state: an unexpected save response must not
// replace the editor with a row that crashes the invoice table.
export function invoiceResponse(data) {
  const problems = [];
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    problems.push(`expected a JSON object, received ${Array.isArray(data) ? "an array" : data === null ? "null" : typeof data}`);
  } else {
    if (typeof data._id !== "string" || !data._id) problems.push("missing or invalid _id");
    if (typeof data.invoiceNumber !== "string") problems.push("missing or invalid invoiceNumber");
    if (!data.client || typeof data.client.name !== "string") problems.push("missing or invalid client.name");
    if (!data.amountsLocked && !Array.isArray(data.items)) problems.push("missing items array on an unlocked invoice");
  }
  if (problems.length) {
    throw new Error(`The server returned an invalid invoice (${problems.join("; ")}). Reload the invoice list to check whether it was saved before trying again.`);
  }
  return { ...data, items: Array.isArray(data.items) ? data.items : [] };
}

export function invoiceListResponse(data) {
  if (!Array.isArray(data)) throw new Error("The server returned an invalid invoice list. Please reload the page.");
  return data.map(invoiceResponse);
}

// Some deployments acknowledge a write without returning the saved document.
// Read it back rather than repeating the write (which can create duplicates).
export async function savedInvoiceResponse(data, submitted, loadInvoices) {
  try {
    return invoiceResponse(data);
  } catch (responseError) {
    const rows = invoiceListResponse(await loadInvoices());
    const saved = rows.find(row => submitted._id
      ? row._id === submitted._id
      : row.invoiceNumber === submitted.invoiceNumber.trim());
    if (!saved) throw responseError;
    return saved;
  }
}
