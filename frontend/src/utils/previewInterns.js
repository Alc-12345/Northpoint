const storageKey = "northpoint.preview.interns";

export function getPreviewInterns() {
  const data = JSON.parse(sessionStorage.getItem(storageKey) || "[]");
  if (!Array.isArray(data)) throw new Error("Preview intern data is invalid. Start a new preview session.");
  return data;
}

export function addPreviewIntern(values) {
  const user = JSON.parse(localStorage.getItem("authUser") || "null");
  if (!["admin", "superadmin"].includes(user?.role)) throw new Error("Only administrators can add interns.");
  const intern = { ...values, _id: crypto.randomUUID(), createdAt: new Date().toISOString() };
  sessionStorage.setItem(storageKey, JSON.stringify([intern, ...getPreviewInterns()]));
  return intern;
}

export function getPreviewOfferEmployees() {
  const data = JSON.parse(sessionStorage.getItem("northpoint.preview.offerEmployees") || "[]");
  if (!Array.isArray(data)) throw new Error("Preview employee data is invalid.");
  return data;
}

export function addPreviewOfferEmployee(values) {
  const user = JSON.parse(localStorage.getItem("authUser") || "null");
  if (!["admin", "superadmin"].includes(user?.role)) throw new Error("Only administrators can add employees.");
  const employee = { ...values, _id: crypto.randomUUID(), createdAt: new Date().toISOString() };
  sessionStorage.setItem("northpoint.preview.offerEmployees", JSON.stringify([employee, ...getPreviewOfferEmployees()]));
  return employee;
}
