import { protectedProcedure } from "@/server/api/trpc"
import { PaginationInput } from "@/contracts/pagination/pagination"
import type { PagedProfileResult } from "@/contracts/profile/paged-profiles"
import { pageProfiles } from "@/server/api/services/profile/page-profiles"

export const pageProfilesRouter = protectedProcedure
  .input(PaginationInput)
  .query(async ({ input }): Promise<PagedProfileResult> => {
    return pageProfiles(input)
  })
