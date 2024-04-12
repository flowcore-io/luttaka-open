import { MissingText } from "@/components/ui/messages/missing-text"
import { type WithUrlParams } from "@/lib/next-app.types"
import { api } from "@/trpc/server"

import { ActivityView } from "./activity-view"

export type ActivityProps = {
  activityId: string
}

export default async function Activity({
  params,
}: WithUrlParams<ActivityProps>) {
  const activity = await api.activity.get.query({
    id: params.activityId,
  })

  if (!activity) {
    return <MissingText text={"Activity not found"} />
  }

  return (
    <div className="w-[100%] p-4 md:flex md:space-x-10 md:p-6">
      <ActivityView activity={activity} />
    </div>
  )
}
