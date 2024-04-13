import { Loader, PenIcon, Trash } from "lucide-react"
import Image from "next/image"
import { useCallback, useState } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog"
import { api } from "@/trpc/react"

import { UpdateActivityForm } from "./update-activity.form"

export interface ActivityProps {
  activity: {
    id: string
    title: string
    imageBase64: string | undefined
    description: string | undefined
    stageName: string | undefined
    startTime: string
    endTime: string
    publicVisibility: boolean
    archived: boolean
    reason: string | null
  }
  refetch: () => Promise<void>
}

export function Activity({ activity, refetch }: ActivityProps) {
  const [loading, setLoading] = useState(false)

  const apiArchiveActivity = api.activity.archive.useMutation()
  const archiveActivity = useCallback(async () => {
    setLoading(true)
    const success = await apiArchiveActivity.mutateAsync({
      id: activity.id,
    })
    if (success) {
      await refetch()
      toast.success("Activity deleted")
    } else {
      toast.error("Delete activity failed")
    }
    setLoading(false)
  }, [activity.id])

  const [updateActivityDialogOpened, setUpdateActivityDialogOpened] =
    useState(false)

  return (
    <>
      <div
        key={activity.id}
        className="mb-2 flex cursor-pointer items-center gap-4 rounded-lg border p-4 shadow transition hover:scale-101 hover:shadow-lg">
        {activity.imageBase64 ? (
          <Image
            src={activity.imageBase64}
            alt={activity.title}
            className={"rounded-xl"}
            width={50}
            height={50}
          />
        ) : (
          <div className={"h-[50px] w-[50px] rounded-xl bg-gray-300"} />
        )}
        <div className={"flex-1 self-stretch"}>
          <div className={"pb-2 font-bold"}>{activity.title}</div>
          <div className={"text-sm text-gray-500"}>{activity.description}</div>
          <div className={"text-sm text-gray-500"}>
            {activity.startTime} - {activity.endTime}{" "}
            {activity.stageName && (
              <div className="italic">{activity.stageName}</div>
            )}
          </div>
        </div>
        <div className={"text-right"}>
          <Button
            size={"sm"}
            onClick={() => setUpdateActivityDialogOpened(true)}
            disabled={loading}>
            {loading ? <Loader className={"animate-spin"} /> : <PenIcon />}
          </Button>
          <Button
            className={"ml-2"}
            size={"sm"}
            onClick={(e) => {
              e.stopPropagation()
              return archiveActivity()
            }}
            disabled={loading}>
            {loading ? <Loader className={"animate-spin"} /> : <Trash />}
          </Button>
        </div>
        <Dialog
          open={updateActivityDialogOpened}
          onOpenChange={(open) => {
            !open && setUpdateActivityDialogOpened(open)
          }}>
          <DialogContent className={"max-w-4xl"}>
            <DialogHeader>Edit Activity</DialogHeader>
            <UpdateActivityForm
              activity={{
                ...activity,
                title: activity.title ?? "",
              }}
              close={() => setUpdateActivityDialogOpened(false)}
              refetch={() => refetch()}
            />
          </DialogContent>
        </Dialog>
      </div>
    </>
  )
}
