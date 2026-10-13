export const operationGroups = {
  source: {
    label: "Source",
    description: "Upload and store files",
    operations: [
      { label: "CSV File", type: "csv" },
      { label: "JSON File", type: "json-file" },
    ],
  },
  transform: {
    label: "Transform",
    description: "Clean and reshape rows",
    operations: [
      { label: "Filter Rows", type: "filter" },
      { label: "Reshape Columns", type: "select" },
      { label: "SQL Function", type: "sql-function" },
      { label: "Math Function", type: "math" },
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
    description: "Show processed data",
    operations: [
      { label: "Preview Data", type: "preview" },
      { label: "Output Dataset", type: "output" },
    ],
  },
  frontend: {
    label: "Frontend",
    description: "Track frontend work progress",
    operations: [
      { label: "React Page", type: "react-page" },
      { label: "Dashboard UI", type: "dashboard-ui" },
      { label: "Form UI", type: "form-ui" },
      { label: "Table UI", type: "table-ui" },
    ],
  },
  backend: {
    label: "Backend",
    description: "Track backend work progress",
    operations: [
      { label: "REST API", type: "rest-api" },
      { label: "Auth Service", type: "auth-service" },
      { label: "Database Model", type: "db-model" },
      { label: "Background Job", type: "background-job" },
    ],
  },
  server: {
    label: "Server",
    description: "Track server work progress",
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
