"use server"

import {
  ticket,
  TicketEventCreatedPayloadDto,
  TicketEventUpdatedPayloadDto,
} from "@/contracts/events/ticket"
import { db } from "@/database"
import { tickets } from "@/database/schemas"
import { sendWebhook } from "@/lib/webhook"
import { eq } from "drizzle-orm"
import { v4 as uuid } from "uuid"
import { type z } from "zod"

export async function getTicketsByUserId(userId: string) {
  return db.query.tickets.findMany({
    where: eq(tickets.userId, userId),
  })
}

export async function getTicketById(id: string) {
  return db.query.tickets.findFirst({
    where: eq(tickets.id, id),
  })
}

const CreateTicketDto = TicketEventCreatedPayloadDto.omit({ id: true })
export async function createTicket(input: z.infer<typeof CreateTicketDto>) {
  const id: string = uuid()
  try {
    await sendWebhook<z.infer<typeof TicketEventCreatedPayloadDto>>(
      ticket.flowType,
      ticket.eventType.created,
      {
        id,
        ...input,
      },
    )
    return id
  } catch (error) {
    console.error("Error occurred:", error)
    return null
  }
}

const UpdateTicketDto = TicketEventUpdatedPayloadDto.omit({ id: true })
export async function updateTicket(
  id: string,
  input: z.infer<typeof UpdateTicketDto>,
) {
  try {
    await sendWebhook<z.infer<typeof TicketEventUpdatedPayloadDto>>(
      ticket.flowType,
      ticket.eventType.updated,
      {
        id,
        ...input,
      },
    )
    return true
  } catch (error) {
    console.error("Error occurred:", error)
    return false
  }
}
