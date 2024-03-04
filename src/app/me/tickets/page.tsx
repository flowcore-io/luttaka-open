"use client"

import { useAuth } from "@clerk/nextjs"
import { Loader } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"

import { Ticket } from "@/app/me/tickets/ticket.component"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { api } from "@/trpc/react"

export default function Tickets() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { isLoaded, userId } = useAuth()
  const [ticketRedeemDialogOpened, setTicketRedeemDialogOpened] =
    useState(false)
  const [transferId, setTransferId] = useState("")
  const { data: tickets, refetch } = api.ticket.list.useQuery()

  useEffect(() => {
    const success = searchParams.get("success")
    if (success === "true") {
      toast.success("Ticket purchased")
    } else if (success === "false") {
      toast.info("Ticket purchase cancelled")
    }
    router.replace(pathname)
  }, [])

  const apiAcceptTicketTransfer = api.ticket.acceptTransfer.useMutation()
  const acceptTicketTransfer = useCallback(async () => {
    if (!transferId) {
      return
    }
    try {
      await apiAcceptTicketTransfer.mutateAsync({
        transferId,
      })
      toast.success("Ticket redeemed")
    } catch (error) {
      const title = error instanceof Error ? error.message : "Redeem failed"
      toast.error(title)
    }
    await refetch()
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
            onClick={() => setTicketRedeemDialogOpened(true)}
            disabled={apiAcceptTicketTransfer.isLoading}>
            {apiAcceptTicketTransfer.isLoading ? (
              <Loader className={"animate-spin"} />
            ) : (
              "Redeem ticket"
            )}
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
            <Button
              onClick={acceptTicketTransfer}
              disabled={apiAcceptTicketTransfer.isLoading}>
              Redeem
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  )
}
