"use client"

import { useContext } from "react"

import { EventsList } from "@/components/events-list"
import { NoticeText } from "@/components/ui/messages/notice-text"
import { PageTitle } from "@/components/ui/page-title"
import { EventContext } from "@/context/event-context"
import { api } from "@/trpc/react"

import { CompanyList } from "./company-list.component"

export default function CompaniesPage() {
  const apiFetchAttendingEvents = api.attendance.myEvents.useQuery()
  const { eventId, eventName } = useContext(EventContext)
  return (
    <div className="p-4 md:p-6">
      <PageTitle
        title={"Companies"}
        subtitle={`A list of all the companies present at ${eventName}`}
      />

      {eventId ? (
        <CompanyList eventId={eventId} />
      ) : (
        <>
          <NoticeText
            text={
              "Select a event (that you have a ticket for) to view participants."
            }
          />
          <EventsList events={apiFetchAttendingEvents.data ?? []} />
        </>
      )}
    </div>
  )
}
