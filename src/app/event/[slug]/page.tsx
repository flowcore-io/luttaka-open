"use client"

import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs"
import { TicketIcon } from "lucide-react"
import Link from "next/link"

import BuyTicket from "@/app/me/tickets/buy-ticket"
import RedeemTicketsDialog from "@/app/me/tickets/redeem-ticket.dialog"
import MarkdownViewer from "@/components/md-viewer"
import { Button } from "@/components/ui/button"
import { PageTitle } from "@/components/ui/page-title"
import { Skeleton } from "@/components/ui/skeleton"
import { type WithUrlParams } from "@/lib/next-app.types"
import { api } from "@/trpc/react"

export type EventProps = {
  slug: string
}

type EventData =
  | {
      id: string
      name: string
      archived: boolean
      reason: string | null
      description: string | null
      slug: string | null
      imageBase64: string | null
      ticketDescription: string | null
      ticketPrice: number
      ticketCurrency: string
      startDate: string
      endDate: string
      productId: string
      noResults?: boolean
    }
  | {
      noResults: true
    }

export default function EventPage({ params }: WithUrlParams<EventProps>) {
  const {
    data: event,
    refetch,
    isLoading,
  } = api.event.getPublic.useQuery({
    slug: params.slug,
  }) as { data: EventData; refetch: () => void; isLoading: boolean }

  if (isLoading)
    return <Skeleton className="m-auto h-[250px] w-[250px] rounded-xl" />
  if (event?.noResults)
    return (
      <div className="text-center">
        Event not found. Go to{" "}
        <Link href="/" className="text-blue-500">
          front page
        </Link>
      </div>
    )
  return (
    <div className="mx-auto flex w-full flex-col items-center p-4 md:p-6">
      <PageTitle title={`${event?.name ?? ""}`} />
      {event?.description ? (
        <div>
          <MarkdownViewer source={event?.description} className={`mt-2`} />
        </div>
      ) : (
        <div>No description</div>
      )}
      {event?.startDate ? (
        <div>
          <div className="mt-6">
            {new Date(event.startDate).toLocaleString()}
          </div>
        </div>
      ) : (
        <div>No start date</div>
      )}
      <SignedOut>
        <SignInButton redirectUrl={`/event/${event?.slug}`} mode="modal">
          <button className="dark:hover:bg-blud-700 mx-10 mb-4 mt-6 h-12 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:focus:ring-blue-800 md:mb-0">
            Join Event
          </button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <BuyTicket key={event.id} event={event} />
        <RedeemTicketsDialog onDone={() => refetch()}>
          <Button variant={"secondary"}>
            <TicketIcon className={"mr-2"} /> Redeem ticket
          </Button>
        </RedeemTicketsDialog>
      </SignedIn>
    </div>
  )
}
