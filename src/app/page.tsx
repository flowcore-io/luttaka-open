"use client"

import { useAuth } from "@clerk/nextjs"
import { useContext } from "react"

import { Skeleton } from "@/components/ui/skeleton"
import { EventContext } from "@/context/event-context"
import { api } from "@/trpc/react"

import HomeAvailableEvents from "./home-available-events"
import HomeSelectedEvent from "./home-selected-event"

export default function Home() {
  const { isLoaded, userId } = useAuth()
  const { eventId } = useContext(EventContext)
  if (!isLoaded || !userId) {
    // Show the public page
    return (
      <div className="mx-auto w-full p-4 md:p-6">
        <div className="text-center text-slate-400">
          Welcome to Luttaka!
        </div>
      </div>
    )
  }
  const { data: events, isLoading } = api.event.list.useQuery()
  if (events === undefined) return <Skeleton />
  const event = events?.find((c) => c.id === eventId)
  if (!event || (eventId === null && events && events.length > 0)) {
    return <HomeAvailableEvents events={events} isLoading={isLoading} />
  }
  return <HomeSelectedEvent event={event} />
}
