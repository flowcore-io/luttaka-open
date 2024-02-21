import { drizzle } from "drizzle-orm/node-postgres"
import * as schemas from "@/database/schemas"
import { Client } from "pg"

const client = new Client({
  connectionString: process.env.POSTGRES_URL!,
})

client.connect().catch((err) => console.error(err))

export const db = drizzle(client, {
  schema: schemas,
})
