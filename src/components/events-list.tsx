import { type inferRouterOutputs } from "@trpc/server"
import dayjs from "dayjs"
import { useContext } from "react"

import { Button } from "@/components/ui/button"
import { EventContext } from "@/context/event-context"
import { type appRouter } from "@/server/api/root"

type RouterOutput = inferRouterOutputs<typeof appRouter>

interface EventsListProps {
  events: RouterOutput["event"]["list"]
}
export function EventsList({ events }: EventsListProps) {
  if (events.length === 0) {
    return <div>No events found</div>
  }
  return events
    .sort((a, b) => {
      return dayjs(a.startDate).isBefore(dayjs(b.startDate)) ? -1 : 1
    })
    .map((event) => {
      const { eventId, setEventId, setEventName } = useContext(EventContext)
      return (
        <div
          key={event.id}
          className={`mb-6 p-2 ${event.id === eventId ? "bg-slate-200" : ""}`}>
          {event.id !== eventId && (
            <Button
              onClick={() => {
                setEventId(event.id)
                setEventName(event.name)
              }}>
              {event.name}
            </Button>
          )}
          <div className="mb-2">{event.description}</div>
          <div className="mb-2 text-sm italic">
            {dayjs(event.startDate).format("MMMM D, YYYY")}
            {" - "}
            {dayjs(event.endDate).format("MMMM D, YYYY")}
          </div>
        </div>
      )
    })
}
