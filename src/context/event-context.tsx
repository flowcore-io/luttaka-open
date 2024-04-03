import React, { useEffect } from "react"

import useLocalStorage from "@/hooks/use-local-storage"
import { api } from "@/trpc/react"

interface EventContextType {
  eventId: string | null
  eventName: string | null
  eventStartDate: string | null
  setEventId: (id: string) => void
  setEventName: (name: string) => void
  setEventStartDate: (startDate: string) => void
}

export const EventContext = React.createContext<EventContextType>({
  eventId: null,
  eventName: null,
  eventStartDate: null,
  setEventId: () => {
    throw new Error("setEventId function must be overridden")
  },
  setEventName: () => {
    throw new Error("setEventName function must be overridden")
  },
  setEventStartDate: () => {
    throw new Error("setEventStartDate function must be overridden")
  },
})

export const EventProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [eventId, setEventId] = useLocalStorage<string | null>(
    "luttaka.eventId",
    null,
  )
  const [eventName, setEventName] = React.useState<string | null>(null)
  const [eventStartDate, setEventStartDate] = React.useState<string | null>(
    null,
  )
  const { data: events } = api.event.list.useQuery()

  useEffect(() => {
    if (events && eventId) {
      const event = events.find((c) => c.id === eventId)
      if (event) {
        setEventName(event.name)
        setEventStartDate(event.startDate)
      }
    }
  }, [events, eventId])
  return (
    <EventContext.Provider
      value={{
        eventId,
        eventName,
        eventStartDate,
        setEventId,
        setEventName,
        setEventStartDate,
      }}>
      {children}
    </EventContext.Provider>
  )
}
