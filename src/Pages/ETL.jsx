import { normalizeEtlNodes } from "../../shared/etlNodes.js";
import { mergeTaskNodes } from "../../shared/taskWorkflow.js";
import React, { useCallback, useEffect, useRef, useState } from "react";
import CanvasArea from "../Components/CanvasArea";
import CanvasToolbar from "../Components/CanvasToolbar";
import ETLSidebar from "../Components/ETLSidebar";
import PropertyPanel from "../Components/PropertyPanel";
import { etlApi } from "../services/api";
import { getOperationLabel } from "../utils/etlConfig";
import { importWorkflow, loadWorkflow, saveWorkflow } from "../utils/workflowUtils";

const initialNodes = [
  {
    id: "1",
    type: "custom",
    position: { x: 120, y: 120 },
    data: {
      label: "CSV Input",
      category: "source",
      type: "csv",
      description: "",
      sqlQuery: "",
      sqlConnection: "",
      sqlTable: "",
      endpoint: "",
      method: "GET",
      status: "Ready",
      progress: 0,
      totalWorkingHours: 0,
      fileName: "",
      fileSize: "",
      outputRows: [],
    },
  },
];

const createOutputRows = (nodes) =>
  nodes.map((node, index) => ({
    step: index + 1,
    node: node.data?.label || node.id,
    operation: node.data?.type || "unknown",
    status: "Completed",
    progress: "100%",
  }));

const withSerializableData = (nodes) =>
  normalizeEtlNodes(nodes).map((node) => ({
    ...node,
    data: Object.fromEntries(
      Object.entries(node.data || {}).filter(([, value]) => typeof value !== "function")
    ),
  }));

