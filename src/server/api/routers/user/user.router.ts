import { createTRPCRouter } from "@/server/api/trpc"
import { getUserRouter } from "@/server/api/routers/user/user-get"
import { getUserRoleRouter } from "@/server/api/routers/user/user-role"
import { setUserRoleRouter } from "@/server/api/routers/user/user-set-role"

export const userRouter = createTRPCRouter({
  get: getUserRouter,
  role: getUserRoleRouter,
  setRole: setUserRoleRouter,
})
