export const isPanelPreview = () => sessionStorage.getItem("panelPreview") === "true";

export const startPanelPreview = (role) => {
  clearAuthSession();
  sessionStorage.setItem("panelPreview", "true");
  localStorage.setItem("authUser", JSON.stringify({ role }));
};

export const clearAuthSession = () => {
  sessionStorage.removeItem("panelPreview");
  localStorage.removeItem("authToken");
  localStorage.removeItem("authUser");
};

export const logout = (navigate) => {
  clearAuthSession();
  navigate("/login", { replace: true });
};
