import { sql } from "drizzle-orm"
import {
  boolean,
  customType,
  decimal,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core"
const bytea = customType<{ data: Buffer; notNull: false; default: false }>({
  dataType() {
    return "bytea"
  },
})

import { UserRole } from "@/contracts/user/user-role"
import { image } from "@uiw/react-md-editor"

export const tickets = pgTable("tickets", {
  id: text("id").primaryKey(),
  eventId: text("event_id").notNull(),
  userId: text("user_id").notNull(),
  state: text("state").notNull(),
  createdAt: timestamp("created_at").default(sql`now()`),
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

export const events = pgTable("events", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  archived: boolean("archived").notNull().default(false),
  reason: text("reason"),
  ticketDescription: text("ticket_description"),
  ticketPrice: decimal("ticket_price").notNull().$type<number>(),
  ticketCurrency: text("ticket_currency").notNull(),
  startDate: text("start_date").notNull(),
  endDate: text("end_date").notNull(),
  stripeId: text("stripe_id").notNull(),
})

export const companies = pgTable("companies", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  ownerId: text("owner_id").notNull(),
  archived: boolean("archived").notNull().default(false),
  reason: text("reason"),
})

export const newsitems = pgTable("newsitems", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  introText: text("intro_text"),
  fullText: text("full_text"),
  publicVisibility: boolean("public_visibility").notNull().default(false),
  publishedAt: text("published_at"),
  archived: boolean("archived").notNull().default(false),
  reason: text("reason"),
})
