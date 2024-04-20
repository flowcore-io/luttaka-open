"use client"

import {
  faArrowUpFromBracket,
  faEnvelopeCircleCheck,
  faTicket,
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useContext, useEffect } from "react"
import { toast } from "sonner"

import Loading from "@/app/loading"
import { MissingText } from "@/components/ui/messages/missing-text"
import { PageTitle } from "@/components/ui/page-title"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EventContext } from "@/context/event-context"
import { api } from "@/trpc/react"

import BuyTicket from "./buy-ticket"
import { MyTickets } from "./my-tickets.component"
import { TicketsInTransit } from "./tickets-in-transit.component"
import { TransferredTickets } from "./transferred-tickets.component"

const MY_TICKET_TAB = "my-tickets"
const TICKETS_IN_TRANSIT_TAB = "tickets-in-transit"
const TRANSFERRED_TICKETS_TAB = "transferred-tickets"

export default function Tickets() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { data: events, isLoading: eventsLoading } = api.event.list.useQuery()
  const { eventId, setEventId } = useContext(EventContext)

  useEffect(() => {
    const success = searchParams.get("success")
    if (success === "true") {
      toast.success("Ticket purchased")
      setEventId(searchParams.get("eventid") ?? "")
      router.replace(pathname)
    } else if (success === "false") {
      toast.info("Ticket purchase cancelled")
      router.replace(pathname)
    }
  }, [])

  return (
    <div className="mx-auto w-full p-4 md:p-6">
      <div className="pb-8">
        <PageTitle title={"Tickets"} />
        <Tabs
          defaultValue={MY_TICKET_TAB}
          className=""
          onValueChange={(value) => {
            console.log(value)
          }}>
          <TabsList className="grid-wrap mb-6 grid h-auto w-full grid-cols-2 gap-y-3 sm:grid-cols-3">
            <TabsTrigger value={MY_TICKET_TAB} className="gap-x-2">
              <p>My Tickets</p>
              <FontAwesomeIcon icon={faTicket} />
            </TabsTrigger>
            <TabsTrigger value={TICKETS_IN_TRANSIT_TAB} className="gap-x-2">
              <p>Tickets in Transit</p>
              <FontAwesomeIcon icon={faArrowUpFromBracket} />
            </TabsTrigger>
            <TabsTrigger value={TRANSFERRED_TICKETS_TAB} className="gap-x-2">
              <p>Transferred Tickets</p>
              <FontAwesomeIcon icon={faEnvelopeCircleCheck} />
            </TabsTrigger>
          </TabsList>
          <TabsContent value={MY_TICKET_TAB}>
            <h3 className={"mb-4 text-2xl font-bold"}>My Tickets</h3>
            <MyTickets />
          </TabsContent>
          <TabsContent value={TICKETS_IN_TRANSIT_TAB}>
            <h3 className={"mb-4 text-2xl font-bold"}>Tickets in Transit</h3>
            <TicketsInTransit />
          </TabsContent>
          <TabsContent value={TRANSFERRED_TICKETS_TAB}>
            <h3 className={"mb-4 text-2xl font-bold"}>Tickets Transferred</h3>
            <TransferredTickets />
          </TabsContent>
        </Tabs>

        <h3 className={"mb-4 mt-16 text-2xl font-bold"}>Buy more tickets</h3>

        {/* todo: create a loading indicator */}
        {/* todo: create a list check */}
        {eventsLoading ? (
          <Loading />
        ) : events?.length ? (
          events?.map((event) => <BuyTicket key={event.id} event={event} />)
        ) : (
          <MissingText text="No events available" />
        )}
      </div>
    </div>
  )
}
