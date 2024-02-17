import {createTRPCRouter, protectedProcedure} from "@/server/api/trpc";
import {type UserRoleDto} from "@/dtos/user/user-role.dto";
import {clerkClient} from "@clerk/nextjs/server";

export const authorizationRouter = createTRPCRouter({
  role: protectedProcedure
    .query(async ({ctx}): Promise<UserRoleDto> => {
      const userId = ctx.auth?.userId;
      if (!userId) {
        throw new Error("User not found");
      }

      const user = await clerkClient.users.getUser(userId);
      const privateMetadata = user.privateMetadata;
      
      return privateMetadata.role as UserRoleDto ?? "user";
    }),
});