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
import { api } from "@/trpc/react"
import { Loader, MoreVertical, Share, Trash } from "lucide-react"
import { useQRCode } from "next-qrcode"
import { useCallback, useState } from "react"
import { toast } from "sonner"

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
    const id = await apiCreateTicketTransfer.mutateAsync({
      ticketId: ticket.id,
    })
    if (id) {
      await refetch()
      toast.success("Ticket transfer created")
    } else {
      toast.error("Ticket transfer create failed")
    }
    setLoading(false)
  }, [ticket.id])

  return (
    <>
      <div
        key={ticket.id}
        onClick={() => setTicketDialogOpened(true)}
        className="mb-2 flex cursor-pointer items-center rounded-lg border p-4 shadow transition hover:shadow-lg">
        <div className={"pr-4"}>
          <img src={"/images/tonik.svg"} width={120} />
        </div>
        <div className={"flex-1 self-stretch"}>
          <div className={"pb-2 font-bold"}>Tonik 2024</div>
          <div className={"text-sm text-gray-500"}>Ticket ID: {ticket.id}</div>
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
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation()
                  return archiveTicket()
                }}>
                <Trash size={14} className={"mr-2"} /> Delete ticket
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation()
                  return createTicketTransfer()
                }}>
                <Share size={14} className={"mr-2"} /> Transfer ticket
              </DropdownMenuItem>
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
            <img src={"/images/tonik.svg"} width={240} />
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
