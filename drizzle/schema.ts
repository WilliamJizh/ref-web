import {
    index,
    jsonb,
    pgTable,
    serial,
    text,
    timestamp
} from "drizzle-orm/pg-core";


export const RefTable = pgTable(
  "References",
  {
    id: serial("id").primaryKey(),
    userId: text("userId").notNull(),
    data: jsonb("data").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (references) => {
    return {
      userIdIdx: index("userId_idx").on(references.userId),
    };
  }
);
