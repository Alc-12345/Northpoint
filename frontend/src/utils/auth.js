export const isPanelPreview = () => sessionStorage.getItem("panelPreview") === "true";

export const startPanelPreview = (role) => {
  clearAuthSession();
  sessionStorage.setItem("panelPreview", "true");
  localStorage.setItem("authUser", JSON.stringify({ role }));
};

export const clearAuthSession = () => {
  sessionStorage.removeItem("panelPreview");
  sessionStorage.removeItem("northpoint.preview.interns");
  sessionStorage.removeItem("northpoint.preview.offerEmployees");
  sessionStorage.removeItem("northpoint.preview.invoices");
  sessionStorage.removeItem("northpoint.preview.invoiceSettings");
  localStorage.removeItem("authToken");
  localStorage.removeItem("authUser");
};

export const logout = async (navigate) => {
  const token = localStorage.getItem("authToken");
  if (token && !isPanelPreview()) {
    try {
      const rawUrl = (import.meta.env.VITE_API_URL || "http://localhost:5001/api").trim().replace(/\/+$/, "");
      const apiUrl = rawUrl.endsWith("/api") ? rawUrl : `${rawUrl}/api`;
      const response = await fetch(`${apiUrl}/auth/logout`, { method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, body: "{}" });
      if (!response.ok && response.status !== 401) throw new Error("Logout could not be finalized. Please retry.");
    } catch (error) { window.alert(error.message); return; }
  }
  clearAuthSession();
  navigate("/login", { replace: true });
};
