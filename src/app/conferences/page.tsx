"use client"

import { DialogTitle } from "@radix-ui/react-dialog"
import { type inferRouterOutputs } from "@trpc/server"
import dayjs from "dayjs"
import Link from "next/link"
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
import { Skeleton } from "@/components/ui/skeleton"
import { UserRole } from "@/contracts/user/user-role"
import getStripe from "@/lib/stripe/get"
import { type appRouter } from "@/server/api/root"
import { api } from "@/trpc/react"

export default function ConferencesPage() {
  const { data: conferences, isLoading } = api.conference.list.useQuery()
  return (
    <main className="mx-auto w-full">
      <div className="mb-6 text-3xl font-bold">Conferences</div>
      {isLoading || !conferences ? (
        <Skeleton />
      ) : (
        <ConferencesList conferences={conferences} />
      )}
    </main>
  )
}

type RouterOutput = inferRouterOutputs<typeof appRouter>

interface ConferencesListProps {
  conferences: RouterOutput["conference"]["list"]
}
function ConferencesList({ conferences }: ConferencesListProps) {
  return conferences.map((conference) => <Conference conference={conference} />)
}

const CheckoutResponse = z.object({
  sessionId: z.string(),
})

interface ConferenceProps {
  conference: RouterOutput["conference"]["list"][0]
}
function Conference({ conference }: ConferenceProps) {
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
    <div key={conference.id}>
      <div className="mb-4 text-xl font-bold">
        {conference.name}
        <Link href="/admin/conferences" className="float-right">
          Admin
        </Link>
      </div>
      <div className="mb-2">{conference.description}</div>
      <div className="mb-2 text-sm italic">
        {dayjs(conference.startDate).format("MMMM D, YYYY")}
        {" - "}
        {dayjs(conference.endDate).format("MMMM D, YYYY")}
      </div>
      <div>
        <Card className="w-full sm:w-80">
          <CardHeader>
            <CardTitle>{conference.name}</CardTitle>
            <CardDescription>{conference.ticketDescription}</CardDescription>
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
