import React, { useState } from "react";
import CanvasArea from "../Components/CanvasArea";
import ETLSidebar from "../Components/ETLSidebar";
import PropertyPanel from "../Components/PropertyPanel";
import CanvasToolbar from "../Components/CanvasToolbar";

export default function ETLBuilder() {
  const [nodes, setNodes] = useState([
    {
      id: "1",
      type: "custom",
      position: { x: 120, y: 120 },
      data: {
        label: "CSV Input",
        type: "csv",
        description: "Read CSV File",
        employee: "",
        hours: "",
        expression: "",
      },
    },
  ]);

  const [edges, setEdges] = useState([]);

  const [selectedNode, setSelectedNode] = useState(null);

  const handleNodeUpdate = (id, updatedData) => {
    setNodes((prev) =>
      prev.map((node) =>
        node.id === id
          ? {
              ...node,
              data: {
                ...node.data,
                label: updatedData.name,
                description: updatedData.description,
                type: updatedData.type,
                expression: updatedData.expression,
                employee: updatedData.employee,
                hours: updatedData.hours,
              },
            }
          : node
      )
    );
      setSelectedNode(null);

    setSelectedNode((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        data: {
          ...prev.data,
          label: updatedData.name,
          description: updatedData.description,
          type: updatedData.type,
          expression: updatedData.expression,
          employee: updatedData.employee,
          hours: updatedData.hours,
        },
      };
    });
  };

  return (
    <div className="h-screen flex flex-col bg-[#0B1220] text-white">

      {/* Toolbar */}
      <CanvasToolbar />

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">

        {/* Sidebar */}
        <ETLSidebar />

        {/* Canvas */}
        <div className="flex-1">

          <CanvasArea
            nodes={nodes}
            setNodes={setNodes}
            edges={edges}
            setEdges={setEdges}
            selectedNode={selectedNode}
            setSelectedNode={setSelectedNode}
          />

        </div>

        {/* Property Panel */}
        {selectedNode && (
  <PropertyPanel
    selectedNode={selectedNode}
    onUpdate={handleNodeUpdate}
  />
)}

      </div>

    </div>
  );
}