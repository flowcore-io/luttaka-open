import {createTRPCRouter, protectedProcedure} from "@/server/api/trpc";
import {clerkClient} from "@clerk/nextjs/server";
import {UserByIdDto} from "@/dtos/user/user-by-id.dto";
import {type UserProfileDto} from "@/dtos/profile/user-profile.dto";
import {UpdateUserProfileDto} from "@/dtos/profile/update-profile.dto";
import {getInitialsFromString} from "@/server/lib/format/get-initials-from-string";

export const userRouter = createTRPCRouter({
  get: protectedProcedure
    .input(UserByIdDto)
    .query(async ({input}): Promise<UserProfileDto> => {

      const user = await clerkClient.users.getUser(input.userId);
      const displayName = `${user.firstName} ${user.lastName}`;

      return {
        userId: user.id,
        displayName: displayName,
        description: "",
        title: "",
        socials: "",
        company: "",
        avatarUrl: user.imageUrl,
        initials: getInitialsFromString(displayName),
      }
    }),

  me: protectedProcedure
    .query(async ({ctx}): Promise<UserProfileDto> => {

      const userId = ctx.auth?.userId;
      if (!userId) {
        throw new Error("User not found");
      }

      // todo: refactor duplicated code
      const user = await clerkClient.users.getUser(userId);
      const displayName = `${user.firstName} ${user.lastName}`;

      return {
        userId: user.id,
        displayName: displayName,
        description: "",
        title: "",
        socials: "",
        company: "",
        avatarUrl: user.imageUrl,
        initials: getInitialsFromString(displayName),
      }
    }),

  update: protectedProcedure
    .input(UpdateUserProfileDto)
    .mutation(async ({input}): Promise<boolean> => {
      // todo: push changes to flowcore
      console.log("user updated", input);
      return true;
    })
})