import {z} from "zod";

export const UserByIdDto = z.object({
  userId: z.string().min(1)
})