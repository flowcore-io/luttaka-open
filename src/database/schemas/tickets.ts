import { text, pgTable, uuid } from "drizzle-orm/pg-core";

export const tickets = pgTable('tickets', {
  id: uuid('id').primaryKey(),
  userId: text('user_id').notNull(),
  state: text('state').notNull().default('open'),
})
