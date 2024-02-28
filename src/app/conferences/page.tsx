"use client"

import { useAuth } from "@clerk/nextjs"
import { Loader } from "lucide-react"
import { useState } from "react"

import { Conference } from "@/app/conferences/conference.component"
import { CreateConferenceForm } from "@/app/conferences/create-conference.form"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog"
import { api } from "@/trpc/react"

export default function Conferences() {
  const { isLoaded, userId } = useAuth()
  const [loading, setLoading] = useState(false)
  const [createConferenceDialogOpened, setCreateConferenceDialogOpened] =
    useState(false)

  const { data: conferences, refetch } = api.conference.list.useQuery()

  if (!isLoaded || !userId) {
    return null
  }

  return (
    <main className="mx-auto w-full">
      <div className="flex pb-8">
        <div className="flex-1 text-3xl font-bold text-slate-900">
          Conferences
        </div>
        <div className="flex-1 text-right">
          <Button
            onClick={() => setCreateConferenceDialogOpened(true)}
            disabled={loading}>
            {loading ? (
              <Loader className={"animate-spin"} />
            ) : (
              "Create Conference"
            )}
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
    </main>
  )
}
