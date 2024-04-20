"use client"

import dayjs from "dayjs"
import Image from "next/image"
import Link from "next/link"

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { PageTitle } from "@/components/ui/page-title"
import { api } from "@/trpc/react"

export default function HomePublicPage() {
  const { data: events } = api.event.getPublicList.useQuery()
  return (
    <div className="mx-auto flex w-full flex-col items-center p-4 md:p-6">
      <div className="text-center">
        <PageTitle title={"Events near You"} />
      </div>
      <div className="mt-12 flex flex-row flex-wrap justify-center gap-4">
        {events?.map((event) => (
          <Card className="w-full sm:w-80" key={event.id}>
            <Link href={`/event/${event.slug}`}>
              <CardHeader>
                <CardTitle>{event.name}</CardTitle>
                <CardDescription>{event.description}</CardDescription>
                <CardDescription>
                  {dayjs(event.startDate).format("MMMM D, YYYY")}
                  {" - "}
                  {dayjs(event.endDate).format("MMMM D, YYYY")}
                </CardDescription>
              </CardHeader>
              <CardFooter className="space-x-2"></CardFooter>
            </Link>
          </Card>
        ))}
      </div>
      <Link href="/tonik">
        <Image
          src="/images/tonik-logo.svg"
          width={360}
          height={360}
          alt="Tonik logo"
          className="mt-16"
        />
      </Link>
    </div>
  )
}
