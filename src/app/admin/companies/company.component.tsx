import { Loader, PenIcon, Trash } from "lucide-react"
import { useCallback, useState } from "react"
import { toast } from "sonner"

import { UpdateCompanyForm } from "@/app/admin/companies/update-company.form"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog"
import { api } from "@/trpc/react"

export interface CompanyProps {
  company: {
    id: string
    name: string
    imageBase64: string | undefined
    description: string | undefined
    ownerId: string | undefined
    companyType: string | undefined
    archived: boolean
    reason: string | null
  }
  refetch: () => Promise<void>
}

export function Company({ company, refetch }: CompanyProps) {
  const [loading, setLoading] = useState(false)

  const apiArchiveCompany = api.company.archive.useMutation()
  const archiveCompany = useCallback(async () => {
    setLoading(true)
    const success = await apiArchiveCompany.mutateAsync({
      id: company.id,
    })
    if (success) {
      await refetch()
      toast.success("Company deleted")
    } else {
      toast.error("Delete company failed")
    }
    setLoading(false)
  }, [company.id])

  const [updateCompanyDialogOpened, setUpdateCompanyDialogOpened] =
    useState(false)

  return (
    <>
      <div
        key={company.id}
        className="mb-2 flex cursor-pointer items-center rounded-lg border p-4 shadow transition hover:scale-101 hover:shadow-lg">
        <div className={"flex-1 self-stretch"}>
          <div className={"pb-2 font-bold"}>{company.name}</div>
          <div className={"text-sm text-gray-500"}>{company.imageBase64}</div>
          <div className={"text-sm text-gray-500"}>{company.description}</div>
          <div className={"text-sm text-gray-500"}>
            {company.companyType === "sponsor"
              ? "SPONSOR"
              : company.companyType === "exhibitor"
                ? "EXHIBITOR"
                : ""}
          </div>
        </div>
        <div className={"text-right"}>
          <Button
            size={"sm"}
            onClick={() => setUpdateCompanyDialogOpened(true)}
            disabled={loading}>
            {loading ? <Loader className={"animate-spin"} /> : <PenIcon />}
          </Button>
          <Button
            className={"ml-2"}
            size={"sm"}
            onClick={(e) => {
              e.stopPropagation()
              return archiveCompany()
            }}
            disabled={loading}>
            {loading ? <Loader className={"animate-spin"} /> : <Trash />}
          </Button>
        </div>
        <Dialog
          open={updateCompanyDialogOpened}
          onOpenChange={(open) => {
            !open && setUpdateCompanyDialogOpened(open)
          }}>
          <DialogContent
            className={"max-w-4xl"}
            onCloseAutoFocus={() => (document.body.style.overflow = "auto")}>
            <DialogHeader>Edit Company</DialogHeader>
            <UpdateCompanyForm
              company={{
                ...company,
                name: company.name ?? "",
                owner: company.ownerId ?? "",
              }}
              close={() => setUpdateCompanyDialogOpened(false)}
              refetch={() => refetch()}
            />
          </DialogContent>
        </Dialog>
      </div>
    </>
  )
}
