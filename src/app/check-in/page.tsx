"use client"

import QrReader from "@/app/check-in/qr-reader.component"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import QrScanner from "qr-scanner"
import { useState } from "react"
import ScanResult = QrScanner.ScanResult

export default function CheckInPage() {
  const [result, setResult] = useState<{
    userId: string
    ticketId: string
  } | null>(null)
  const [showQrReader, setShowQrReader] = useState(false)
  const { toast } = useToast()

  const onScanSuccess = (result: ScanResult) => {
    const ticket = result.data.split(",")
    const ticketId = ticket[0]?.split(":")[1]
    const userId = ticket[1]?.split(":")[1]

    setShowQrReader(false)

    if (!userId || !ticketId) {
      toast({ title: "Invalid QR Code", variant: "destructive" })
      return
    }

    setResult({ userId, ticketId })

    toast({ title: "Scanned QR Code" })
  }

  return (
    <main className="mx-auto w-full">
      <div className={"mb-4 flex justify-center"}>
        {showQrReader ? (
          <QrReader onScanSuccess={onScanSuccess} />
        ) : (
          <Button onClick={() => setShowQrReader(true)}>Check In</Button>
        )}
      </div>
      {result && (
        <div>
          <div>Ticket ID</div>
          <code>{result?.ticketId}</code>
          <div>User ID</div>
          <code>{result?.userId}</code>
        </div>
      )}
    </main>
  )
}
