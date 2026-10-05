export const clearAuthSession = () => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("authUser");
};

export const logout = (navigate) => {
  clearAuthSession();
  navigate("/login", { replace: true });
};
