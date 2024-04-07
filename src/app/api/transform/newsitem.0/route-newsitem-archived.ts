import { eq } from "drizzle-orm"

import { NewsitemEventArchivedPayload } from "@/contracts/events/newsitem"
import { db } from "@/database"
import { newsitems } from "@/database/schemas"

export default async function newsitemArchived(payload: unknown) {
  console.log("Got archived newsitem", payload)
  const parsedPayload = NewsitemEventArchivedPayload.parse(payload)
  const exists = await db.query.newsitems.findFirst({
    where: eq(newsitems.id, parsedPayload.id),
  })
  if (!exists) {
    return
  }

  await db
    .update(newsitems)
    .set({
      archived: true,
    })
    .where(eq(newsitems.id, parsedPayload.id))
}
