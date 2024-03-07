import { and, eq } from "drizzle-orm"
import shortUuid from "short-uuid"

import { CreateCompanyInputDto } from "@/contracts/company/company"
import {
  sendCompanyArchivedEvent,
  sendCompanyCreatedEvent,
} from "@/contracts/events/company"
import { db } from "@/database"
import { companies } from "@/database/schemas"
import waitForPredicate from "@/lib/wait-for-predicate"
import { protectedProcedure } from "@/server/api/trpc"

export const createCompanyProcedure = protectedProcedure
  .input(
    CreateCompanyInputDto.omit({
      owner: true,
    }),
  )
  .mutation(async ({ ctx, input }) => {
    if (
      await db.query.companies.findFirst({
        where: and(
          eq(companies.name, input.name),
          eq(companies.archived, false),
        ),
      })
    ) {
      throw new Error("Company with that name already exists")
    }

    const id = shortUuid.generate()

    await sendCompanyCreatedEvent({ id, ...input, ownerId: ctx.user.id })
    try {
      await waitForPredicate(
        () =>
          db.query.companies.findFirst({
            where: eq(companies.id, id),
          }),
        (result) => !!result,
      )
    } catch (error) {
      await sendCompanyArchivedEvent({
        id: id,
        _reason: "rollback",
      })
      throw new Error("Company creation failed, rolling back")
    }
    return id
  })
