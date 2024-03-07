"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { type ReactNode, useCallback, useEffect, useState } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { api } from "@/trpc/react"

export interface RedeemTicketsDialogProps {
  children: ReactNode
  onDone: () => void
}

export default function RedeemTicketsDialog(props: RedeemTicketsDialogProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const [opened, setOpened] = useState(false)
  const [transferId, setTransferId] = useState("")

  const apiAcceptTicketTransfer = api.ticket.acceptTransfer.useMutation()
  const acceptTicketTransfer = useCallback(async () => {
    if (!transferId) {
      return
    }
    const transferIds = transferId.split(",").map((id) => id.trim())
    for (const tid of transferIds) {
      try {
        await apiAcceptTicketTransfer.mutateAsync({
          transferId: tid,
        })
        toast.success("Ticket redeemed")
      } catch (error) {
        const title =
          error instanceof Error ? error.message : `Redeem failed for "${tid}"`
        toast.error(title)
      }
    }
    setTransferId("")
    setOpened(false)
    props.onDone()
  }, [transferId])

  useEffect(() => {
    const redeemCode = searchParams.get("redeemCode")
    if (redeemCode) {
      setTransferId(redeemCode)
      setOpened(true)
      router.replace(pathname)
    }
  }, [])

  return (
    <Dialog
      open={opened}
      onOpenChange={(open) => {
        setOpened(open)
      }}>
      <DialogTrigger asChild>{props.children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Receive ticket</DialogTitle>
          <DialogDescription>
            In order to receive a ticket you need to get a code from the person
            giving the ticket. Note that you can enter multiple redeem codes
            seperated by comma (,)
          </DialogDescription>
        </DialogHeader>
        <Label htmlFor={"transferId"}>Ticket redeem code</Label>
        <Input
          id={"transferId"}
          name={"transferId"}
          value={transferId}
          placeholder={"Redeem code"}
          onChange={(code) => setTransferId(code.currentTarget.value)}
        />
        <DialogFooter>
          <Button
            onClick={acceptTicketTransfer}
            disabled={apiAcceptTicketTransfer.isLoading}>
            Redeem
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
