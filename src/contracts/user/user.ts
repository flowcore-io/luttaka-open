import { z } from "zod"

import { UserRole } from "@/contracts/user/user-role"

const UserDto = z.object({
  id: z.string(),
  role: z.nativeEnum(UserRole),
})

export type User = z.infer<typeof UserDto>