export default function ETLBuilder() {
  const fileInputRef = useRef(null);
  const flowRef = useRef(null);
  const undoRef = useRef([]);
  const redoRef = useRef([]);
  const [initialWorkflow] = useState(() => {
    const localWorkflow = loadWorkflow();
    const hasLocalWorkflow = localStorage.getItem("etl_workflow") !== null;

    return {
      nodes: hasLocalWorkflow ? localWorkflow.nodes : initialNodes,
      edges: hasLocalWorkflow ? localWorkflow.edges : [],
      message: hasLocalWorkflow ? "Loaded local workflow" : "",
    };
  });
  const [nodes, setNodes] = useState(initialWorkflow.nodes);
  const [edges, setEdges] = useState(initialWorkflow.edges);
  const [selectedNode, setSelectedNode] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [apiMessage, setApiMessage] = useState(initialWorkflow.message);

  useEffect(() => {
    etlApi
      .getWorkflow()
      .then((workflow) => {
        if (workflow?._id || workflow?.nodes?.length || workflow?.edges?.length) {
          setNodes(normalizeEtlNodes(workflow.nodes || []));
          setEdges(workflow.edges || []);
          setApiMessage("Loaded API workflow");
        }
      })
      .catch(() => {
        setApiMessage("Using local workflow");
      });
  }, []);

  useEffect(() => {
    let cancelled = false;
    let pending = false;
    const refreshTasks = async () => {
      if (pending) return;
      pending = true;
      try {
        const workflow = await etlApi.getWorkflow();
        if (!cancelled) {
          const taskNodes = normalizeEtlNodes(workflow.nodes || []).filter(node => node.data?.taskId);
          setNodes(current => mergeTaskNodes(current, taskNodes));
          setSelectedNode(current => current?.data?.taskId
            ? taskNodes.find(node => node.id === current.id) || null : current);
        }
      } catch { /* Preserve the current canvas while the API is unavailable. */ }
      finally { pending = false; }
    };
    const timer = setInterval(refreshTasks, 5000);
    window.addEventListener("focus", refreshTasks);
    return () => {
      cancelled = true;
      clearInterval(timer);
      window.removeEventListener("focus", refreshTasks);
    };
  }, []);

  const rememberSnapshot = useCallback(() => {
    undoRef.current.push({
      nodes: withSerializableData(nodes),
      edges,
    });
    redoRef.current = [];
  }, [edges, nodes]);

  const syncSelectedNode = (updatedNodes, id) => {
    const nextSelected = updatedNodes.find((node) => node.id === id);
    if (nextSelected) setSelectedNode(nextSelected);
  };

  const handleNodeUpdate = (id, updatedData) => {
    if (nodes.find(node => node.id === id)?.data?.taskId) return;
    rememberSnapshot();

    setNodes((prev) => {
      const updatedNodes = prev.map((node) =>
        node.id === id
          ? {
              ...node,
              data: {
                ...node.data,
                label: updatedData.name,
                category: updatedData.category,
                type: updatedData.type,
                description: updatedData.description,
                sqlQuery: updatedData.sqlQuery,
                sqlConnection: updatedData.sqlConnection,
                sqlTable: updatedData.sqlTable,
                endpoint: updatedData.endpoint,
                method: updatedData.method,
                status: updatedData.status,
                progress: updatedData.progress,
                totalWorkingHours: updatedData.totalWorkingHours,
                fileName: updatedData.fileName,
                fileSize: updatedData.fileSize,
                outputRows: updatedData.outputRows,
              },
            }
          : node
      );

      syncSelectedNode(updatedNodes, id);
      return updatedNodes;
    });
  };

  const handleNodeDelete = useCallback((id) => {
    if (nodes.find(node => node.id === id)?.data?.taskId) return;
    rememberSnapshot();
    setNodes((prev) => prev.filter((node) => node.id !== id));
    setEdges((prev) => prev.filter((edge) => edge.source !== id && edge.target !== id));
    setSelectedNode((prev) => prev?.id === id ? null : prev);
  }, [rememberSnapshot, nodes]);

  const handleOperationChange = useCallback(
    (id, operation) => {
      rememberSnapshot();

      setNodes((prev) => {
        const updatedNodes = prev.map((node) =>
          node.id === id
            ? {
                ...node,
                data: {
                  ...node.data,
                  type: operation.type,
                  label: operation.label || getOperationLabel(operation.type),
                },
              }
            : node
        );

        syncSelectedNode(updatedNodes, id);
        return updatedNodes;
      });
    },
    [rememberSnapshot]
  );

  const handleSave = async () => {
    const cleanNodes = withSerializableData(nodes);
    const workflow = { nodes: cleanNodes, edges };

    saveWorkflow(cleanNodes, edges);
    setApiMessage("Saved locally");

    try {
      const saved = await etlApi.saveWorkflow(workflow);
      setNodes(current => mergeTaskNodes(current, saved.nodes.filter(node => node.data?.taskId)));
      setApiMessage("Saved to API");
    } catch (error) {
      setApiMessage(`Local save only: ${error.message}`);
    }
  };

  const handleRun = async () => {
    setIsRunning(true);
    setApiMessage("Running workflow");

    setNodes((prev) =>
      prev.map((node) => node.data?.taskId ? node : ({
        ...node,
        data: {
          ...node.data,
          status: "Running",
          progress: Math.max(Number(node.data?.progress || 0), 10),
        },
      }))
    );

    try {
      const result = await etlApi.runWorkflow({
        nodes: withSerializableData(nodes),
        edges,
      });

      const completedNodeIds = new Set(result?.nodes?.map((node) => node.id));
      const operatedRows = result?.outputRows || createOutputRows(nodes);

      setNodes((prev) =>
        prev.map((node) => node.data?.taskId ? node : ({
          ...node,
          data: {
            ...node.data,
            status: completedNodeIds.size === 0 || completedNodeIds.has(node.id) ? "Completed" : "Ready",
            progress: completedNodeIds.size === 0 || completedNodeIds.has(node.id) ? 100 : node.data?.progress || 0,
            outputRows: ["preview", "output"].includes(node.data?.type) ? operatedRows : node.data?.outputRows || [],
          },
        }))
      );
      setApiMessage(result?.message || "Workflow completed");
    } catch (error) {
      setNodes((prev) =>
        prev.map((node) => node.data?.taskId ? node : ({
          ...node,
          data: {
            ...node.data,
            status: "Completed",
            progress: 100,
            outputRows: ["preview", "output"].includes(node.data?.type)
              ? createOutputRows(nodes)
              : node.data?.outputRows || [],
          },
        }))
      );
      setApiMessage(`Simulated run: ${error.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleImport = () => {
    fileInputRef.current?.click();
  };

  const handleImportFile = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    rememberSnapshot();
    importWorkflow(file, (nextNodes, nextEdges) => {
      setNodes(nextNodes || []);
      setEdges(nextEdges || []);
      setSelectedNode(null);
      setApiMessage("Imported workflow");
    });

    event.target.value = "";
  };

  const handleUndo = () => {
    const snapshot = undoRef.current.pop();
    if (!snapshot) return;

    redoRef.current.push({
      nodes: withSerializableData(nodes),
      edges,
    });
    setNodes(snapshot.nodes);
    setEdges(snapshot.edges);
    setSelectedNode(null);
  };

  const handleRedo = () => {
    const snapshot = redoRef.current.pop();
    if (!snapshot) return;

    undoRef.current.push({
      nodes: withSerializableData(nodes),
      edges,
    });
    setNodes(snapshot.nodes);
    setEdges(snapshot.edges);
    setSelectedNode(null);
  };

  return (
    <div className="flex h-dvh min-h-0 flex-col overflow-hidden bg-[#20212b] text-white">
      <CanvasToolbar
        nodes={withSerializableData(nodes)}
        edges={edges}
        onSave={handleSave}
        onRun={handleRun}
        onImport={handleImport}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onZoomIn={() => flowRef.current?.zoomIn()}
        onZoomOut={() => flowRef.current?.zoomOut()}
        onReset={() => flowRef.current?.fitView({ padding: 0.3, maxZoom: 0.85, duration: 250 })}
        isRunning={isRunning}
        apiMessage={apiMessage}
      />

      <input ref={fileInputRef} type="file" accept="application/json" onChange={handleImportFile} className="hidden" />

      <div className="flex min-h-0 flex-1 overflow-hidden">
        <ETLSidebar />

        <div className="min-w-0 flex-1">
          <CanvasArea
            nodes={nodes}
            setNodes={setNodes}
            edges={edges}
            setEdges={setEdges}
            selectedNode={selectedNode}
            setSelectedNode={setSelectedNode}
            onOperationChange={handleOperationChange}
            onNodeDelete={handleNodeDelete}
            onFlowReady={(instance) => {
              flowRef.current = instance;
            }}
          />
        </div>

        {selectedNode && (
          <PropertyPanel selectedNode={selectedNode} onUpdate={handleNodeUpdate} onClose={() => setSelectedNode(null)} />
        )}
      </div>
    </div>
  );
}
