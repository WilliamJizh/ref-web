"use client";

import { NodeData } from "@/types/types";
import { upload } from "@vercel/blob/client";
import { v4 as uuidv4 } from "uuid";
import { createReference, modifyReference } from "../actions/handleReferences";

const base64ToBlob = (base64: string) => {
  const byteString = atob(base64.split(",")[1]);
  const mimeString = base64.split(",")[0].split(":")[1].split(";")[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeString });
};

export const handleUpload = async (
  nodeData: NodeData[],
  referenceId: number,
  user: { id: string } | null
) => {
  if (!user) {
    throw new Error("User not found");
  }

  for (const node of nodeData) {
    console.log("node image", node.data.image);
    if (node.data.image.startsWith("data:")) {
      const imageName = `${user.id}/${uuidv4()}`;
      const image = base64ToBlob(node.data.image);
      const vercelBlobItem = await upload(imageName, image, {
        access: "public",
        handleUploadUrl: "/api/image/upload",
      }).catch((error) => {
        console.error("Error uploading image", error);
        throw new Error("Error uploading image");
      });

      // TODO: wait for cdn implementation
      if (vercelBlobItem) {
        node.data.image = vercelBlobItem.url;
      }
    }
  }

  console.log("nodeData", nodeData);

  if (referenceId === -1) {
    return createReference(nodeData, user.id);
  }

  return modifyReference(referenceId, nodeData);

};
