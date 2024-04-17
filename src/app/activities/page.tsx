"use client"

import { format } from "date-fns"
import Image from "next/image"
import Link from "next/link"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { PageTitle } from "@/components/ui/page-title"
import { Skeleton } from "@/components/ui/skeleton"
import { api } from "@/trpc/react"

export default function ActivitiesPage() {
  const { data: activities } = api.activity.list.useQuery()
  const stages = [...new Set(activities?.map((activity) => activity.stageName))]
  stages.sort()
  return (
    <div>
      <div className="mx-auto w-full p-4 md:p-6">
        <PageTitle title={"Activities"} />
      </div>
      <Accordion type="single" collapsible className="mx-6">
        {stages?.map((stage) => (
          <AccordionItem value={stage ?? ""} key={stage}>
            <AccordionTrigger className="text-2xl font-bold">
              {stage}
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4">
              {activities
                ?.sort((a, b) => {
                  return (a.startTime ?? "").localeCompare(b.startTime ?? "")
                })
                ?.filter((activity) => activity.stageName === stage)
                .map((activity) => (
                  <Link
                    href={`/activities/${activity.id}`}
                    key={activity.id}
                    className="flex flex-row items-center gap-4">
                    {activity.imageBase64 ? (
                      <Image
                        src={activity.imageBase64}
                        alt={activity.title}
                        className="rounded-xl"
                        width={50}
                        height={50}
                      />
                    ) : (
                      <Skeleton className="h-[50px] min-h-[50px] w-[50px] min-w-[50px] rounded-xl" />
                    )}
                    <div className="">
                      {format(activity.startTime ?? "", `HH:mm`)}-
                      {format(activity.endTime ?? "", `HH:mm`)} {activity.title}
                    </div>
                  </Link>
                ))}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
