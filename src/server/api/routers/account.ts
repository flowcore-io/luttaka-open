import {createTRPCRouter, protectedProcedure} from "@/server/api/trpc";
import {verifyUserIdMiddleware} from "@/server/api/routers/middlewares/verify-user-id.middleware";
import {db} from "@/database";
import {eq} from "drizzle-orm";
import {profiles, users} from "@/database/schemas";
import {sendWebhook} from "@/lib/webhook";
import type {z} from "zod";
import shortUUID from "short-uuid";
import {type UserCreatedEventPayload, userEvent} from "@/contracts/events/user";
import {UserRole} from "@/contracts/user/user-role";
import {waitFor} from "@/server/lib/delay/wait-for";
import {UserByIdInput} from "@/contracts/user/user-by-id-input";
import {type ProfileCreatedEventPayload, profileEvent} from "@/contracts/events/profile";
import {clerkClient} from "@clerk/nextjs/server";

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

      const profile = await db.query.profiles.findFirst(
        {where: eq(profiles.userId, user.id)}
      );

      return !!profile;
    }),

  setupUser: protectedProcedure
    .use(verifyUserIdMiddleware)
    .mutation(async ({ctx}): Promise<string> => {

      const externalId = ctx.auth!.userId;

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

  setupProfile: protectedProcedure
    .input(UserByIdInput)
    .use(verifyUserIdMiddleware)
    .mutation(async ({ctx, input}) => {

      const clerkUser = await clerkClient.users.getUser(ctx.auth.userId);

      const profileId = shortUUID.generate();
      await sendWebhook<z.infer<typeof ProfileCreatedEventPayload>>(
        profileEvent.flowType,
        profileEvent.eventType.created,
        {
          id: profileId,
          userId: input.userId,
          firstName: clerkUser.firstName ?? "",
          lastName: clerkUser.lastName ?? "",
          title: "",
          description: "",
          socials: "",
          company: "",
          avatarUrl: clerkUser.imageUrl ?? ""
        }
      );

      const result = await waitFor(
        async () =>
          db.query.profiles.findFirst({where: eq(profiles.userId, input.userId)}),
        (result) => !!result
      );

      if (!result) {
        throw new Error("User not found");
      }

      return result.id;
    }),
});
