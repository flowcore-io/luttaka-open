import { and, eq, type SQL } from "drizzle-orm"
import { type z } from "zod"

import { ConferenceProfileDto } from "@/contracts/conference/conference"
import { sendConferenceUpdatedEvent } from "@/contracts/events/conference"
import { db } from "@/database"
import { conferences } from "@/database/schemas"
import waitForPredicate from "@/lib/wait-for-predicate"
import { protectedProcedure } from "@/server/api/trpc"

export const UpdateConferenceInputDto = ConferenceProfileDto.partial().required(
  {
    id: true,
  },
)

export type UpdateConferenceInput = z.infer<typeof UpdateConferenceInputDto>

export const updateConferenceRouter = protectedProcedure
  .input(UpdateConferenceInputDto)
  .mutation(async ({ input }) => {
    if (
      !(await db.query.conferences.findFirst({
        where: and(
          eq(conferences.id, input.id),
          eq(conferences.archived, false),
        ),
      }))
    ) {
      throw new Error("Conference not found")
    }

    await sendConferenceUpdatedEvent({ ...input })
    try {
      const condition: SQL<unknown>[] = [
        eq(conferences.id, input.id),
        eq(conferences.archived, false),
        ...(input.name ? [eq(conferences.name, input.name)] : []),
        ...(input.description
          ? [eq(conferences.description, input.description)]
          : []),
        ...(input.ticketPrice
          ? [eq(conferences.ticketPrice, input.ticketPrice)]
          : []),
        ...(input.ticketCurrency
          ? [eq(conferences.ticketCurrency, input.ticketCurrency)]
          : []),
        ...(input.startDate
          ? [eq(conferences.startDate, input.startDate)]
          : []),
        ...(input.endDate ? [eq(conferences.endDate, input.endDate)] : []),
      ]

      await waitForPredicate(
        () =>
          db.query.conferences.findFirst({
            where: and(...condition),
          }),
        (result) => !!result,
      )
      return true
    } catch (error) {
      return false
    }
  })
