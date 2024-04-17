import {
  faArchive,
  faPencil,
  faStickyNote,
  faTicket,
  faUser,
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Loader } from "lucide-react"
import { useCallback, useState } from "react"
import { toast } from "sonner"

import { EditTicketDialog } from "@/app/admin/tickets/edit-ticket.dialog"
import ConfirmDialog from "@/components/molecules/dialogs/confirm.dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { api } from "@/trpc/react"

export interface TicketProps {
  ticket: {
    id: string
    userId: string
    eventId: string
    state: string
    transferId: string
    note: string
  }
  refetch: () => Promise<void>
  selected: boolean
  onSelected: (value: boolean) => void
}

export function Ticket({ ticket, refetch, selected, onSelected }: TicketProps) {
  const [loading, setLoading] = useState(false)

  const user = api.profile.getByUserId.useQuery({ userId: ticket.userId })

  const apiArchiveTicket = api.ticket.archive.useMutation()
  const archiveTicket = useCallback(async () => {
    setLoading(true)
    const success = await apiArchiveTicket.mutateAsync({
      id: ticket.id,
    })
    if (success) {
      await refetch()
      toast.success("Ticket deleted")
    } else {
      toast.error("Delete ticket failed")
    }
    setLoading(false)
  }, [ticket.id])

  return (
    <>
      <div
        onClick={() => onSelected(!selected)}
        key={ticket.id}
        className={cn(
          "relative mb-2 flex cursor-pointer flex-wrap items-center gap-1 rounded-lg border p-4 shadow transition hover:scale-101 hover:shadow-lg sm:gap-4",
          selected ? "bg-accent" : "",
        )}>
        <div
          className={
            "absolute right-1.5 top-1.5 sm:relative sm:right-0 sm:top-0"
          }>
          <Avatar>
            <AvatarImage
              src={user.data?.avatarUrl}
              alt={user.data?.displayName}
            />
            <AvatarFallback>{user.data?.initials}</AvatarFallback>
          </Avatar>
        </div>

        {/* Ticket Description */}
        <div className={"flex flex-grow flex-col"}>
          {user.isLoading ? (
            <Loader className={"animate-spin"} />
          ) : !!user.data?.displayName ? (
            <p className={"font-bold"}>{user.data.emails}</p>
          ) : (
            <p className={"text-muted"}>No Display Name</p>
          )}

          <span className={"flex items-center space-x-1 text-muted"}>
            <FontAwesomeIcon icon={faStickyNote} />
            <p className={"font-light italic"}>{ticket.note || "no notes"}</p>
          </span>

          {user.isLoading ? (
            <Loader className={"animate-spin"} />
          ) : (
            <span className={"flex items-center space-x-1 text-muted"}>
              <FontAwesomeIcon icon={faUser} />
              <p>user:</p>
              <p className={"font-light italic"}>{ticket.userId}</p>
            </span>
          )}
          <span className={"flex items-center space-x-1 text-muted"}>
            <FontAwesomeIcon icon={faTicket} />
            <p>ticket:</p>
            <p className={"font-light italic"}>{ticket.id}</p>
          </span>
          <div>
            <Badge variant={getVariantBasedOnState(ticket.state)}>
              {ticket.state}
            </Badge>
          </div>
        </div>

        {/* Ticket Controls */}
        <div className={"flex flex-grow justify-end space-x-2"}>
          <EditTicketDialog
            eventId={ticket.eventId}
            ticketId={ticket.id}
            note={ticket.note}
            onComplete={refetch}>
            <Button
              asChild
              size={"sm"}
              disabled={loading}
              variant={"secondary"}>
              {loading ? (
                <Loader className={"animate-spin"} />
              ) : (
                <span className={"flex items-center gap-2"}>
                  <p>Edit</p>
                  <FontAwesomeIcon icon={faPencil} />
                </span>
              )}
            </Button>
          </EditTicketDialog>
          <ConfirmDialog
            title={"Are you sure you want to archive the ticket"}
            description={"Doing so will remove the ticket for the user"}
            onConfirm={archiveTicket}>
            <Button
              asChild
              variant={"destructive"}
              size={"sm"}
              disabled={loading}>
              {loading ? (
                <Loader className={"animate-spin"} />
              ) : (
                // todo: incorporate the icon into the button (or create an icon text component)
                <span className={"flex items-center gap-2"}>
                  <p>Archive</p>
                  <FontAwesomeIcon icon={faArchive} />
                </span>
              )}
            </Button>
          </ConfirmDialog>
        </div>
      </div>
    </>
  )
}

const getVariantBasedOnState = (status: string) => {
  switch (status) {
    case "checked-in":
      return "default"
    case "open":
      return "outline"
    default:
      return undefined
  }
}
