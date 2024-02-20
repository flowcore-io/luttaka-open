"use client"

import { Button } from "@/components/ui/button"
import { createTicket, getTicketsByUserId } from "@/services/ticket.service"
import { useAuth } from "@clerk/nextjs"
import { useEffect, useState } from "react"

const conferenceId = "67db25b2-0b76-4ab2-9c20-f73b16a5bb18"

export default function Tickets() {
  const { isLoaded, userId } = useAuth()
  const [tickets, setTickets] = useState<{ id: string }[]>([])
  useEffect(() => {
    if (!userId) return
    getTicketsByUserId(userId)
      .then((tickets) => {
        setTickets(tickets)
      })
      .catch((error) => console.error(error))
  }, [userId])

  if (!isLoaded || !userId) return null

  return (
    <main className="mx-auto w-full">
      <div className="text-center text-slate-400">
        <Button
          onClick={async () => {
            await createTicket({
              userId,
              conferenceId,
              state: "open",
            })
          }}>
          Create ticket
        </Button>
      </div>
      {tickets.map((ticket) => (
        <div key={ticket.id} className="text-center text-slate-400">
          {ticket.id}
        </div>
      ))}
    </main>
  )
}
