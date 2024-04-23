"use client"

import React, { useEffect } from "react"

import { MissingText } from "@/components/ui/messages/missing-text"
import { type WithUrlParams } from "@/lib/next-app.types"
import { api } from "@/trpc/react"

export type TicketLabelProps = {
  userId: string
}

export default function TicketLabel({
  params,
}: WithUrlParams<TicketLabelProps>) {
  const profile = api.profile.getByUserId.useQuery({
    userId: params.userId,
  })
  // Todo: Check if the user has a valid ticket

  useEffect(() => {
    if (profile?.data?.displayName !== undefined) {
      window.print()
    }
  }, [profile])

  if (!profile) {
    return <MissingText text={"User not found"} />
  }

  return (
    <div className="m-auto h-40 w-80 p-0">
      {profile?.data?.displayName !== undefined && (
        <div className="flex flex-col items-center">
          <div className="text-2xl font-bold">{profile?.data?.displayName}</div>
          <div>{profile?.data?.title}</div>
          <div>{profile?.data?.company}</div>
          <br />
          <div className="text-2xl">PARTICIPANT</div>
        </div>
      )}
    </div>
  )
}
