import { archiveTicketRouter } from "@/server/api/routers/ticket/ticket-archive"
import { checkInTicketRouter } from "@/server/api/routers/ticket/ticket-check-in"
import { createTicketRouter } from "@/server/api/routers/ticket/ticket-create"
import { getTicketsRouter } from "@/server/api/routers/ticket/ticket-list"
import { getTicketRouter } from "@/server/api/routers/ticket/ticket-get"
import { acceptTicketTransferRouter } from "@/server/api/routers/ticket/ticket-transfer-accept"
import { cancelTicketTransferRouter } from "@/server/api/routers/ticket/ticket-transfer-cancel"
import { createTicketTransferRouter } from "@/server/api/routers/ticket/ticket-transfer-create"
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
