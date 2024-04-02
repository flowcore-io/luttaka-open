import { type inferRouterOutputs } from "@trpc/server"

import { PageTitle } from "@/components/ui/page-title"
import { Skeleton } from "@/components/ui/skeleton"
import { type appRouter } from "@/server/api/root"
import { api } from "@/trpc/react"

import { ConferencesList } from "../components/conferences-list"

type RouterOutput = inferRouterOutputs<typeof appRouter>

interface HomeAvailableConferencesProps {
  conferences: RouterOutput["conference"]["list"]
  isLoading: boolean
}

export default function HomeAvailableConferences({
  conferences,
  isLoading,
}: HomeAvailableConferencesProps) {
  const apiFetchAttendingConferences = api.attendance.myConferences.useQuery()

  return (
    <div className="mx-auto w-full p-4 md:p-6">
      <PageTitle
        title={"Your events"}
        subtitle={"A list of events that you have tickets to"}
      />
      {isLoading || !conferences ? (
        <Skeleton />
      ) : (
        <ConferencesList
          conferences={apiFetchAttendingConferences.data ?? []}
        />
      )}
    </div>
  )
}
