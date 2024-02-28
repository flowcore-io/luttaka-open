import { z } from "zod"

export const UserByIdInput = z.object({
  userId: z.string().min(1),
})
