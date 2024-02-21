import {createTRPCRouter, protectedProcedure} from "@/server/api/trpc";
import {UserRole} from "@/contracts/user/user-role";
import {clerkClient} from "@clerk/nextjs/server";
import {SetUserRoleInput} from "@/contracts/authorization/set-user-role-input";
import {verifyUserIdMiddleware} from "@/server/api/routers/middlewares/verify-user-id.middleware";
import {adminsOnlyMiddleware} from "@/server/api/routers/middlewares/admins-only.middleware";

export const authorizationRouter = createTRPCRouter({
  role: protectedProcedure
    .use(verifyUserIdMiddleware)
    .query(async ({ctx}): Promise<UserRole> => {

      const user = await clerkClient.users.getUser(ctx.auth!.userId);
      const privateMetadata = user.privateMetadata;

      return privateMetadata.role as UserRole ?? UserRole.user;
    }),

  setRole: protectedProcedure
    .input(SetUserRoleInput)
    .use(adminsOnlyMiddleware)
    .mutation(async ({input}) => {
      await clerkClient.users.updateUserMetadata(input.userId, {
        privateMetadata: {
          role: input.role
        }
      });
    })
});
