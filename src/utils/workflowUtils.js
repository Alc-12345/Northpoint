// Save Workflow

export const saveWorkflow = (nodes, edges) => {
  const workflow = {
    nodes,
    edges,
  };

  localStorage.setItem(
    "etl_workflow",
    JSON.stringify(workflow)
  );
};

// Load Workflow

export const loadWorkflow = () => {
  const data = localStorage.getItem("etl_workflow");

  if (!data) {
    return {
      nodes: [],
      edges: [],
    };
  }

  return JSON.parse(data);
};

// Export JSON

export const exportWorkflow = (nodes, edges) => {
  const workflow = {
    nodes,
    edges,
  };

  const blob = new Blob(
    [JSON.stringify(workflow, null, 2)],
    {
      type: "application/json",
    }
  );

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");

  a.href = url;

  a.download = "workflow.json";

  a.click();

  URL.revokeObjectURL(url);
};

// Import JSON

export const importWorkflow = (file, callback) => {
  const reader = new FileReader();

  reader.onload = (e) => {
    const json = JSON.parse(e.target.result);

    callback(json.nodes, json.edges);
  };

  reader.readAsText(file);
};