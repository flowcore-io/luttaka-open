import React from "react"
import useLocalStorage from "@/hooks/use-local-storage"

interface ConferenceContextType {
  conferenceId: string | null
  setConferenceId: (id: string) => void
}

export const ConferenceContext = React.createContext<ConferenceContextType>({
  conferenceId: null,
  setConferenceId: () => {},
})

export const ConferenceProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [conferenceId, setConferenceId] = useLocalStorage<string | null>(
    "luttaka.conferenceId",
    null,
  )

  return (
    <ConferenceContext.Provider value={{ conferenceId, setConferenceId }}>
      {children}
    </ConferenceContext.Provider>
  )
}
