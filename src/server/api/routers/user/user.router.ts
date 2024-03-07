import { getUserProcedure } from "@/server/api/routers/user/user-get.procedure"
import { getUserRoleProcedure } from "@/server/api/routers/user/user-role.procedure"
import { setUserRoleProcedure } from "@/server/api/routers/user/user-set-role.procedure"
import { createTRPCRouter } from "@/server/api/trpc"

export const userRouter = createTRPCRouter({
  get: getUserProcedure,
  role: getUserRoleProcedure,
  setRole: setUserRoleProcedure,
})
