import { z } from "zod"

// DTOs

export const NewsitemProfileDto = z.object({
  id: z.string(),
  title: z.string(),
  introText: z.string(),
  fullText: z.string(),
  publicVisibility: z.boolean(),
  publishedAt: z.string(),
  archived: z.boolean(),
  reason: z.string().nullable(),
})

export const NewsitemPreviewDto = NewsitemProfileDto.pick({
  id: true,
  title: true,
})

export const CreateNewsitemInputDto = NewsitemProfileDto.pick({
  title: true,
  introText: true,
  fullText: true,
  publicVisibility: true,
  publishedAt: true,
  archived: true,
  reason: true,
})

export const UpdateNewsitemInputDto = NewsitemProfileDto.partial().required({
  id: true,
})

// Types
export type NewsitemProfile = z.infer<typeof NewsitemProfileDto>

export type NewsitemPreview = z.infer<typeof NewsitemPreviewDto>

export type CreateNewsitemInput = z.infer<typeof CreateNewsitemInputDto>

export type UpdateNewsitemInput = z.infer<typeof UpdateNewsitemInputDto>
