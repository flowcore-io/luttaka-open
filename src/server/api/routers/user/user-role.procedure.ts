import { UserRole } from "@/contracts/user/user-role"
import { protectedProcedure } from "@/server/api/trpc"

export const getUserRoleProcedure = protectedProcedure.query(
  async ({ ctx }): Promise<UserRole> => {
    return (ctx.user.role as UserRole) ?? UserRole.user
  },
)
