import { executeWorkflow } from "../shared/etlEngine.js";
import { withTaskUpdates } from "../services/taskWorkflow.js";
import EtlWorkflow from "../models/EtlWorkflow.js";

const DEFAULT_KEY = "default";

export const getWorkflow = async (req, res) => {
  const workflow = await EtlWorkflow.findOne({ key: DEFAULT_KEY });

  res.json(
    workflow ? { ...workflow.toObject(), nodes: await withTaskUpdates(workflow.nodes) } : {
      key: DEFAULT_KEY,
      nodes: await withTaskUpdates([]),
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
      nodes: await withTaskUpdates(nodes),
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
  let result;
  try {
    result = executeWorkflow(await withTaskUpdates(nodes), edges);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
  const { nodes: completedNodes, outputRows } = result;

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
