import React, { type FC, useMemo } from "react"

import { ProfileListItem } from "@/app/networking/profile-list-item.component"
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

export type ProfileListProps = {
  conferenceId: string
}

export const ProfileList: FC<ProfileListProps> = ({ conferenceId }) => {
  const pager = usePagination()

  const profileCountRequest = api.profile.count.useQuery()
  const profilesRequest = api.attendance.page.useQuery(
    {
      page: pager.page,
      pageSize: PAGE_SIZE,
      conferenceId,
    },
    {
      enabled: !!conferenceId,
    },
  )

  const pageNumbers = useMemo(() => {
    if (!profileCountRequest.data) {
      return []
    }

    const previousPages = [pager.page - 2, pager.page - 1].filter(
      (page) => page > 0,
    )
    const nextPages = [pager.page + 1, pager.page + 2].filter(
      (page) => page <= profileCountRequest.data / PAGE_SIZE,
    )
    return [...previousPages, pager.page, ...nextPages]
  }, [profileCountRequest.data, pager.page])

  const profiles = useMemo(
    () => profilesRequest.data?.items ?? [],
    [profilesRequest.data],
  )

  // todo: encapsulate this into a trpc fetching component
  if (profilesRequest.isLoading) {
    return <SkeletonList count={PAGE_SIZE} />
  }
  if (profilesRequest.error) {
    return <p>Failed to load profiles</p>
  }

  if (profiles.length < 1) {
    return <MissingText text={"No profiles found"} />
  }

  return (
    <div>
      <ul className={"space-y-2"}>
        {profiles.map((profile) => {
          return <ProfileListItem key={profile.id} profile={profile} />
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
