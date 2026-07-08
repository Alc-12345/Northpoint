import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
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
    const data = error.response?.data;
    const message = Array.isArray(data?.errors)
      ? data.errors.join(", ")
      : data?.message || error.message || "Something went wrong";

    return Promise.reject(new Error(message));
  }
);

const unwrap = (request) => request.then((response) => response.data);

export const authApi = {
  login: (credentials) => unwrap(api.post("/auth/login", credentials)),
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
  update: (id, data) => unwrap(api.put(`/leads/${id}`, data)),
  remove: (id) => unwrap(api.delete(`/leads/${id}`)),
};

export const projectApi = {
  getAll: () => unwrap(api.get("/projects")),
  getById: (id) => unwrap(api.get(`/projects/${id}`)),
  create: (data) => unwrap(api.post("/projects", data)),
  update: (id, data) => unwrap(api.put(`/projects/${id}`, data)),
  remove: (id) => unwrap(api.delete(`/projects/${id}`)),
};

export const taskApi = {
  getAll: () => unwrap(api.get("/tasks")),
  getById: (id) => unwrap(api.get(`/tasks/${id}`)),
  create: (data) => unwrap(api.post("/tasks", data)),
  update: (id, data) => unwrap(api.put(`/tasks/${id}`, data)),
  remove: (id) => unwrap(api.delete(`/tasks/${id}`)),
};

export const hrApi = {
  getSummary: () => unwrap(api.get("/hr")),
};

export const etlApi = {
  getWorkflow: () => unwrap(api.get("/etl/workflow")),
  saveWorkflow: (workflow) => unwrap(api.post("/etl/workflow", workflow)),
  runWorkflow: (workflow) => unwrap(api.post("/etl/run", workflow)),
};

export default api;
