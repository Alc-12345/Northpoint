// Validate before updating React state: an unexpected save response must not
// replace the editor with a row that crashes the invoice table.
export function invoiceResponse(data) {
  if (
    !data || typeof data !== "object" ||
    typeof data._id !== "string" || !data._id ||
    typeof data.invoiceNumber !== "string" ||
    !data.client || typeof data.client.name !== "string" ||
    (!data.amountsLocked && !Array.isArray(data.items))
  ) {
    throw new Error("The server returned an invalid invoice. Reload the invoice list to check whether it was saved before trying again.");
  }
  return { ...data, items: Array.isArray(data.items) ? data.items : [] };
}

export function invoiceListResponse(data) {
  if (!Array.isArray(data)) throw new Error("The server returned an invalid invoice list. Please reload the page.");
  return data.map(invoiceResponse);
}
