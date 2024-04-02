"use client"

import { useAuth } from "@clerk/nextjs"
import { useState } from "react"

import { Conference } from "@/app/admin/conferences/conference.component"
import { CreateConferenceForm } from "@/app/admin/conferences/create-conference.form"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog"
import { api } from "@/trpc/react"

export default function Conferences() {
  const { isLoaded, userId } = useAuth()
  const [createConferenceDialogOpened, setCreateConferenceDialogOpened] =
    useState(false)

  const { data: conferences, refetch } = api.conference.list.useQuery()

  if (!isLoaded || !userId) {
    return null
  }

  return (
    <div className="mx-auto w-full p-4 md:p-6">
      <div className="flex pb-8">
        <div className="flex-1 text-3xl font-bold text-slate-900">Events</div>
        <div className="flex-1 text-right">
          <Button onClick={() => setCreateConferenceDialogOpened(true)}>
            Create Event
          </Button>
        </div>
      </div>

      {conferences?.map((conference) => (
        <Conference
          key={conference.id}
          conference={{
            ...conference,
            ...(typeof conference.ticketPrice === "string" && {
              ticketPrice: parseFloat(conference.ticketPrice),
            }),
          }}
          refetch={async () => {
            await refetch()
          }}
        />
      ))}

      <Dialog
        open={createConferenceDialogOpened}
        onOpenChange={(open) => {
          !open && setCreateConferenceDialogOpened(open)
        }}>
        <DialogContent className={"max-w-4xl"}>
          <DialogHeader>Create new conference</DialogHeader>
          <CreateConferenceForm
            close={() => setCreateConferenceDialogOpened(false)}
            refetch={() => refetch()}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
