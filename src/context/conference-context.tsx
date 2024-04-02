import React, { useEffect } from "react"

import useLocalStorage from "@/hooks/use-local-storage"
import { api } from "@/trpc/react"

interface ConferenceContextType {
  conferenceId: string | null
  conferenceName: string | null
  conferenceStartDate: string | null
  setConferenceId: (id: string) => void
  setConferenceName: (name: string) => void
  setConferenceStartDate: (startDate: string) => void
}

export const ConferenceContext = React.createContext<ConferenceContextType>({
  conferenceId: null,
  conferenceName: null,
  conferenceStartDate: null,
  setConferenceId: () => {
    throw new Error("setConferenceId function must be overridden")
  },
  setConferenceName: () => {
    throw new Error("setConferenceName function must be overridden")
  },
  setConferenceStartDate: () => {
    throw new Error("setConferenceStartDate function must be overridden")
  },
})

export const ConferenceProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [conferenceId, setConferenceId] = useLocalStorage<string | null>(
    "luttaka.conferenceId",
    null,
  )
  const [conferenceName, setConferenceName] = React.useState<string | null>(
    null,
  )
  const [conferenceStartDate, setConferenceStartDate] = React.useState<
    string | null
  >(null)
  const { data: conferences } = api.conference.list.useQuery()

  useEffect(() => {
    if (conferences && conferenceId) {
      const conference = conferences.find((c) => c.id === conferenceId)
      if (conference) {
        setConferenceName(conference.name)
        setConferenceStartDate(conference.startDate)
      }
    }
  }, [conferences, conferenceId])
  return (
    <ConferenceContext.Provider
      value={{
        conferenceId,
        conferenceName,
        conferenceStartDate,
        setConferenceId,
        setConferenceName,
        setConferenceStartDate,
      }}>
      {children}
    </ConferenceContext.Provider>
  )
}
