import { previewInvoiceApi } from "../utils/previewInvoices";
import axios from "axios";
import { clearAuthSession, isPanelPreview } from "../utils/auth";
import { getPreviewInterns, addPreviewIntern, getPreviewOfferEmployees, addPreviewOfferEmployee } from "../utils/previewInterns";

const rawBaseUrl = (import.meta.env.VITE_API_URL || "http://localhost:5001/api").trim().replace(/\/+$/, "");
const baseURL = rawBaseUrl.endsWith("/api") ? rawBaseUrl : `${rawBaseUrl}/api`;

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && error.config?.url !== "/auth/login" && !isPanelPreview()) {
      clearAuthSession();
      if (window.location.pathname !== "/login") window.location.replace("/login");
    }
    const data = error.response?.data;
    const message = Array.isArray(data?.errors)
      ? data.errors.join(", ")
      : data?.message || error.message || "Something went wrong";

    return Promise.reject(new Error(message));
  }
);

const unwrap = (request) => request.then((response) => response.data);

export const authApi = {
  login: ({ identifier, email, username, password }) =>
    unwrap(
      api.post("/auth/login", {
        identifier: identifier || email || username,
        password,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      })
    ),
};

export const employeeApi = {
  getAll: () => unwrap(api.get("/employees")),
  getById: (id) => unwrap(api.get(`/employees/${id}`)),
  create: (data) => unwrap(api.post("/employees", data)),
  update: (id, data) => unwrap(api.put(`/employees/${id}`, data)),
  remove: (id) => unwrap(api.delete(`/employees/${id}`)),
};

export const clientApi = {
  getAll: () => unwrap(api.get("/clients")),
  getById: (id) => unwrap(api.get(`/clients/${id}`)),
  create: (data) => unwrap(api.post("/clients", data)),
  update: (id, data) => unwrap(api.put(`/clients/${id}`, data)),
  remove: (id) => unwrap(api.delete(`/clients/${id}`)),
};

export const leadApi = {
  getAll: () => unwrap(api.get("/leads")),
  getById: (id) => unwrap(api.get(`/leads/${id}`)),
  create: (data) => unwrap(api.post("/leads", data)),
  convert: (id) => unwrap(api.post(`/leads/${id}/convert`)),
  update: (id, data) => unwrap(api.put(`/leads/${id}`, data)),
  remove: (id) => unwrap(api.delete(`/leads/${id}`)),
};

export const projectApi = {
  getAll: () => unwrap(api.get("/projects")),
  getById: (id) => unwrap(api.get(`/projects/${id}`)),
  create: (data) => unwrap(api.post("/projects", data)),
  update: (id, data) => unwrap(api.put(`/projects/${id}`, data)),
  remove: (id) => unwrap(api.delete(`/projects/${id}`)),
  assignTeam: (id, employeeIds) => unwrap(api.post(`/projects/${id}/team`, { employeeIds })),
};

export const taskApi = {
  addWorkUpdate: (id, data) => unwrap(api.post(`/tasks/${id}/work`, data)),
  getAll: () => unwrap(api.get("/tasks")),
  getById: (id) => unwrap(api.get(`/tasks/${id}`)),
  create: (data) => unwrap(api.post("/tasks", data)),
  update: (id, data) => unwrap(api.put(`/tasks/${id}`, data)),
  remove: (id) => unwrap(api.delete(`/tasks/${id}`)),
};

export const hrDocumentApi = {
  getOfferEmployees: async () => isPanelPreview() ? getPreviewOfferEmployees() : unwrap(api.get("/hr/documents/offer-employees")),
  addOfferEmployee: async (data) => isPanelPreview() ? addPreviewOfferEmployee(data) : unwrap(api.post("/hr/documents/offer-employees", data)),
  getInterns: async () => isPanelPreview() ? getPreviewInterns() : unwrap(api.get("/hr/documents/interns")),
  addIntern: async (data) => isPanelPreview() ? addPreviewIntern(data) : unwrap(api.post("/hr/documents/interns", data)),
  getAll: (type) => unwrap(api.get(`/hr/documents/${type}`)),
  create: (type, data) => unwrap(api.post(`/hr/documents/${type}`, data)),
  update: (type, id, data) => unwrap(api.put(`/hr/documents/${type}/${id}`, data)),
};

export const hrApi = {
  getSummary: () => unwrap(api.get("/hr")),
};

export const etlApi = {
  getWorkflow: () => unwrap(api.get("/etl/workflow")),
  saveWorkflow: (workflow) => unwrap(api.post("/etl/workflow", workflow)),
  runWorkflow: (workflow) => unwrap(api.post("/etl/run", workflow)),
};

export const practiceLabApi = {
  getOverview: () => unwrap(api.get("/training/practice/overview")),
  getProjects: () => unwrap(api.get("/training/practice/projects")),
  createProject: (data) => unwrap(api.post("/training/practice/projects", data)),
  updateProject: (id, data) => unwrap(api.put(`/training/practice/projects/${id}`, data)),
  removeProject: (id) => unwrap(api.delete(`/training/practice/projects/${id}`)),
  startSession: (data) => unwrap(api.post("/training/practice/sessions", data)),
  getChallenges: () => unwrap(api.get("/training/practice/challenges")),
};

export default api;

export const invoiceApi = {
  getAll: async () => isPanelPreview() ? previewInvoiceApi.getAll() : unwrap(api.get('/invoices')),
  getById: async id => isPanelPreview() ? previewInvoiceApi.getById(id) : unwrap(api.get(`/invoices/${id}`)),
  create: async data => isPanelPreview() ? previewInvoiceApi.create(data) : unwrap(api.post('/invoices', data)),
  update: async (id, data) => isPanelPreview() ? previewInvoiceApi.update(id, data) : unwrap(api.put(`/invoices/${id}`, data)),
  remove: async id => isPanelPreview() ? previewInvoiceApi.remove(id) : unwrap(api.delete(`/invoices/${id}`)),
  getSettings: async () => isPanelPreview() ? previewInvoiceApi.getSettings() : unwrap(api.get('/invoices/settings')),
  saveSettings: async data => isPanelPreview() ? previewInvoiceApi.saveSettings(data) : unwrap(api.put('/invoices/settings', data)),
};
