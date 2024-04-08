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

import Event from "./buy-ticket"

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

  const onSelect = useCallback(
    (ticketId: string) => (selected: boolean) => {
      const selectedTicketIds = selectedTickets.filter((id) => id !== ticketId)
      if (selected) {
        setSelectedTickets([...selectedTicketIds, ticketId])
      } else {
        setSelectedTickets(selectedTicketIds)
      }
    },
    [selectedTickets],
  )

  const ticketsOtherEvents =
    tickets?.filter((ticket) => ticket.eventId !== eventId) ?? []

  return (
    <div className="mx-auto w-full p-4 md:p-6">
      <div className="pb-8">
        <PageTitle title={"My tickets"} />
        {ticketsCurrentEvent?.map((ticket) => (
          <Ticket
            key={ticket.id}
            selected={selectedTickets.includes(ticket.id)}
            onSelect={onSelect(ticket.id)}
            ticket={ticket}
            refetch={async () => {
              await refetch()
            }}
          />
        ))}
        <div className="whitespace-nowrap md:mt-4 md:flex-1 md:text-right">
          {selectedTickets.length > 0 && (
            <TransferTicketsDialog
              ticketIds={selectedTickets}
              onDone={() => refetch()}>
              <Button className={"mr-2"}>
                <ArrowBigRightDash className={"mr-2"} />
                Transfer tickets
              </Button>
            </TransferTicketsDialog>
          )}
          <RedeemTicketsDialog onDone={() => refetch()}>
            <Button variant={"secondary"}>
              <TicketIcon className={"mr-2"} /> Redeem ticket
            </Button>
          </RedeemTicketsDialog>
        </div>
        {ticketsOtherEvents?.length > 0 && <h3 className={"mb-4 mt-16"} />}
        {ticketsOtherEvents?.map((ticket) => (
          <div key={ticket.id}>
            <Ticket
              selected={selectedTickets.includes(ticket.id)}
              onSelect={onSelect(ticket.id)}
              ticket={ticket}
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
        {events?.map((event) => <Event key={event.id} event={event} />)}
      </div>
    </div>
  )
}
