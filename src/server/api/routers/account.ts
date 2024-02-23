import {createTRPCRouter, protectedProcedure} from "@/server/api/trpc";
import {verifyUserIdMiddleware} from "@/server/api/routers/middlewares/verify-user-id.middleware";
import {db} from "@/database";
import {eq} from "drizzle-orm";
import {users} from "@/database/schemas";
import {sendWebhook} from "@/lib/webhook";
import type {z} from "zod";
import shortUUID from "short-uuid";
import {type UserCreatedEventPayload, userEvent} from "@/contracts/events/user";
import {UserRole} from "@/contracts/user/user-role";
import {waitFor} from "@/server/lib/delay/wait-for";

export const accountRouter = createTRPCRouter({

  isAccountSetup: protectedProcedure
    .use(verifyUserIdMiddleware)
    .query(async ({ctx}) => {
      const externalId = ctx.auth!.userId;

      const user = await db.query.users.findFirst(
        {where: eq(users.externalId, externalId)}
      );

      if (!user) {
        return false;
      }

      return true;
    }),

  setupUser: protectedProcedure
    .use(verifyUserIdMiddleware)
    .mutation(async ({ctx}): Promise<string> => {

      const externalId = ctx.auth!.userId;
      const user = await db.query.users.findFirst(
        {where: eq(users.externalId, externalId)}
      );

      if (user) {
        return user.id;
      }

      const userId = shortUUID.generate();
      await sendWebhook<z.infer<typeof UserCreatedEventPayload>>(
        userEvent.flowType, userEvent.eventType.created, {
          userId: userId,
          role: UserRole.user,
          externalId
        }
      );

      const result = await waitFor(
        async () =>
          db.query.users.findFirst({where: eq(users.externalId, externalId)}),
        (result) => !!result
      );

      if (!result) {
        throw new Error("User not found");
      }

      return result.id;
    }),
});
