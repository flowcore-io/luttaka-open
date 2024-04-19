import { archiveTicketProcedure } from "@/server/api/routers/ticket/ticket-archive.procedure"
import { checkInTicketProcedure } from "@/server/api/routers/ticket/ticket-check-in.procedure"
import { createTicketProcedure } from "@/server/api/routers/ticket/ticket-create.procedure"
import { getTicketProcedure } from "@/server/api/routers/ticket/ticket-get.procedure"
import { ticketHistoryProcedure } from "@/server/api/routers/ticket/ticket-history.procedure"
import { getTicketsProcedure } from "@/server/api/routers/ticket/ticket-list.procedure"
import { listForEventProcedure } from "@/server/api/routers/ticket/ticket-list-for-event.procedure"
import { acceptTicketTransferProcedure } from "@/server/api/routers/ticket/ticket-transfer-accept.procedure"
import { cancelTicketTransferProcedure } from "@/server/api/routers/ticket/ticket-transfer-cancel.procedure"
import { createTicketTransferProcedure } from "@/server/api/routers/ticket/ticket-transfer-create.procedure"
import { updateTicketProcedure } from "@/server/api/routers/ticket/ticket-update.procedure"
import { createTRPCRouter } from "@/server/api/trpc"

import { ticketsInTransitProcedure } from "./ticket-in-transit.procedure"
import { createTicketTransferBundleProcedure } from "./ticket-transfer-create-bundle.procedure"
import { ticketsTransferredProcedure } from "./ticket-transferred.procedure"

export const ticketRouter = createTRPCRouter({
  get: getTicketProcedure,
  ticketHistory: ticketHistoryProcedure,
  list: getTicketsProcedure,
  inTransit: ticketsInTransitProcedure,
  transferredTickets: ticketsTransferredProcedure,
  listForEvent: listForEventProcedure,
  create: createTicketProcedure,
  update: updateTicketProcedure,
  checkIn: checkInTicketProcedure,
  archive: archiveTicketProcedure,
  createTransfer: createTicketTransferProcedure,
  createTransferBundle: createTicketTransferBundleProcedure,
  cancelTransfer: cancelTicketTransferProcedure,
  acceptTransfer: acceptTicketTransferProcedure,
})
