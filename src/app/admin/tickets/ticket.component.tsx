import { Loader, PenIcon, Trash } from "lucide-react"
import { useCallback, useState } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { api } from "@/trpc/react"

export interface TicketProps {
  ticket: {
    id: string
    userId: string
    eventId: string
    state: string
    transferId: string
  }
  refetch: () => Promise<void>
}

export function Ticket({ ticket, refetch }: TicketProps) {
  const [loading, setLoading] = useState(false)

  const apiArchiveTicket = api.ticket.archive.useMutation()
  const archiveTicket = useCallback(async () => {
    setLoading(true)
    const success = await apiArchiveTicket.mutateAsync({
      id: ticket.id,
    })
    if (success) {
      await refetch()
      toast.success("Ticket deleted")
    } else {
      toast.error("Delete ticket failed")
    }
    setLoading(false)
  }, [ticket.id])

  return (
    <>
      <div
        key={ticket.id}
        className="mb-2 flex cursor-pointer items-center gap-4 rounded-lg border p-4 shadow transition hover:scale-101 hover:shadow-lg">
        <div className={"flex-1 self-stretch"}>
          <div className={"pb-2 font-bold"}>{ticket.id}</div>
        </div>
        <div className={"text-right"}>
          <Button size={"sm"} disabled={loading}>
            {loading ? <Loader className={"animate-spin"} /> : <PenIcon />}
          </Button>
          <Button
            className={"ml-2"}
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
    </>
  )
}
