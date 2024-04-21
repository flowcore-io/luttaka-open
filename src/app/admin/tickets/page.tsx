"use client"

import { useAuth } from "@clerk/nextjs"
import { faArrowUpFromBracket } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { type inferRouterOutputs } from "@trpc/server"
import { useContext, useEffect, useState } from "react"

import TransferTicketsDialog from "@/app/me/tickets/ticket-transfer.dialog"
import { SelectAllController } from "@/components/molecules/selector/select-all-controller"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog"
import { EventContext } from "@/context/event-context"
import { useSelector } from "@/hooks/use-selector"
import { type appRouter } from "@/server/api/root"
import { api } from "@/trpc/react"

import GenerateTicket from "./generate-ticket"
import { Ticket } from "./ticket.component"

type RouterOutput = inferRouterOutputs<typeof appRouter>

export default function Tickets() {
  const { isLoaded, userId } = useAuth()
  const [createTicketDialogOpened, setCreateTicketDialogOpened] =
    useState(false)

  const { eventId } = useContext(EventContext)
  const [event, setEvent] = useState<RouterOutput["event"]["list"][0]>()
  const { data: tickets, refetch } = api.ticket.listForEvent.useQuery(
    { eventId: eventId ?? "" },
    { enabled: !!eventId },
  )

  const selector = useSelector({
    onSelectAll: () => tickets?.map((ticket) => ticket.id) ?? [],
    onRemoveFilter: (existing, incoming) => existing !== incoming,
  })

  const eventQuery = api.event.get.useQuery(
    { id: eventId ?? "" },
    { enabled: !!eventId },
  )
  useEffect(() => {
    if (eventQuery.data) {
      setEvent(eventQuery.data)
    }
  }, [eventQuery.data])

  const ticketsForEvent = tickets?.filter(
    (ticket) => ticket.eventId === eventId,
  )

  const transferComplete = async () => {
    selector.deselectAll()
    await refetch()
  }

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

      <div className="mb-4 flex justify-between">
        <SelectAllController selector={selector} />

        {/* todo: move this component into an organism or "dialog" folder */}
        <TransferTicketsDialog
          ticketIds={selector.selections}
          onDone={transferComplete}>
          <Button
            disabled={!selector.hasSelections}
            variant={"secondary"}
            className={"space-x-2"}>
            <p>Transfer Ticket(s)</p>
            <FontAwesomeIcon icon={faArrowUpFromBracket} />
          </Button>
        </TransferTicketsDialog>
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
            note: !!ticket.transferNote
              ? ticket.transferNote
              : ticket.ticketNote ?? "",
          }}
          selected={selector.isSelected(ticket.id)}
          onSelected={(status) => selector.select(status, ticket.id)}
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
