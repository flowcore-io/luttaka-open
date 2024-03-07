"use client"

import { useAuth } from "@clerk/nextjs"
import { zodResolver } from "@hookform/resolvers/zod"
import copy from "copy-to-clipboard"
import {
  ArrowBigRightDash,
  Clipboard,
  Loader,
  SendHorizontal,
} from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { type ReactNode, useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { Ticket } from "@/app/me/tickets/ticket.component"
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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
  const [selectedTickets, setSelectedTickets] = useState<string[]>([])

  useEffect(() => {
    const redeemCode = searchParams.get("redeemCode")
    const success = searchParams.get("success")

    if (redeemCode) {
      setTransferId(redeemCode)
      setTicketRedeemDialogOpened(true)
    }

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
    await refetch()
    setTransferId("")
    setTicketRedeemDialogOpened(false)
  }, [userId, transferId])

  const apiTransferTicket = api.ticket.createTransfer.useMutation()

  const onSelect = (ticketId: string) => (selected: boolean) => {
    const selectedTicketIds = selectedTickets.filter((id) => id !== ticketId)
    if (selected) {
      setSelectedTickets([...selectedTicketIds, ticketId])
    } else {
      setSelectedTickets(selectedTicketIds)
    }
  }

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
            variant={"ghost"}
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
      {selectedTickets.length > 0 && (
        <div className={"mb-4 text-center"}>
          <TransferTicketsDialog
            ticketIds={selectedTickets}
            onDone={() => refetch()}>
            <Button className={"mr-2"} disabled={apiTransferTicket.isLoading}>
              <ArrowBigRightDash className={"mr-2"} />
              Transfer tickets
            </Button>
          </TransferTicketsDialog>
        </div>
      )}

      {tickets?.map((ticket) => (
        <Ticket
          key={ticket.id}
          selected={selectedTickets.includes(ticket.id)}
          onSelect={onSelect(ticket.id)}
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
          <DialogHeader>
            <DialogTitle>Receive ticket</DialogTitle>
            <DialogDescription>
              In order to receive a ticket you need to get a code from the
              person giving the ticket. Note that you can enter multiple redeem
              codes seperated by comma (,)
            </DialogDescription>
          </DialogHeader>
          <div>
            <Label htmlFor={"transferId"}>Ticket redeem code</Label>
            <Input
              name={"transferId"}
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

interface TransferTicketsDialogProps {
  children: ReactNode
  ticketIds: string[]
  onDone: () => void
}

function TransferTicketsDialog(props: TransferTicketsDialogProps) {
  const [opened, setOpened] = useState(false)
  const [loading, setLoading] = useState(false)
  const apiTransferTicket = api.ticket.createTransfer.useMutation()

  const formSchema = z.object({
    email: z.string().email(),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true)
    const transferIds = await Promise.all(
      props.ticketIds.map((ticketId) =>
        apiTransferTicket.mutateAsync({ ticketId }),
      ),
    )

    const shareLink = `${window.location.origin}/me/tickets?redeemCode=${transferIds.join(",")}`

    sendEmail(
      values.email,
      "You have received tickets:)",
      `Hi\n\nYou have received tickets on Luttaka.\n\n You can redeem them by visiting the following link:\n ${shareLink}`,
    )

    setLoading(false)
    setOpened(false)
    props.onDone()
  }

  const copyToClipboard = async () => {
    setLoading(true)
    const transferIds = await Promise.all(
      props.ticketIds.map((ticketId) =>
        apiTransferTicket.mutateAsync({ ticketId }),
      ),
    )

    const shareLink = `${window.location.origin}/me/tickets?redeemCode=${transferIds.join(",")}`

    copy(shareLink)
    toast.success("Share link copied to clipboard")

    setLoading(false)
    setOpened(false)
    props.onDone()
  }

  return (
    <Dialog open={opened} onOpenChange={(open) => setOpened(open)}>
      <DialogTrigger>{props.children}</DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <DialogHeader>
              <DialogTitle>Transfer tickets</DialogTitle>
              <DialogDescription>
                Create ticket transfers and send mail to receiver. You can also
                click on "copy share link" to copy the share link to clipboard
              </DialogDescription>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Recipient</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Recipient email"
                        {...field}
                        autoComplete={"off"}
                        data-1p-ignore
                      />
                    </FormControl>
                    <FormDescription>
                      The email to share the tickets with
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </DialogHeader>
            <DialogFooter>
              <Button
                variant={"outline"}
                onClick={() => setOpened(false)}
                disabled={loading}>
                Cancel
              </Button>
              <Button
                variant={"secondary"}
                disabled={loading}
                onClick={copyToClipboard}>
                <Clipboard /> Copy share link
              </Button>
              <Button type={"submit"} disabled={loading}>
                <SendHorizontal /> Send Email
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

function sendEmail(email: string, subject: string, body: string) {
  // Encode parameters in standard URI format to ensure they will be correctly interpreted by email clients
  subject = encodeURIComponent(subject)
  body = encodeURIComponent(body)

  // Construct the 'mailto' URL
  const mailtoLink = `mailto:${email}?subject=${subject}&body=${body}`

  // Create a new window with the 'mailto' URL
  const win = window.open(mailtoLink, "_blank")

  // Ensure the new window was successfully opened
  if (win) {
    win.focus()
  } else {
    throw new Error("Could not open new window for sending email")
  }
}
