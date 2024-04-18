import { z } from "zod"
import { api } from "@/trpc/server"
import { protectedProcedure } from "@/server/api/trpc"

const CreateTicketTransferInput = z.object({
  ticketIds: z.array(z.string()),
  userId: z.string().optional(),
})

export type TicketTransferCreationResult = {
  error: string | undefined
  transferId: string | undefined
}

export const createTicketTransferBundleProcedure = protectedProcedure
  .input(CreateTicketTransferInput)
  .mutation(async ({ input }): Promise<TicketTransferCreationResult[]> => {
    const results = await Promise.allSettled(
      input.ticketIds.map((ticketId) =>
        api.ticket.createTransfer.mutate({
          userId: input.userId,
          ticketId,
        }),
      ),
    )

    return results.map((result): TicketTransferCreationResult => {
      if (result.status === "fulfilled") {
        return { transferId: result.value, error: undefined }
      }

      return { error: result.reason as string, transferId: undefined }
    })
  })
