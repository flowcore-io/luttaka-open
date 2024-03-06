import * as schemas from "@/database/schemas"

import { Pool } from "pg"
import { drizzle } from "drizzle-orm/node-postgres"
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
