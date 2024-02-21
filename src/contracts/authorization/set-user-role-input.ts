import {z} from "zod";

export const SetUserRoleInput = z.object({
  userId: z.string().min(1),
  role: z.union([
    z.literal("admin"),
    z.literal("user")
  ]),
})
