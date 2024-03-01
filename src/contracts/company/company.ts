import { z } from "zod"

// DTOs

export const CompanyProfileDto = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  owner: z.string(),
})

export const CreateCompanyInputDto = CompanyProfileDto.pick({
  name: true,
  description: true,
  owner: true,
})

export const UpdateCompanyInputDto = CompanyProfileDto.partial().required({
  id: true,
})

// Types
export type CompanyProfile = z.infer<typeof CompanyProfileDto>

export type CreateCompanyInput = z.infer<typeof CreateCompanyInputDto>

export type UpdateCompanyInput = z.infer<typeof UpdateCompanyInputDto>
