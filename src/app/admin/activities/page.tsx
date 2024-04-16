"use client"

import { useAuth } from "@clerk/nextjs"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog"
import { api } from "@/trpc/react"

import { Activity } from "./activity.component"
import { CreateActivityForm } from "./create-activity.form"

export default function Activities() {
  const { isLoaded, userId } = useAuth()
  const [createActivityDialogOpened, setCreateActivityDialogOpened] =
    useState(false)

  const { data: activities, refetch } = api.activity.list.useQuery()

  if (!isLoaded || !userId) {
    return null
  }

  return (
    <div className="mx-auto w-full p-4 md:p-6">
      <div className="flex pb-8">
        <div className="flex-1 text-3xl font-bold text-slate-900">
          Activities
        </div>
        <div className="flex-1 text-right">
          <Button onClick={() => setCreateActivityDialogOpened(true)}>
            Create Activity
          </Button>
        </div>
      </div>

      {activities?.map((activity) => (
        <Activity
          key={activity.id}
          activity={{
            ...activity,
            imageBase64: activity.imageBase64 ?? "",
            description: activity.description ?? "",
            stageName: activity.stageName ?? "",
            startTime: activity.startTime ?? "",
            endTime: activity.endTime ?? "",
          }}
          refetch={async () => {
            await refetch()
          }}
        />
      ))}

      <Dialog
        open={createActivityDialogOpened}
        onOpenChange={(open) => {
          !open && setCreateActivityDialogOpened(open)
        }}>
        <DialogContent
          className={"max-w-4xl"}
          onCloseAutoFocus={() => (document.body.style.overflow = "auto")}>
          <DialogHeader>Create activity</DialogHeader>
          <CreateActivityForm
            close={() => setCreateActivityDialogOpened(false)}
            refetch={() => refetch()}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
