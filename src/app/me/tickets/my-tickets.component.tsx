import { faArrowUpFromBracket } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { TicketIcon } from "lucide-react"
import { type FC, useCallback, useState } from "react"

import { SkeletonList } from "@/components/molecules/skeletons/skeleton-list"
import { Button } from "@/components/ui/button"
import { api } from "@/trpc/react"

import RedeemTicketsDialog from "./redeem-ticket.dialog"
import { Ticket } from "./ticket.component"
import TransferTicketsDialog from "./ticket-transfer.dialog"

export const MyTickets: FC = () => {
  const { data: tickets, isLoading, refetch } = api.ticket.list.useQuery()

  const [selectedTickets, setSelectedTickets] = useState<string[]>([])

  const toggleAllSelection = useCallback(() => {
    if (selectedTickets.length > 0) {
      setSelectedTickets([])
      return
    }

    setSelectedTickets(tickets?.map((ticket) => ticket.id) ?? [])
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

  if (isLoading) {
    // todo make a new skeleton loader for this
    return <SkeletonList count={5} />
  }

  return (
    <div>
      <div className="mb-4 flex justify-between">
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
      {tickets!.map((ticket) => (
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
      ))}
    </div>
  )
}
