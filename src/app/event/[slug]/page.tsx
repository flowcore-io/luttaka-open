"use client"

import MarkdownViewer from "@/components/md-viewer"
import { PageTitle } from "@/components/ui/page-title"
import { type WithUrlParams } from "@/lib/next-app.types"
import { api } from "@/trpc/react"

export type EventProps = {
  slug: string
}

export default function EventPage({ params }: WithUrlParams<EventProps>) {
  const { data: event } = api.event.getPublic.useQuery({
    slug: params.slug,
  })
  return (
    <div className="mx-auto flex w-full flex-col items-center p-4 md:p-6">
      <PageTitle title={`${event?.name ?? ""}`} />
      {event?.description && (
        <div>
          <MarkdownViewer source={event?.description} className={`mt-2`} />
        </div>
      )}
    </div>
  )
}
