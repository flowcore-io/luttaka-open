import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"

import * as schemas from "@/database/schemas"
import { registerService } from "@/lib/register-service"

const client = registerService<Pool>(
  "pgpool",
  () =>
    new Pool({
      connectionString: process.env.POSTGRES_URL!,
    }),
)

client.connect().catch((err: unknown) => console.error(err))

export const db = drizzle(client, {
  schema: schemas,
})
