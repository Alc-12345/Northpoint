import Task from '../models/Task.js';
import EtlWorkflow from '../models/EtlWorkflow.js';
import { taskWorkflowNodes } from '../../shared/taskWorkflow.js';

export const withTaskUpdates = async (nodes = []) => {
  const [tasks, saved] = await Promise.all([
    Task.find().sort({ createdAt: 1 }).lean(),
    EtlWorkflow.findOne({ key: 'default' }).lean(),
  ]);
  const nodeIds = new Set(nodes.map(node => node.id));
  const taskIds = new Set(tasks.map(task => String(task._id)));
  const linkedIds = new Set(tasks.map(task => task.etlNodeId).filter(Boolean));
  // A stale canvas must not remove an existing task's linked node.
  const missingLinks = (saved?.nodes || []).filter(node =>
    !nodeIds.has(node.id) && (linkedIds.has(node.id) || taskIds.has(node.data?.taskId))
  );
  return taskWorkflowNodes([...nodes, ...missingLinks], tasks);
};
