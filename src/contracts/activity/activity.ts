import { z } from "zod"

// DTOs

export const ActivityProfileDto = z.object({
  id: z.string(),
  title: z.string(),
  imageUrl: z.string().optional(),
  introText: z.string().optional(),
  fullText: z.string().optional(),
  stageName: z.string().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  publicVisibility: z.boolean(),
  publishedAt: z.string(),
  archived: z.boolean(),
  reason: z.string().nullable(),
})

export const ActivityPreviewDto = ActivityProfileDto.pick({
  id: true,
  title: true,
})

export const CreateActivityInputDto = ActivityProfileDto.pick({
  title: true,
  imageUrl: true,
  introText: true,
  fullText: true,
  stageName: true,
  startTime: true,
  endTime: true,
  publicVisibility: true,
  publishedAt: true,
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
