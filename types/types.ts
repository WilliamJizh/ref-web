import { Node } from "@xyflow/react";

export type ImageNodeData = {
  image: string;
  colors: { hex: string }[];
  originalHeight: number;
  originalWidth: number;
};

export type NodeData = Node & {
  data: ImageNodeData;
};
