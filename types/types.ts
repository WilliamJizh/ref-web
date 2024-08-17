export type ImageNodeData = {
  image: string;
  colors: { hex: string }[];
  height: number;
  width: number;
};

export type NodeData = {
  id: string;
  position: { x: number; y: number };
  type: "imageNode";
  data: ImageNodeData;
};