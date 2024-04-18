"use client"

import { ArrowBigRightDash, TicketIcon } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useContext, useEffect, useState } from "react"
import { toast } from "sonner"

import RedeemTicketsDialog from "@/app/me/tickets/redeem-ticket.dialog"
import { Ticket } from "@/app/me/tickets/ticket.component"
import TransferTicketsDialog from "@/app/me/tickets/ticket-transfer.dialog"
import { Button } from "@/components/ui/button"
import { PageTitle } from "@/components/ui/page-title"
import { EventContext } from "@/context/event-context"
import { api } from "@/trpc/react"

import BuyTicket from "./buy-ticket"
import { faArrowUpFromBracket } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

export default function Tickets() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { data: tickets, refetch } = api.ticket.list.useQuery()
  const { data: events } = api.event.list.useQuery()
  const [selectedTickets, setSelectedTickets] = useState<string[]>([])
  const { eventId, setEventId } = useContext(EventContext)
  const [ticketsCurrentEvent, setTicketsCurrentEvent] = useState<
    typeof tickets
  >([])

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

  useEffect(() => {
    const tickets0 =
      tickets?.filter((ticket) => ticket.eventId === eventId) ?? []
    setTicketsCurrentEvent(tickets0)
  }, [tickets, eventId])

  const ticketsOtherEvents =
    tickets?.filter((ticket) => ticket.eventId !== eventId) ?? []

  const toggleAllSelection = useCallback(() => {
    if (selectedTickets.length > 0) {
      setSelectedTickets([])
      return
    }

    setSelectedTickets(ticketsOtherEvents?.map((ticket) => ticket.id) ?? [])
  }, [selectedTickets])

  const handleSelected = useCallback(
    (selected: boolean, id: string) => {
      if (!selected) {
        setSelectedTickets(
          selectedTickets.filter((ticketId) => ticketId !== id),
        )
        return
      }

      if (selectedTickets.includes(id)) {
        setSelectedTickets(
          selectedTickets.filter((ticketId) => ticketId !== id),
        )
        return
      }

      setSelectedTickets([...selectedTickets, id])
    },
    [selectedTickets],
  )

  return (
    <div className="mx-auto w-full p-4 md:p-6">
      <div className="pb-8">
        <PageTitle title={"My tickets"} />
        <div className="mb-4 flex justify-between">
          <Button variant={"link"} onClick={toggleAllSelection}>
            {selectedTickets.length > 0 ? "Deselect All" : "Select All"}
          </Button>

          {/* todo: make the buttons drop to the next line on mobile */}
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
    </div>
  )
}
