"use client"

import { AlertCircle } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"

import QrReader from "@/app/admin/check-in/qr-reader.component"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
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
  DialogTitle,
} from "@/components/ui/dialog"
import { api } from "@/trpc/react"

export default function CheckInPage() {
  const [pristine, setPristine] = useState(true)
  const [ticketId, setTicketId] = useState<string>()
  const [userId, setUserId] = useState<string>()
  const [showQrReader, setShowQrReader] = useState(false)
  const [warning, setWarning] = useState<string>()
  const { data: ticket, refetch: refetchTicket } = api.ticket.get.useQuery(
    { id: ticketId! },
    {
      enabled: !!ticketId,
    },
  )
  const { data: profile } = api.profile.getByUserId.useQuery(
    { userId: userId! },
    { enabled: !!userId },
  )

  const onScanSuccess = async (result: string) => {
    const ticketScan = result.split(",")
    const ticketId = ticketScan[0]?.split(":")[1]
    const userId = ticketScan[1]?.split(":")[1]

    setShowQrReader(false)

    if (!userId || !ticketId) {
      toast.warning("Invalid ticket QR code")
      setTicketId(undefined)
      setUserId(undefined)
      return
    }

    setTicketId(ticketId)
    setUserId(userId)

    toast.success("Ticket Scanned Successfully")
  }

  useEffect(() => {
    if (!ticket || !profile) {
      setWarning(undefined)
      return
    }
    if (ticket.userId !== profile.userId) {
      setWarning("Ticket does not belong to this user")
    } else if (ticket.state === "checked-in") {
      setWarning("Ticket already checked in")
    } else if (ticket.state !== "open") {
      setWarning("Ticket has an invalid state")
    } else if (ticket.transferId) {
      setWarning("Ticket is part of a transfer")
    } else {
      setWarning(undefined)
      window.open(
        `/admin/check-in/print/${ticket.userId}`,
        "_blank",
        "height=600,width=800",
      )
    }
  }, [ticket, profile])

  const apiCheckInTicket = api.ticket.checkIn.useMutation()
  const checkInTicket = async () => {
    if (!ticket) {
      return
    }
    try {
      await apiCheckInTicket.mutateAsync({ id: ticket.id })
      toast.success("Ticket Checked In", {})
      setPristine(false)
      await refetchTicket()
    } catch (error) {
      const title = error instanceof Error ? error.message : "Check In failed"
      toast.error(title)
    }
  }

  return (
    <div className="mx-auto w-full p-4 md:p-6">
      {!ticketId && (
        <div className={"mb-4 flex justify-center"}>
          <Button
            onClick={() => {
              setPristine(true)
              setTicketId(undefined)
              setUserId(undefined)
              setShowQrReader(true)
            }}>
            Scan Ticket
          </Button>
        </div>
      )}
      {warning && pristine && (
        <Alert variant={"destructive"} className={"mb-4"}>
          <AlertCircle />
          <AlertTitle>Ticket not eligible for check in</AlertTitle>
          <AlertDescription>{warning}</AlertDescription>
        </Alert>
      )}
      {ticket && profile && (
        <Card className={"mb-4"}>
          <CardHeader>
            <CardTitle>Ticket Info</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              Ticket ID:&nbsp;
              <code>{ticket.id}</code>
            </div>
            <div>
              Ticket State:&nbsp;
              <code>{ticket.state}</code>
            </div>
            <br />
            <code>
              {profile.displayName ?? (
                <em className={"text-gray-500"}>no name</em>
              )}
            </code>
            <br />
            <code>
              {profile.title ?? <em className={"text-gray-500"}>no title</em>}
            </code>
            <br />
            <code>
              {profile.company ?? (
                <em className={"text-gray-500"}>no company</em>
              )}
            </code>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => {
                setTicketId(undefined)
                setUserId(undefined)
              }}>
              Start Over
            </Button>
            <Button
              variant="secondary"
              onClick={() =>
                window.open(
                  `/admin/check-in/print/${ticket.userId}`,
                  "_blank",
                  "height=600,width=800",
                )
              }>
              Print
            </Button>
            <Button
              disabled={!!warning || apiCheckInTicket.isLoading}
              onClick={checkInTicket}>
              {apiCheckInTicket.isLoading ? "Checking In..." : "Check In"}
            </Button>
          </CardFooter>
        </Card>
      )}
      <Dialog
        open={showQrReader}
        onOpenChange={(open) => setShowQrReader(open)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Check In</DialogTitle>
            <DialogDescription>Scan Ticket QR Code</DialogDescription>
          </DialogHeader>
          <div>
            <QrReader onScanSuccess={onScanSuccess} />
          </div>
          <DialogFooter>
            <Button onClick={() => setShowQrReader(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
