import { ticket, TicketEventCreatedPayloadDto } from "@/contracts/events/ticket"
import { db } from "@/database"
import { tickets } from "@/database/schemas"
import { sendWebhook } from "@/lib/webhook"
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc"
import { eq } from "drizzle-orm"
import { v4 as uuid } from "uuid"
import { z } from "zod"

const GetTicketInput = z.object({
  id: z.string(),
})

const GetTicketListInput = z.object({
  userId: z.string(),
})

const CreateTicketInput = TicketEventCreatedPayloadDto.omit({ id: true })

export const ticketRouter = createTRPCRouter({
  get: protectedProcedure.input(GetTicketInput).query(({ input }) => {
    console.log("input", input)
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
      const id: string = uuid()
      await sendWebhook<z.infer<typeof TicketEventCreatedPayloadDto>>(
        ticket.flowType,
        ticket.eventType.created,
        {
          id,
          ...input,
        },
      )
      return id
    }),
})
