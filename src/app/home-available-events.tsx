import { type inferRouterOutputs } from "@trpc/server"
import dayjs from "dayjs"
import Link from "next/link"

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { PageTitle } from "@/components/ui/page-title"
import { Skeleton } from "@/components/ui/skeleton"
import { type appRouter } from "@/server/api/root"

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
  return (
    <div className="mx-auto w-full p-4 md:p-6">
      <PageTitle title={"Available events"} />
      <PageTitle title={"Available events"} />
      {isLoading || !events ? (
        <Skeleton />
      ) : (
        <EventsList events={events ?? []} />
      )}
    </div>
  )
}
