import { archiveTicketRouter } from "@/server/api/routers/ticket/ticket-archive.procedure"
import { checkInTicketRouter } from "@/server/api/routers/ticket/ticket-check-in.procedure"
import { createTicketRouter } from "@/server/api/routers/ticket/ticket-create.procedure"
import { getTicketRouter } from "@/server/api/routers/ticket/ticket-get.procedure"
import { getTicketsRouter } from "@/server/api/routers/ticket/ticket-list.procedure"
import { acceptTicketTransferRouter } from "@/server/api/routers/ticket/ticket-transfer-accept.procedure"
import { cancelTicketTransferRouter } from "@/server/api/routers/ticket/ticket-transfer-cancel.procedure"
import { createTicketTransferRouter } from "@/server/api/routers/ticket/ticket-transfer-create.procedure"
import { createTRPCRouter } from "@/server/api/trpc"

export default createTRPCRouter({
  get: getTicketRouter,
  list: getTicketsRouter,
  create: createTicketRouter,
  checkIn: checkInTicketRouter,
  archive: archiveTicketRouter,
  createTransfer: createTicketTransferRouter,
  cancelTransfer: cancelTicketTransferRouter,
  acceptTransfer: acceptTicketTransferRouter,
})
