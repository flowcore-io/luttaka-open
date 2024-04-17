"use client"

import { useAuth } from "@clerk/nextjs"
import { useContext, useState } from "react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog"
import { EventContext } from "@/context/event-context"
import { api } from "@/trpc/react"

import GenerateTicket from "./generate-ticket"
import { Ticket } from "./ticket.component"

export default function Tickets() {
  const { isLoaded, userId } = useAuth()
  const [createTicketDialogOpened, setCreateTicketDialogOpened] =
    useState(false)
  const { eventId } = useContext(EventContext)
  const { data: event } = api.event.get.useQuery({ id: eventId ?? "" })
  const { data: tickets, refetch } = api.ticket.list.useQuery()
  const ticketsForEvent = tickets?.filter(
    (ticket) => ticket.eventId === eventId,
  )

  if (!isLoaded || !userId) {
    return null
  }

  return (
    <div className="mx-auto w-full p-4 md:p-6">
      <div className="flex pb-8">
        <div className="flex-1 text-3xl font-bold text-slate-900">Tickets</div>
        <div className="flex-1 text-right">
          <Button onClick={() => setCreateTicketDialogOpened(true)}>
            Create Ticket
          </Button>
        </div>
      </div>

      {ticketsForEvent?.map((ticket) => (
        <Ticket
          key={ticket.id}
          ticket={{
            ...ticket,
            userId: ticket.userId ?? "",
            eventId: ticket.eventId ?? "",
            state: ticket.state ?? "",
            transferId: ticket.transferId ?? "",
            note: ticket.ticketNote ?? "",
          }}
          refetch={async () => {
            await refetch()
          }}
        />
      ))}

      <Dialog
        open={createTicketDialogOpened}
        onOpenChange={(open) => {
          !open && setCreateTicketDialogOpened(open)
        }}>
        <DialogContent
          className={"max-w-4xl"}
          onCloseAutoFocus={() => (document.body.style.overflow = "auto")}>
          <DialogHeader>Create ticket</DialogHeader>
          {event !== undefined && (
            <GenerateTicket
              event={event}
              refetch={async () => {
                await refetch()
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
