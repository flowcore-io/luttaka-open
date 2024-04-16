import { type inferRouterOutputs } from "@trpc/server"
import Image from "next/image"
import Link from "next/link"
import { useContext } from "react"

import CountdownBanner from "@/components/countdown-banner"
import MarkdownViewer from "@/components/md-viewer"
import { Button } from "@/components/ui/button"
import { PageTitle } from "@/components/ui/page-title"
import { Skeleton } from "@/components/ui/skeleton"
import { EventContext } from "@/context/event-context"
import { type appRouter } from "@/server/api/root"
import { api } from "@/trpc/react"

type RouterOutput = inferRouterOutputs<typeof appRouter>
interface EventProps {
  event: RouterOutput["event"]["list"][0]
}

export default function HomeSelectedEvent(props: EventProps) {
  const { eventName, eventStartDate } = useContext(EventContext)
  const { data: newsitems } = api.newsitem.listPublished.useQuery()

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
          <div key={newsitem.id} className="mb-12 space-y-4">
            {newsitem.imageBase64 ? (
              <Image
                src={newsitem.imageBase64}
                alt={newsitem.title}
                className="rounded-xl"
                width={250}
                height={250}
              />
            ) : (
              <Skeleton className="h-[250px] w-[250px] rounded-xl" />
            )}
            <div className="text-2xl font-bold">{newsitem.title}</div>
            <MarkdownViewer source={newsitem.introText ?? ""} />
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
