import { z } from "zod"

// DTOs

export const CompanyProfileDto = z.object({
  id: z.string(),
  name: z.string(),
  imageUrl: z.string().optional(),
  description: z.string().optional(),
  owner: z.string().optional(),
  companyType: z.string().optional(),
})

export const CreateCompanyInputDto = CompanyProfileDto.pick({
  name: true,
  imageUrl: true,
  description: true,
  owner: true,
  companyType: true,
})

export const UpdateCompanyInputDto = CompanyProfileDto.partial().required({
  id: true,
})

// Types
export type CompanyProfile = z.infer<typeof CompanyProfileDto>

export type CreateCompanyInput = z.infer<typeof CreateCompanyInputDto>

export type UpdateCompanyInput = z.infer<typeof UpdateCompanyInputDto>
