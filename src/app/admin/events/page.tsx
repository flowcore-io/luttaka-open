"use client"

import { useAuth } from "@clerk/nextjs"
import { useState } from "react"

import { CreateEventForm } from "@/app/admin/events/create-event.form"
import { Event } from "@/app/admin/events/event.component"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog"
import { api } from "@/trpc/react"

export default function Events() {
  const { isLoaded, userId } = useAuth()
  const [createEventDialogOpened, setCreateEventDialogOpened] = useState(false)

  const { data: events, refetch } = api.event.list.useQuery()

  if (!isLoaded || !userId) {
    return null
  }

  return (
    <div className="mx-auto w-full p-4 md:p-6">
      <div className="flex pb-8">
        <div className="flex-1 text-3xl font-bold text-slate-900">Events</div>
        <div className="flex-1 text-right">
          <Button onClick={() => setCreateEventDialogOpened(true)}>
            Create Event
          </Button>
        </div>
      </div>

      {events?.map((event) => (
        <Event
          key={event.id}
          event={{
            ...event,
          }}
          refetch={async () => {
            await refetch()
          }}
        />
      ))}

      <Dialog
        open={createEventDialogOpened}
        onOpenChange={(open) => {
          !open && setCreateEventDialogOpened(open)
        }}>
        <DialogContent className={"max-w-4xl"}>
          <DialogHeader>Create new event</DialogHeader>
          <CreateEventForm
            close={() => setCreateEventDialogOpened(false)}
            refetch={() => refetch()}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
