import { inArray } from "drizzle-orm"
import shortUuid from "short-uuid"
import { z } from "zod"

import { sendTicketCreatedEvent } from "@/contracts/events/ticket"
import { db } from "@/database"
import { tickets } from "@/database/schemas"
import waitForPredicate from "@/lib/wait-for-predicate"
import { adminsOnlyMiddleware } from "@/server/api/routers/middlewares/admins-only.middleware"
import { protectedProcedure } from "@/server/api/trpc"

const CreateTicketInput = z.object({
  conferenceId: z.string(),
  quantity: z.number(),
})

export const createTicketProcedure = protectedProcedure
  .input(CreateTicketInput)
  .use(adminsOnlyMiddleware)
  .mutation(async ({ ctx, input }) => {
    const userId = ctx.user.id
    const ids: string[] = []
    for (let i = 0; i < input.quantity; i++) {
      const id = shortUuid.generate()
      ids.push(id)
      await sendTicketCreatedEvent({
        id,
        userId,
        conferenceId: input.conferenceId,
        state: "open",
      })
    }
    try {
      await waitForPredicate(
        () => db.query.tickets.findMany({ where: inArray(tickets.id, ids) }),
        (result) => result.length === input.quantity,
      )
    } catch (error) {
      return false
    }
    return true
  })
