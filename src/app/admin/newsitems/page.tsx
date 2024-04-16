"use client"

import { useAuth } from "@clerk/nextjs"
import { useState } from "react"

import { CreateNewsitemForm } from "@/app/admin/newsitems/create-newsitem.form"
import { Newsitem } from "@/app/admin/newsitems/newsitem.component"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog"
import { api } from "@/trpc/react"

export default function Newsitems() {
  const { isLoaded, userId } = useAuth()
  const [createNewsitemDialogOpened, setCreateNewsitemDialogOpened] =
    useState(false)

  const { data: newsitems, refetch } = api.newsitem.list.useQuery()

  if (!isLoaded || !userId) {
    return null
  }

  return (
    <div className="mx-auto w-full p-4 md:p-6">
      <div className="flex pb-8">
        <div className="flex-1 text-3xl font-bold text-slate-900">
          News Items
        </div>
        <div className="flex-1 text-right">
          <Button onClick={() => setCreateNewsitemDialogOpened(true)}>
            Create News Item
          </Button>
        </div>
      </div>

      {newsitems?.map((newsitem) => (
        <Newsitem
          key={newsitem.id}
          newsitem={{
            ...newsitem,
            imageBase64: newsitem.imageBase64 ?? "",
            introText: newsitem.introText ?? "",
            fullText: newsitem.fullText ?? "",
            publishedAt: newsitem.publishedAt ?? "",
          }}
          refetch={async () => {
            await refetch()
          }}
        />
      ))}

      <Dialog
        open={createNewsitemDialogOpened}
        onOpenChange={(open) => {
          !open && setCreateNewsitemDialogOpened(open)
        }}>
        <DialogContent
          className={"max-w-4xl"}
          onCloseAutoFocus={() => (document.body.style.overflow = "auto")}>
          <DialogHeader>Create news item</DialogHeader>
          <CreateNewsitemForm
            close={() => setCreateNewsitemDialogOpened(false)}
            refetch={() => refetch()}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
