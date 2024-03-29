import { PageTitle } from "@/components/ui/page-title"
import { type appRouter } from "@/server/api/root"
import { inferRouterOutputs } from "@trpc/server"
import CountdownBanner from "@/components/countdown-banner"
import { Skeleton } from "@/components/ui/skeleton"
import { useContext } from "react"
import { ConferenceContext } from "@/context/conference-context"

type RouterOutput = inferRouterOutputs<typeof appRouter>
interface ConferenceProps {
  conference: RouterOutput["conference"]["list"][0]
}

export default function HomeSelectedConference(props: ConferenceProps) {
  const { conferenceName, conferenceStartDate } = useContext(ConferenceContext)
  return (
    <div className="mx-auto w-full">
      <div className="block sm:hidden">
        <CountdownBanner targetDate={new Date(conferenceStartDate ?? "")} />
      </div>
      <div className="p-4 md:p-6">
        <PageTitle
          title={conferenceName ?? ""}
          subtitle={props.conference.description ?? ""}
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
