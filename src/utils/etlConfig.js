export const operationGroups = {
  source: {
    label: "Source",
    description: "Files, SQL, and APIs",
    operations: [
      { label: "CSV Input", type: "csv" },
      { label: "Excel Input", type: "excel" },
      { label: "SQL Input", type: "sql" },
      { label: "API Input", type: "api" },
    ],
  },
  transform: {
    label: "Transform",
    description: "Clean and reshape rows",
    operations: [
      { label: "Filter Rows", type: "filter" },
      { label: "Formula", type: "formula" },
      { label: "Select Columns", type: "select" },
      { label: "Split Column", type: "split" },
      { label: "JSON Flatten", type: "json" },
    ],
  },
  combine: {
    label: "Combine",
    description: "Join, union, aggregate",
    operations: [
      { label: "Join Data", type: "join" },
      { label: "Union Data", type: "union" },
      { label: "Aggregate", type: "aggregate" },
    ],
  },
  output: {
    label: "Output",
    description: "Preview or publish data",
    operations: [
      { label: "Preview Data", type: "preview" },
      { label: "Output Dataset", type: "output" },
    ],
  },
  frontend: {
    label: "Frontend",
    description: "UI pages and client views",
    operations: [
      { label: "React Page", type: "react-page" },
      { label: "Dashboard UI", type: "dashboard-ui" },
      { label: "Form UI", type: "form-ui" },
      { label: "Table UI", type: "table-ui" },
    ],
  },
  backend: {
    label: "Backend",
    description: "APIs, services, and jobs",
    operations: [
      { label: "REST API", type: "rest-api" },
      { label: "Auth Service", type: "auth-service" },
      { label: "Database Model", type: "db-model" },
      { label: "Background Job", type: "background-job" },
    ],
  },
  server: {
    label: "Server",
    description: "Deploy and runtime setup",
    operations: [
      { label: "Node Server", type: "node-server" },
      { label: "Express Route", type: "express-route" },
      { label: "Environment Config", type: "env-config" },
      { label: "Deployment", type: "deployment" },
    ],
  },
};

export const getDefaultOperation = (category) =>
  operationGroups[category]?.operations[0] || operationGroups.source.operations[0];

export const getOperationLabel = (type) => {
  const operation = Object.values(operationGroups)
    .flatMap((group) => group.operations)
    .find((item) => item.type === type);

  return operation?.label || "ETL Step";
};
