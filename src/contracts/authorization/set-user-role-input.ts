import {z} from "zod";
import {UserRole} from "@/contracts/user/user-role";

export const SetUserRoleInput = z.object({
  userId: z.string().min(1),
  role: z.nativeEnum(UserRole),
})
