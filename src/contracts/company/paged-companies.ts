import z from "zod"

import { CompanyProfileDto } from "@/contracts/company/company"
import { PaginationResult } from "@/contracts/pagination/pagination"

export const PagedCompanyProfilesDto = PaginationResult.extend({
  items: z.array(CompanyProfileDto),
})

export type PagedCompanyProfileResult = z.infer<typeof PagedCompanyProfilesDto>
