import { text, pgTable } from "drizzle-orm/pg-core"

export const tickets = pgTable("tickets", {
  id: text("id").primaryKey(),
  conferenceId: text("conference_id").notNull(),
  userId: text("user_id").notNull(),
  state: text("state").notNull(),
})

export const ticketTransfers = pgTable("ticket_transfers", {
  id: text("id").primaryKey(),
  ticketId: text("ticket_id").notNull(),
  state: text("state").notNull(),
})
