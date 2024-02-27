"use client"

import { Ticket } from "@/app/tickets/ticket.component"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { api } from "@/trpc/react"
import { useAuth } from "@clerk/nextjs"
import { Loader } from "lucide-react"
import { useCallback, useState } from "react"

const conferenceId = "xxxxxxxxxxxxxxxxxxxxxx"

export default function Tickets() {
  const { isLoaded, userId } = useAuth()
  const [loading, setLoading] = useState(false)
  const [ticketRedeemDialogOpened, setTicketRedeemDialogOpened] =
    useState(false)
  const [transferId, setTransferId] = useState("")
  const { toast } = useToast()

  const { data: tickets, refetch } = api.ticket.list.useQuery({ conferenceId })

  const apiCreateTicket = api.ticket.create.useMutation()
  const createTicket = useCallback(async () => {
    if (!userId) {
      return
    }
    setLoading(true)
    try {
      await apiCreateTicket.mutateAsync({ conferenceId })
      toast({ title: "Ticket created" })
    } catch (error) {
      const title =
        error instanceof Error ? error.message : "Ticket create failed"
      toast({ title, variant: "destructive" })
    }
    await refetch()
    setLoading(false)
  }, [userId])

  const apiAcceptTicketTransfer = api.ticket.acceptTransfer.useMutation()
  const acceptTicketTransfer = useCallback(async () => {
    if (!transferId) {
      return
    }
    setLoading(true)
    try {
      await apiAcceptTicketTransfer.mutateAsync({
        transferId,
      })
      toast({ title: "Ticket redeemed" })
    } catch (error) {
      const title = error instanceof Error ? error.message : "Redeem failed"
      toast({ title, variant: "destructive" })
    }
    await refetch()
    setLoading(false)
    setTransferId("")
    setTicketRedeemDialogOpened(false)
  }, [userId, transferId])

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
            className="mr-2"
            disabled={loading}>
            {loading ? <Loader className={"animate-spin"} /> : "Create ticket"}
          </Button>
          <Button
            onClick={() => setTicketRedeemDialogOpened(true)}
            disabled={loading}>
            {loading ? <Loader className={"animate-spin"} /> : "Redeem ticket"}
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

      <Dialog
        open={ticketRedeemDialogOpened}
        onOpenChange={(open) => {
          !open && setTicketRedeemDialogOpened(open)
        }}>
        <DialogContent>
          <DialogHeader>Redeem ticket</DialogHeader>
          <div>
            <Input
              value={transferId}
              placeholder={"Redeem code"}
              onChange={(code) => setTransferId(code.currentTarget.value)}
            />
          </div>
          <DialogFooter>
            <Button onClick={acceptTicketTransfer} disabled={loading}>
              Redeem
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  )
}
