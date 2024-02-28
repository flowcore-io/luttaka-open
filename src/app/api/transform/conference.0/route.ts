import { eq } from "drizzle-orm"

import {
  conference,
  ConferenceEventArchivedPayload,
  ConferenceEventCreatedPayload,
  ConferenceEventUpdatedPayload,
} from "@/contracts/events/conference"
import { db } from "@/database"
import { conferences } from "@/database/schemas"
import EventTransformer from "@/lib/event-transformer"

const eventTransformer = new EventTransformer(conference, {
  created: async (payload: unknown) => {
    console.log("Got created event", payload)
    const parsedPayload = ConferenceEventCreatedPayload.parse(payload)
    const exists = await db.query.conferences.findFirst({
      where: eq(conferences.id, parsedPayload.id),
    })
    if (exists) {
      return
    }
    await db.insert(conferences).values(parsedPayload)
  },
  updated: async (payload: unknown) => {
    console.log("Got updated event", payload)
    const parsedPayload = ConferenceEventUpdatedPayload.parse(payload)
    const exists = await db.query.conferences.findFirst({
      where: eq(conferences.id, parsedPayload.id),
    })
    if (!exists) {
      return
    }
    await db
      .update(conferences)
      .set(parsedPayload)
      .where(eq(conferences.id, parsedPayload.id))
  },
  archived: async (payload: unknown) => {
    console.log("Got archived event", payload)
    const parsedPayload = ConferenceEventArchivedPayload.parse(payload)
    const exists = await db.query.conferences.findFirst({
      where: eq(conferences.id, parsedPayload.id),
    })
    if (!exists) {
      return
    }
    await db
      .update(conferences)
      .set({
        archived: true,
      })
      .where(eq(conferences.id, parsedPayload.id))
  },
})

export const POST = eventTransformer.post.bind(eventTransformer)
