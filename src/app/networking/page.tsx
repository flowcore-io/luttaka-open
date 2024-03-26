"use client"

import { useState } from "react"

import { ConferenceSelection } from "@/app/networking/conference-selection"
import { ProfileList } from "@/app/networking/profile-list.component"
import { NoticeText } from "@/components/ui/messages/notice-text"
import { PageTitle } from "@/components/ui/page-title"
import { api } from "@/trpc/react"

export default function NetworkingPage() {
  const apiFetchAttendingConferences = api.attendance.myConferences.useQuery()

  const [selectedConferenceId, setSelectedConferenceId] = useState<string>("")

  return (
    <div>
      <PageTitle
        title={"Networking"}
        subtitle={
          "A list of all the people who have tickets for the selected conference"
        }
      />
      <div className={"mb-5"}>
        <ConferenceSelection
          conferences={apiFetchAttendingConferences.data ?? []}
          onSelect={setSelectedConferenceId}
        />
      </div>

      {selectedConferenceId ? (
        <ProfileList conferenceId={selectedConferenceId} />
      ) : (
        <NoticeText text={"Select a conference to view participants"} />
      )}
    </div>
  )
}
