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

import { PageTitle } from "@/components/ui/page-title"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EventContext } from "@/context/event-context"

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
      </div>
    </div>
  )
}

{
  /* <div className="mb-4 flex justify-between">
          <Button variant={"link"} onClick={toggleAllSelection}>
            {selectedTickets.length > 0 ? "Deselect All" : "Select All"}
          </Button>

          
          <div className="flex flex-grow flex-wrap items-center justify-end space-x-4 space-y-2 sm:space-y-0">
            <TransferTicketsDialog ticketIds={selectedTickets} onDone={refetch}>
              <Button
                disabled={selectedTickets.length < 1}
                variant={"secondary"}
                className={"space-x-2"}>
                <p>Transfer Ticket(s)</p>
                <FontAwesomeIcon icon={faArrowUpFromBracket} />
              </Button>
            </TransferTicketsDialog>
            <RedeemTicketsDialog onDone={() => refetch()}>
              <Button variant={"secondary"}>
                <TicketIcon className={"mr-2"} /> Redeem ticket
              </Button>
            </RedeemTicketsDialog>
          </div>
        </div>

        {ticketsCurrentEvent?.map((ticket) => (
          <Ticket
            key={ticket.id}
            selected={selectedTickets.includes(ticket.id)}
            onSelect={(status) => handleSelected(status, ticket.id)}
            ticket={{
              ...ticket,
              ticketNote: ticket.ticketNote ?? "",
              transferNote: ticket.transferNote ?? "",
            }}
            refetch={async () => {
              await refetch()
            }}
          />
        ))}
        {ticketsOtherEvents?.length > 0 && <h3 className={"mb-4 mt-16"} />}
        {ticketsOtherEvents?.map((ticket) => (
          <div key={ticket.id}>
            <Ticket
              selected={selectedTickets.includes(ticket.id)}
              onSelect={(status) => handleSelected(status, ticket.id)}
              ticket={{
                ...ticket,
                ticketNote: ticket.ticketNote ?? "",
                transferNote: ticket.transferNote ?? "",
              }}
              refetch={async () => {
                await refetch()
              }}
            />
            <Button
              className="mb-8"
              variant="outline"
              onClick={() => {
                setEventId(ticket.eventId)
                toast.success(`Switched event.`)
                router.push("/")
              }}>
              Switch to event
            </Button>
          </div>
        ))}
        <h3 className={"mb-4 mt-16 text-2xl font-bold"}>Buy more tickets</h3>
        {events?.map((event) => <BuyTicket key={event.id} event={event} />)}
      </div>
    </div> */
}
