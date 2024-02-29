import { and, eq, type SQL } from "drizzle-orm"
import shortUuid from "short-uuid"
import { z } from "zod"

import {
  CreateConferenceInputDto,
  UpdateConferenceInputDto,
} from "@/contracts/conference/conference"
import {
  sendConferenceArchivedEvent,
  sendConferenceCreatedEvent,
  sendConferenceUpdatedEvent,
} from "@/contracts/events/conference"
import { db } from "@/database"
import { conferences } from "@/database/schemas"
import waitForPredicate from "@/lib/wait-for-predicate"
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc"

const ArchiveTicketInput = z.object({
  id: z.string(),
})

export const conferenceRouter = createTRPCRouter({
  list: protectedProcedure.query(async () => {
    return (
      (await db
        .select({
          id: conferences.id,
          name: conferences.name,
          description: conferences.description,
          ticketPrice: conferences.ticketPrice,
          ticketCurrency: conferences.ticketCurrency,
          startDate: conferences.startDate,
          endDate: conferences.endDate,
        })
        .from(conferences)
        .where(eq(conferences.archived, false))
        .execute()) || []
    )
  }),
  create: protectedProcedure
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
    }),
  update: protectedProcedure
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
    }),
  archive: protectedProcedure
    .input(ArchiveTicketInput)
    .mutation(async ({ input }) => {
      await sendConferenceArchivedEvent({ id: input.id })
      try {
        await waitForPredicate(
          () =>
            db.query.conferences.findFirst({
              where: and(
                eq(conferences.id, input.id),
                eq(conferences.archived, true),
              ),
            }),
          (result) => !!result,
        )
        return true
      } catch (error) {
        return false
      }
    }),
})
