import { eq } from "drizzle-orm"
import shortUuid from "short-uuid"
import { z } from "zod"

import {
  sendTicketArchivedEvent,
  sendTicketCreatedEvent,
} from "@/contracts/events/ticket"
import { db } from "@/database"
import { tickets } from "@/database/schemas"
import waitForPredicate from "@/lib/wait-for-predicate"
import { protectedProcedure } from "@/server/api/trpc"

const CreateTicketInput = z.object({
  conferenceId: z.string(),
})

export const createTicketRouter = protectedProcedure
  .input(CreateTicketInput)
  .mutation(async ({ ctx, input }) => {
    // TODO: Check if user is allowed to create ticket
    const userId = ctx.user.id
    const id = shortUuid.generate()
    await sendTicketCreatedEvent({
      id,
      userId,
      conferenceId: input.conferenceId,
      state: "open",
    })
    try {
      await waitForPredicate(
        () => db.query.tickets.findFirst({ where: eq(tickets.id, id) }),
        (result) => !!result,
      )
    } catch (error) {
      await sendTicketArchivedEvent({ id, _reason: "rollback" })
      throw new Error("Failed to create ticket")
    }
    return id
  })
