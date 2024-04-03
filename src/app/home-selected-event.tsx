import { type inferRouterOutputs } from "@trpc/server"
import { useContext } from "react"

import CountdownBanner from "@/components/countdown-banner"
import { PageTitle } from "@/components/ui/page-title"
import { Skeleton } from "@/components/ui/skeleton"
import { EventContext } from "@/context/event-context"
import { type appRouter } from "@/server/api/root"

type RouterOutput = inferRouterOutputs<typeof appRouter>
interface EventProps {
  event: RouterOutput["event"]["list"][0]
}

export default function HomeSelectedEvent(props: EventProps) {
  const { eventName, eventStartDate } = useContext(EventContext)
  return (
    <div className="mx-auto w-full">
      <div className="block sm:hidden">
        <CountdownBanner targetDate={new Date(eventStartDate ?? "")} />
      </div>
      <div className="p-4 md:p-6">
        <PageTitle
          title={eventName ?? ""}
          subtitle={props.event.description ?? ""}
        />
        <div className="flex flex-col space-y-3">
          <Skeleton className="h-4 w-[250px] bg-muted/50" />
          <Skeleton className="h-[125px] w-[250px] rounded-xl bg-muted/50" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px] bg-muted/50" />
            <Skeleton className="h-4 w-[200px] bg-muted/50" />
          </div>
        </div>
        <div className="mt-16 flex flex-col space-y-3">
          <Skeleton className="h-4 w-[250px] bg-muted/50" />
          <Skeleton className="h-[125px] w-[250px] rounded-xl bg-muted/50" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px] bg-muted/50" />
            <Skeleton className="h-4 w-[200px] bg-muted/50" />
          </div>
        </div>
      </div>
    </div>
  )
}
