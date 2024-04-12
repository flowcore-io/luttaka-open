import React, { type FC, useMemo } from "react"

import { CompanyListItem } from "@/app/companies/company-list-item.component"
import { SkeletonList } from "@/components/molecules/skeletons/skeleton-list"
import { MissingText } from "@/components/ui/messages/missing-text"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination"
import { usePagination } from "@/hooks/use-pagination"
import { api } from "@/trpc/react"

const PAGE_SIZE = 8

export type CompanyListProps = {
  eventId: string
}

export const CompanyList: FC<CompanyListProps> = ({ eventId }) => {
  const pager = usePagination()

  const companyCountRequest = api.company.count.useQuery({ eventId })
  const companyRequest = api.company.page.useQuery(
    {
      page: pager.page,
      pageSize: PAGE_SIZE,
      eventId,
    },
    {
      enabled: !!eventId,
    },
  )
  const pageNumbers = useMemo(() => {
    if (!companyCountRequest.data) {
      return []
    }
    const previousPages = [pager.page - 2, pager.page - 1].filter(
      (page) => page > 0,
    )
    const nextPages = [pager.page + 1, pager.page + 2].filter(
      (page) => page <= companyCountRequest.data / PAGE_SIZE + 1,
    )

    return [...previousPages, pager.page, ...nextPages]
  }, [companyCountRequest.data, pager.page])

  const companies = useMemo(
    () => companyRequest.data?.items ?? [],
    [companyRequest.data],
  )

  // todo: encapsulate this into a trpc fetching component
  if (companyRequest.isLoading) {
    return <SkeletonList count={PAGE_SIZE} />
  }
  if (companyRequest.error) {
    return <p>Failed to load companies</p>
  }

  if (companies.length < 1) {
    return <MissingText text={"No companies found"} />
  }

  return (
    <div>
      <ul className={"space-y-2"}>
        {companies.map((company) => {
          return <CompanyListItem key={company.id} company={company} />
        })}
      </ul>
      <div
        className={
          "absolute bottom-6 left-4 right-4 rounded-full bg-background"
        }>
        <Pagination>
          <PaginationContent>
            {pageNumbers.map((pageNumber) => (
              <PaginationItem key={pageNumber}>
                <PaginationLink onClick={() => pager.setPage(pageNumber)}>
                  {pageNumber}
                </PaginationLink>
              </PaginationItem>
            ))}
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}
