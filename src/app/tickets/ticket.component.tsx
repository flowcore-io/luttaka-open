import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { api } from "@/trpc/react"
import { Loader, Share, Trash } from "lucide-react"
import { useQRCode } from "next-qrcode"
import { useCallback, useState } from "react"

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
  const { toast } = useToast()

  const apiArchiveTicket = api.ticket.archive.useMutation()
  const archiveTicket = useCallback(async () => {
    setLoading(true)
    const success = await apiArchiveTicket.mutateAsync({ id: ticket.id })
    if (success) {
      await refetch()
      toast({ title: "Ticket deleted" })
    } else {
      toast({ title: "Delete ticket failed", variant: "destructive" })
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
      toast({ title: "Ticket transfer created" })
    } else {
      toast({ title: "Ticket transfer create failed", variant: "destructive" })
    }
    setLoading(false)
  }, [ticket.id])

  return (
    <>
      <div
        key={ticket.id}
        onClick={() => setTicketDialogOpened(true)}
        className="mb-2 flex cursor-pointer items-center rounded-lg border p-4 shadow transition hover:scale-101 hover:shadow-lg">
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
          {!ticket.transferId && (
            <Button
              className={"mr-2"}
              size={"sm"}
              onClick={(e) => {
                e.stopPropagation()
                return createTicketTransfer()
              }}
              disabled={loading}>
              {loading ? <Loader className={"animate-spin"} /> : <Share />}
            </Button>
          )}
          <Button
            size={"sm"}
            onClick={(e) => {
              e.stopPropagation()
              return archiveTicket()
            }}
            disabled={loading}>
            {loading ? <Loader className={"animate-spin"} /> : <Trash />}
          </Button>
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
