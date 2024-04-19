import { faBan } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { type FC, useCallback, useState } from "react"
import { toast } from "sonner"

import ConfirmDialog from "@/components/molecules/dialogs/confirm.dialog"
import { SkeletonList } from "@/components/molecules/skeletons/skeleton-list"
import { Button } from "@/components/ui/button"
import { MissingText } from "@/components/ui/messages/missing-text"
import { api } from "@/trpc/react"

import { Ticket } from "./ticket.component"

export const TicketsInTransit: FC = () => {
  const { data: tickets, isLoading, refetch } = api.ticket.inTransit.useQuery()
  const apiCancelTicketTransfer = api.ticket.cancelTransfer.useMutation()

  const [selectedTickets, setSelectedTickets] = useState<string[]>([])

  const toggleAllSelection = useCallback(() => {
    if (selectedTickets.length > 0) {
      setSelectedTickets([])
      return
    }

    if (!tickets) {
      setSelectedTickets([])
      return
    }

    const ticketsWithTransferIds: string[] = tickets
      .filter((ticket) => ticket.transferId !== null)
      .map((ticket): string => ticket.transferId!)

    setSelectedTickets(ticketsWithTransferIds)
  }, [selectedTickets])

  const handleSelected = useCallback(
    (selected: boolean, id: string) => {
      if (!id) {
        return
      }

      if (!selected) {
        setSelectedTickets(
          selectedTickets.filter((transferId) => transferId !== id),
        )
        return
      }

      if (selectedTickets.includes(id)) {
        setSelectedTickets(
          selectedTickets.filter((transferId) => transferId !== id),
        )
        return
      }

      setSelectedTickets([...selectedTickets, id])
    },
    [selectedTickets],
  )

  const cancelTicketTransfers = useCallback(async () => {
    if (selectedTickets.length < 1) {
      return
    }

    console.log(selectedTickets)

    const result = await Promise.allSettled(
      selectedTickets.map((transferId) => {
        return apiCancelTicketTransfer.mutateAsync({ transferId })
      }),
    )

    for (const r of result) {
      if (r.status === "rejected") {
        toast.error("Failed to cancel ticket transfer")
        continue
      }

      toast.success("Ticket transfer cancelled")
    }

    await refetch()
  }, [tickets, selectedTickets])

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
          <ConfirmDialog
            title={"Cancel ticket transfer"}
            description={
              "Are you sure you want to cancel the ticket transfer(s)? The redeem code will be removed and the ticket(s) will be available for check in again"
            }
            onConfirm={cancelTicketTransfers}>
            <Button
              disabled={selectedTickets.length < 1}
              variant={"secondary"}
              className={"space-x-2"}>
              <p>Cancel Transfer(s)</p>
              <FontAwesomeIcon icon={faBan} />
            </Button>
          </ConfirmDialog>
        </div>
      </div>
      {tickets?.length ? (
        tickets.map((ticket) => (
          <Ticket
            key={ticket.id}
            selected={selectedTickets.includes(ticket.transferId!)}
            onSelect={(status) => handleSelected(status, ticket.transferId!)}
            ticket={{
              ...ticket,
              ticketNote: ticket.ticketNote ?? "",
              transferNote: ticket.transferNote ?? "",
            }}
            refetch={async () => {
              await refetch()
            }}
          />
        ))
      ) : (
        <MissingText text="No tickets in transit" />
      )}
    </div>
  )
}
