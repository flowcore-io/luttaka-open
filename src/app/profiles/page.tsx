"use client";

import {api} from "@/trpc/react";
import React, {useMemo} from "react";
import {ProfileList} from "@/app/profiles/profile-list.component";
import {PageTitle} from "@/components/ui/page-title";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination";
import {useSearchParams} from "next/navigation";

const PAGE_SIZE = 1;

export default function ProfilePage() {

  const searchParams = useSearchParams();

  const page = useMemo(() => {
    const param = searchParams.get("page")
    return param ? parseInt(param) : 1;
  }, []);

  const profileCountRequest = api.profile.count.useQuery();

  const profilesRequest = api.profile.page.useQuery({
    page,
    pageSize: PAGE_SIZE
  });

  const profiles = useMemo(() => {
    if (profilesRequest.data?.items) {
      return profilesRequest.data.items;
    }
    return [];
  }, [profilesRequest.data]);

  const pageNumbers = useMemo(() => {
    if (!profileCountRequest.data) {
      return [];
    }

    const pages = Math.ceil(profileCountRequest.data / PAGE_SIZE);

    return Array.from({length: pages}, (_, i) => i + 1);

  }, [profileCountRequest.data])

  return (<div>
    <PageTitle
      title={"Participants"}
      subtitle={"A list of all the people who are partaking in this conference"}
    />
    <ProfileList profiles={profiles}/>
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href={`/profiles?page=${page - 1}`}/>
        </PaginationItem>
        {pageNumbers.map((pageNumber) =>
          <PaginationItem key={pageNumber}>
            <PaginationLink href={`/profiles?page=${pageNumber}`}>{pageNumber}</PaginationLink>
          </PaginationItem>
        )}
        <PaginationItem>
          <PaginationNext href={`/profiles?page=${page + 1}`}/>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  </div>);
}
