import { faTicket } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { type FC } from "react"

import { SkeletonList } from "@/components/molecules/skeletons/skeleton-list"
import { Card, CardContent } from "@/components/ui/card"
import { MissingText } from "@/components/ui/messages/missing-text"
import { cn } from "@/lib/utils"
import { api } from "@/trpc/react"

export const TransferredTickets: FC = () => {
  const { data: tickets, isLoading } = api.ticket.transferredTickets.useQuery()

  if (isLoading) {
    // todo make a new skeleton loader for this
    return <SkeletonList count={5} />
  }

  return (
    <div>
      {tickets?.length ? (
        tickets.map((ticket) => (
          <div>
            <Card className={cn("shadowsm:gap-4 mb-4")}>
              <CardContent className="h-min-28 group p-4">
                <div className="flex items-center  space-x-4">
                  <FontAwesomeIcon icon={faTicket} />
                  <div>
                    {/* todo: add the abiliy to navigate to the event with click */}
                    <p>Event: {ticket.event}</p>
                    <p>{ticket.ticketNote}</p>
                  </div>
                </div>
                <div className="mt-3 border-t-2 border-dashed pt-3">
                  <p className="font-light italic">Recipients:</p>
                  {ticket.recipients.length > 1 ? (
                    <ul className="space-y-4">
                      {ticket.recipients.map((recipient) => (
                        <li key={recipient.timestamp}>
                          <div className="flex justify-between">
                            <div>
                              <p>{recipient.email}</p>
                              <p className="text-sm font-light">
                                {recipient.firstName} {recipient.lastName}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-light">
                                {new Date(recipient.timestamp).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <MissingText text="No recipients" />
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        ))
      ) : (
        <MissingText text="No one has accepted any tickets from you" />
      )}
    </div>
  )
}
