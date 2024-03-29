"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { api } from "@/trpc/react"
import { useContext } from "react"
import { ConferenceContext } from "@/context/conference-context"
import { useAuth } from "@clerk/nextjs"
import HomeSelectedConference from "./home-selected-conference"
import HomeAvailableConferences from "./home-available-conferences"

export default function Home() {
  const { isLoaded, userId } = useAuth()
  const { conferenceId } = useContext(ConferenceContext)
  if (!isLoaded || !userId) {
    // Show the public page
    return (
      <div className="mx-auto w-full p-4 md:p-6">
        <div className="text-center text-slate-400">Welcome to Luttaka!</div>
      </div>
    )
  }
  const { data: conferences, isLoading } = api.conference.list.useQuery()
  if (conferences === undefined) return <Skeleton />
  const conference = conferences?.find((c) => c.id === conferenceId)
  if (
    !conference ||
    (conferenceId === null && conferences && conferences.length > 0)
  ) {
    return (
      <HomeAvailableConferences
        conferences={conferences}
        isLoading={isLoading}
      />
    )
  }
  return <HomeSelectedConference conference={conference} />
}
