import { zodResolver } from "@hookform/resolvers/zod"
import { Loader } from "lucide-react"
import { type FC, type PropsWithChildren, useCallback, useState } from "react"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  type UpdateTicketInput,
  UpdateTicketInputDto,
} from "@/contracts/ticket/ticket"
import { api } from "@/trpc/react"

export type EditTicketDialogProps = {
  eventId: string
  ticketId: string
  note: string

  onComplete: () => void
}

export const EditTicketDialog: FC<PropsWithChildren<EditTicketDialogProps>> = (
  props,
) => {
  const form = useForm<UpdateTicketInput>({
    resolver: zodResolver(UpdateTicketInputDto),
    defaultValues: {
      note: props.note,
      id: props.ticketId,
      eventId: props.eventId,
    },
  })

  const [open, setOpen] = useState(false)
  const updateTicket = api.ticket.update.useMutation({
    onSuccess: () => {
      setOpen(false)
      form.reset()
      props.onComplete()
    },
  })

  const onSubmit = useCallback(
    (result: UpdateTicketInput) => {
      updateTicket.mutate(result)
    },
    [props],
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>{props.children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>Update Ticket</DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className={"space-y-3"}>
            <FormField
              control={form.control}
              name={"note"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ticket Note</FormLabel>
                  <FormControl>
                    <Input placeholder={"note for this ticket"} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className={"flex justify-end"}>
              <Button type={"submit"} disabled={updateTicket.isLoading}>
                {updateTicket.isLoading && (
                  <Loader className={"animate-spin"} />
                )}
                Update Ticket
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
