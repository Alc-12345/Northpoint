import React, { useCallback, useRef } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";
import CustomNode from "./CustomNode";

const nodeTypes = {
  custom: CustomNode,
};

export default function CanvasArea({
  nodes,
  setNodes,
  edges,
  setEdges,
  setSelectedNode,
  onOperationChange,
  onFlowReady,
}) {
  const wrapperRef = useRef(null);

  const onNodesChange = useCallback(
    (changes) => {
      setNodes((nds) => applyNodeChanges(changes, nds));
    },
    [setNodes]
  );

  const onEdgesChange = useCallback(
    (changes) => {
      setEdges((eds) => applyEdgeChanges(changes, eds));
    },
    [setEdges]
  );

  const onConnect = useCallback(
    (params) => {
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            animated: true,
            style: {
              stroke: "#3B82F6",
              strokeWidth: 2,
            },
          },
          eds
        )
      );
    },
    [setEdges]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const raw = event.dataTransfer.getData("application/reactflow");
      if (!raw) return;

      const block = JSON.parse(raw);
      const bounds = wrapperRef.current?.getBoundingClientRect();

      const newNode = {
        id: `${Date.now()}`,
        type: "custom",
        position: {
          x: event.clientX - (bounds?.left || 0) - 110,
          y: event.clientY - (bounds?.top || 0) - 60,
        },
        data: {
          label: block.label,
          category: block.category,
          type: block.type,
          status: "Ready",
          progress: 0,
          fileName: "",
          fileSize: "",
          outputRows: [],
          endpoint: "",
          method: "GET",
          expression: "",
          sqlConnection: "",
          sqlTable: "",
          onOperationChange,
        },
      };

      setNodes((nds) => [...nds, newNode]);
      setSelectedNode(newNode);
    },
    [onOperationChange, setNodes, setSelectedNode]
  );

  return (
    <div ref={wrapperRef} className="etl-flow-canvas h-[calc(100vh-56px)] w-full cursor-default bg-[#0F172A]">
      <ReactFlow
        nodes={nodes.map((node) => ({
          ...node,
          data: {
            ...node.data,
            onOperationChange,
          },
        }))}
        edges={edges}
        nodeTypes={nodeTypes}
        onInit={onFlowReady}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onNodeClick={(event, node) => {
          setSelectedNode(node);
        }}
        fitView
      >
        <Background gap={20} size={1} color="#334155" />

        <Controls showInteractive />
      </ReactFlow>
    </div>
  );
}
