import { MissingText } from "@/components/ui/messages/missing-text"
import { type WithUrlParams } from "@/lib/next-app.types"
import { api } from "@/trpc/server"

import { NewsitemView } from "./newsitem-view"

export type NewsitemProps = {
  newsitemId: string
}

export default async function Newsitem({
  params,
}: WithUrlParams<NewsitemProps>) {
  const newsitem = await api.newsitem.getPublished.query({
    id: params.newsitemId,
  })

  if (!newsitem) {
    return <MissingText text={"News item not found"} />
  }

  return (
    <div className="w-[100%] p-4 md:flex md:space-x-10 md:p-6">
      <NewsitemView newsitem={newsitem} />
    </div>
  )
}
