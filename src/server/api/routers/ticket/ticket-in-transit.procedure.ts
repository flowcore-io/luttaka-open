import { protectedProcedure } from "@/server/api/trpc"
import { api } from "@/trpc/server"

import { type TicketDetails } from "./ticket-list.procedure"

export const ticketsInTransit = protectedProcedure.query<TicketDetails[]>(
  async (): Promise<TicketDetails[]> => {
    // todo: make it its own query, to seperate non-transits from transits
    const result = await api.ticket.list.query()
    return result.filter(
      (ticket) => ticket.state === "open" && !!ticket.transferId,
    )
  },
)
