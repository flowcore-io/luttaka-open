import { protectedProcedure } from "@/server/api/trpc"
import { UserRole } from "@/contracts/user/user-role"

export const getUserRoleRouter = protectedProcedure.query(
  async ({ ctx }): Promise<UserRole> => {
    return (ctx.user.role as UserRole) ?? UserRole.user
  },
)
