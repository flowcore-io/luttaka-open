"use client"

import { format } from "date-fns"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { PageTitle } from "@/components/ui/page-title"
import { Skeleton } from "@/components/ui/skeleton"
import { api } from "@/trpc/react"

export default function ActivitiesPage() {
  const { data: activities } = api.activity.list.useQuery()
  return (
    <div>
      <div className="mx-auto w-full p-4 md:p-6">
        <PageTitle title={"Activities"} />
      </div>
      <div className="flex flex-col gap-4 px-6">
        {activities?.map((activity) => (
          <div key={activity.id} className="flex flex-row items-center gap-4">
            {activity.imageUrl ? (
              <img
                src={activity.imageUrl}
                alt={activity.title}
                className="max-w-[50px] rounded-xl"
              />
            ) : (
              <Skeleton className="h-[50px] w-[50px] rounded-xl" />
            )}
            <div className="">
              {format(activity.startTime ?? "", `HH:mm`)}-
              {format(activity.endTime ?? "", `HH:mm`)} {activity.title}
              <br />
              {activity.stageName && (
                <div className="italic">{activity.stageName}</div>
              )}
            </div>
            {activity.description && (
              <Button asChild>
                <Link href={`/activities/${activity.id}`}>Read more</Link>
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
