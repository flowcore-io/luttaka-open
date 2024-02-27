import {
  sendTicketArchivedEvent,
  sendTicketCreatedEvent,
  sendTicketTransferCancelledEvent,
  sendTicketTransferCreatedEvent,
  sendTicketTransferAcceptedEvent,
  sendTicketUpdatedEvent,
} from "@/contracts/events/ticket"
import { db } from "@/database"
import { tickets, ticketTransfers } from "@/database/schemas"
import waitForPredicate from "@/lib/wait-for-predicate"
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc"
import { and, eq } from "drizzle-orm"
import shortUuid from "short-uuid"
import { z } from "zod"

const GetTicketInput = z.object({
  ticketId: z.string(),
})

const GetTicketListInput = z.object({
  conferenceId: z.string(),
})

const CreateTicketInput = z.object({
  conferenceId: z.string(),
})

const CheckInTicketInput = z.object({
  ticketId: z.string(),
})

const ArchiveTicketInput = z.object({
  id: z.string(),
})

const CreateTicketTransferInput = z.object({
  ticketId: z.string(),
})

const AcceptTicketTransferInput = z.object({
  transferId: z.string(),
})

// TODO: Split into separate files

export const ticketRouter = createTRPCRouter({
  get: protectedProcedure.input(GetTicketInput).query(({ input }) => {
    return db.query.tickets.findFirst({
      where: and(eq(tickets.id, input.ticketId)),
    })
  }),
  list: protectedProcedure.input(GetTicketListInput).query(({ ctx, input }) => {
    const userId = ctx.user.id
    return db
      .select({
        id: tickets.id,
        userId: tickets.userId,
        conferenceId: tickets.conferenceId,
        state: tickets.state,
        transferId: ticketTransfers.id,
      })
      .from(tickets)
      .leftJoin(
        ticketTransfers,
        and(
          eq(tickets.id, ticketTransfers.ticketId),
          eq(ticketTransfers.state, "open"),
        ),
      )
      .where(
        and(
          eq(tickets.userId, userId),
          eq(tickets.conferenceId, input.conferenceId),
        ),
      )
      .execute()
  }),
  create: protectedProcedure
    .input(CreateTicketInput)
    .mutation(async ({ ctx, input }) => {
      // TODO: Check if user is allowed to create ticket
      const userId = ctx.user.id
      const id = shortUuid.generate()
      await sendTicketCreatedEvent({
        id,
        userId,
        conferenceId: input.conferenceId,
        state: "open",
      })
      try {
        await waitForPredicate(
          () => db.query.tickets.findFirst({ where: eq(tickets.id, id) }),
          (result) => !!result,
        )
      } catch (error) {
        await sendTicketArchivedEvent({ id, _reason: "rollback" })
        throw new Error("Failed to create ticket")
      }
      return id
    }),
  checkIn: protectedProcedure
    .input(CheckInTicketInput)
    .mutation(async ({ input }) => {
      await sendTicketUpdatedEvent({ id: input.ticketId, state: "checked-in" })
      try {
        await waitForPredicate(
          () =>
            db.query.tickets.findFirst({
              where: eq(tickets.id, input.ticketId),
            }),
          (result) => result?.state === "checked-in",
        )
      } catch (error) {
        await sendTicketUpdatedEvent({ id: input.ticketId, state: "open" })
        throw new Error("Failed to check in ticket")
      }
    }),
  archive: protectedProcedure
    .input(ArchiveTicketInput)
    .mutation(async ({ input }) => {
      // TODO: Check if user is allowed to archive ticket
      await sendTicketArchivedEvent({ id: input.id })
      try {
        await waitForPredicate(
          () => db.query.tickets.findFirst({ where: eq(tickets.id, input.id) }),
          (result) => !result,
        )
        return true
      } catch (error) {
        return false
      }
    }),

  createTransfer: protectedProcedure
    .input(CreateTicketTransferInput)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id
      const ticket = await db.query.tickets.findFirst({
        where: and(eq(tickets.id, input.ticketId), eq(tickets.userId, userId)),
      })
      if (!ticket) {
        throw new Error("Ticket not found")
      } else if (ticket.state !== "open") {
        throw new Error("Ticket not eligible for transfer")
      }
      const id: string = shortUuid.generate()
      await sendTicketTransferCreatedEvent({ id, state: "open", ...input })
      try {
        await waitForPredicate(
          () =>
            db.query.ticketTransfers.findFirst({
              where: eq(ticketTransfers.id, id),
            }),
          (result) => !!result,
        )
      } catch (error) {
        await sendTicketTransferCancelledEvent({
          transferId: id,
          _reason: "rollback",
        })
        throw new Error("Ticket transfer creation failed")
      }
      return id
    }),
  acceptTransfer: protectedProcedure
    .input(AcceptTicketTransferInput)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id
      const ticketTransfer = await db.query.ticketTransfers.findFirst({
        where: and(
          eq(ticketTransfers.id, input.transferId),
          eq(ticketTransfers.state, "open"),
        ),
      })
      if (!ticketTransfer) {
        throw new Error("Invalid redeem code")
      }
      const ticket = await db.query.tickets.findFirst({
        where: and(
          eq(tickets.id, ticketTransfer.ticketId),
          eq(tickets.state, "open"),
        ),
      })
      if (!ticket) {
        throw new Error("Ticket not found")
      }
      try {
        await sendTicketUpdatedEvent({ id: ticket.id, userId })
        await sendTicketTransferAcceptedEvent({ transferId: input.transferId })
        await waitForPredicate(
          () =>
            db.query.ticketTransfers.findFirst({
              where: eq(ticketTransfers.id, input.transferId),
            }),
          (result) => result?.state === "accepted",
        )
      } catch (error) {
        console.log(error)
        return false
      }
      return true
    }),
})
