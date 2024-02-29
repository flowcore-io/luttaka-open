import { getUserRouter } from "@/server/api/routers/user/user-get"
import { getUserRoleRouter } from "@/server/api/routers/user/user-get-role"
import { setUserRoleRouter } from "@/server/api/routers/user/user-set-role"
import { createTRPCRouter } from "@/server/api/trpc"

export const userRouter = createTRPCRouter({
  get: getUserRouter,
  role: getUserRoleRouter,
  setRole: setUserRoleRouter,
})
