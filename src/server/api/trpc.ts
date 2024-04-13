/**
 * YOU PROBABLY DON'T NEED TO EDIT THIS FILE, UNLESS:
 * 1. You want to modify request context (see Part 1).
 * 2. You want to create a new middleware or type of procedure (see Part 3).
 *
 * TL;DR - This is where all the tRPC server stuff is created and plugged in. The pieces you will
 * need to use are documented accordingly near the end.
 */

import {
  clerkClient,
  type SignedInAuthObject,
  type SignedOutAuthObject,
} from "@clerk/nextjs/server"
import { initTRPC, TRPCError } from "@trpc/server"
import { eq } from "drizzle-orm"
import shortUUID from "short-uuid"
import superjson from "superjson"
import { type z, ZodError } from "zod"

import {
  type UserCreatedEventPayload,
  userEvent,
} from "@/contracts/events/user"
import { type User } from "@/contracts/user/user"
import { UserRole } from "@/contracts/user/user-role"
import { db } from "@/database"
import { profiles, users } from "@/database/schemas"
import { sendWebhook } from "@/lib/webhook"
import waitForPredicate from "@/lib/wait-for-predicate"

/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API.
 *
 * These allow you to access things when processing a request, like the database, the session, etc.
 *
 * This helper generates the "internals" for a tRPC context. The API handler and RSC clients each
 * wrap this and provides the required context.
 *
 * @see https://trpc.io/docs/server/context
 */

type AuthContext = SignedInAuthObject | SignedOutAuthObject

export type SessionContext = {
  db: typeof db
  user: User | undefined
  auth: AuthContext
}

export const createTRPCContext = async (opts: {
  auth: AuthContext
}): Promise<SessionContext> => {
  const externalId = opts.auth.userId
  if (!externalId) {
    return {
      db,
      user: undefined,
      ...opts,
    }
  }

  // todo: move this into a service to reduce code scan
  const user = await db.query.users.findFirst({
    where: eq(users.externalId, externalId),
  })
  if (user) {
    return {
      db,
      user: { ...user, role: user.role as UserRole },
      ...opts,
    }
  }
  const userCount = (await db.query.users.findMany()).length
  const externalUser = await clerkClient.users.getUser(externalId)
  const userId = shortUUID.generate()
  await sendWebhook<z.infer<typeof UserCreatedEventPayload>>(
    userEvent.flowType,
    userEvent.eventType.created,
    {
      userId: userId,
      role: userCount === 0 ? UserRole.admin : UserRole.user,
      externalId,
      firstName: externalUser.firstName ?? "",
      lastName: externalUser.lastName ?? "",
      title: "",
      description: "",
      socials: "",
      company: "",
      avatarUrl: externalUser.imageUrl ?? "",
    },
  )
  try {
    await waitForPredicate(
      async () =>
        db.query.profiles.findFirst({ where: eq(profiles.userId, userId) }),
      (result) => !!result,
    )
  } catch (error) {
    throw new Error("Failed to generate internal user")
  }

  return {
    db,
    user,
    ...opts,
  }
}

/**
 * 2. INITIALIZATION
 *
 * This is where the tRPC API is initialized, connecting the context and transformer. We also parse
 * ZodErrors so that you get typesafety on the frontend if your procedure fails due to validation
 * errors on the backend.
 */
const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    }
  },
})

/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 *
 * These are the pieces you use to build your tRPC API. You should import these a lot in the
 * "/src/server/api/routers" directory.
 */

/**
 * This is how you create new routers and sub-routers in your tRPC API.
 *
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router

/**
 * Public (unauthenticated) procedure
 *
 * This is the base piece you use to build new queries and mutations on your tRPC API. It does not
 * guarantee that a user querying is authorized, but you can still access user session data if they
 * are logged in.
 */
export const publicProcedure = t.procedure

/**
 * Reusable middleware that enforces users are logged in before running the
 * procedure
 */
const enforceUserIsAuthed = t.middleware(async ({ next, ctx }) => {
  if (!ctx.auth.userId) {
    throw new TRPCError({ code: "UNAUTHORIZED" })
  }

  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" })
  }

  return next({
    ctx: {
      auth: ctx.auth,
      user: ctx.user,
    },
  })
})

// export this procedure to be used anywhere in your application
export const protectedProcedure = t.procedure.use(enforceUserIsAuthed)
