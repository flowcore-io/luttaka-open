import z from "zod"

export const UserProfileDto = z.object({
  id: z.string().min(1),
  userId: z.string().min(1),

  displayName: z.string().default(""),
  firstName: z.string().default(""),
  lastName: z.string().default(""),
  title: z.string().default(""),
  description: z.string().default(""),
  socials: z.string().default(""),
  emails: z.string().default(""),
  company: z.string().default(""),
  companyId: z.string().default(""),
  avatarUrl: z.string().default(""),
  initials: z.string().default(""),
})

export const UpdateUserProfileInputDto = z.object({
  userId: z.string().min(1),
})

export type UserProfile = z.infer<typeof UserProfileDto>

export const UserProfileListDto = z.object({
  items: z.array(UserProfileDto),
})

export type UserProfileListResult = z.infer<typeof UserProfileListDto>

export type UpdateUserProfileInput = z.infer<typeof UpdateUserProfileInputDto>
