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
      expression: "",
      sqlConnection: "",
      sqlTable: "",
      endpoint: "",
      method: "GET",
      status: "Ready",
      progress: 0,
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
  nodes.map((node) => ({
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
    const hasLocalWorkflow = localWorkflow.nodes.length || localWorkflow.edges.length;

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
        if (workflow?.nodes?.length || workflow?.edges?.length) {
          setNodes(workflow.nodes || []);
          setEdges(workflow.edges || []);
          setApiMessage("Loaded API workflow");
        }
      })
      .catch(() => {
        setApiMessage("Using local workflow");
      });
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
                expression: updatedData.expression,
                sqlConnection: updatedData.sqlConnection,
                sqlTable: updatedData.sqlTable,
                endpoint: updatedData.endpoint,
                method: updatedData.method,
                status: updatedData.status,
                progress: updatedData.progress,
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
      await etlApi.saveWorkflow(workflow);
      setApiMessage("Saved to API");
    } catch (error) {
      setApiMessage(`Local save only: ${error.message}`);
    }
  };

  const handleRun = async () => {
    setIsRunning(true);
    setApiMessage("Running workflow");

    setNodes((prev) =>
      prev.map((node) => ({
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
        prev.map((node) => ({
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
        prev.map((node) => ({
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
    <div className="flex h-screen flex-col bg-[#0B1220] text-white">
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
        onReset={() => flowRef.current?.fitView()}
        isRunning={isRunning}
        apiMessage={apiMessage}
      />

      <input ref={fileInputRef} type="file" accept="application/json" onChange={handleImportFile} className="hidden" />

      <div className="flex flex-1 overflow-hidden">
        <ETLSidebar />

        <div className="flex-1">
          <CanvasArea
            nodes={nodes}
            setNodes={setNodes}
            edges={edges}
            setEdges={setEdges}
            selectedNode={selectedNode}
            setSelectedNode={setSelectedNode}
            onOperationChange={handleOperationChange}
            onFlowReady={(instance) => {
              flowRef.current = instance;
            }}
          />
        </div>

        <PropertyPanel selectedNode={selectedNode} onUpdate={handleNodeUpdate} />
      </div>
    </div>
  );
}
