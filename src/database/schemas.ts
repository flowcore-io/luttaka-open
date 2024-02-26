import { boolean, pgTable, text } from "drizzle-orm/pg-core"
import { UserRole } from "@/contracts/user/user-role"

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

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  role: text("role").notNull().default(UserRole.user),
  externalId: text("external_id").unique(),
  archived: boolean("archived").notNull().default(false),
  reason: text("reason"),
})

export const profiles = pgTable("profiles", {
  id: text("id").primaryKey(),
  userId: text("user_id").unique().notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  title: text("title"),
  description: text("description"),
  socials: text("socials"),
  company: text("company"),
  avatarUrl: text("avatar_url"),
  archived: boolean("archived").notNull().default(false),
  reason: text("reason"),
})
