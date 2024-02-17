import {createTRPCRouter, protectedProcedure} from "@/server/api/trpc";
import {type UserRoleDto} from "@/dtos/user/user-role.dto";
import {clerkClient} from "@clerk/nextjs/server";
import {SetUserRoleDto} from "@/dtos/authorization/set-user-role.dto";
import {verifyUserIdMiddleware} from "@/server/api/routers/middlewares/verify-user-id.middleware";
import {adminsOnlyMiddleware} from "@/server/api/routers/middlewares/admins-only.middleware";

export const authorizationRouter = createTRPCRouter({
  role: protectedProcedure
    .use(verifyUserIdMiddleware)
    .query(async ({ctx}): Promise<UserRoleDto> => {

      const user = await clerkClient.users.getUser(ctx.auth!.userId);
      const privateMetadata = user.privateMetadata;

      return privateMetadata.role as UserRoleDto ?? "user";
    }),

  setRole: protectedProcedure
    .input(SetUserRoleDto)
    .use(adminsOnlyMiddleware)
    .mutation(async ({input}) => {
      await clerkClient.users.updateUserMetadata(input.userId, {
        privateMetadata: {
          role: input.role
        }
      });
    })
});
