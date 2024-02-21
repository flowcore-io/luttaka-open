import {z} from "zod";

export const SetUserRoleDto = z.object({
  userId: z.string().min(1),
  role: z.union([
    z.literal("admin"),
    z.literal("user")
  ]),
})