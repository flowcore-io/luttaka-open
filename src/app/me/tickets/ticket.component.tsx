import { MoreVertical, Share, Trash } from "lucide-react"
import Image from "next/image"
import { useQRCode } from "next-qrcode"
import { useCallback, useState } from "react"
import { toast } from "sonner"

import { RestrictedToRole } from "@/components/restricted-to-role"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
  refetch: () => Promise<void>
}
export function Ticket({ ticket, refetch }: TicketProps) {
  const [loading, setLoading] = useState(false)
  const [ticketDialogOpened, setTicketDialogOpened] = useState(false)
  const { Canvas } = useQRCode()
  const { data: conference } = api.conference.get.useQuery({
    id: ticket.conferenceId,
  })

  const apiArchiveTicket = api.ticket.archive.useMutation()
  const archiveTicket = useCallback(async () => {
    setLoading(true)
    const success = await apiArchiveTicket.mutateAsync({ id: ticket.id })
    if (success) {
      await refetch()
      toast.success("Ticket deleted")
    } else {
      toast.error("Delete ticket failed")
    }
    setLoading(false)
  }, [ticket.id])

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

  return (
    <>
      <div
        key={ticket.id}
        onClick={() => setTicketDialogOpened(true)}
        className="mb-2 flex cursor-pointer items-center rounded-lg border p-4 shadow transition hover:shadow-lg">
        <div className={"pr-4"}>
          <Image
            alt={"Tonik"}
            src={"/images/tonik.svg"}
            width={120}
            height={120}
          />
        </div>
        <div className={"flex-1 self-stretch"}>
          <div className={"font-bold"}>{conference?.name}</div>
          <div className={"text-sm text-gray-500"}>
            Ticket State: {ticket.state}
          </div>
          {ticket.transferId && (
            <div className={"text-sm text-gray-500"}>
              Redeem Code: {ticket.transferId}
            </div>
          )}
        </div>
        <div className={"text-right"}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={"ghost"} size={"sm"} disabled={loading}>
                <MoreVertical />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className={"w-56"}>
              <DropdownMenuLabel>Ticket</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <RestrictedToRole role={UserRole.admin}>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation()
                    return archiveTicket()
                  }}>
                  <Trash size={14} className={"mr-2"} /> Delete ticket
                </DropdownMenuItem>
              </RestrictedToRole>
              {ticket.state === "open" && ticket.transferId && (
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation()
                    return cancelTicketTransfer()
                  }}>
                  <Share size={14} className={"mr-2"} /> Cancel ticket transfer
                </DropdownMenuItem>
              )}
              {ticket.state === "open" && !ticket.transferId && (
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation()
                    return createTicketTransfer()
                  }}>
                  <Share size={14} className={"mr-2"} /> Transfer ticket
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <Dialog
        open={ticketDialogOpened}
        modal
        onOpenChange={(opened) => setTicketDialogOpened(opened)}>
        <DialogContent>
          <div className={"flex justify-center"}>
            <Image
              alt={"Tonik"}
              src={"/images/tonik.svg"}
              width={240}
              height={240}
            />
          </div>
          <div className={"flex justify-center"}>
            <Canvas
              text={`ticket:${ticket.id},user:${ticket.userId}`}
              options={{
                errorCorrectionLevel: "M",
                margin: 3,
                scale: 4,
                width: 300,
                color: {
                  dark: "#31112d",
                },
              }}
            />
          </div>
          <code className={"text-center"}>
            <div>Ticket ID: {ticket.id}</div>
            <div>User ID: {ticket.userId}</div>
          </code>
        </DialogContent>
      </Dialog>
    </>
  )
}
