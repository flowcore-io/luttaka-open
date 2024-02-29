import { and, eq } from "drizzle-orm"
import shortUuid from "short-uuid"
import { type z } from "zod"

import { ConferenceProfileDto } from "@/contracts/conference/conference"
import {
  sendConferenceArchivedEvent,
  sendConferenceCreatedEvent,
} from "@/contracts/events/conference"
import { db } from "@/database"
import { conferences } from "@/database/schemas"
import waitForPredicate from "@/lib/wait-for-predicate"
import { protectedProcedure } from "@/server/api/trpc"

export const CreateConferenceInputDto = ConferenceProfileDto.pick({
  name: true,
  description: true,
  ticketPrice: true,
  ticketCurrency: true,
  startDate: true,
  endDate: true,
})

export type CreateConferenceInput = z.infer<typeof CreateConferenceInputDto>

export const createConferenceRouter = protectedProcedure
  .input(CreateConferenceInputDto)
  .mutation(async ({ input }) => {
    // TODO: make sure user has correct permissions

    if (
      await db.query.conferences.findFirst({
        where: and(
          eq(conferences.name, input.name),
          eq(conferences.archived, false),
        ),
      })
    ) {
      throw new Error("Conference with that name already exists")
    }

    const id = shortUuid.generate()

    console.log("id", id, input)
    await sendConferenceCreatedEvent({ id, ...input })
    try {
      await waitForPredicate(
        () =>
          db.query.conferences.findFirst({
            where: eq(conferences.id, id),
          }),
        (result) => {
          console.log("result", result)
          return !!result
        },
      )
    } catch (error) {
      await sendConferenceArchivedEvent({
        id: id,
        _reason: "rollback",
      })
      throw new Error("Conference creation failed, rolling back")
    }
    return id
  })
