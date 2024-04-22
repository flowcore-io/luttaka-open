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
    <div style={{ width: "4in", height: "2.125in", border: "1px solid black" }}>
      {profile?.data?.displayName !== undefined && (
        <div className="mt-8 flex flex-col items-center">
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
