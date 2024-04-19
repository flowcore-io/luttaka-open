import { faBan } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { type FC, useCallback } from "react"
import { toast } from "sonner"

import ConfirmDialog from "@/components/molecules/dialogs/confirm.dialog"
import { SelectAllController } from "@/components/molecules/selector/select-all-controller"
import { SkeletonList } from "@/components/molecules/skeletons/skeleton-list"
import { Button } from "@/components/ui/button"
import { MissingText } from "@/components/ui/messages/missing-text"
import { useSelector } from "@/hooks/use-selector"
import { api } from "@/trpc/react"

import { Ticket } from "./ticket.component"

export const TicketsInTransit: FC = () => {
  const { data: tickets, isLoading, refetch } = api.ticket.inTransit.useQuery()
  const apiCancelTicketTransfer = api.ticket.cancelTransfer.useMutation()

  const selector = useSelector({
    onSelectAll: () => tickets?.map((ticket) => ticket.transferId!) ?? [],
    onRemoveFilter: (existing, incoming) => existing !== incoming,
  })

  const cancelTicketTransfers = useCallback(async () => {
    if (!selector.hasSelections) {
      return
    }

    const result = await Promise.allSettled(
      selector.selections.map((transferId) => {
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
    selector.deselectAll()
  }, [tickets, selector.selections])

  if (isLoading) {
    // todo make a new skeleton loader for this
    return <SkeletonList count={5} />
  }

  return (
    <div>
      <div className="mb-4 flex justify-between">
        <SelectAllController selector={selector} />

        <div className="flex flex-grow flex-wrap items-center justify-end space-x-4 space-y-2 sm:space-y-0">
          <ConfirmDialog
            title={"Cancel ticket transfer"}
            description={
              "Are you sure you want to cancel the ticket transfer(s)? The redeem code will be removed and the ticket(s) will be available for check in again"
            }
            onConfirm={cancelTicketTransfers}>
            <Button
              disabled={!selector.hasSelections}
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
            selected={selector.isSelected(ticket.transferId!)}
            onSelect={(status) => selector.select(status, ticket.transferId!)}
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
