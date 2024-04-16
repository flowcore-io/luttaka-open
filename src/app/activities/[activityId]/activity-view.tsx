"use client"

import { format } from "date-fns"
import Image from "next/image"
import React, { type FC } from "react"

import MarkdownViewer from "@/components/md-viewer"
import { Skeleton } from "@/components/ui/skeleton"
import { type RouterOutputs } from "@/trpc/shared"

export type ActivityProps = {
  activity: RouterOutputs["activity"]["get"]
}

export const ActivityView: FC<ActivityProps> = ({ activity }) => {
  if (!activity) {
    console.error("No activity found")
    return null
  }

  return (
    <div className={`md:flex md:space-x-4`}>
      <div>
        <div className={`mt-2 text-left`}>
          {activity.imageBase64 ? (
            <Image
              src={activity.imageBase64}
              alt={activity.title}
              className="mb-6 rounded-xl"
              width={250}
              height={250}
            />
          ) : (
            <Skeleton className="mb-6 h-[250px] w-[250px] rounded-xl" />
          )}
          <div className={`flex flex-row`}>
            <h1 className={`text-4xl font-bold`}>{activity.title}</h1>
          </div>
          {activity.description && (
            <div>
              <MarkdownViewer
                source={activity.description}
                className={`mt-2`}
              />
            </div>
          )}
          <br />
          <div className="">
            {format(activity.startTime ?? "", `HH:mm`)}-
            {format(activity.endTime ?? "", `HH:mm`)}{" "}
            {activity.stageName ? `@ ${activity.stageName}` : ""}
          </div>
        </div>
      </div>
    </div>
  )
}
