import { zodResolver } from "@hookform/resolvers/zod"
import copy from "copy-to-clipboard"
import { Clipboard, SendHorizontal } from "lucide-react"
import { type ReactNode, useState } from "react"
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
import doMailto from "@/lib/do-mailto"
import { api } from "@/trpc/react"

export interface TransferTicketsDialogProps {
  children: ReactNode
  ticketIds: string[]
  onDone: () => void
}

export default function TransferTicketsDialog(
  props: TransferTicketsDialogProps,
) {
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

    doMailto(
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
