"use client"

import { Button } from "@/components/ui/button"
import { api } from "@/trpc/react"
import { useAuth } from "@clerk/nextjs"
import { useCallback } from "react"

const conferenceId = "67db25b2-0b76-4ab2-9c20-f73b16a5bb18"

export default function Tickets() {
  const { isLoaded, userId } = useAuth()

  const { data: tickets, refetch } = api.ticket.list.useQuery(
    { userId: userId! },
    { enabled: !!userId },
  )

  const apiCreateTicket = api.ticket.create.useMutation()
  const createTicket = useCallback(async () => {
    if (!userId) {
      return
    }
    await apiCreateTicket.mutateAsync({ userId, conferenceId, state: "open" })
    await refetch()
  }, [userId])

  if (!isLoaded || !userId) return null

  return (
    <main className="mx-auto w-full">
      <div className="text-center text-slate-400">
        <Button onClick={() => createTicket()}>Create ticket</Button>
        <Button onClick={() => refetch()}>Load tickets</Button>
      </div>
      {tickets?.map((ticket) => (
        <div key={ticket.id} className="text-center text-slate-400">
          {ticket.id}
        </div>
      ))}
    </main>
  )
}
