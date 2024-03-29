"use client"

import { useContext } from "react"
import { ProfileList } from "@/app/networking/profile-list.component"
import { NoticeText } from "@/components/ui/messages/notice-text"
import { PageTitle } from "@/components/ui/page-title"
import { ConferenceContext } from "@/context/conference-context"
import { ConferencesList } from "@/components/conferences-list"
import { api } from "@/trpc/react"

export default function NetworkingPage() {
  const apiFetchAttendingConferences = api.attendance.myConferences.useQuery()
  const { conferenceId, conferenceName } = useContext(ConferenceContext)

  return (
    <div className="p-4 md:p-6">
      <PageTitle
        title={"Networking"}
        subtitle={`A list of all the people who have tickets for ${conferenceName}`}
      />

      {conferenceId ? (
        <ProfileList conferenceId={conferenceId} />
      ) : (
        <>
          <NoticeText
            text={
              "Select a conference (that you have a ticket for) to view participants."
            }
          />
          <ConferencesList
            conferences={apiFetchAttendingConferences.data ?? []}
          />
        </>
      )}
    </div>
  )
}
