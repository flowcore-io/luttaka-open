import { Loader, PenIcon, Trash } from "lucide-react"
import { useCallback, useState } from "react"
import { toast } from "sonner"

import { UpdateNewsitemForm } from "@/app/admin/newsitems/update-newsitem.form"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog"
import { api } from "@/trpc/react"

export interface NewsitemProps {
  newsitem: {
    id: string
    title: string
    imageBase64: string | undefined
    introText: string | undefined
    fullText: string | undefined
    publicVisibility: boolean
    publishedAt: string
    archived: boolean
    reason: string | null
  }
  refetch: () => Promise<void>
}

export function Newsitem({ newsitem, refetch }: NewsitemProps) {
  const [loading, setLoading] = useState(false)

  const apiArchiveNewsitem = api.newsitem.archive.useMutation()
  const archiveNewsitem = useCallback(async () => {
    setLoading(true)
    const success = await apiArchiveNewsitem.mutateAsync({
      id: newsitem.id,
    })
    if (success) {
      await refetch()
      toast.success("Newsitem deleted")
    } else {
      toast.error("Delete newsitem failed")
    }
    setLoading(false)
  }, [newsitem.id])

  const [updateNewsitemDialogOpened, setUpdateNewsitemDialogOpened] =
    useState(false)

  return (
    <>
      <div
        key={newsitem.id}
        className="mb-2 flex cursor-pointer items-center rounded-lg border p-4 shadow transition hover:scale-101 hover:shadow-lg">
        <div className={"flex-1 self-stretch"}>
          <div className={"pb-2 font-bold"}>{newsitem.title}</div>
          <div className={"text-sm text-gray-500"}>{newsitem.introText}</div>
          <div className={"text-sm text-gray-500"}>{newsitem.fullText}</div>
          <div className={"text-sm text-gray-500"}>
            Newsitem ID: {newsitem.id}
          </div>
          <div className={"text-sm text-gray-500"}>
            Published at: {newsitem.publishedAt}
          </div>
        </div>
        <div className={"text-right"}>
          <Button
            size={"sm"}
            onClick={() => setUpdateNewsitemDialogOpened(true)}
            disabled={loading}>
            {loading ? <Loader className={"animate-spin"} /> : <PenIcon />}
          </Button>
          <Button
            className={"ml-2"}
            size={"sm"}
            onClick={(e) => {
              e.stopPropagation()
              return archiveNewsitem()
            }}
            disabled={loading}>
            {loading ? <Loader className={"animate-spin"} /> : <Trash />}
          </Button>
        </div>
        <Dialog
          open={updateNewsitemDialogOpened}
          onOpenChange={(open) => {
            !open && setUpdateNewsitemDialogOpened(open)
          }}>
          <DialogContent
            className={"max-w-4xl"}
            onCloseAutoFocus={() => (document.body.style.overflow = "auto")}>
            <DialogHeader>Edit News Item</DialogHeader>
            <UpdateNewsitemForm
              newsitem={{
                ...newsitem,
                title: newsitem.title ?? "",
              }}
              close={() => setUpdateNewsitemDialogOpened(false)}
              refetch={() => refetch()}
            />
          </DialogContent>
        </Dialog>
      </div>
    </>
  )
}
