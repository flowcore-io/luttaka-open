import {
  ticket,
  type TicketEventArchivedPayloadDto,
  TicketEventCreatedPayloadDto,
} from "@/contracts/events/ticket"
import { db } from "@/database"
import { tickets } from "@/database/schemas"
import { sendWebhook } from "@/lib/webhook"
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc"
import { eq } from "drizzle-orm"
import { retry } from "radash"
import shortUuId from "short-uuid"
import { z } from "zod"

const GetTicketInput = z.object({
  id: z.string(),
})

const GetTicketListInput = z.object({
  userId: z.string(),
})

const CreateTicketInput = TicketEventCreatedPayloadDto.omit({
  id: true,
})

const ArchiveTicketInput = z.object({
  id: z.string(),
})

export const ticketRouter = createTRPCRouter({
  get: protectedProcedure.input(GetTicketInput).query(({ input }) => {
    return db.query.tickets.findFirst({ where: eq(tickets.id, input.id) })
  }),
  list: protectedProcedure.input(GetTicketListInput).query(({ input }) => {
    return db.query.tickets.findMany({
      where: eq(tickets.userId, input.userId),
    })
  }),
  create: protectedProcedure
    .input(CreateTicketInput)
    .mutation(async ({ input }) => {
      const id: string = shortUuId.generate()
      await sendCreatedTicketEvent({ id, ...input })
      try {
        await waitForTicket(id, true)
      } catch (error) {
        await sendArchivedTicketEvent({ id, _reason: "Rollback ticket create" })
        return null
      }
      return id
    }),
  archive: protectedProcedure
    .input(ArchiveTicketInput)
    .mutation(async ({ input }) => {
      await sendArchivedTicketEvent({ id: input.id })
      try {
        await waitForTicket(input.id, false)
        return true
      } catch (error) {
        return false
      }
    }),
})

async function sendCreatedTicketEvent(
  input: z.infer<typeof TicketEventCreatedPayloadDto>,
) {
  await sendWebhook(ticket.flowType, ticket.eventType.created, input)
}

async function sendArchivedTicketEvent(
  input: z.infer<typeof TicketEventArchivedPayloadDto>,
) {
  await sendWebhook(ticket.flowType, ticket.eventType.archived, input)
}

async function waitForTicket(id: string, exists: boolean) {
  await retry({ times: 6, delay: 250 }, async () => {
    console.log("Waiting for ticket", id, "to", exists ? "exist" : "not exist")
    const ticket = await db.query.tickets.findFirst({
      where: eq(tickets.id, id),
    })
    if (exists === !!ticket) {
      return
    }
    throw new Error("Retry")
  })
}
