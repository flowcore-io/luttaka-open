import { z } from "zod"

// DTOs

export const ActivityProfileDto = z.object({
  id: z.string(),
  title: z.string(),
  imageBase64: z.string().optional(),
  description: z.string().optional(),
  stageName: z.string().optional(),
  startTime: z.string(),
  endTime: z.string(),
  publicVisibility: z.boolean(),
  archived: z.boolean(),
  reason: z.string().nullable(),
})

export const ActivityPreviewDto = ActivityProfileDto.pick({
  id: true,
  title: true,
})

export const CreateActivityInputDto = ActivityProfileDto.pick({
  title: true,
  imageBase64: true,
  description: true,
  stageName: true,
  startTime: true,
  endTime: true,
  publicVisibility: true,
  archived: true,
  reason: true,
})

export const UpdateActivityInputDto = ActivityProfileDto.partial().required({
  id: true,
})

// Types
export type ActivityProfile = z.infer<typeof ActivityProfileDto>

export type ActivityPreview = z.infer<typeof ActivityPreviewDto>

export type CreateActivityInput = z.infer<typeof CreateActivityInputDto>

export type UpdateActivityInput = z.infer<typeof UpdateActivityInputDto>
