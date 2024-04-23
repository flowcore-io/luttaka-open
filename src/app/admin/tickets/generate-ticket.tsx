"use client"

import { DialogTitle } from "@radix-ui/react-dialog"
import { type inferRouterOutputs } from "@trpc/server"
import dayjs from "dayjs"
import { useRouter } from "next/navigation"
import { useCallback, useState } from "react"
import { toast } from "sonner"

import { RestrictedToRole } from "@/components/restricted-to-role"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { UserRole } from "@/contracts/user/user-role"
import { type appRouter } from "@/server/api/root"
import { api } from "@/trpc/react"

type RouterOutput = inferRouterOutputs<typeof appRouter>

interface GenerateTicketProps {
  event: RouterOutput["event"]["list"][0]
  refetch: () => Promise<void>
}

// todo: remove duplicate code by creating a general purpose organism for buy-ticket.tsx and generate-ticket.tsx
export default function GenerateTicket({
  event,
  refetch,
}: GenerateTicketProps) {
  const [generateTicketDialogOpened, setGenerateTicketDialogOpened] =
    useState(false)
  const [ticketQuantity, setTicketQuantity] = useState(1)
  const [ticketNote, setTicketNote] = useState("")
  const [generateLoading, setGenerateLoading] = useState(false)
  const router = useRouter()

  const apiCreateTicket = api.ticket.create.useMutation()
  const generateTicket = useCallback(async () => {
    setGenerateLoading(true)
    try {
      await apiCreateTicket.mutateAsync({
        eventId: event.id,
        quantity: ticketQuantity,
        note: ticketNote,
      })
      toast.success("Ticket(s) created")
      router.push("/admin/tickets")
    } catch (error) {
      const title =
        error instanceof Error ? error.message : "Ticket create failed"
      toast.error(title)
    }
    setGenerateLoading(false)
    setGenerateTicketDialogOpened(false)
    setTicketNote("") // reset
    await refetch()
  }, [ticketQuantity, ticketNote, event.id])

  return (
    <div key={event.id} className={`mb-6 p-2`}>
      <div>
        <Card className="w-full sm:w-80">
          <CardHeader>
            <CardTitle>{event.name}</CardTitle>
            <CardDescription>{event.ticketDescription}</CardDescription>
            <CardDescription>
              {dayjs(event.startDate).format("MMMM D, YYYY")}
              {" - "}
              {dayjs(event.endDate).format("MMMM D, YYYY")}
            </CardDescription>
          </CardHeader>
          <CardFooter className="space-x-2">
            <Button
              type="button"
              className="flex-1"
              onClick={() => setGenerateTicketDialogOpened(true)}>
              Generate
            </Button>
          </CardFooter>
        </Card>
        <Dialog
          open={generateTicketDialogOpened}
          onOpenChange={(open) => {
            !open && setGenerateTicketDialogOpened(open)
          }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Generate ticket(s) for {event?.name}</DialogTitle>
            </DialogHeader>
            <div className={"space-y-3"}>
              <Input
                type={"number"}
                min={1}
                value={ticketQuantity}
                disabled={generateLoading}
                onChange={(e) =>
                  setTicketQuantity(parseInt(e.currentTarget.value, 10))
                }
              />
              <Input
                type={"text"}
                value={ticketNote}
                placeholder={"A note attached to the ticket(s)"}
                disabled={generateLoading}
                onChange={(e) => setTicketNote(e.currentTarget.value)}
              />
            </div>
            <DialogFooter>
              <RestrictedToRole role={UserRole.admin}>
                <Button
                  variant={"outline"}
                  onClick={() => generateTicket()}
                  disabled={generateLoading}>
                  Generate {ticketQuantity} ticket
                  {ticketQuantity > 1 ? "s" : ""}
                </Button>
              </RestrictedToRole>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
