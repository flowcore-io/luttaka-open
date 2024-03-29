"use client"

import { DialogTitle } from "@radix-ui/react-dialog"
import { type inferRouterOutputs } from "@trpc/server"
import dayjs from "dayjs"
import { useRouter } from "next/navigation"
import { useCallback, useState } from "react"
import { toast } from "sonner"
import { z } from "zod"

import { RestrictedToRole } from "@/components/restricted-to-role"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { UserRole } from "@/contracts/user/user-role"
import getStripe from "@/lib/stripe/get"
import { type appRouter } from "@/server/api/root"
import { api } from "@/trpc/react"

type RouterOutput = inferRouterOutputs<typeof appRouter>

const CheckoutResponse = z.object({
  sessionId: z.string(),
})

interface ConferenceProps {
  conference: RouterOutput["conference"]["list"][0]
}
export default function Conference({ conference }: ConferenceProps) {
  const [purchaseTicketDialogOpened, setPurchaseTicketDialogOpened] =
    useState(false)
  const [ticketQuantity, setTicketQuantity] = useState(1)
  const [purchaseLoading, setPurchaseLoading] = useState(false)
  const router = useRouter()

  const formatCurrency = (value: number, currency: string, locale = "da-DK") =>
    new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency,
    }).format(value)

  const apiCreateTicket = api.ticket.create.useMutation()
  const generateTicket = useCallback(async () => {
    setPurchaseLoading(true)
    try {
      await apiCreateTicket.mutateAsync({
        conferenceId: conference.id,
        quantity: ticketQuantity,
      })
      toast.success("Ticket(s) created")
      router.push("/me/tickets")
    } catch (error) {
      const title =
        error instanceof Error ? error.message : "Ticket create failed"
      toast.error(title)
    }
    setPurchaseLoading(false)
  }, [ticketQuantity, conference.id])

  const purchaseTicket = useCallback(async () => {
    setPurchaseLoading(true)
    const stripe = await getStripe()
    if (!stripe) {
      toast.error("Failed to redirect to checkout")
      return
    }
    const response = await fetch("/api/stripe/checkout", {
      method: "POST",
      body: JSON.stringify({
        conferenceId: conference.id,
        quantity: ticketQuantity,
      }),
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
  }, [ticketQuantity, conference.id])

  return (
    <div key={conference.id} className={`mb-6 p-2`}>
      <div>
        <Card className="w-full sm:w-80">
          <CardHeader>
            <CardTitle>{conference.name}</CardTitle>
            <CardDescription>{conference.ticketDescription}</CardDescription>
            <CardDescription>
              {dayjs(conference.startDate).format("MMMM D, YYYY")}
              {" - "}
              {dayjs(conference.endDate).format("MMMM D, YYYY")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-2 font-bold">Price:</div>
            <div>
              {formatCurrency(
                conference.ticketPrice,
                conference.ticketCurrency,
              )}
            </div>
          </CardContent>
          <CardFooter className="space-x-2">
            <Button
              type="button"
              className="flex-1"
              onClick={() => setPurchaseTicketDialogOpened(true)}>
              Buy
            </Button>
          </CardFooter>
        </Card>
        <Dialog
          open={purchaseTicketDialogOpened}
          onOpenChange={(open) => {
            !open && setPurchaseTicketDialogOpened(open)
          }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Purchase ticket(s) for {conference?.name}
              </DialogTitle>
              <DialogDescription>
                Price:{" "}
                {formatCurrency(
                  conference.ticketPrice,
                  conference.ticketCurrency,
                )}
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
              <RestrictedToRole role={UserRole.admin}>
                <Button
                  variant={"outline"}
                  onClick={() => generateTicket()}
                  disabled={purchaseLoading}>
                  Generate {ticketQuantity} ticket
                  {ticketQuantity > 1 ? "s" : ""}
                </Button>
              </RestrictedToRole>
              <Button
                onClick={() => purchaseTicket()}
                disabled={purchaseLoading}>
                Purchase {ticketQuantity} ticket{ticketQuantity > 1 ? "s" : ""}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
