import copy from "copy-to-clipboard"
import {
  ArrowBigLeftDash,
  ArrowBigRightDash,
  Clipboard,
  TicketIcon,
  Trash,
} from "lucide-react"
import Image from "next/image"
import { useQRCode } from "next-qrcode"
import { useCallback, useState } from "react"
import { toast } from "sonner"

import ConfirmDialog from "@/components/confirm.dialog"
import { RestrictedToRole } from "@/components/restricted-to-role"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { UserRole } from "@/contracts/user/user-role"
import { api } from "@/trpc/react"

export interface TicketProps {
  ticket: {
    id: string
    userId: string
    conferenceId: string
    state: string
    transferId: string | null
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
  const { data: conference } = api.conference.get.useQuery({
    id: ticket.conferenceId,
  })

  const apiCreateTicketTransfer = api.ticket.createTransfer.useMutation()
  const createTicketTransfer = useCallback(async () => {
    setLoading(true)
    try {
      await apiCreateTicketTransfer.mutateAsync({
        ticketId: ticket.id,
      })
      await refetch()
      toast.success("Ticket transfer created")
    } catch (error) {
      const message = error instanceof Error ? error.message : "Transfer failed"
      toast.error(message)
    }
    setLoading(false)
  }, [ticket.id])

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

  return (
    <>
      <div className="group relative mb-2 flex h-28 space-x-4 rounded-lg border p-2 shadow transition hover:shadow-lg">
        {ticket.state === "open" && (
          <div
            className={`${!selected && "invisible"} absolute left-2 top-2 group-hover:visible`}>
            <Checkbox checked={selected} onClick={() => onSelect(!selected)} />
          </div>
        )}
        <div className="hidden w-32 items-center justify-center self-stretch sm:flex">
          <Image
            alt={"Tonik"}
            src={"/images/tonik.svg"}
            width={120}
            height={120}
          />
        </div>
        <div className={"flex flex-1 flex-col justify-end"}>
          <div className={"overflow-hidden whitespace-nowrap"}>
            <span className={"font-bold"}>{conference?.name}</span>
          </div>
          <div className={"text-sm text-gray-500"}>
            {conference?.ticketDescription}
          </div>
          <div className={"flex flex-1 items-end justify-end"}>
            {!ticket.transferId && ticket.state === "open" && (
              <>
                <ConfirmDialog
                  title={"Do you want to transfer this ticket?"}
                  description={
                    "This will create a code on the ticket that can be used to redeem the ticket. While the ticket is in transfer it cannot be used to check in"
                  }
                  onConfirm={async () => {
                    await createTicketTransfer()
                    await refetch()
                  }}>
                  <Button
                    size={"sm"}
                    className={"mr-2"}
                    variant={"ghost"}
                    disabled={loading}>
                    <ArrowBigRightDash className={"mr-2"} />
                    Transfer ticket
                  </Button>
                </ConfirmDialog>

                <Button
                  size={"sm"}
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
      <Dialog
        open={ticketDialogOpened}
        modal
        onOpenChange={(opened) => {
          !opened && setForceView(false)
          setTicketDialogOpened(opened)
        }}>
        <DialogContent>
          <div className={"flex justify-center"}>
            <Image
              alt={"Tonik"}
              src={"/images/tonik.svg"}
              width={240}
              height={240}
            />
          </div>
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
