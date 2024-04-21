import ticketArchived from "@/app/api/transform/ticket.0/route-ticket-archived"
import ticketCreated from "@/app/api/transform/ticket.0/route-ticket-created"
import ticketTransferAccepted from "@/app/api/transform/ticket.0/route-ticket-transfer-accepted"
import ticketTransferCancelled from "@/app/api/transform/ticket.0/route-ticket-transfer-cancelled"
import ticketTransferCreated from "@/app/api/transform/ticket.0/route-ticket-transfer-created"
import ticketUpdated from "@/app/api/transform/ticket.0/route-ticket-updated"
import { ticket } from "@/contracts/events/ticket"
import EventTransformer from "@/lib/event-transformer"

import ticketOwnerChanged from "./route-ticket-owner-changed"

const eventTransformer = new EventTransformer(ticket, {
  created: [ticketCreated, ticketOwnerChanged],
  updated: [ticketUpdated, ticketOwnerChanged],
  archived: ticketArchived,
  transferCreated: ticketTransferCreated,
  transferAccepted: ticketTransferAccepted,
  transferCancelled: ticketTransferCancelled,
})

export const POST = eventTransformer.post.bind(eventTransformer)
