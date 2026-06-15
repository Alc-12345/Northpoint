import React, { useCallback } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
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
  selectedNode,
  setSelectedNode,
}) {

  // Node Change
  const onNodesChange = useCallback(
    (changes) => {
      setNodes((nds) => applyNodeChanges(changes, nds));
    },
    [setNodes]
  );

  // Edge Change
  const onEdgesChange = useCallback(
    (changes) => {
      setEdges((eds) => applyEdgeChanges(changes, eds));
    },
    [setEdges]
  );

  // Connect Nodes
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

  // Drag Over
  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  // Drop New Node
  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const raw = event.dataTransfer.getData(
        "application/reactflow"
      );

      if (!raw) return;

      const type = JSON.parse(raw);

      const position = {
        x: event.clientX - 260,
        y: event.clientY - 100,
      };

      const newNode = {
        id: `${Date.now()}`,
        type: "custom",
        position,
        data: {
          label: type.label,
          type: type.type,
          description: "",
          hours: "",
          employee: "",
          expression: "",
        },
      };

      setNodes((nds) => [...nds, newNode]);
    },
    [setNodes]
  );

  return (
    <div className="w-full h-[calc(100vh-56px)] bg-[#0F172A]">

      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
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

        <Background
          gap={20}
          size={1}
          color="#334155"
        />

        <MiniMap
          pannable
          zoomable
          nodeColor="#3B82F6"
        />

        {/* <Controls 
        showInteractive 
        /> */}

      </ReactFlow>

    </div>
  );
}