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
  onNodeDelete,
  onFlowReady,
}) {
  const wrapperRef = useRef(null);
  const instanceRef = useRef(null);

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
            type: "smoothstep",
            style: {
              stroke: "#858593",
              strokeWidth: 1.5,
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
      const position = instanceRef.current?.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      if (!position) return;

      const newNode = {
        id: `${Date.now()}`,
        type: "custom",
        position: {
          x: position.x - 64,
          y: position.y - 44,
        },
        data: {
          label: block.label,
          category: block.category,
          type: block.type,
          status: "Ready",
          progress: 0,
          totalWorkingHours: 0,
          fileName: "",
          fileSize: "",
          outputRows: [],
          endpoint: "",
          method: "GET",
          description: "",
          sqlQuery: "",
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
    <div ref={wrapperRef} className="etl-flow-canvas h-full w-full cursor-default bg-[#20212b]">
      <ReactFlow
        nodes={nodes.map((node) => ({
          ...node,
          data: {
            ...node.data,
            onOperationChange,
            onDelete: onNodeDelete,
          },
        }))}
        edges={edges}
        nodeTypes={nodeTypes}
        onInit={(instance) => {
          instanceRef.current = instance;
          onFlowReady?.(instance);
        }}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onNodeClick={(event, node) => {
          setSelectedNode(node);
        }}
        onPaneClick={() => setSelectedNode(null)}
        fitView
        fitViewOptions={{ padding: 0.3, maxZoom: 0.85 }}
        minZoom={0.25}
        maxZoom={1.5}
        defaultEdgeOptions={{ type: "smoothstep", style: { stroke: "#858593", strokeWidth: 1.5 } }}
      >
        <Background gap={24} size={1} color="#454652" />

        <Controls showInteractive />
      </ReactFlow>
    </div>
  );
}
