"use client"

import { useAuth } from "@clerk/nextjs"
import { useState } from "react"

import { Company } from "@/app/admin/companies/company.component"
import { CreateCompanyForm } from "@/app/admin/companies/create-company.form"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog"
import { api } from "@/trpc/react"

export default function Companies() {
  const { isLoaded, userId } = useAuth()
  const [createCompanyDialogOpened, setCreateCompanyDialogOpened] =
    useState(false)

  const { data: companies, refetch } = api.company.list.useQuery()

  if (!isLoaded || !userId) {
    return null
  }

  return (
    <div className="mx-auto w-full p-4 md:p-6">
      <div className="flex pb-8">
        <div className="flex-1 text-3xl font-bold text-slate-900">
          Companies
        </div>
        <div className="flex-1 text-right">
          <Button onClick={() => setCreateCompanyDialogOpened(true)}>
            Create Company
          </Button>
        </div>
      </div>

      {companies?.map((company) => (
        <Company
          key={company.id}
          company={{
            ...company,
            imageUrl: company.imageUrl ?? "",
            description: company.description ?? "",
            ownerId: company.ownerId ?? "",
            companyType: company.companyType ?? "",
            archived: company.archived,
            reason: company.reason,
          }}
          refetch={async () => {
            await refetch()
          }}
        />
      ))}

      <Dialog
        open={createCompanyDialogOpened}
        onOpenChange={(open) => {
          !open && setCreateCompanyDialogOpened(open)
        }}>
        <DialogContent className={"max-w-4xl"}>
          <DialogHeader>Create Company</DialogHeader>
          <CreateCompanyForm
            close={() => setCreateCompanyDialogOpened(false)}
            refetch={() => refetch()}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
