"use client";

import {
  Background,
  ControlButton,
  Controls,
  MiniMap,
  ReactFlow,
  SelectionMode,
  useNodesState,
  useReactFlow,
} from "@xyflow/react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { getReferences } from "@/actions/handleReferences";
import { ImageNodeData, NodeData } from "@/types/types";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import "@xyflow/react/dist/style.css";
import { extractColors } from "extract-colors";
import { Maximize, Minus, Plus } from "lucide-react";
import CornerControl from "./cornerControl";
import ImageNode from "./imageNode";
import { handleUpload } from "./uploadComponent";
import { useToast } from "./ui/use-toast";
import { Button } from "./ui/button";

const FlowCanvas: React.FC = () => {
  const { user } = useKindeBrowserClient();
  const [nodes, setNodes, onNodesChange] = useNodesState<NodeData>([]);
  const [referenceId, setReferenceId] = useState<number>(-1);
  const { zoomIn, zoomOut, fitView, screenToFlowPosition, getViewport } =
    useReactFlow();
  const nodeTypes = useMemo(() => ({ imageNode: ImageNode }), []);
  const { toast } = useToast();

  console.log(nodes);
  useEffect(() => {
    const fetchReferences = async () => {
      if (user) {
        const references = await getReferences(user.id);
        setReferenceId(references[0]?.id || -1);
        setNodes((references[0]?.data as NodeData[]) || []);
      }
    };
    fetchReferences();
  }, [setNodes, user]);

  const loadImages = async (
    images: FileList,
    event: React.DragEvent
  ): Promise<NodeData[]> => {
    const { x: dropFlowPosX, y: dropFlowPosY } = screenToFlowPosition({
      x: event.clientX,
      y: event.clientY,
    });

    // Load all images and sort by area (width * height) descending
    const loadedImages: ImageNodeData[] = await Promise.all(
      Array.from(images).map(
        (image) =>
          new Promise<ImageNodeData>((resolve, reject) => {
            if (typeof image === "string") {
              // Handle URL
              const img = new Image();
              img.crossOrigin = "Anonymous";
              img.src = image;

              img.onload = async () => {
                const colors = await extractColors(image);
                resolve({
                  image: image,
                  width: img.width,
                  height: img.height,
                  colors: colors,
                });
              };

              img.onerror = reject;
            } else if (image.type.startsWith("image/")) {
              // Handle File
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
                  image: result,
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
    // Sort
    const sortedImages = loadedImages.sort(
      (a, b) => b.width * b.height - a.width * a.height
    );

    // Align images horizontally
    let lastWidth = 0;
    let updatedNodes: NodeData[] = [];
    const firstImage = sortedImages[0];
    const correctX = dropFlowPosX - firstImage.width / 2;
    const correctY = dropFlowPosY - firstImage.height / 2;
    sortedImages.forEach((image) => {
      updatedNodes.push({
        id: uuidv4(),
        position: {
          x: correctX + lastWidth,
          y: correctY,
        },
        data: image,
        type: "imageNode",
      });
      lastWidth += image.width;
    });

    return updatedNodes;
  };

  const onDrop = useCallback(async (event: React.DragEvent) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (!files.length) return;

    const nodes = await loadImages(files, event);

    setNodes((currNodes) => currNodes.concat(nodes as never[]));
  }, []);

  const handleSave = async () => {
    handleUpload(nodes, referenceId, user)
      .then(() => {
        toast({
          title: "Success",
          description: "Save successful",
        });
      })
      .catch((error) => {
        toast({
          title: "Error",
          description: "Save failed" + error,
        });
      });
  };

  return (
    <div
      className="h-full w-full"
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
        selectionOnDrag
        panOnDrag={[1]}
        selectionMode={SelectionMode.Partial}
        fitView
        minZoom={0.01}
        maxZoom={10}
      >
        <Controls
          showZoom={false}
          showFitView={false}
          showInteractive={false}
          className="bg-background border rounded-md p-2 gap-2"
        >
          <Button
            variant="outline"
            onClick={() => zoomIn()}
            className="bg-background w-fit h-fit p-2"
          >
            <Plus />
          </Button>
          <Button
            variant="outline"
            onClick={() => zoomOut()}
            className="bg-background w-fit h-fit p-2"
          >
            <Minus />
          </Button>
          <Button
            variant="outline"
            onClick={() => fitView()}
            className="bg-background w-fit h-fit p-2"
          >
            <Maximize />
          </Button>
        </Controls>
        <Background />
        <MiniMap />
      </ReactFlow>
    </div>
  );
};

export default FlowCanvas;
