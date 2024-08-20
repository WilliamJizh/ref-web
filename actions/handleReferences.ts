"use server";

import { db } from "@/drizzle/db";
import { asc, desc, eq } from "drizzle-orm";
import * as schema from "@/drizzle/schema";
import { NodeData } from "@/types/types";

export const getReferences = async (userId: string) => {
  return db.query.RefTable.findMany({
    orderBy: [asc(schema.RefTable.id)],
    where: eq(schema.RefTable.userId, userId),
  });
};

export const createReference = async (
  reference: NodeData[],
  userId: string
) => {
  const res = await db
    .insert(schema.RefTable)
    .values({
      userId: userId,
      data: reference,
    })
    .returning({ id: schema.RefTable.id });

  return res;
};

export const modifyReference = async (
  referenceId: number,
  reference: NodeData[]
) => {
  const res = await db
    .update(schema.RefTable)
    .set({ data: reference })
    .where(eq(schema.RefTable.id, referenceId))
    .returning({ id: schema.RefTable.id });

  return res;
};
