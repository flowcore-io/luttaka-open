import { type inferRouterOutputs } from "@trpc/server"

import { Skeleton } from "@/components/ui/skeleton"
import { type appRouter } from "@/server/api/root"

import Event from "./me/tickets/buy-ticket"

type RouterOutput = inferRouterOutputs<typeof appRouter>

interface HomeAvailableEventsProps {
  events: RouterOutput["event"]["list"]
  isLoading: boolean
}

export default function HomeAvailableEvents({
  events,
  isLoading,
}: HomeAvailableEventsProps) {
  return (
    <div className="mx-auto w-full p-4 md:p-6">
      {isLoading || !events ? (
        <Skeleton />
      ) : (
        <div>
          {events?.map((event) => <Event key={event.id} event={event} />)}
        </div>
      )}
    </div>
  )
}
