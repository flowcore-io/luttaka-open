import { eq } from "drizzle-orm"
import { z } from "zod"

import { sendTicketUpdatedEvent } from "@/contracts/events/ticket"
import { db } from "@/database"
import { tickets } from "@/database/schemas"
import waitForPredicate from "@/lib/wait-for-predicate"
import { protectedProcedure } from "@/server/api/trpc"

const CheckInTicketInput = z.object({
  id: z.string(),
})

export const checkInTicketProcedure = protectedProcedure
  .input(CheckInTicketInput)
  .mutation(async ({ input }) => {
    await sendTicketUpdatedEvent({ id: input.id, state: "checked-in" })
    try {
      await waitForPredicate(
        () =>
          db.query.tickets.findFirst({
            where: eq(tickets.id, input.id),
          }),
        (result) => result?.state === "checked-in",
      )
    } catch (error) {
      await sendTicketUpdatedEvent({ id: input.id, state: "open" })
      throw new Error("Failed to check in ticket")
    }
  })
