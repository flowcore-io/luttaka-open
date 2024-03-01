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
import {
  archiveProduct,
  createProduct,
  updateProduct,
} from "@/lib/stripe/product"

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
    await createProduct({
      id: parsedPayload.stripeId,
      name: parsedPayload.name,
      description: parsedPayload.description,
      price: parsedPayload.ticketPrice,
      currency: parsedPayload.ticketCurrency,
      conferenceId: parsedPayload.id,
    })
  },
  updated: async (payload: unknown) => {
    console.log("Got updated event", payload)
    const parsedPayload = ConferenceEventUpdatedPayload.parse(payload)
    const conference = await db.query.conferences.findFirst({
      where: eq(conferences.id, parsedPayload.id),
    })
    if (!conference) {
      console.warn("Conference not found", parsedPayload.id)
      return
    }

    let price: number | undefined = undefined
    let currency: string | undefined = undefined
    if (parsedPayload.ticketPrice && parsedPayload.ticketCurrency) {
      price =
        parsedPayload.ticketPrice !== conference.ticketPrice ||
        parsedPayload.ticketCurrency !== conference.ticketCurrency
          ? parsedPayload.ticketPrice
          : undefined
      currency =
        parsedPayload.ticketPrice !== conference.ticketPrice ||
        parsedPayload.ticketCurrency !== conference.ticketCurrency
          ? parsedPayload.ticketCurrency
          : undefined
    }
    await updateProduct({
      id: conference.stripeId,
      name: parsedPayload.name,
      description: parsedPayload.description,
      price,
      currency,
    })

    await db
      .update(conferences)
      .set(parsedPayload)
      .where(eq(conferences.id, parsedPayload.id))
  },
  archived: async (payload: unknown) => {
    console.log("Got archived event", payload)
    const parsedPayload = ConferenceEventArchivedPayload.parse(payload)
    const conference = await db.query.conferences.findFirst({
      where: eq(conferences.id, parsedPayload.id),
    })
    if (!conference) {
      return
    }
    await db
      .update(conferences)
      .set({
        archived: true,
      })
      .where(eq(conferences.id, parsedPayload.id))

    await archiveProduct(conference.stripeId)
  },
})

export const POST = eventTransformer.post.bind(eventTransformer)
