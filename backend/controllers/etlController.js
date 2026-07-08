import EtlWorkflow from "../models/EtlWorkflow.js";

const DEFAULT_KEY = "default";

export const getWorkflow = async (req, res) => {
  const workflow = await EtlWorkflow.findOne({ key: DEFAULT_KEY });

  res.json(
    workflow || {
      key: DEFAULT_KEY,
      nodes: [],
      edges: [],
      lastRunStatus: "Ready",
    }
  );
};

export const saveWorkflow = async (req, res) => {
  const { nodes = [], edges = [] } = req.body;

  const workflow = await EtlWorkflow.findOneAndUpdate(
    { key: DEFAULT_KEY },
    {
      nodes,
      edges,
      lastRunStatus: "Ready",
    },
    {
      new: true,
      runValidators: true,
      upsert: true,
    }
  );

  res.json(workflow);
};

export const runWorkflow = async (req, res) => {
  const { nodes = [], edges = [] } = req.body;
  const outputRows = nodes.map((node, index) => ({
    step: index + 1,
    node: node.data?.label || node.id,
    operation: node.data?.type || "unknown",
    status: "Completed",
    progress: "100%",
  }));

  const completedNodes = nodes.map((node) => ({
    ...node,
    data: {
      ...(node.data || {}),
      status: "Completed",
      progress: 100,
      outputRows: ["preview", "output"].includes(node.data?.type)
        ? outputRows
        : node.data?.outputRows || [],
    },
  }));

  const workflow = await EtlWorkflow.findOneAndUpdate(
    { key: DEFAULT_KEY },
    {
      nodes: completedNodes,
      edges,
      lastRunAt: new Date(),
      lastRunStatus: "Completed",
    },
    {
      new: true,
      runValidators: true,
      upsert: true,
    }
  );

  res.json({
    message: "Workflow completed",
    nodes: workflow.nodes,
    edges: workflow.edges,
    outputRows,
    lastRunAt: workflow.lastRunAt,
    lastRunStatus: workflow.lastRunStatus,
  });
};
