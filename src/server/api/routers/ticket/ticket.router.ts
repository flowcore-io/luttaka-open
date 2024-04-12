import { archiveTicketProcedure } from "@/server/api/routers/ticket/ticket-archive.procedure"
import { checkInTicketProcedure } from "@/server/api/routers/ticket/ticket-check-in.procedure"
import { createTicketProcedure } from "@/server/api/routers/ticket/ticket-create.procedure"
import { getTicketProcedure } from "@/server/api/routers/ticket/ticket-get.procedure"
import { getTicketsProcedure } from "@/server/api/routers/ticket/ticket-list.procedure"
import { acceptTicketTransferProcedure } from "@/server/api/routers/ticket/ticket-transfer-accept.procedure"
import { cancelTicketTransferProcedure } from "@/server/api/routers/ticket/ticket-transfer-cancel.procedure"
import { createTicketTransferProcedure } from "@/server/api/routers/ticket/ticket-transfer-create.procedure"
import { createTRPCRouter } from "@/server/api/trpc"

export const ticketRouter = createTRPCRouter({
  get: getTicketProcedure,
  list: getTicketsProcedure,
  create: createTicketProcedure,
  checkIn: checkInTicketProcedure,
  archive: archiveTicketProcedure,
  createTransfer: createTicketTransferProcedure,
  cancelTransfer: cancelTicketTransferProcedure,
  acceptTransfer: acceptTicketTransferProcedure,
})
