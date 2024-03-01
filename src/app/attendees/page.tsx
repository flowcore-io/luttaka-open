"use client"

import { useState } from "react"

import { ConferenceSelection } from "@/app/attendees/conference-selection"
import { ProfileList } from "@/app/attendees/profile-list.component"
import { NoticeText } from "@/components/ui/messages/notice-text"
import { PageTitle } from "@/components/ui/page-title"
import { api } from "@/trpc/react"

export default function AttendeesPage() {
  // todo: needs to be tested with the ticketing system to make sure that a user is connected to a specific event
  // to make sure that the query indeed works :)
  const apiFetchAttendingConferences = api.attendance.myConferences.useQuery()

  const [selectedConferenceId, setSelectedConferenceId] = useState<string>("")

  return (
    <div>
      <PageTitle
        title={"Attendees"}
        subtitle={
          "A list of all the people who have tickets for the selected conference"
        }
      />
      <div className={"mb-4"}>
        <ConferenceSelection
          conferences={apiFetchAttendingConferences.data ?? []}
          onSelect={setSelectedConferenceId}
        />
      </div>

      {selectedConferenceId ? (
        <ProfileList conferenceId={selectedConferenceId} />
      ) : (
        <NoticeText text={"Select a conference to view attendees"} />
      )}
    </div>
  )
}
