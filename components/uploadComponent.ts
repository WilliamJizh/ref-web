"use client";

import { upload } from "@vercel/blob/client";
import { v4 as uuidv4 } from "uuid";
import { createReference, modifyReference } from "../actions/handleReferences";
import { NodeData } from "@/types/types";

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
  console.log("referenceId", referenceId);

  if (!user) {
    throw new Error("User not found");
  }

  await Promise.all(
    nodeData.map(async (node) => {
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
        node.data.image = cdnReplacement(vercelBlobItem.url);

      }
    })
  );

  if (referenceId === -1) {
    console.log("creating reference");
    return await createReference(nodeData, user.id);
  }

  return modifyReference(referenceId, nodeData).catch((error) => {
    console.error("Error modifying reference", error);
    throw new Error("Error modifying reference");
  });
};

const cdnReplacement = (image: string) => {
  console.log(process.env.NEXT_PUBLIC_VERCEL_BLOB_URL);
  console.log(process.env.NEXT_PUBLIC_TWICPICS_DOMAIN);
  return image.replace(
    process.env.NEXT_PUBLIC_VERCEL_BLOB_URL || "",
    process.env.NEXT_PUBLIC_TWICPICS_DOMAIN || ""
  );
};
