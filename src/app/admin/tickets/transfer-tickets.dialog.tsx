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
import {
  TransferTicketsInputDto,
  TransferTicketsInput,
} from "@/contracts/ticket/ticket"
import { api } from "@/trpc/react"
import { SelectOwnerField } from "../companies/select-owner-field"

export type EditTicketDialogProps = {
  ticketIds: string[]
  onComplete: () => void
}

export const TransferTicketsDialog: FC<
  PropsWithChildren<EditTicketDialogProps>
> = (props) => {
  const form = useForm<TransferTicketsInput>({
    resolver: zodResolver(TransferTicketsInputDto),
    defaultValues: {
      ticketIds: props.ticketIds,
      userId: "",
    },
  })

  const [open, setOpen] = useState(false)

  const transferRequest = api.ticket.createTransferBundle.useMutation({
    onSuccess: () => {
      setOpen(false)
      form.reset()
      props.onComplete()
    },
  })

  const onSubmit = useCallback(
    (result: TransferTicketsInput) => {
      transferRequest.mutate(result)
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
              name={"userId"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ticket Note</FormLabel>
                  <FormControl>
                    <div>
                      <SelectOwnerField
                        value={field.value!}
                        setValue={field.onChange}
                        label={""}
                        submit={() => onSubmit(form.getValues())}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className={"flex justify-end"}>
              <Button type={"submit"} disabled={transferRequest.isLoading}>
                {transferRequest.isLoading && (
                  <Loader className={"animate-spin"} />
                )}
                Transfer
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
