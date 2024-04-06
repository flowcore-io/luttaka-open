import { type inferRouterOutputs } from "@trpc/server"
import { useContext } from "react"

import CountdownBanner from "@/components/countdown-banner"
import { PageTitle } from "@/components/ui/page-title"
import { Skeleton } from "@/components/ui/skeleton"
import { EventContext } from "@/context/event-context"
import { type appRouter } from "@/server/api/root"
import { api } from "@/trpc/react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

type RouterOutput = inferRouterOutputs<typeof appRouter>
interface EventProps {
  event: RouterOutput["event"]["list"][0]
}

export default function HomeSelectedEvent(props: EventProps) {
  const { eventName, eventStartDate } = useContext(EventContext)
  const { data: newsitems } = api.newsitem.list.useQuery()

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
        {newsitems?.map((newsitem) => (
          <div key={newsitem.id} className="space-y-4">
            <Skeleton className="mt-8 h-[125px] w-[250px] rounded-xl" />
            <div className="text-2xl font-bold">{newsitem.title}</div>
            <div>{newsitem.introText}</div>
            {newsitem.fullText && (
              <Button asChild>
                <Link href={`/newsitems/${newsitem.id}`}>Read more</Link>
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
