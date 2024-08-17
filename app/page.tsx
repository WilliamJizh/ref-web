import CornerControl from "@/components/cornerControl";
import FlowCanvas from "@/components/flowCanvas";
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  Controls,
  MiniMap,
  Background,
  ReactFlowProvider,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";
import { useCallback } from "react";

export default function Home() {
  return (
    <main className="h-screen w-screen">
      <ReactFlowProvider>
        <FlowCanvas />
      </ReactFlowProvider>
    </main>
  );
}
