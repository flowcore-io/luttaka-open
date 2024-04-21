import { faArrowUpFromBracket } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { TicketIcon } from "lucide-react"
import { type FC } from "react"

import { SelectAllController } from "@/components/molecules/selector/select-all-controller"
import { SkeletonList } from "@/components/molecules/skeletons/skeleton-list"
import { Button } from "@/components/ui/button"
import { MissingText } from "@/components/ui/messages/missing-text"
import { useSelector } from "@/hooks/use-selector"
import { api } from "@/trpc/react"

import RedeemTicketsDialog from "./redeem-ticket.dialog"
import { Ticket } from "./ticket.component"
import TransferTicketsDialog from "./ticket-transfer.dialog"

export type MyTicketsProps = {
  currentEventId: string
  changeEvent: (eventId: string) => void
}

export const MyTickets: FC<MyTicketsProps> = (props) => {
  const { data: tickets, isLoading, refetch } = api.ticket.list.useQuery()

  const selector = useSelector({
    onSelectAll: () => tickets?.map((ticket) => ticket.id) ?? [],
    onRemoveFilter: (existing, incoming) => existing !== incoming,
  })

  const ticketTransferred = async () => {
    await refetch()
    selector.deselectAll()
  }

  if (isLoading) {
    // todo make a new skeleton loader for this
    return <SkeletonList count={5} />
  }

  return (
    <div>
      <div className="mb-4 flex justify-between">
        <SelectAllController selector={selector} />
        <div className="flex flex-grow flex-wrap items-center justify-end space-x-4 space-y-2 sm:space-y-0">
          <TransferTicketsDialog
            ticketIds={selector.selections}
            onDone={ticketTransferred}>
            <Button
              disabled={!selector.hasSelections}
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

      {tickets?.length ? (
        tickets.map((ticket) => (
          <div key={ticket.id}>
            <Ticket
              selected={selector.isSelected(ticket.id)}
              onSelect={(status) => selector.select(status, ticket.id)}
              ticket={{
                ...ticket,
                ticketNote: ticket.ticketNote ?? "",
                transferNote: ticket.transferNote ?? "",
              }}
              refetch={async () => {
                await refetch()
              }}
            />
            {ticket.eventId !== props.currentEventId && (
              <Button
                className="mb-8"
                variant="outline"
                onClick={() => {
                  props.changeEvent(ticket.eventId)
                }}>
                Switch to event
              </Button>
            )}
          </div>
        ))
      ) : (
        <MissingText text="You don't have any tickets" />
      )}
    </div>
  )
}
