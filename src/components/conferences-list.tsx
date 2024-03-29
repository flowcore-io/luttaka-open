import dayjs from "dayjs"
import { useContext } from "react"

import { Button } from "@/components/ui/button"
import { ConferenceContext } from "@/context/conference-context"
import { type ConferenceProfile } from "@/contracts/conference/conference"

interface ConferencesListProps {
  conferences: ConferenceProfile[]
}
export function ConferencesList({ conferences }: ConferencesListProps) {
  return conferences
    .sort((a, b) => {
      return dayjs(a.startDate).isBefore(dayjs(b.startDate)) ? -1 : 1
    })
    .map((conference) => (
      <Conference conference={conference} key={conference.id} />
    ))
}
interface ConferenceProps {
  conference: ConferenceProfile
}
function Conference({ conference }: ConferenceProps) {
  const { conferenceId, setConferenceId, setConferenceName } =
    useContext(ConferenceContext)
  return (
    <div
      key={conference.id}
      className={`mb-6 p-2 ${conference.id === conferenceId ? "bg-slate-200" : ""}`}>
      {conference.id !== conferenceId && (
        <Button
          onClick={() => {
            setConferenceId(conference.id)
            setConferenceName(conference.name)
          }}>
          {conference.name}
        </Button>
      )}
      <div className="mb-2">{conference.description}</div>
      <div className="mb-2 text-sm italic">
        {dayjs(conference.startDate).format("MMMM D, YYYY")}
        {" - "}
        {dayjs(conference.endDate).format("MMMM D, YYYY")}
      </div>
    </div>
  )
}
