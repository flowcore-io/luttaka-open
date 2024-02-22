"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { api } from "@/trpc/react"
import { useAuth } from "@clerk/nextjs"
import { Trash, Loader } from "lucide-react"
import { useQRCode } from "next-qrcode"
import { useCallback, useState } from "react"

const conferenceId = "xxxxxxxxxxxxxxxxxxxxxx"

export default function Tickets() {
  const { isLoaded, userId } = useAuth()
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const { data: tickets, refetch } = api.ticket.list.useQuery(
    { userId: userId! },
    { enabled: !!userId },
  )

  const apiCreateTicket = api.ticket.create.useMutation()
  const createTicket = useCallback(async () => {
    if (!userId) {
      return
    }
    setLoading(true)
    const id = await apiCreateTicket.mutateAsync({
      userId,
      conferenceId,
      state: "open",
    })
    if (id) {
      await refetch()
      toast({ title: "Ticket created" })
    } else {
      toast({ title: "Ticket create failed", variant: "destructive" })
      await refetch()
    }
    setLoading(false)
  }, [userId])

  if (!isLoaded || !userId) {
    return null
  }

  return (
    <main className="mx-auto w-full">
      <div className="flex pb-8">
        <div className="flex-1 text-3xl font-bold text-slate-900">
          My tickets
        </div>
        <div className="flex-1 text-right">
          <Button
            onClick={() => createTicket()}
            className="float-right"
            disabled={loading}>
            {loading ? <Loader className={"animate-spin"} /> : "Create ticket"}
          </Button>
        </div>
      </div>

      {tickets?.map((ticket) => (
        <Ticket
          key={ticket.id}
          ticket={ticket}
          refetch={async () => {
            await refetch()
          }}
        />
      ))}
    </main>
  )
}

interface TicketProps {
  ticket: {
    id: string
    userId: string
    conferenceId: string
    state: string
  }
  refetch: () => Promise<void>
}
function Ticket({ ticket, refetch }: TicketProps) {
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

  return (
    <>
      <div
        key={ticket.id}
        onClick={() => setTicketDialogOpened(true)}
        className="hover:scale-101 mb-2 flex cursor-pointer items-center rounded-lg border p-4 shadow transition hover:shadow-lg">
        <div className={"flex-1"}>
          <Canvas
            text={`ticket:${ticket.id},user:${ticket.userId}`}
            options={{
              errorCorrectionLevel: "M",
              margin: 3,
              scale: 4,
              width: 100,
              color: {
                dark: "#31112d",
              },
            }}
          />
        </div>
        <div className={"flex-1"}>{ticket.id}</div>
        <div className={"flex-1 text-right"}>
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
          <DialogHeader>
            <DialogTitle>Conference Ticket</DialogTitle>
          </DialogHeader>
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
