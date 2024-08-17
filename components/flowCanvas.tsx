"use client";

import {
  Background,
  ControlButton,
  Controls,
  MiniMap,
  ReactFlow,
  SelectionMode,
  useEdgesState,
  useNodesState,
  useReactFlow,
  useViewport,
} from "@xyflow/react";
import React, { useCallback, useMemo } from "react";

import { NodeData } from "@/types/types";
import "@xyflow/react/dist/style.css";
import { extractColors } from "extract-colors";
import { Maximize, Minus, Plus } from "lucide-react";
import { useTheme } from "next-themes";
import CornerControl from "./cornerControl";
import ImageNode from "./imageNode";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";

const FlowCanvas: React.FC = () => {
  const { user } = useKindeBrowserClient();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const { zoomIn, zoomOut, fitView, screenToFlowPosition, getViewport } =
    useReactFlow();
  const nodeTypes = useMemo(() => ({ imageNode: ImageNode }), []);

  const alignImages = async (
    images: FileList,
    event: React.DragEvent
  ): Promise<NodeData[]> => {
    const nodes: NodeData[] = [];

    const viewport = getViewport();
    console.log("viewport", viewport);

    const { x: correctX, y: correctY } = screenToFlowPosition({
      x: event.clientX,
      y: event.clientY,
    });

    console.log("correctX", correctX);
    console.log("correctY", correctY);

    // Load all images and sort by area (width * height) descending
    const loadedImages = await Promise.all(
      Array.from(images).map(
        (image) =>
          new Promise<{
            src: string;
            width: number;
            height: number;
            colors: any[];
          }>((resolve, reject) => {
            if (image.type.startsWith("image/")) {
              const reader = new FileReader(); // Create a new FileReader for each image

              reader.onload = async () => {
                const result = reader.result as string;
                const imageLoaded = new Image();
                imageLoaded.src = result;

                await new Promise<void>((resolve) => {
                  imageLoaded.onload = () => {
                    resolve();
                  };
                });

                const colors = await extractColors(result);

                resolve({
                  src: result,
                  width: imageLoaded.width,
                  height: imageLoaded.height,
                  colors: colors,
                });
              };

              reader.onerror = reject;
              reader.readAsDataURL(image);
            } else {
              reject("File is not an image");
            }
          })
      )
    );

    // Sort images by height descending
    const sortedImages = loadedImages.sort((a, b) => b.height - a.height);
    const firstImageCenterX = sortedImages[0].width / 2;
    const firstImageCenterY = sortedImages[0].height / 2;

    const maxWidth = 10000;
    let hightestImage = sortedImages[0].height;
    let currWidth = 0;
    let currHeight = 0;

    for (const img of sortedImages) {
      nodes.push({
        id: uuidv4(),
        position: {
          x: correctX - firstImageCenterX + currWidth,
          y: correctY - firstImageCenterY + currHeight,
        },
        type: "imageNode",
        data: {
          image: img.src,
          colors: img.colors,
          height: img.height,
          width: img.width,
        },
      });
      currWidth += img.width;
      if (currWidth + img.width > maxWidth) {
        currWidth = 0;
        currHeight += hightestImage;
        hightestImage = img.height;
      }
    }

    return nodes;
  };

  const onDrop = useCallback(async (event: React.DragEvent) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (!files.length) return;

    const nodes = await alignImages(files, event);

    setNodes((currNodes) => currNodes.concat(nodes as never[]));
  }, []);

  const handleSave = () => {
    console.log(nodes);
  };

  return (
    <div
      className="h-full w-full bg-red-500"
      onDragOver={(event) => event.preventDefault()}
      onDrop={onDrop}
    >
      <div className="absolute right-0 top-0 z-10">
        <CornerControl handleSave={handleSave} />
      </div>
      <ReactFlow
        colorMode="dark"
        nodes={nodes}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        panOnScroll
        selectionOnDrag
        panOnDrag={[1]}
        selectionMode={SelectionMode.Partial}
        fitView
        minZoom={0.1}
      >
        <Controls showZoom={false} showFitView={false} showInteractive={false}>
          <ControlButton onClick={() => zoomIn()} className="bg-background">
            <Plus />
          </ControlButton>
          <ControlButton onClick={() => zoomIn()} className="bg-background">
            <Minus />
          </ControlButton>
          <ControlButton onClick={() => fitView()} className="bg-background">
            <Maximize />
          </ControlButton>
        </Controls>
        <Background />
        <MiniMap />
      </ReactFlow>
    </div>
  );
};

export default FlowCanvas;
function uuidv4(): string {
  return crypto.randomUUID();
}
