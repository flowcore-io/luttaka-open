"use client"

import { useContext } from "react"

import { Skeleton } from "@/components/ui/skeleton"
import { EventContext } from "@/context/event-context"
import { api } from "@/trpc/react"

import HomeAvailableEvents from "./home-available-events"
import HomeSelectedEvent from "./home-selected-event"

export default function HomeProtectedPage() {
  const { eventId } = useContext(EventContext)
  const { data: events, isLoading } = api.event.list.useQuery()
  if (events === undefined) return <Skeleton />
  const event = events?.find((c) => c.id === eventId)
  if (!event || (eventId === null && events && events.length > 0)) {
    return <HomeAvailableEvents events={events} isLoading={isLoading} />
  }
  return <HomeSelectedEvent event={event} />
}
