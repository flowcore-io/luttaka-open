import { webhookFactory } from "@/lib/webhook"
import { z } from "zod"

export const ticket = {
  flowType: "ticket.0",
  eventType: {
    created: "ticket.created.0",
    updated: "ticket.updated.0",
    archived: "ticket.archived.0",
    transferCreated: "ticket.transfer-created.0",
    transferAccepted: "ticket.transfer-accepted.0",
    transferCancelled: "ticket.transfer-cancelled.0",
  },
} as const

export const TicketEventCreatedPayload = z.object({
  id: z.string(),
  conferenceId: z.string(),
  userId: z.string(),
  state: z.string(),
})

export const TicketEventUpdatedPayload = z.object({
  id: z.string(),
  conferenceId: z.string().optional(),
  userId: z.string().optional(),
  state: z.string().optional(),
})

export const TicketEventArchivedPayload = z.object({
  id: z.string(),
  _reason: z.string().optional(),
})

export const TicketEventTransferCreatedPayload = z.object({
  id: z.string(),
  ticketId: z.string(),
  state: z.string(),
})

export const TicketEventTransferAcceptedPayload = z.object({
  id: z.string(),
  userId: z.string(),
})

export const TicketEventTransferCancelledPayload = z.object({
  id: z.string(),
  _reason: z.string().optional(),
})

export const sendTicketCreatedEvent = webhookFactory<
  z.infer<typeof TicketEventCreatedPayload>
>(ticket.flowType, ticket.eventType.created)

export const sendTicketUpdatedEvent = webhookFactory<
  z.infer<typeof TicketEventUpdatedPayload>
>(ticket.flowType, ticket.eventType.updated)

export const sendTicketArchivedEvent = webhookFactory<
  z.infer<typeof TicketEventArchivedPayload>
>(ticket.flowType, ticket.eventType.archived)

export const sendTicketTransferCreatedEvent = webhookFactory<
  z.infer<typeof TicketEventTransferCreatedPayload>
>(ticket.flowType, ticket.eventType.transferCreated)

export const sendTicketTransferAcceptedEvent = webhookFactory<
  z.infer<typeof TicketEventTransferAcceptedPayload>
>(ticket.flowType, ticket.eventType.transferAccepted)

export const sendTicketTransferCancelledEvent = webhookFactory<
  z.infer<typeof TicketEventTransferCancelledPayload>
>(ticket.flowType, ticket.eventType.transferCancelled)
