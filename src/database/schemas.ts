import { text, pgTable, uuid } from "drizzle-orm/pg-core"

export const tickets = pgTable("tickets", {
  id: uuid("id").primaryKey(),
  conferenceId: uuid("conference_id").notNull(),
  userId: text("user_id").notNull(),
  state: text("state").notNull(),
})

export const conferences = pgTable("conferences", {
  id: uuid("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
})
