import { type FC, type PropsWithChildren, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog"
import { api } from "@/trpc/react"
import { DialogDescription } from "@radix-ui/react-dialog"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { SkeletonList } from "@/components/molecules/skeletons/skeleton-list"

export type TicketHistoryDialogProps = {
  ticketId: string
  userId?: string
}

export const TicketHistoryDialog: FC<
  PropsWithChildren<TicketHistoryDialogProps>
> = (props) => {
  const [open, setOpen] = useState(false)

  const history = api.ticket.ticketHistory.useQuery(
    {
      ticketId: props.ticketId,
      userId: props.userId,
    },
    {
      enabled: open,
    },
  )

  return (
    <Dialog onOpenChange={setOpen}>
      <DialogTrigger>{props.children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>Ticket History</DialogHeader>
        <DialogDescription>
          An overview of how many people have owned this ticket
        </DialogDescription>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">User</TableHead>
              <TableHead className="text-right">Timestamp</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!history.data ? (
              <SkeletonList count={2} />
            ) : (
              history.data.map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell>{ticket.owner}</TableCell>
                  <TableCell className="text-right">
                    {new Date(ticket.timestamp).toUTCString()}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell>Total</TableCell>
              <TableCell>{history.data?.length ?? 0}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </DialogContent>
    </Dialog>
  )
}
