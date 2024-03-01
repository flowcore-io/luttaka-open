"use client"

import { useAuth } from "@clerk/nextjs"
import { Loader } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"
import { z } from "zod"

import { Ticket } from "@/app/me/tickets/ticket.component"
import { RestrictedToRole } from "@/components/restricted-to-role"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { UserRole } from "@/contracts/user/user-role"
import getStripe from "@/lib/stripe/get"
import { api } from "@/trpc/react"

const CheckoutResponse = z.object({
  sessionId: z.string(),
})

export default function Tickets() {
  const [purchaseLoading, setPurchaseLoading] = useState(false)
  const [conferenceId, setConferenceId] = useState<string>()
  const { data: conferences } = api.conference.list.useQuery()
  const { data: conference } = api.conference.get.useQuery(
    {
      id: conferenceId!,
    },
    { enabled: !!conferenceId },
  )
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { isLoaded, userId } = useAuth()
  const [ticketRedeemDialogOpened, setTicketRedeemDialogOpened] =
    useState(false)
  const [purchaseTicketDialogOpened, setPurchaseTicketDialogOpened] =
    useState(false)
  const [ticketQuantity, setTicketQuantity] = useState(1)
  const [transferId, setTransferId] = useState("")
  const { data: tickets, refetch } = api.ticket.list.useQuery(
    { conferenceId: conferenceId! },
    { enabled: !!conferenceId },
  )

  useEffect(() => {
    const success = searchParams.get("success")
    if (success === "true") {
      toast.success("Ticket purchased")
    } else if (success === "false") {
      toast.info("Ticket purchase cancelled")
    }
    router.replace(pathname)
  }, [])

  useEffect(() => {
    if (conferences) {
      setConferenceId(conferences[0]?.id)
    }
  }, [conferences])

  const apiCreateTicket = api.ticket.create.useMutation()
  const createTicket = useCallback(async () => {
    if (!userId || !conferenceId) {
      return
    }
    try {
      await apiCreateTicket.mutateAsync({ conferenceId })
      toast.success("Ticket created")
    } catch (error) {
      const title =
        error instanceof Error ? error.message : "Ticket create failed"
      toast.error(title)
    }
    await refetch()
  }, [userId])

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

  const purchaseTicket = useCallback(async () => {
    setPurchaseLoading(true)
    const stripe = await getStripe()
    if (!stripe) {
      toast.error("Failed to redirect to checkout")
      return
    }
    const response = await fetch("/api/stripe/checkout", {
      method: "POST",
      body: JSON.stringify({ conferenceId, quantity: ticketQuantity }),
    })
    const session = CheckoutResponse.parse(await response.json())
    const result = await stripe.redirectToCheckout({
      sessionId: session.sessionId,
    })
    if (result.error) {
      toast.error("Failed to redirect to checkout")
      setPurchaseLoading(false)
      return
    }
  }, [ticketQuantity, conferenceId])

  return (
    <main className="mx-auto w-full">
      <div className="flex pb-8">
        <div className="flex-1 text-3xl font-bold text-slate-900">
          My tickets
        </div>
        <div className="flex-1 text-right">
          <Button
            onClick={() => setPurchaseTicketDialogOpened(true)}
            className={"mr-2"}>
            Purchase ticket(s)
          </Button>
          <RestrictedToRole role={UserRole.admin}>
            <Button
              onClick={() => createTicket()}
              className="mr-2"
              disabled={apiCreateTicket.isLoading}>
              {apiCreateTicket.isLoading ? (
                <Loader className={"animate-spin"} />
              ) : (
                "Create ticket"
              )}
            </Button>
          </RestrictedToRole>
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

      <Dialog
        open={purchaseTicketDialogOpened}
        onOpenChange={(open) => {
          !open && setPurchaseTicketDialogOpened(open)
        }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Purchase ticket(s) for {conference?.name}</DialogTitle>
            <DialogDescription>
              Price: {conference?.ticketPrice} {conference?.ticketCurrency}
            </DialogDescription>
          </DialogHeader>
          <div>
            <Input
              type={"number"}
              value={ticketQuantity}
              disabled={purchaseLoading}
              onChange={(e) =>
                setTicketQuantity(parseInt(e.currentTarget.value, 10))
              }
            />
          </div>
          <DialogFooter>
            <Button onClick={() => purchaseTicket()} disabled={purchaseLoading}>
              Purchase {ticketQuantity} ticket{ticketQuantity > 1 ? "s" : ""}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  )
}
