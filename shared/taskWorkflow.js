import { normalizeEtlNodes } from './etlNodes.js';

export const mergeTaskNodes = (nodes, taskNodes) => {
  const current = new Map(nodes.map(node => [node.id, node]));
  const incomingIds = new Set(taskNodes.map(node => node.id));
  return [
    ...nodes.filter(node => !node.data?.taskId && !incomingIds.has(node.id)),
    ...taskNodes.map(node => ({ ...node, position: current.get(node.id)?.position || node.position })),
  ];
};

export const taskWorkflowNodes = (nodes, tasks) => {
  const normalized = normalizeEtlNodes(nodes);
  const byTask = new Map(normalized.filter(node => node.data?.taskId).map(node => [node.data.taskId, node]));
  const byId = new Map(normalized.map(node => [node.id, node]));
  const taskNodes = tasks.map((task, index) => {
    const taskId = String(task._id);
    const existing = byId.get(task.etlNodeId) || byTask.get(taskId);
    const category = task.workCategory || 'frontend';
    return {
      ...existing,
      id: existing?.id || `task-${taskId}`,
      type: 'custom',
      position: existing?.position || { x: 360 + (index % 4) * 200, y: 120 + Math.floor(index / 4) * 200 },
      data: {
        ...existing?.data,
        taskId,
        label: task.title,
        description: task.description || '',
        category: existing?.data?.category || category,
        type: existing?.data?.type || ({ frontend: 'react-page', backend: 'rest-api', server: 'node-server' }[category]),
        status: { Pending: 'Ready', 'In Progress': 'Running', Completed: 'Completed' }[task.status],
        progress: task.status === 'Completed' ? 100 : task.progress || 0,
        assignedTo: task.assignedTo || '',
        project: task.project || '',
        totalWorkingHours: task.totalWorkingHours || 0,
        workLogs: task.workLogs || [],
        taskUpdatedAt: task.updatedAt,
      },
    };
  });
  return mergeTaskNodes(normalized, taskNodes);
};
