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
import { api } from "@/trpc/react"
import { ConferenceContext } from "@/context/conference-context"
import Conference from "./buy-ticket"

export default function Tickets() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { data: tickets, refetch } = api.ticket.list.useQuery()
  const { data: conferences, isLoading } = api.conference.list.useQuery()
  const [selectedTickets, setSelectedTickets] = useState<string[]>([])
  const {
    conferenceId,
    setConferenceId,
    setConferenceName,
    setConferenceStartDate,
  } = useContext(ConferenceContext)
  const [ticketsCurrentEvent, setTicketsCurrentEvent] = useState<
    typeof tickets
  >([])

  useEffect(() => {
    const success = searchParams.get("success")
    if (success === "true") {
      toast.success("Ticket purchased")
      router.replace(pathname)
    } else if (success === "false") {
      toast.info("Ticket purchase cancelled")
      router.replace(pathname)
    }
  }, [])

  useEffect(() => {
    const tickets0 =
      tickets?.filter((ticket) => ticket.conferenceId === conferenceId) ?? []
    setTicketsCurrentEvent(tickets0)
    if (tickets0.length === 0 && !isLoading) {
      setConferenceId("")
      setConferenceName("Luttaka")
      setConferenceStartDate("")
    }
  }, [tickets, conferenceId])

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
    tickets?.filter((ticket) => ticket.conferenceId !== conferenceId) ?? []
  const otherConferences =
    conferences?.filter(
      (conference) =>
        !tickets?.some((ticket) => ticket.conferenceId === conference.id),
    ) ?? []

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
        {ticketsOtherEvents?.length > 0 && (
          <h3 className={"mb-4 mt-16 text-2xl font-bold"}>
            My tickets to other events
          </h3>
        )}
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
                setConferenceId(ticket.conferenceId)
                toast.success(`Switched event.`)
                router.push("/")
              }}>
              Switch to event
            </Button>
          </div>
        ))}
        <h3 className={"mb-4 mt-16 text-2xl font-bold"}>Buy more tickets</h3>
        {conferences?.map((conference) => (
          <Conference key={conference.id} conference={conference} />
        ))}
      </div>
    </div>
  )
}
