import { zodResolver } from "@hookform/resolvers/zod"
import copy from "copy-to-clipboard"
import { Clipboard, SendHorizontal } from "lucide-react"
import { type ReactNode, useContext, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

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
import { EventContext } from "@/context/event-context"
import { api } from "@/trpc/react"

export interface TransferTicketsDialogProps {
  children: ReactNode
  ticketIds: string[]
  sender?: string
  onDone: () => void
}

type ResponseData = {
  message: string
  status: string
}

export default function TransferTicketsDialog(
  props: TransferTicketsDialogProps,
) {
  const { eventName } = useContext(EventContext)
  const [opened, setOpened] = useState(false)
  const [loading, setLoading] = useState(false)
  const apiTransferTicket = api.ticket.createTransfer.useMutation()
  const [noteIsTouched, setNoteIsTouched] = useState(false)

  const formSchema = z.object({
    email: z.string().email(),
    note: z.string(),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      note: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true)
    const transferIds = await Promise.all(
      props.ticketIds.map((ticketId) =>
        apiTransferTicket.mutateAsync({ ticketId, note: values.note }),
      ),
    )
    const countIds = transferIds.length
    const ticketText = countIds > 1 ? "tickets" : "ticket"
    const shareLink = `${window.location.origin}/me/tickets?redeemCode=${transferIds.join(",")}`

    const formData = {
      email: values.email,
      subject: `You have received ${countIds} ${ticketText} on Luttaka for ${eventName}`,
      message: `You can redeem the ${ticketText} for ${eventName} ${props.sender ? `that ${props.sender} has sent you ` : ""}by visiting the following link:<br> ${shareLink}<br><br>Regards,<br>Luttaka Team<br><br>P.S. Luttaka is an event experience app powered by Flowcore. Contact Pal Joensen at pal@flowcore.com or +298 272030 if you are curious about using Luttaka for your own event.`,
    }

    await fetch("/api/sendgrid", {
      method: "POST",
      body: JSON.stringify(formData),
    })
      .then((res) => res.json() as Promise<ResponseData>)
      .then(() => {
        toast.success("Email sent")
      })

    setLoading(false)
    setOpened(false)
    form.setValue("email", "")
    form.setValue("note", "")
    setNoteIsTouched(false)
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
      <DialogTrigger asChild>{props.children}</DialogTrigger>
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
                        onChange={(e) => {
                          field.onChange(e)
                          if (!noteIsTouched) {
                            form.setValue("note", e.target.value)
                          }
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      The email to share the tickets with
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="note"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Transfer Note</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="a note on the ticket transfer"
                        {...field}
                        autoComplete={"off"}
                        data-1p-ignore
                        onChange={(e) => {
                          field.onChange(e)
                          setNoteIsTouched(true)
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      This note is ideal for keeping track of who the ticket is
                      for
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
