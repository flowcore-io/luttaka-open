import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"

import * as schemas from "@/database/schemas"
import { registerService } from "@/lib/register-service"

const pool = registerService<Pool>(
  "pgpool",
  () =>
    new Pool({
      connectionString: process.env.POSTGRES_URL!,
    }),
)

export const db = drizzle(pool, {
  schema: schemas,
})
