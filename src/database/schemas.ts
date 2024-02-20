import { text, pgTable, uuid } from "drizzle-orm/pg-core"

export const tickets = pgTable("tickets", {
  id: uuid("id").primaryKey(),
  conferenceId: uuid("conference_id").notNull(),
  userId: text("user_id").notNull(),
  state: text("state").notNull(),
})
