"use client"

import { SignInButton } from "@clerk/nextjs"
import dayjs from "dayjs"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { api } from "@/trpc/react"

export default function HomePublicPage() {
  const { data: events } = api.event.getPublicList.useQuery()
  return (
    <div className="mx-auto w-full p-4 md:p-6">
      <div className="text-center">Luttaka Open Source</div>
      <div className="text-center">Event Experience Application</div>
      <div className="mt-12 text-center">
        <SignInButton redirectUrl={`/`} mode="modal">
          <Button>Sign In</Button>
        </SignInButton>
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
    </div>
  )
}
