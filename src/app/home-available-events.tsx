import { type inferRouterOutputs } from "@trpc/server"

import { PageTitle } from "@/components/ui/page-title"
import { Skeleton } from "@/components/ui/skeleton"
import { type appRouter } from "@/server/api/root"
import { api } from "@/trpc/react"

import { EventsList } from "../components/events-list"

type RouterOutput = inferRouterOutputs<typeof appRouter>

interface HomeAvailableEventsProps {
  events: RouterOutput["event"]["list"]
  isLoading: boolean
}

export default function HomeAvailableEvents({
  events,
  isLoading,
}: HomeAvailableEventsProps) {
  const apiFetchAttendingEvents = api.attendance.myEvents.useQuery()

  return (
    <div className="mx-auto w-full p-4 md:p-6">
      <PageTitle
        title={"Your events"}
        subtitle={"A list of events that you have tickets to"}
      />
      {isLoading || !events ? (
        <Skeleton />
      ) : (
        <EventsList events={apiFetchAttendingEvents.data ?? []} />
      )}
    </div>
  )
}
