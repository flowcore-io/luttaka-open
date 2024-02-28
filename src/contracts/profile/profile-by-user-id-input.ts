import { z } from "zod"

export const ProfileByUserIdInput = z.object({
  userId: z.string().min(1),
})
