import { z } from "zod"

export const ProfileByIdInput = z.object({
  profileId: z.string().min(1),
})
