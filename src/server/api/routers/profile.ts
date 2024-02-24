import {createTRPCRouter, protectedProcedure} from "@/server/api/trpc";
import {verifyUserIdMiddleware} from "@/server/api/routers/middlewares/verify-user-id.middleware";
import {db} from "@/database";
import {eq} from "drizzle-orm";
import {profiles, users} from "@/database/schemas";
import {type UserProfile} from "@/contracts/profile/user-profile";
import {ProfileByIdInput} from "@/contracts/profile/profile-by-id-input";
import {getProfileById} from "@/server/api/services/profile/get-profile-by-id";
import {getProfileByUserId} from "@/server/api/services/profile/get-profile-by-user-id";
import {UserByIdInput} from "@/contracts/user/user-by-id-input";
import {UpdateUserProfileInput} from "@/contracts/profile/update-profile-input";
import {sendWebhook} from "@/lib/webhook";
import {profileEvent, type ProfileUpdatedEventPayload} from "@/contracts/events/profile";
import {type z} from "zod";
import {waitFor} from "@/server/lib/delay/wait-for";

export const profileRouter = createTRPCRouter({

  get: protectedProcedure
    .input(ProfileByIdInput)
    .query(async ({input}): Promise<UserProfile> => {
      return getProfileById(input);
    }),

  me: protectedProcedure
    .use(verifyUserIdMiddleware)
    .query(async ({ctx}): Promise<UserProfile> => {

      const externalId = ctx.auth.userId;
      const user = await db.query.users.findFirst({where: eq(users.externalId, externalId)});
      if (!user) {
        throw new Error(`User not found`);
      }

      return getProfileByUserId(UserByIdInput.parse({userId: user.id}));
    }),

  update: protectedProcedure
    .input(UpdateUserProfileInput)
    .use(verifyUserIdMiddleware)
    .mutation(async ({input, ctx}): Promise<string> => {

      const user = await db.query.users.findFirst(
        {where: eq(users.externalId, ctx.auth!.userId)}
      );
      if (!user) {
        throw new Error(`User not found`);
      }

      const profile = await getProfileByUserId(UserByIdInput.parse({userId: user.id}));
      const profileId = profile.id;

      await sendWebhook<z.infer<typeof ProfileUpdatedEventPayload>>(
        profileEvent.flowType,
        profileEvent.eventType.updated,
        {
          id: profileId,
          firstName: input.firstName,
          lastName: input.lastName,
          title: input.title,
          description: input.description,
          socials: input.socials,
          company: input.company,
          avatarUrl: input.avatarUrl,
        });

      const result = await waitFor(
        () => db.query.profiles.findFirst({where: eq(profiles.id, profileId)}),
        (profile) => {

          if (!profile) {
            return false;
          }

          return profile.firstName === input.firstName
            && profile.lastName === input.lastName
            && profile.title === input.title
            && profile.description === input.description
            && profile.socials === input.socials
            && profile.company === input.company
            && profile.avatarUrl === input.avatarUrl;
        }
      );

      if (!result) {
        throw new Error(`Profile not found`);
      }

      return result.id;
    })

});
