import type { IconProp } from "@fortawesome/fontawesome-svg-core"
import { faNoteSticky } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import copy from "copy-to-clipboard"
import {
  ArrowBigLeftDash,
  ArrowBigRightDash,
  Clipboard,
  TicketIcon,
  Trash,
} from "lucide-react"
import { useQRCode } from "next-qrcode"
import { useCallback, useMemo, useState } from "react"
import { toast } from "sonner"

import ConfirmDialog from "@/components/molecules/dialogs/confirm.dialog"
import { RestrictedToRole } from "@/components/restricted-to-role"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { UserRole } from "@/contracts/user/user-role"
import { api } from "@/trpc/react"
import { cn } from "@/lib/utils"

export interface TicketProps {
  ticket: {
    id: string
    userId: string
    eventId: string
    state: string
    transferId: string | null
    transferNote: string
    ticketNote: string
  }
  selected?: boolean
  onSelect: (selected: boolean) => void
  refetch: () => Promise<void>
}

export function Ticket({ ticket, refetch, selected, onSelect }: TicketProps) {
  const [forceView, setForceView] = useState(false)
  const [loading, setLoading] = useState(false)
  const [ticketDialogOpened, setTicketDialogOpened] = useState(false)
  const { Canvas } = useQRCode()
  const { data: event } = api.event.get.useQuery({
    id: ticket.eventId,
  })

  const apiCancelTicketTransfer = api.ticket.cancelTransfer.useMutation()
  const cancelTicketTransfer = useCallback(async () => {
    setLoading(true)
    try {
      await apiCancelTicketTransfer.mutateAsync({
        transferId: ticket.transferId!,
      })
      await refetch()
      toast.success("Ticket transfer cancelled")
    } catch (error) {
      const message = error instanceof Error ? error.message : "Cancel failed"
      toast.error(message)
    }
    setLoading(false)
  }, [ticket.transferId])

  const apiArchiveTicket = api.ticket.archive.useMutation()
  const archiveTicket = useCallback(async () => {
    setLoading(true)
    const success = await apiArchiveTicket.mutateAsync({ id: ticket.id })
    if (success) {
      toast.success("Ticket archived")
    } else {
      toast.error("Archive ticket failed")
    }
    setLoading(false)
    await refetch()
  }, [ticket.id])

  const note = useMemo(
    () => ticket.transferNote || ticket.ticketNote,
    [ticket.transferNote, ticket.ticketNote],
  )

  return (
    <>
      <Card
        className={cn(
          "mb-4 cursor-pointer shadow transition hover:scale-101 hover:shadow-lg sm:gap-4",
          selected ? "bg-accent" : "",
        )}>
        <CardContent className="h-min-28 group relative flex space-x-4 p-4">
          <div
            className={"flex flex-grow flex-wrap justify-between space-y-3"}
            onClick={() => onSelect(!selected)}>
            {/* Ticket Description */}
            <div>
              <p className={"font-bold"}>{event?.name}</p>
              <p className={"text-sm text-muted"}>{event?.ticketDescription}</p>
              <div
                className={
                  "mt-2 flex flex-wrap space-x-2 overflow-hidden text-wrap"
                }>
                {!!note ? (
                  <>
                    <FontAwesomeIcon
                      icon={faNoteSticky as IconProp}
                      className={"text-sm text-muted"}
                    />
                    <p>{note}</p>
                  </>
                ) : (
                  <p className={"text-xs italic text-muted"}>no notes</p>
                )}
              </div>
            </div>

            {/* Transfer And Check-in */}
            <div className={"flex flex-grow flex-col items-end justify-end"}>
              <div className={"flex flex-wrap items-center justify-end"}>
                {!ticket.transferId && ticket.state === "open" && (
                  <>
                    <Button
                      size={"lg"}
                      disabled={loading}
                      onClick={() => setTicketDialogOpened(true)}>
                      <TicketIcon className={"mr-2"} />
                      Check in
                    </Button>
                  </>
                )}
                {ticket.state === "open" && ticket.transferId && (
                  <>
                    <ConfirmDialog
                      title={"Cancel ticket transfer"}
                      description={
                        "Are you sure you want to cancel the ticket transfer? The redeem code will be removed and the ticket will be available for check in again"
                      }
                      onConfirm={async () => {
                        await cancelTicketTransfer()
                        await refetch()
                      }}>
                      <Button
                        size={"sm"}
                        className={"mr-2"}
                        variant={"secondary"}
                        disabled={loading}>
                        <ArrowBigLeftDash className={"mr-2"} />
                        Cancel transfer
                      </Button>
                    </ConfirmDialog>

                    <Button
                      size={"sm"}
                      variant={"ghost"}
                      disabled={loading}
                      onClick={() => {
                        copy(
                          `${window.location.origin}/me/tickets?redeemCode=${ticket.transferId}`,
                        )
                        toast.success("Share link copied to clipboard")
                      }}>
                      <Clipboard className={"mr-2"} />
                      Share link
                    </Button>
                  </>
                )}
                {ticket.state === "checked-in" && (
                  <Button
                    size={"sm"}
                    className={"text-wrap"}
                    variant={"link"}
                    onClick={() => setTicketDialogOpened(true)}>
                    <TicketIcon className={"mr-2"} />
                    Ticket is checked in. Click here to view ticket
                  </Button>
                )}
                <RestrictedToRole role={UserRole.admin}>
                  <ConfirmDialog
                    title={"Archive ticket"}
                    description={
                      "Are you sure you want to archive this ticket? this action cannot be undone"
                    }
                    onConfirm={async () => {
                      await archiveTicket()
                      await refetch()
                    }}>
                    <Button
                      size={"icon"}
                      variant={"destructive"}
                      className={
                        "invisible absolute right-1 top-1 ml-2 opacity-25 hover:opacity-100 group-hover:visible"
                      }>
                      <Trash size={"14"} />
                    </Button>
                  </ConfirmDialog>
                </RestrictedToRole>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Dialog
        open={ticketDialogOpened}
        modal
        onOpenChange={(opened) => {
          !opened && setForceView(false)
          setTicketDialogOpened(opened)
        }}>
        <DialogContent>
          <div className={"relative flex justify-center"}>
            {ticket.state === "checked-in" && !forceView && (
              <div
                className={
                  "text- absolute left-32 top-28 rotate-12 rounded border-2 border-red-800 bg-white p-4 text-3xl font-bold text-red-800 opacity-75"
                }>
                Checked in
              </div>
            )}
            <Canvas
              text={`ticket:${ticket.id},user:${ticket.userId}`}
              options={{
                errorCorrectionLevel: "M",
                margin: 3,
                scale: 4,
                width: 300,
                color: {
                  dark: ticket.state === "open" || forceView ? "#111" : "#BBB",
                },
              }}
            />
          </div>
          {ticket.state === "checked-in" && !forceView && (
            <Button variant={"link"} onClick={() => setForceView(true)}>
              View ticket QR
            </Button>
          )}
          <code className={"text-center"}>
            <div>Ticket ID: {ticket.id}</div>
            <div>User ID: {ticket.userId}</div>
          </code>
        </DialogContent>
      </Dialog>
    </>
  )
}
