import { eq } from "drizzle-orm"

import { CompanyEventCreatedPayload } from "@/contracts/events/company"
import { db } from "@/database"
import { companies } from "@/database/schemas"

export default async function companyCreated(payload: unknown) {
  console.log("Got created event", payload)
  const parsedPayload = CompanyEventCreatedPayload.parse(payload)
  const exists = await db.query.companies.findFirst({
    where: eq(companies.id, parsedPayload.id),
  })
  if (exists) {
    return
  }
  await db.insert(companies).values(parsedPayload)
}
