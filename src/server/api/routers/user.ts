import {createTRPCRouter, protectedProcedure} from "@/server/api/trpc";
import {clerkClient} from "@clerk/nextjs/server";
import {UserByIdInput} from "@/contracts/user/user-by-id-input";
import {type UserProfile} from "@/contracts/profile/user-profile";
import {UpdateUserProfileInput} from "@/contracts/profile/update-profile-input";
import {getInitialsFromString} from "@/server/lib/format/get-initials-from-string";

export const userRouter = createTRPCRouter({
  get: protectedProcedure
    .input(UserByIdInput)
    .query(async ({input}): Promise<UserProfile> => {

      const user = await clerkClient.users.getUser(input.userId);
      const displayName = `${user.firstName} ${user.lastName}`;

      const metadata = user.publicMetadata;
      const description: string = metadata.description as string ?? "";
      const title: string = metadata.title as string ?? "";
      const socials: string = metadata.socials as string ?? "";
      const company: string = metadata.company as string ?? "";

      return {
        userId: user.id,
        firstName: user.firstName ?? "",
        lastName: user.lastName ?? "",
        displayName: displayName,
        description,
        title,
        socials,
        company,
        avatarUrl: user.imageUrl,
        initials: getInitialsFromString(displayName),
      }
    }),

  me: protectedProcedure
    .query(async ({ctx}): Promise<UserProfile> => {

      const userId = ctx.auth?.userId;
      if (!userId) {
        throw new Error("User not found");
      }

      // todo: refactor duplicated code
      const user = await clerkClient.users.getUser(userId);
      const displayName = `${user.firstName} ${user.lastName}`;

      const metadata = user.publicMetadata;
      const description: string = metadata.description as string ?? "";
      const title: string = metadata.title as string ?? "";
      const socials: string = metadata.socials as string ?? "";
      const company: string = metadata.company as string ?? "";

      return {
        userId: user.id,
        firstName: user.firstName ?? "",
        lastName: user.lastName ?? "",
        displayName: displayName,
        description,
        title,
        socials,
        company,
        avatarUrl: user.imageUrl,
        initials: getInitialsFromString(displayName),
      }
    }),

  update: protectedProcedure
    .input(UpdateUserProfileInput)
    .mutation(async ({ctx, input}): Promise<boolean> => {

      const userId = ctx.auth?.userId;

      await clerkClient.users.updateUser(userId, {
        firstName: input.firstName,
        lastName: input.lastName,
      });

      await clerkClient.users.updateUserMetadata(userId, {
        publicMetadata: {
          title: input.title,
          description: input.description,
          socials: input.socials,
          company: input.company,
        }
      });

      // todo: update avatar
      console.log("user updated", input);
      return true;
    })
})
