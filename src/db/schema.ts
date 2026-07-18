import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

export const shoppinglist = sqliteTable("shoppinglist", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  product: text("product").notNull(),
  quantity: real("quantity").notNull().default(1),
  active: integer("active", { mode: "boolean" }).notNull().default(true),
  isWeekly: integer("isWeekly", { mode: "boolean" }).notNull().default(true),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});
