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
import Script from "next/script"

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
    console.log("ticket scan: ", ticketScan)
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

  interface Printer {
    name: string
    // Add other properties as known, such as:
    // model: string;
    // isConnected: boolean;
    // etc.
  }

  const [printers, setPrinters] = useState<Printer[]>([])

  useEffect(() => {
    if (typeof window !== "undefined" && window.dymo) {
      const timeoutId = setTimeout(() => {
        dymo.label.framework.init(() => {
          console.log("DYMO SDK initialized successfully.")
          // Further actions...
        })
      }, 1000) // Delay initialization by 1000 ms

      return () => clearTimeout(timeoutId) // Clean up timeout
    }
  }, [])

  useEffect(() => {
    if (typeof window !== "undefined" && window.dymo) {
      const initDymo = () => {
        console.log("Initializing DYMO SDK...")
        dymo.label.framework.init(() => {
          console.log("DYMO SDK initialized successfully.")
          const environment = dymo.label.framework.checkEnvironment()
          console.log("Environment Check:", environment)

          if (
            environment.isFrameworkInstalled &&
            environment.isBrowserSupported
          ) {
            const availablePrinters = dymo.label.framework.getPrinters()
            console.log("Available printers:", availablePrinters)
            if (availablePrinters.length > 0) {
              setPrinters(availablePrinters)
            } else {
              console.error("No DYMO printers are installed.")
              toast.error("No DYMO printers detected.")
            }
          } else {
            console.error(
              "DYMO environment is not properly set up.",
              environment,
            )
            toast.error("DYMO environment setup issue.")
          }
        })
      }

      if (!(window.dymo as any).initiated) {
        ;(window.dymo as any).initiated = true
        initDymo()
      }
    } else {
      console.error("DYMO SDK not loaded.")
      toast.error("DYMO SDK not loaded.")
    }
  }, [])

  function createLabelXml(profile: {
    displayName: string
    company: string | null
  }) {
    return `<?xml version="1.0" encoding="utf-8"?>
    <DieCutLabel Version="8.0" Units="twips">
      <PaperName>30252 Address</PaperName>
      <DrawCommands>
        <RoundRectangle X="0" Y="0" Width="3060" Height="1440" Rx="180" Ry="180" />
      </DrawCommands>
      <ObjectInfo>
        <TextObject>
          <Name>Text</Name>
          <ForeColor Alpha="255" Red="0" Green="0" Blue="0" />
          <BackColor Alpha="0" Red="255" Green="255" Blue="255" />
          <LinkedObjectName />
          <Rotation>Rotation0</Rotation>
          <IsMirrored>False</IsMirrored>
          <IsVariable>False</IsVariable>
          <HorizontalAlignment>Center</HorizontalAlignment>
          <VerticalAlignment>Middle</VerticalAlignment>
          <TextFitMode>None</TextFitMode>
          <UseFullFontHeight>True</UseFullFontHeight>
          <Verticalized>False</Verticalized>
          <StyledText>
            <Element>
              <String>Óðin</String>
              <Attributes>
                <Font Family="Arial" Size="14" Bold="True" Italic="False" Underline="False" StrikeOut="False" />
                <ForeColor Alpha="255" Red="0" Green="0" Blue="0" />
              </Attributes>
            </Element>
            <Element>
              <String>FLOWCORE</String>
              <Attributes>
                <Font Family="Arial" Size="14" Bold="True" Italic="False" Underline="False" StrikeOut="False" />
                <ForeColor Alpha="255" Red="0" Green="0" Blue="0" />
              </Attributes>
            </Element>
          </StyledText>
        </TextObject>
        <Bounds X="332" Y="150" Width="4455" Height="1260" />
      </ObjectInfo>
    </DieCutLabel>
    `
  }

  const printLabel = async (profile: any) => {
    if (printers.length > 0) {
      const labelXml = createLabelXml(profile)
      console.log("Generated Label XML:", labelXml)
      const printerName = printers[0] ? printers[0].name : ""

      try {
        dymo.label.framework.printLabel(printerName, null, labelXml, null)
        console.log("Label sent to printer.")
        toast.success("Printing label...")
      } catch (error: any) {
        console.error("Failed to print label:", error)
        console.error("Error printing label: " + error.message)
      }
    } else {
      toast.error(
        "No printers detected. Please ensure a DYMO printer is connected.",
      )
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
            <div>Ticket ID</div>
            <code>{ticket.id}</code>
            <div>Ticket State</div>
            <code>{ticket.state}</code>
            <div>Ticket Holder</div>
            <code>{profile.displayName}</code>
            <div>Ticket Holder Company</div>
            <code>
              {profile.company || (
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
              disabled={!!warning || apiCheckInTicket.isLoading}
              onClick={() => {
                if (!warning && ticket && profile) {
                  checkInTicket()
                  printLabel(profile)
                } else {
                  console.error("Cannot proceed: ", {
                    warning,
                    ticket,
                    profile,
                  })
                  toast.error("Check-in or printing prerequisites not met.")
                }
              }}>
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
      <Script
        src="/dymo/dymo.connect.framework.js"
        strategy="beforeInteractive"></Script>
    </div>
  )
}
