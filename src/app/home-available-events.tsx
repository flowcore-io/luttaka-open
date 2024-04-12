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
      {isLoading || !events ? (
        <Skeleton />
      ) : (
        <div className="mt-12 flex flex-row flex-wrap justify-center gap-4">
          {events?.map((event) => (
            <Card className="w-full sm:w-80" key={event.id}>
              <Link href={`/event/${event.slug}`}>
                <CardHeader>
                  <CardTitle>{event.name}</CardTitle>
                  <CardDescription>{event.description}</CardDescription>
                  <CardDescription>
                    {dayjs(event.startDate).format("MMMM D, YYYY")}
                    {" - "}
                    {dayjs(event.endDate).format("MMMM D, YYYY")}
                  </CardDescription>
                </CardHeader>
                <CardFooter className="space-x-2"></CardFooter>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
