import {createTRPCRouter, protectedProcedure} from "@/server/api/trpc";
import {UserRole} from "@/contracts/user/user-role";
import {SetUserRoleInput} from "@/contracts/authorization/set-user-role-input";
import {getUserById} from "@/server/api/services/user/get-user-by-id";
import {sendWebhook} from "@/lib/webhook";
import {userEvent, type UserUpdatedEventPayload} from "@/contracts/events/user";
import {type z} from "zod";
import {waitFor} from "@/server/lib/delay/wait-for";
import {db} from "@/database";
import {eq} from "drizzle-orm";
import {users} from "@/database/schemas";
import {adminsOnlyMiddleware} from "@/server/api/routers/middlewares/admins-only.middleware";

export const userRouter = createTRPCRouter({
  role: protectedProcedure
    .query(async ({ctx}): Promise<UserRole> => {
      return ctx.user.role as UserRole ?? UserRole.user;
    }),

  setRole: protectedProcedure
    .input(SetUserRoleInput)
    .use(adminsOnlyMiddleware)
    .mutation(async ({input}) => {

      const user = await getUserById(input.userId);

      await sendWebhook<z.infer<typeof UserUpdatedEventPayload>>(
        userEvent.flowType,
        userEvent.eventType.updated,
        {
          userId: user.id,
          role: input.role
        }
      )

      const result = await waitFor(
        () => db.query.users.findFirst({where: eq(users.id, input.userId)}),
        (user) => (user?.role as UserRole ?? "user") === input.role
      );

      if (!result) {
        throw new Error("Failed to update user role");
      }
    })
})
