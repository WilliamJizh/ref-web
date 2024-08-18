"use server";

import { db } from "@/drizzle/db";
import { eq } from "drizzle-orm";
import * as schema from "@/drizzle/schema";
import { NodeData } from "@/types/types";

export const getReferences = async (userId: string) => {
  return db.query.RefTable.findMany({
    where: eq(schema.RefTable.userId, userId),
  });
};

export const createReference = async (
  reference: NodeData[],
  userId: string
) => {
  db.insert(schema.RefTable).values({
    userId: userId,
    data: reference,
  });
};

export const modifyReference = async (
  referenceId: number,
  reference: NodeData[]
) => {
  db.update(schema.RefTable)
    .set({ data: reference })
    .where(eq(schema.RefTable.id, referenceId));
};
